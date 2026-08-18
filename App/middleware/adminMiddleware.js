const adminMiddleware = (req, res, next) => {

    if (req.user.role !== "admin") {   //access only the role
        return res.status(403).send({
            status: 0,
            message: "Access denied. Admin only."
        });
    }

    next();
};

module.exports = adminMiddleware;