const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

const utilities = require("./utilities/")
const baseController = require("./controllers/baseController");
const errorRoute = require("./routes/errorRoute")
const db = require("./database")

// Run the rebuild script at startup (development only)
if (process.env.NODE_ENV === "development" && db.rebuildDatabase) {
  db.rebuildDatabase()
}

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));
// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))

app.get("/test-db", async (req, res) => {
  try {
    const pool = require("./database")
    const result = await pool.query("SELECT NOW()")
    res.send({
      status: "Database connection successful",
      timestamp: result.rows[0].now,
      message: "If you see this, your database connection is working properly."
    })
  } catch (error) {
    res.status(500).send({
      status: "Database connection failed",
      error: error.message
    })
  }
})

app.use("/", errorRoute)

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  console.error(err.stack) // Add stack trace for better debugging
  
  if(err.status == 404) { 
    res.status(404).render("errors/404", {
      title: '404 - Page Not Found',
      message: err.message,
      nav
    })
  } else {
    res.status(500).render("errors/500", {
      title: '500 - Server Error',
      message: err.message,
      nav
    })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});