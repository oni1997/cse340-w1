const db = require('../database/index')

async function getHomePage(req, res) {
  try {
    const vehiclesResult = await db.query('SELECT * FROM vehicles')
    const upgradesResult = await db.query('SELECT * FROM upgrades')
    
    const nav = await require('../utilities/').getNav()
    
    res.render('index', {
      title: 'Home',
      nav,
      vehicles: vehiclesResult.rows,
      upgrades: upgradesResult.rows
    })
  } catch (err) {
    console.error("Error fetching data:", err)
    res.status(500).send('Database error')
  }
}

module.exports = { getHomePage }
