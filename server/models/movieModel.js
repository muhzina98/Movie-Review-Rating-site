const mongoose  = require("mongoose");

const movieSchema = new mongoose.Schema({
title: { type: String, required: true },
synopsis: String,
genres: [String],
releaseDate: Date,
runtime: Number,
director: String,
cast: [String],
posterUrl: String,
trailerUrl: String,
createdBy: { type: mongoose.Schema.Types.ObjectId,
     ref: 'User' },
avgRating: { 
    type: Number,
     default: 0 },
reviewCount: {
     type: Number, 
     default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Movie',movieSchema)