const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    description: { type: String, required: true },
    category:    { type: String, required: true, enum: ['workspace', 'events', 'creative', 'wellness'] },
    price:       { type: Number, required: true },
    duration:    { type: String, required: true },
    location:    { type: String, required: true },
    image:       { type: String, required: true },
    features:    [{ type: String }],
    rating:      { type: Number, default: 0 },
    reviews:     { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
