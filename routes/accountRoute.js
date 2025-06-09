// Account routes
const express = require('express')
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
const accountValidate = require("../utilities/account-validation")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route to build account management view
router.get("/", utilities.checkJWTToken, utilities.handleErrors(accountController.buildAccountManagement))

// Route to build account update view (Task 5)
router.get("/update/:accountId", utilities.checkJWTToken, utilities.handleErrors(accountController.buildAccountUpdate))

// Process account update (Task 5)
router.post(
  "/update-account",
  utilities.checkJWTToken,
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password update (Task 5)
router.post(
  "/update-password",
  utilities.checkJWTToken,
  accountValidate.updatePasswordRules(),
  accountValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

// Logout route (Task 6)
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

module.exports = router
