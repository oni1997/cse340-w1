const db = require('../database/index')

async function getHomePage(req, res) {
  try {
    const vehiclesResult = await db.query('SELECT * FROM vehicles')
    const upgradesResult = await db.query('SELECT * FROM upgrades')
    res.render('index', {
      vehicles: vehiclesResult.rows,
      upgrades: upgradesResult.rows
    })
  } catch (err) {
    res.status(500).send('Database error')
  }
}

module.exports = { getHomePage }