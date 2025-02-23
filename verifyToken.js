import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; 

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