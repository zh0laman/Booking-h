require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes    = require('./routes/auth');
const roomRoutes    = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');

const app = express();

// ── Middlewares ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors());

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/rooms',    roomRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── MongoDB ────────────────────────────────────────────────────────────────────
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('❌ Переменная MONGO_URI не найдена в .env!');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => console.log('✅ MongoDB подключена'))
    .catch((err) => {
        console.error('❌ Ошибка подключения к MongoDB:', err.message);
        process.exit(1);
    });

// ── Server ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
    console.log(`📋 Эндпоинты:`);
    console.log(`   POST   /api/auth/register`);
    console.log(`   POST   /api/auth/login`);
    console.log(`   GET    /api/auth/me`);
    console.log(`   PATCH  /api/auth/profile`);
    console.log(`   PATCH  /api/auth/password`);
    console.log(`   GET    /api/rooms`);
    console.log(`   GET    /api/rooms/:id`);
    console.log(`   POST   /api/rooms  (auth)`);
    console.log(`   PUT    /api/rooms/:id  (auth)`);
    console.log(`   DELETE /api/rooms/:id  (auth)`);
    console.log(`   POST   /api/rooms/seed`);
    console.log(`   GET    /api/bookings  (auth)`);
    console.log(`   POST   /api/bookings  (auth)`);
    console.log(`   PATCH  /api/bookings/:id/cancel  (auth)`);
    console.log(`   DELETE /api/bookings/:id  (auth)`);
});
