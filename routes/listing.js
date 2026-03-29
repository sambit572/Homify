const express = require('express');
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const { Listing } = require("../models/listing");
const { isLoggedIn,validateListing } = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingController.index))
.post(upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));

//new route
router.get("/new",listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit",wrapAsync(listingController.editListing));

module.exports = router;