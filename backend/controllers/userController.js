import fs from "fs";
import imagekit from "../config/imageKit.js";
import User from "../models/User.js";
// update user data using userId

export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { username, bio, location, full_name } = req.body;
    const tempUser = await User.findById(userId);
    if (!tempUser) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
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

    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
        folder: "/users/profile",
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          {
            quality: "auto",
          },
          {
            format: "webp",
          },
          {
            width: 512,
          },
        ],
      });
      updateData.profile_picture = url;
    }

    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: cover1``.originalname,
        folder: "/users/cover",
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          {
            quality: "auto",
          },
          {
            format: "webp",
          },
          {
            width: 1280,
          },
        ],
      });
      updateData.cover_photo = url;
    }
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.json({ success: true, user, message: "Profile Updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// get user data using userId

export const getUserId = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    if (!user) {
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
      message: error.message,
    });
  }
};

// find user using username, location, email, fileName

export const discoverUsers = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { input } = req.body;
    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });
    const filteredUsers = allUsers.filter((user) => user._id !== userId);
    res.json({ success: true, users: filteredUsers });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
