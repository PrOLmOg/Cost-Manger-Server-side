import { Cost } from '../models/cost.js';

/**
 * Retrieves all cost entries
 */
const getCosts = async (req, res) => {
  try {
    const costs = await Cost.find();
    res.json(costs);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

/**
 * Adds a new cost entry
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
      createdAt: createdAt ? new Date(createdAt) : new Date() // Default to current date if not provided
    });

    await newCost.save();
    res.status(201).json(newCost);
  } catch (error) {
    res.status(500).json({ message: 'Error adding cost item: ' + error.message });
  }
};

/**
 * Generates a monthly cost report for a given user
 */
const getMonthlyReport = async (req, res) => {
  const { id, user_id, year, month } = req.query;
  const uid = id ?? user_id;
  if (!uid || !year || !month) {
    return res.status(400).json({ error: "Please provide id, year, and month." });
  }

  try {
    const costs = await Cost.aggregate([
      {
        $match: {
          userid: uid,
          createdAt: {
            $gte: new Date(`${year}-${month}-01T00:00:00.000Z`),
            $lt: new Date(`${year}-${month}-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: "$category",
          costs: {
            $push: {
              sum: "$sum",
              description: "$description",
              day: { $dayOfMonth: "$createdAt" },
            },
          },
        },
      },
    ]);

    const categories = ["food", "health", "housing", "sport", "education"];
    const report = {};

    categories.forEach(category => {
      report[category] = [];
    });

    costs.forEach(cost => {
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

  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export default { getCosts, addCost, getMonthlyReport };
