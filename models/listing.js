const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const VALID_TAGS = [
    "digital-nomad", "romantic", "family-friendly", "pet-friendly", "party-friendly",
    "fast-wifi", "dedicated-desk", "ev-charger", "self-checkin",
    "private-pool", "hot-tub", "rooftop", "beach-access", "mountain-view", "firepit", "bbq",
    "solar-powered", "eco-certified",
    "long-stay-discount", "superhost", "instant-book"
];

const listingSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    image: { url: String, filename: String },
    price: Number,
    location: String,
    country: String,
    tags: {
        type: [String],
        enum: VALID_TAGS,
        default: []
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    owner: { type: Schema.Types.ObjectId, ref: "User" }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = { Listing, VALID_TAGS };
