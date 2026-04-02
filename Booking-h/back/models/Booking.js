const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    // Snapshot полей помещения на момент бронирования
    serviceId:    { type: String },
    serviceTitle: { type: String, required: true },
    serviceImage: { type: String },
    price:        { type: Number, required: true },
    date:         { type: String, required: true },
    time:         { type: String, required: true },
    guests:       { type: Number, required: true, min: 1, max: 50 },
    status:       { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    notes:        { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
