const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

const utilities = require("./utilities/")
const baseController = require("./controllers/baseController");
const errorRoute = require("./routes/errorRoute")
const inventoryRoute = require("./routes/inventoryRoute")

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute)
app.use("/", errorRoute)

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ 
    message = 'Oh no! The page you were looking for was not found.'
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
  }
  res.status(err.status || 500)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});