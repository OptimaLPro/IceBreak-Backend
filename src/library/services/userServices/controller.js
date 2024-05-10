import Users from "../../modules/usersModule.js";

export const getAllUsers =  async (req, res) => {
    try {
      console.log("inside");
      const users = await Users.find();
      if (!users) {
        return res.status(404).json({ error: "No users found" });
      }
      res.json(users);
      console.log(users);
    } catch (error) {
      console.log("error fetching users:", error);
      res.status(500).send(error.message);
    }
  };

export const createUser = async (req, res) => {
  const userData = req.body;
  try {
    const newUser = new Users(userData);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.code === 11000 && error.keyValue.email !== undefined) {
      // If the error is due to a duplicate email
      res.status(400).json({ error: "Email already exists" });
    } else {
      // For other errors
      res.status(400).json({ error: `Error creating user: ${error.message}` });
    }
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  try {
    const user = await Users.findByIdAndUpdate(id, userData, { new: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
}