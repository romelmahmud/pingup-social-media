// update user data using userId
import User from "../models/User.js";

export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { username, bio, location, full_name } = req.body;
    const tempUser = await User.findById(userId);
    !username && (username = tempUser.username);
    if (tempUser.username !== username) {
      const user = User.findOne({ username });
      if (user) {
        //we will not change the username if it is already taken
        username = tempUser.username;
      }
    }
    const updateData = {
      username,
      bio,
      location,
      full_name,
    };
    const profile = req.files.profile && req.files.profile[0];
    const cover = req.files.cover && req.files.cover[0];

    if (!userId) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: message.error,
    });
  }
};

// get user data using userId

export const getUserId = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    if (!userId) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: message.error,
    });
  }
};
