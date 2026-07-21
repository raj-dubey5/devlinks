const Link = require("../models/Link")

const addLink = async (req, res) => {
    try {
        const { title, url, order } = req.body;

        const link = await Link.create({
            title,
            url,
            order,
            user: req.user,
        });
        res.status(201).json(link);
    } catch (err) {
  console.error(err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
}
}


const getLinks = async (req, res) => {
    try {
        const link = await Link.find({
            user: req.user,
        });
        res.status(200).json(link);
    } catch (err) {
  console.error(err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
}
}

const updateLink = async (req, res) => {
  try {
    const { title, url, order } = req.body;

    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({
        message: "Link not found",
      });
    }

    if (link.user.toString() !== req.user) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    link.title = title;
    link.url = url;
    link.order = order;

    await link.save();

    res.status(200).json(link);
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
}
};

const deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({
        message: "Link not found",
      });
    }

    if (link.user.toString() !== req.user) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await link.deleteOne();

    res.status(200).json({
      message: "Link deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports={
    addLink,
    getLinks,
    updateLink,
    deleteLink,
}
