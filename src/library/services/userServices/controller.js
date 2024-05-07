import Users from "../../modules/usersModule.js";

export const getAllUsers =
  ("/users",
  async (req, res) => {
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
  });

export const createUser = async (req, res) => {
  const userData = req.body;
  try {
    const newUser = new Users(userData);
    const savedUser = await newUser.save({ validateBeforeSave: false });
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: `Error creating user: ${error.message}` });
  }
};
