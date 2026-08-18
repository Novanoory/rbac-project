const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["user", "admin"],//rule only aloow these values in role field
            default: "user"
        }
    },
    {
        timestamps: true //Mongoose option that automatically adds two date fields to every document.
                        //createdAt, updatedAt

    }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;