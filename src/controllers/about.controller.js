/**
 * Controller function to retrieve team details
 */
export const getAbout = async (req, res) => {
  try {
    // Static team members data
    const team = [
      { first_name: "Almog", last_name: "Bacharlia" },
      { first_name: "Maxim", last_name: "Shapira" }
    ];
    
    res.json(team); // Send response with team details
  } catch (error) {
    res.status(500).json({ error: "Server error" }); // Handle server error
  }
};