const User = require("../models/User");
const Link = require("../models/Link");

const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOneAndUpdate(
      { username },
      { $inc: { profileViews: 1 } },
      { new: true }
    );

    console.log("Updated views:", user?.profileViews);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const links = await Link.find({ user: user._id }).sort({ order: 1 });

    res.status(200).json({
      user: {
        name: user.name,
        username: user.username,
        profileViews: user.profileViews,
      },
      links,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getPublicProfile,
};