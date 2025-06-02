/**
 * Returns the fixed list of team members.
 *
 * @category Controller
 * @param {import('express').Request}  _req - Express request (unused)
 * @param {import('express').Response} res  - Express response
 * @returns {Promise<void>} Sends JSON array or 500 on error
 */
export const getAbout = async (_req, res) => {
  try {
    // Static team members data
    const team = [
      { first_name: 'Almog', last_name: 'Bacharlia' },
      { first_name: 'Maxim', last_name: 'Shapira' },
    ];

    res.json(team); // Send response with team details
  } catch (_error) {
    res.status(500).json({ _error: 'Server error' }); // Handle server error
  }
};
