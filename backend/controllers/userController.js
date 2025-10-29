import fs from "fs";
import imagekit from "../config/imageKit.js";
import User from "../models/User.js";

// update user data using userId
export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    let { username, bio, location, full_name } = req.body || {};

    const tempUser = await User.findById(userId);
    if (!tempUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!username) username = tempUser.username;
    if (tempUser.username !== username) {
      const userExists = await User.findOne({ username });
      if (userExists) username = tempUser.username;
    }

    const updateData = {
      username: username || tempUser.username,
      bio: bio || tempUser.bio,
      location: location || tempUser.location,
      full_name: full_name || tempUser.full_name,
    };

    const profile = req.files?.profile?.[0];
    const cover = req.files?.cover?.[0];

    // Helper to upload a file (accepts Buffer or disk path)
    const uploadToImageKit = async ({
      fileBuffer,
      filePath,
      fileName,
      folder,
      transformationOpts,
      extension,
    }) => {
      // If you have Buffer, convert to the SDK's file using toFile helper
      let fileForUpload;
      if (fileBuffer) {
        // toFile returns an object compatible with client.files.upload()
        fileForUpload = await toFile(fileBuffer, fileName);
      } else if (filePath) {
        // fs.createReadStream for disk path
        fileForUpload = fs.createReadStream(filePath);
      } else {
        throw new Error("No file buffer or path provided for upload");
      }

      const uploadParams = {
        file: fileForUpload,
        fileName,
        folder,
        tags: ["user", "profile"], // optional
        useUniqueFileName: true,
        isPrivateFile: false,
        // You can include other options here (customCoordinates, responseFields, etc.)
      };

      const response = await imagekit.files.upload(uploadParams);
      // response usually contains url and filePath; you can use response.url or generate dynamic URL with helper
      const finalUrl =
        response.url ||
        imagekit.helper.buildSrc({
          urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
          src: response.filePath,
          transformation: transformationOpts,
        });

      return { response, finalUrl };
    };

    // Upload profile (prefer buffer if using memoryStorage)
    if (profile) {
      const fileBuffer = profile.buffer ?? null;
      const filePath = profile.path ?? null; // diskStorage
      const fileName = profile.originalname ?? `profile-${Date.now()}`;

      const { finalUrl } = await uploadToImageKit({
        fileBuffer,
        filePath,
        fileName,
        folder: "/users/profile",
        transformationOpts: [
          { quality: "auto" },
          { format: "webp" },
          { width: 512 },
        ],
      });

      updateData.profile_picture = finalUrl;
    }

    // Upload cover
    if (cover) {
      const fileBuffer = cover.buffer ?? null;
      const filePath = cover.path ?? null;
      const fileName = cover.originalname ?? `cover-${Date.now()}`;

      const { finalUrl } = await uploadToImageKit({
        fileBuffer,
        filePath,
        fileName,
        folder: "/users/cover",
        transformationOpts: [
          { quality: "auto" },
          { format: "webp" },
          { width: 1280 },
        ],
      });

      updateData.cover_photo = finalUrl;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    return res.json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// get user data using userId

export const getUserData = async (req, res) => {
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

// Follow user
export const followUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);
    if (user.following.includes(id)) {
      return res.json({
        success: false,
        message: "You are already following this user",
      });
    }
    user.following.push(id);
    await user.save();
    const toUser = await User.findById(id);
    toUser.followers.push(userId);
    await toUser.save();

    res.json({ success: true, message: "Now you are following this user" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// Unfollow User
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);
    user.following = user.following.filter((user) => user !== id);
    await user.save();

    const toUser = await User.findById(id);

    toUser.following = toUser.following.filter((user) => user !== userId);
    await toUser.save();

    res.json({
      success: true,
      message: "You are no longer following this user",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
