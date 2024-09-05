import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please provide a valid email" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User created successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log({ user })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({
            name: user.name,
            email: user.email,
            profileImage: user.profileImage
        })
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const updateUserProfile = async (req, res) => {
    const { name, email } = req.body;
    const profileImage = req.file ? req.file.path : null;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (profileImage) user.profileImage = profileImage;

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};