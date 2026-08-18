const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send({
                status: 0,
                message: "Authorization header missing"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).send({
                status: 0,
                message: "Token missing"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).send({
            status: 0,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;