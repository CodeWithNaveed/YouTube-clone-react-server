import jwt from "jsonwebtoken";
import { createError } from "./utils/error.js";

// export const verifyToken = (req, res, next) => {
//     const token = req.cookies.access_token;
//     if (!token) return next(createError(401, "You are not authenticated!"));

//     jwt.verify(token, process.env.JWT,(err, user) => {
//         if (err) return next(createError(403, "Token is not valid!"));
//         req.user = user;
//         next()
//     });
// };

// export const verifyToken = (req, res, next) => {
//     const token = req.cookies.access_token;
//     if (!token) return res.status(403).json("Not authenticated!");
    
//     jwt.verify(token, process.env.JWT, (err, user) => {
//         if (err) return res.status(403).json("Invalid token!");
//         req.user = user;
//         next();
//     });
// };


export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Token extract karo

    if (!token) {
        return res.status(403).json({ message: "Access denied! No token provided." });
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token!" });
        }
        req.user = user;
        next();
    });
};