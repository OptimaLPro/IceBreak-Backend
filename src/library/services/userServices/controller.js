import Users from "../../modules/usersModule.js";
import bcrypt from "bcrypt";

export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find();
    if (!users) {
      return res.status(404).json({ error: "No users found" });
    }
    res.json(users);
  } catch (error) {
    console.log("error fetching users:", error);
    res.status(500).send(error.message);
  }
};

export const createUser = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    avatar: req.body.avatar,
    history: req.body.history,
    favorites: req.body.favorites,
  };
  try {
    const newUser = new Users(userData);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.code === 11000 && error.keyValue.email !== undefined) {
      res.status(400).json({ error: "Email already exists" });
    } else {
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
};

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
};

export const loginUser = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("User not found");
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.json({ message: "Login successful" });
    } else {
      throw new Error("Incorrect password");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getUserByToken = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) {
    return res.sendStatus(401);
  }
  jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    res.json(user);
  });
};

export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null) {
      return res.sendStatus(401);
    }
    const decoded = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const addFavorite = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;
  try {
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.favorites.push(favorite);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const changePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await Users.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
