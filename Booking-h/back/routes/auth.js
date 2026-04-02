const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Заполните все поля' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка регистрации' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Введите email и пароль' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка входа' });
    }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
        res.json({ id: user._id, name: user.name, email: user.email, createdAt: user.createdAt });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения профиля' });
    }
});

// PATCH /api/auth/profile
router.patch('/profile', auth, async (req, res) => {
    try {
        const { name, email } = req.body;
        const updates = {};

        if (name) updates.name = name.trim();
        if (email) {
            const taken = await User.findOne({ email, _id: { $ne: req.userId } });
            if (taken) return res.status(400).json({ error: 'Этот email уже используется' });
            updates.email = email.trim();
        }

        const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
        res.json({ id: user._id, name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка обновления профиля' });
    }
});

// PATCH /api/auth/password
router.patch('/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Укажите текущий и новый пароль' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Новый пароль должен содержать минимум 6 символов' });
        }

        const user = await User.findById(req.userId);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Неверный текущий пароль' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: 'Пароль успешно изменён' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка смены пароля' });
    }
});

module.exports = router;
