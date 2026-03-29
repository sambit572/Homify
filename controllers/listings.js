const { Listing, VALID_TAGS } = require("../models/listing");
const maptilerSdk = require("@maptiler/client");
maptilerSdk.config.apiKey = process.env.MAPTILER_KEY;

const TAG_META = {
    "digital-nomad":      { label: "Digital nomad-ready", icon: "fa-solid fa-laptop",        group: "Vibe" },
    "romantic":           { label: "Romantic getaway",    icon: "fa-solid fa-heart",           group: "Vibe" },
    "family-friendly":    { label: "Family-friendly",     icon: "fa-solid fa-people-roof",     group: "Vibe" },
    "pet-friendly":       { label: "Pet-friendly",        icon: "fa-solid fa-paw",             group: "Vibe" },
    "party-friendly":     { label: "Party-friendly",      icon: "fa-solid fa-music",           group: "Vibe" },
    "fast-wifi":          { label: "Fast WiFi",           icon: "fa-solid fa-wifi",            group: "Work" },
    "dedicated-desk":     { label: "Dedicated desk",      icon: "fa-solid fa-desktop",         group: "Work" },
    "ev-charger":         { label: "EV charger",          icon: "fa-solid fa-charging-station", group: "Work" },
    "self-checkin":       { label: "Self check-in",       icon: "fa-solid fa-key",             group: "Work" },
    "private-pool":       { label: "Private pool",        icon: "fa-solid fa-person-swimming", group: "Outdoors" },
    "hot-tub":            { label: "Hot tub",             icon: "fa-solid fa-hot-tub-person",  group: "Outdoors" },
    "rooftop":            { label: "Rooftop terrace",     icon: "fa-solid fa-building",        group: "Outdoors" },
    "beach-access":       { label: "Beach access",        icon: "fa-solid fa-umbrella-beach",  group: "Outdoors" },
    "mountain-view":      { label: "Mountain view",       icon: "fa-solid fa-mountain",        group: "Outdoors" },
    "firepit":            { label: "Firepit",             icon: "fa-solid fa-fire",            group: "Outdoors" },
    "bbq":                { label: "BBQ / grill",         icon: "fa-solid fa-fire-burner",     group: "Outdoors" },
    "solar-powered":      { label: "Solar powered",       icon: "fa-solid fa-sun",             group: "Eco" },
    "eco-certified":      { label: "Eco-certified",       icon: "fa-solid fa-leaf",            group: "Eco" },
    "long-stay-discount": { label: "Long-stay discount",  icon: "fa-solid fa-tag",             group: "Deals" },
    "superhost":          { label: "Superhost",           icon: "fa-solid fa-medal",           group: "Deals" },
    "instant-book":       { label: "Instant book",        icon: "fa-solid fa-bolt",            group: "Deals" },
};

module.exports.index = async (req, res) => {
    const { tags } = req.query;
    let filter = {};
    let activeTags = [];

    if (tags) {
        activeTags = Array.isArray(tags) ? tags : [tags];
        activeTags = activeTags.filter(t => VALID_TAGS.includes(t));
        if (activeTags.length > 0) {
            filter.tags = { $all: activeTags };
        }
    }

    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", { allListings, VALID_TAGS, TAG_META, activeTags });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs", { VALID_TAGS, TAG_META });
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing, TAG_META });
};

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.tags = req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : [];
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl, VALID_TAGS, TAG_META });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    listing.tags = req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : [];
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }
    await listing.save();
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
};
