const express = require('express');
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing");
const { isLoggedIn,validateListing } = require("../middleware.js");
const listingController=require("../controllers/listings.js");

//Index Route
router.get("/",wrapAsync(listingController.index));  

//new route
router.get("/new",listingController.renderNewForm);

// Show Route
router.get("/:id",wrapAsync(listingController.showListing));

//Create Route
router.post("/",validateListing,wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit",wrapAsync(listingController.editListing));

//Update Route
router.put("/:id",validateListing,wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id",wrapAsync(listingController.destroyListing));

module.exports = router;