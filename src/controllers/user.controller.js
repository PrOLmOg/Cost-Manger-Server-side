import { Cost } from '../models/cost.js';
import { User } from '../models/user.js';

/**
 * Retrieves all users
 * @category Controller
 * @param {import('express').Request}  req  Express request object
 * @param {import('express').Response} res  Express response object
 * @returns {Promise<void>} 201 JSON on success or 400/500 JSON on error
 */
const getUsers = async (req, res) => {
  try {
    // No filter – return the whole collection
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Creates a new user document.
 *
 * @category Controller
 * @param {import('express').Request}  req  Express request object
 * @param {import('express').Response} res  Express response object
 * @returns {Promise<void>} 201 JSON on success or 400/500 JSON on error
 */
const createUser = async (req, res) => {
  try {
    // Validate body
    const { first_name, last_name, birthday, marital_status } = req.body;
    if (!first_name || !last_name || !birthday || !marital_status) {
      return res.status(400).json({
        message: 'All fields are required: first_name, last_name, birthday, marital_status.',
      });
    }

    // Persist
    const created = new User(req.body);
    console.log('created', created);

    await created.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Retrieve a single user and his ∑ of costs.
 *
 * Path param `:id` – user’s ID in the `users` collection
 *
 * @category Controller
 * @param {import('express').Request}  req  Express request
 * @param {import('express').Response} res  Express response
 * @returns {Promise<void>} 200 JSON with first_name, last_name, id, total
 *                          404 if user not found · 500 on server error
 */
export const getUserDetails = async (req, res) => {
  try {
    // Fetch user ------------------------------------------------
    const user = await User.findOne({ id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate total cost for the user ---------------------------------------
    const totalCost = await Cost.aggregate([
      { $match: { userid: req.params.id } },
      { $group: { _id: null, total: { $sum: '$sum' } } },
    ]);

    //Respond --------------------------------------------------
    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      total: totalCost.length > 0 ? totalCost[0].total : 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

export { getUsers, createUser };
