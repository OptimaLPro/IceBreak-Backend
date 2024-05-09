import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        // Regular expression for validating email format
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Minimum length of the password
  },
  avatar: {
    type: String,
    // You can add validation for avatar URLs here
    // For example, you can use regex to validate URLs
  },
  history: {
    type: [String],
    // You can add validation for history array here
    // For example, you can set a maximum length for the array
  },
  favorites: {
    type: [String],
    // You can add validation for favorites array here
    // For example, you can set a maximum length for the array
  },
});

const Users = mongoose.model("users", usersSchema);

export default Users;
