// JWT authentication middleware

import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization; // retrieves the Authorization header
    if (!authHeader)
        return res.status(401).json({ message: "Token mancante" });

    const token = authHeader.split(' ')[1]; // extracts the token from the header
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verifies and decodes the token
        req.user = decoded; // attach decoded user data to the request object
        next(); //pass control
    } catch (err) {
        res.status(401).json({ message: "Token non valido" });
    }
};
