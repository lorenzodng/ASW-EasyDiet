//middleware jwt

import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization; //recupera l'header
    if (!authHeader)
        return res.status(401).json({ message: "Token mancante" });

    const token = authHeader.split(' ')[1]; //estrae il token dall'header
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //decodifica il token
        req.user = decoded; //memorizzo l'id in req così da passarlo al controller della stessa rotta
        next(); //chiama il controller della stessa rotta
    } catch (err) {
        res.status(401).json({ message: "Token non valido" });
    }
};
