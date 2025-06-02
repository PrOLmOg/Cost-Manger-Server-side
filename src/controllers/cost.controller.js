import { Cost } from '../models/cost.js';

/**
 * Return **all** cost documents.
 *
 * @category Controller
 * @param {import('express').Request}  _req  Express request (unused)
 * @param {import('express').Response} res   Express response
 * @returns {Promise<void>} Sends JSON array or 500 on error
 */
const getCosts = async (req, res) => {
  try {
    const costs = await Cost.find();
    res.json(costs);
  } catch (_error) {
    res.status(500).json({ message: 'Server error: ' + _error.message });
  }
};

/**
 * Create a new cost item.
 *
 * Body params  `description, category, userid|user_id, sum [, createdAt]`
 *
 * @category Controller
 * @param {import('express').Request}  req  Express request
 * @param {import('express').Response} res  Express response
 * @returns {Promise<void>} 201 with the new document or 400/500 JSON on error
 */
const addCost = async (req, res) => {
  try {
    let { description, category, userid, user_id, sum, createdAt } = req.body;
    const uid = userid ?? user_id;

    if (!description || !category || !uid || sum === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newCost = new Cost({
      description,
      category,
      userid: uid,
      sum,
      createdAt: createdAt ? new Date(createdAt) : new Date(), // Default to current date if not provided
    });

    await newCost.save();
    res.status(201).json(newCost);
  } catch (_error) {
    res.status(500).json({ message: 'Error adding cost item: ' + _error.message });
  }
};

/**
 * Monthly report for one user, grouped by category.
 *
 * Query params  `id|user_id, year, month`  (month 1-12 accepted)
 *
 * @category Controller
 * @param {import('express').Request}  req  Express request
 * @param {import('express').Response} res  Express response
 * @returns {Promise<void>} 200 JSON report or 400/500 JSON on error
 */
const getMonthlyReport = async (_req, res) => {
  const { id, user_id, year, month } = _req.query;
  const mm = month.toString().padStart(2, '0');
  const uid = id ?? user_id;
  if (!uid || !year || !month) {
    return res.status(400).json({ error: 'Please provide id, year, and month.' });
  }

  try {
    const costs = await Cost.aggregate([
      {
        $match: {
          userid: uid,
          createdAt: {
            $gte: new Date(`${year}-${mm}-01T00:00:00.000Z`),
            $lt: new Date(`${year}-${mm}-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: '$category',
          costs: {
            $push: {
              sum: '$sum',
              description: '$description',
              day: { $dayOfMonth: '$createdAt' },
            },
          },
        },
      },
    ]);

    const categories = ['food', 'health', 'housing', 'sport', 'education'];
    const report = {};

    categories.forEach((category) => {
      report[category] = [];
    });

    costs.forEach((cost) => {
      report[cost._id] = cost.costs;
    });

    return res.json({
      userid: uid,
      year,
      month,
      costs: Object.entries(report).map(([category, items]) => ({
        [category]: items,
      })),
    });
  } catch (_error) {
    return res.status(500).json({ _error: 'Server error' });
  }
};

export default { getCosts, addCost, getMonthlyReport };
