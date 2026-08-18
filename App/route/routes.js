const express = require("express");

const router = express.Router();

const {
    signup,
    login,
    profile,
    getAllUsers,
    deleteUser,
    changeRole
} = require("../controller/controller");

const authMiddleware = require("../middleware/auth_middleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// ==========================
// PUBLIC ROUTES
// ==========================

router.post("/signup", signup);

router.post("/login", login);


// ==========================
// AUTHENTICATED USER ROUTE
// ==========================

router.get(
    "/profile",
    authMiddleware,
    profile
);


// ==========================
// ADMIN ONLY ROUTES
// ==========================

router.get(
    "/all",
    authMiddleware,
    adminMiddleware,
    getAllUsers
);

router.delete(
    "/delete/:id",
    authMiddleware,
    adminMiddleware,
    deleteUser
);

router.patch(
    "/role/:id",
    authMiddleware,
    adminMiddleware,
    changeRole
);


module.exports = router;