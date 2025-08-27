import User from "../../models/User.js";
import bcrypt from "bcrypt";

export const index = async (req, res) => {
  try {
    const activeUsers = await User.query().where("is_active", 1);
    const inactiveUsers = await User.query().where("is_active", 0);
    const allUsers = [...activeUsers, ...inactiveUsers];

    if (!activeUsers && !inactiveUsers) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json({
      activeUsers,
      inactiveUsers,
      allUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Problem retrieving users.", error: error.message });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.query().findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Problem retrieving a user.", error: error.message });
  }
};

export const store = async (req, res) => {
  const { firstname, lastname, email, pin, is_admin, is_active } = req.body;
  try {
    const hashedPin = bcrypt.hashSync(pin, 10);
    const newUser = await User.query().insert({
      firstname,
      lastname,
      email,
      pin: hashedPin,
      is_admin,
      is_active,
    });
    res.status(201).json({
      message: `User created: ${newUser.firstname} ${newUser.lastname}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Problem creating a user.", error: error.message });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, pin, is_admin, is_active } = req.body;

  try {
    const currentUser = await User.query().findById(id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const updateData = {
      firstname,
      lastname,
      email,
      is_admin,
      is_active,
    };

    if (pin) {
      updateData.pin = bcrypt.hashSync(pin, 10);
    }

    const updatedUser = await User.query().patchAndFetchById(id, updateData);

    return res.status(200).json({
      message: `User: ${updatedUser.firstname} ${updatedUser.lastname} was successfully updated`,
    });
  } catch (error) {
    res.status(500).json({ message: "Problem updating user.", error: error.message });
  }
};
