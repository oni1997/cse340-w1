const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

app.use(flash());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

const utilities = require("./utilities/")
const baseController = require("./controllers/baseController");
const errorRoute = require("./routes/errorRoute")
const db = require("./database")

app.use(utilities.checkJWTToken);

// Add these lines before your routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Run the rebuild script at startup (development only)
if (process.env.NODE_ENV === "development" && db.rebuildDatabase) {
  db.rebuildDatabase()
}

// Index route
app.get("/", utilities.handleErrors(require("./controllers/homeController").getHomePage));
// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))
// Account routes
app.use("/account", require("./routes/accountRoute"))

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

// Route to check and update account types (for production setup)
app.get("/admin/accounts", async (req, res) => {
  try {
    const pool = require("./database")
    const result = await pool.query("SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account ORDER BY account_id")
    res.send({
      status: "Account data retrieved",
      accounts: result.rows,
      message: "Current accounts in database"
    })
  } catch (error) {
    res.status(500).send({
      status: "Failed to retrieve accounts",
      error: error.message
    })
  }
})

// Route to update account type (for production setup)
app.post("/admin/update-account-type", async (req, res) => {
  try {
    const { account_email, new_type } = req.body
    if (!account_email || !new_type) {
      return res.status(400).send({
        status: "Missing parameters",
        message: "Please provide account_email and new_type"
      })
    }

    const pool = require("./database")
    const result = await pool.query(
      "UPDATE account SET account_type = $1 WHERE account_email = $2 RETURNING account_id, account_firstname, account_lastname, account_email, account_type",
      [new_type, account_email]
    )

    if (result.rows.length > 0) {
      res.send({
        status: "Account type updated successfully",
        updated_account: result.rows[0]
      })
    } else {
      res.status(404).send({
        status: "Account not found",
        message: "No account found with that email address"
      })
    }
  } catch (error) {
    res.status(500).send({
      status: "Failed to update account type",
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
  // Check if it's an image 404 error
  if(err.status == 404 && req.path.match(/\.(png|jpg|jpeg|gif)$/i)) {
    // Redirect to the fallback SVG
    return res.redirect('/images/svg/No_image_available.svg');
  }
  
  let nav
  try {
    nav = await utilities.getNav()
  } catch (error) {
    console.error("Error getting navigation:", error)
    nav = "<ul><li><a href='/'>Home</a></li></ul>"
  }
  
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  
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
