/**
 * Controller function to retrieve team details
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
