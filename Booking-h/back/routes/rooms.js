const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');

// Начальные данные для сида (совпадают с frontend/src/data/services.js)
const seedRooms = [
    {
        title: 'Private Meeting Room',
        description: 'Fully equipped meeting room for up to 8 people with display screen, whiteboard, and high-speed internet.',
        category: 'workspace', price: 45, duration: '1 hour',
        location: 'Floor 3, Block A',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
        features: ['Wi-Fi', 'Display', 'Whiteboard', 'Coffee'],
        rating: 4.9, reviews: 128,
    },
    {
        title: 'Coworking Day Pass',
        description: 'Open desk in our modern coworking space. Includes amenities and unlimited coffee throughout the day.',
        category: 'workspace', price: 25, duration: 'Full day',
        location: 'Floor 1, Open Area',
        image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=600&h=400&fit=crop',
        features: ['Wi-Fi', 'Coffee', 'Locker', 'Print'],
        rating: 4.7, reviews: 256,
    },
    {
        title: 'Conference Hall',
        description: 'Large conference hall for presentations and events. Seats up to 50 people with full AV setup.',
        category: 'events', price: 200, duration: '2 hours',
        location: 'Floor 5, Main Hall',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop',
        features: ['AV System', 'Microphone', 'Stage', 'Catering'],
        rating: 4.8, reviews: 64,
    },
    {
        title: 'Photography Studio',
        description: 'Professional photography studio with lighting equipment, backdrops, and editing workstation.',
        category: 'creative', price: 80, duration: '2 hours',
        location: 'Floor 2, Studio B',
        image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&h=400&fit=crop',
        features: ['Lighting', 'Backdrops', 'Props', 'Editing PC'],
        rating: 4.6, reviews: 42,
    },
    {
        title: 'Podcast Recording Booth',
        description: 'Soundproof recording booth with professional microphones, mixer, and acoustic treatment.',
        category: 'creative', price: 60, duration: '1 hour',
        location: 'Floor 2, Booth 1',
        image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=400&fit=crop',
        features: ['Soundproof', 'Microphones', 'Mixer', 'Headphones'],
        rating: 4.9, reviews: 89,
    },
    {
        title: 'Workshop Space',
        description: 'Flexible workshop area with movable furniture for up to 20 participants. Ideal for training sessions.',
        category: 'events', price: 120, duration: '3 hours',
        location: 'Floor 4, Room 401',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop',
        features: ['Projector', 'Flipcharts', 'Wi-Fi', 'Catering'],
        rating: 4.5, reviews: 37,
    },
    {
        title: 'Private Office (Weekly)',
        description: 'Dedicated private office for a team of 4. Includes storage, phone booth access, and mail handling.',
        category: 'workspace', price: 350, duration: '1 week',
        location: 'Floor 3, Office 305',
        image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop',
        features: ['24/7 Access', 'Storage', 'Mail', 'Phone Booth'],
        rating: 4.8, reviews: 71,
    },
    {
        title: 'Rooftop Event Space',
        description: 'Open-air rooftop venue for networking events, parties, and celebrations. Stunning city views.',
        category: 'events', price: 500, duration: '4 hours',
        location: 'Rooftop, Level 8',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop',
        features: ['City Views', 'Bar Area', 'DJ Setup', 'Seating'],
        rating: 5.0, reviews: 19,
    },
    {
        title: 'Yoga & Wellness Room',
        description: 'Calm wellness space for yoga classes, meditation, or wellness workshops. Mats and equipment provided.',
        category: 'wellness', price: 35, duration: '1 hour',
        location: 'Floor 1, Wellness Wing',
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&h=400&fit=crop',
        features: ['Mats', 'Sound System', 'Mirrors', 'Showers'],
        rating: 4.7, reviews: 93,
    },
    {
        title: 'Video Production Suite',
        description: 'Full video production setup with green screen, cameras, teleprompter, and post-production editing bay.',
        category: 'creative', price: 150, duration: '3 hours',
        location: 'Floor 2, Suite C',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop',
        features: ['Green Screen', 'Cameras', 'Teleprompter', 'Editing'],
        rating: 4.8, reviews: 31,
    },
    {
        title: 'Executive Boardroom',
        description: 'Premium boardroom with leather seating, video conferencing system, and dedicated reception.',
        category: 'workspace', price: 95, duration: '1 hour',
        location: 'Floor 6, Executive Suite',
        image: 'https://images.unsplash.com/photo-1431540015159-0f91f4e0c63a?w=600&h=400&fit=crop',
        features: ['Video Conf', 'Reception', 'Refreshments', 'Parking'],
        rating: 4.9, reviews: 55,
    },
    {
        title: 'Fitness Class Booking',
        description: 'Group fitness class with certified instructor. Options include HIIT, spinning, or circuit training.',
        category: 'wellness', price: 15, duration: '45 min',
        location: 'Floor 1, Gym',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
        features: ['Instructor', 'Equipment', 'Towels', 'Water'],
        rating: 4.6, reviews: 187,
    },
];

// GET /api/rooms — список помещений (с фильтрацией)
router.get('/', async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice } = req.query;
        const filter = { isActive: true };

        if (category && category !== 'all') {
            filter.category = category;
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const rooms = await Room.find(filter).sort({ createdAt: -1 });
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения списка помещений' });
    }
});

// GET /api/rooms/:id — одно помещение
router.get('/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ error: 'Помещение не найдено' });
        res.json(room);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения помещения' });
    }
});

// POST /api/rooms — создать помещение (только авторизованный пользователь/админ)
router.post('/', auth, async (req, res) => {
    try {
        const room = await Room.create(req.body);
        res.status(201).json(room);
    } catch (err) {
        res.status(400).json({ error: 'Ошибка создания помещения', details: err.message });
    }
});

// PUT /api/rooms/:id — обновить помещение
router.put('/:id', auth, async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!room) return res.status(404).json({ error: 'Помещение не найдено' });
        res.json(room);
    } catch (err) {
        res.status(400).json({ error: 'Ошибка обновления помещения', details: err.message });
    }
});

// DELETE /api/rooms/:id — мягкое удаление (скрыть)
router.delete('/:id', auth, async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!room) return res.status(404).json({ error: 'Помещение не найдено' });
        res.json({ message: 'Помещение деактивировано', room });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка удаления помещения' });
    }
});

// POST /api/rooms/seed — заполнить базу начальными данными
router.post('/seed', async (req, res) => {
    try {
        const count = await Room.countDocuments();
        if (count > 0) {
            return res.json({ message: `База уже содержит ${count} помещений. Сид не нужен.` });
        }
        const rooms = await Room.insertMany(seedRooms);
        res.status(201).json({ message: `Добавлено ${rooms.length} помещений`, rooms });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сида', details: err.message });
    }
});

module.exports = router;
