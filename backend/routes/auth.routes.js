const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.models');
require('dotenv').config();

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);

        const existingUser = await User.findOne({ username: name });
        if (existingUser) {
            return res.status(400).json("User already exists"); // ✅ Add return
        }

        const myEncPassword = await bcrypt.hash(password, 10);
        const user = new User({ username: name, email, password: myEncPassword });
        console.log(user);
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '30d' });

        return res.status(200).json({ token }); // ✅ Add return
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Registration failed' }); // ✅ Add return
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        console.log(name, password);

        if (!(name && password)) {
            return res.status(400).json('Enter all fields'); // ✅ Add return
        }

        const user = await User.findOne({ username: name });
        console.log(user);

        if (!user) {
            return res.status(404).json('User not found'); // ✅ Add return
        }

		const isMatch = await bcrypt.compare(password, user.password);
		console.log("Password match:", isMatch);
		if (!isMatch) {
   		return res.status(400).json('Invalid email or password');
		}
          const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '30d' });

        return res.status(200).json({ token }); // ✅ Add return
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Login failed' }); // ✅ Add return
    }
});

module.exports = router;
