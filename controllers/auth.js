import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    try {
        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        // Create a new user
        const newUser = new User({ ...req.body, password: hash });

        await newUser.save();
        res.status(201).json({ success: true, message: "User has been created." });
    } catch (err) {
        if (err.code === 11000) {
            // Handle unique constraint error
            const field = Object.keys(err.keyPattern)[0]; // Get the field causing the error
            const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
            return res.status(400).json({ success: false, status: 400, message });
        }
        next(err); // For other errors
    }
};


export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name });
        if (!user) return next(createError(404, "User not found!"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordCorrect) return next(createError(400, "Wrong credentials!"));

        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...others } = user._doc;

        res.cookie("access_token", token, {
            httpOnly: true,
        })
            .status(200)
            .json(others);
    } catch (err) {
        next(err);
    }

};

export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (!user.img) {
                user.set({ img: req.body.img });
                user.save();
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT);
            res.cookie("access_token", token, {
                httpOnly: true,
            })
                .status(200)
                .json(user._doc);
        } else {
            const newUser = new User({
                ...req.body,
                fromGoogle: true,
            });
            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
            
            res.cookie("access_token", token, {
                httpOnly: true,
            })
                .status(200)
                .json(savedUser._doc);
        }
    } catch (err) {
        next(err);
    }
};


