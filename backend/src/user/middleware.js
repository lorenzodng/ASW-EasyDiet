import jwt from 'jsonwebtoken';

/*
  Authentication middleware:
  Verifies JWT tokens from incoming requests.
  Blocks requests with missing or invalid tokens before they reach the controller layer.
*/

// Verifiy JWT and attaches user info to the request
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: "Token di autenticazione mancante" });
    const token = authHeader.split(' ')[1]; // Extract the token from the header
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token
        req.user = decoded;
        next(); // Continue to controller
    } catch (err) {
        res.status(401).json({ message: "Token di autenticazione non valido" });
    }
};
