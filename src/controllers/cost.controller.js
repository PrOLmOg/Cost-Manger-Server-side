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
    // Fetch every document
    const costs = await Cost.find();
    res.json(costs);
  } catch (_error) {
    res.status(500).json({ message: 'Server error: ' + _error.message });
  }
};

/**
 * Create a new cost item.
 *
 * Body params  `description, category, userid, sum [, createdAt]`
 *
 * @category Controller
 * @param {import('express').Request}  req  Express request
 * @param {import('express').Response} res  Express response
 * @returns {Promise<void>} 201 with the new document or 400/500 JSON on error
 */
const addCost = async (req, res) => {
  try {
    // Field extraction & validation
    const { description, category, userid, sum, createdAt } = req.body;

    if (!description || !category || !userid || sum === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Build the Mongoose doc
    const newCost = new Cost({
      description,
      category,
      userid,
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
 * Query params  `id, year, month`  (month 1-12 accepted)
 *
 * @category Controller
 * @param {import('express').Request}  req  Express request
 * @param {import('express').Response} res  Express response
 * @returns {Promise<void>} 200 JSON report or 400/500 JSON on error
 */
const getMonthlyReport = async (_req, res) => {
  const { id, year, month } = _req.query;
  const mm = month.toString().padStart(2, '0');

  if (!id || !year || !month) {
    return res.status(400).json({ error: 'Please provide id, year, and month.' });
  }

  try {
    const costs = await Cost.aggregate([
      {
        // match by user & month boundaries
        $match: {
          userid: id,
          createdAt: {
            $gte: new Date(`${year}-${mm}-01T00:00:00.000Z`),
            $lt: new Date(`${year}-${mm}-31T23:59:59.999Z`),
          },
        },
      },
      {
        // group items by category → build array per bucket
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

    // Ensure empty categories exist
    const categories = ['food', 'health', 'housing', 'sport', 'education'];
    const report = {};

    categories.forEach((category) => {
      report[category] = [];
    });

    costs.forEach((cost) => {
      report[cost._id] = cost.costs;
    });

    // Send final payload
    return res.json({
      userid: id,
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
