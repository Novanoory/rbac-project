const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../model/model");


// ==========================
// SIGNUP
// ==========================

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).send({
                status: 0,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).send({
            status: 1,
            message: "Signup successful"
        });

    } catch (error) {
        res.status(500).send({
            status: 0,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================
// LOGIN
// ==========================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send({
                status: 0,
                message: "User not found"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).send({
                status: 0,
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.send({
            status: 1,
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).send({
            status: 0,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================
// PROFILE
// ==========================

const profile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId)
            .select("-password");//Don't include the password field in the result.- means exclude

        if (!user) {
            return res.status(404).send({
                status: 0,
                message: "User not found"
            });
        }

        res.send({
            status: 1,
            user
        });

    } catch (error) {
        res.status(500).send({
            status: 0,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================
// GET ALL USERS
// ADMIN ONLY
// ==========================

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel
            .find()
            .select("-password");

        res.send({
            status: 1,
            users
        });

    } catch (error) {
        res.status(500).send({
            status: 0,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================
// DELETE USER
// ADMIN ONLY
// ==========================

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).send({
                status: 0,
                message: "User not found"
            });
        }

        res.send({
            status: 1,
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).send({
            status: 0,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================
// CHANGE USER ROLE
// ADMIN ONLY
// ==========================

const changeRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {
            return res.status(400).send({
                status: 0,
                message: "Role must be user or admin"
            });
        }

        const user = await userModel.findByIdAndUpdate(
            id,
            { role },
            { new: true } //After updating the user, give me the updated document.
        ).select("-password");

        if (!user) {
            return res.status(404).send({
                status: 0,
                message: "User not found"
            });
        }

        res.send({
            status: 1,
            message: "Role updated successfully",
            user
        });

    } catch (error) {
        res.status(500).send({
            status: 0,
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    signup,
    login,
    profile,
    getAllUsers,
    deleteUser,
    changeRole
};