const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const auth = require('../middleware/auth');

// GET /api/bookings — все бронирования текущего пользователя
router.get('/', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.userId })
            .populate('room', 'title image price duration location')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения бронирований' });
    }
});

// GET /api/bookings/:id — конкретное бронирование
router.get('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, user: req.userId })
            .populate('room');
        if (!booking) return res.status(404).json({ error: 'Бронирование не найдено' });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения бронирования' });
    }
});

// POST /api/bookings — создать бронирование
router.post('/', auth, async (req, res) => {
    try {
        const { roomId, serviceId, serviceTitle, serviceImage, price, date, time, guests, notes } = req.body;

        // Базовая валидация
        if (!date || !time || !guests) {
            return res.status(400).json({ error: 'Укажите дату, время и количество гостей' });
        }

        // Проверяем, существует ли помещение (если передан roomId)
        let roomRef = roomId;
        if (roomId) {
            const room = await Room.findById(roomId);
            if (!room || !room.isActive) {
                return res.status(404).json({ error: 'Помещение не найдено или недоступно' });
            }
        }

        // Проверяем конфликт — то же помещение, та же дата и время
        if (roomId) {
            const conflict = await Booking.findOne({
                room: roomId,
                date,
                time,
                status: 'confirmed',
            });
            if (conflict) {
                return res.status(409).json({ error: 'Это время уже занято. Выберите другое.' });
            }
        }

        const booking = await Booking.create({
            user: req.userId,
            room: roomRef || undefined,
            serviceId,
            serviceTitle,
            serviceImage,
            price,
            date,
            time,
            guests,
            notes: notes || '',
            status: 'confirmed',
        });

        const populated = await booking.populate('room', 'title image price duration location');
        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ error: 'Ошибка создания бронирования', details: err.message });
    }
});

// PATCH /api/bookings/:id/cancel — отменить бронирование
router.patch('/:id/cancel', auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, user: req.userId });
        if (!booking) return res.status(404).json({ error: 'Бронирование не найдено' });
        if (booking.status === 'cancelled') {
            return res.status(400).json({ error: 'Бронирование уже отменено' });
        }

        booking.status = 'cancelled';
        await booking.save();
        res.json({ message: 'Бронирование отменено', booking });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка отмены бронирования' });
    }
});

// DELETE /api/bookings/:id — удалить бронирование
router.delete('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!booking) return res.status(404).json({ error: 'Бронирование не найдено' });
        res.json({ message: 'Бронирование удалено' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка удаления бронирования' });
    }
});

// GET /api/bookings/admin/all — все бронирования (для будущего админ-панели)
router.get('/admin/all', auth, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('room', 'title location')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения всех бронирований' });
    }
});

module.exports = router;
