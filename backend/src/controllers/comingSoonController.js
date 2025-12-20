const { ComingSoon } = require("../models");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

exports.createComingSoon = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      buttonText,
      buttonLink,
      displayOrder,
      isActive,
      backgroundColor,
      textColor,
      startDate,
      endDate,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const result = await uploadToCloudinary(req.file);
    const imageUrl = result.secure_url;

    const comingSoon = await ComingSoon.create({
      title,
      description,
      image: imageUrl,
      buttonText: buttonText || "Notify Me",
      buttonLink: buttonLink || "#",
      displayOrder: parseInt(displayOrder) || 0,
      isActive: isActive === "true" || isActive === true,
      backgroundColor: backgroundColor || "#FFFFFF",
      textColor: textColor || "#000000",
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    });

    res.status(201).json({
      message: "Coming soon section created successfully",
      comingSoon,
    });
  } catch (error) {
    console.error("Error creating coming soon section:", error);
    res
      .status(500)
      .json({ error: "Server error creating coming soon section" });
  }
};

exports.getAllComingSoon = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (isActive !== undefined) where.isActive = isActive === "true";

    const { count, rows: comingSoonSections } =
      await ComingSoon.findAndCountAll({
        where,
        order: [
          ["displayOrder", "ASC"],
          ["createdAt", "DESC"],
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

    res.json({
      comingSoonSections,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalSections: count,
    });
  } catch (error) {
    console.error("Error fetching coming soon sections:", error);
    res
      .status(500)
      .json({ error: "Server error fetching coming soon sections" });
  }
};

exports.getActiveComingSoon = async (req, res) => {
  try {
    const comingSoonSections = await ComingSoon.getActiveSections();
    res.json(comingSoonSections);
  } catch (error) {
    console.error("Error fetching active coming soon sections:", error);
    res
      .status(500)
      .json({ error: "Server error fetching coming soon sections" });
  }
};

exports.getComingSoonById = async (req, res) => {
  try {
    const comingSoon = await ComingSoon.findByPk(req.params.id);

    if (!comingSoon) {
      return res.status(404).json({ error: "Coming soon section not found" });
    }

    res.status(200).json(comingSoon);
  } catch (error) {
    console.error("Error fetching coming soon section:", error);
    res
      .status(500)
      .json({ error: "Server error fetching coming soon section" });
  }
};

exports.updateComingSoon = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const comingSoon = await ComingSoon.findByPk(req.params.id);
    if (!comingSoon) {
      return res.status(404).json({ error: "Coming soon section not found" });
    }

    const {
      title,
      description,
      buttonText,
      buttonLink,
      displayOrder,
      isActive,
      backgroundColor,
      textColor,
      startDate,
      endDate,
    } = req.body;

    let imageUrl = comingSoon.image;
    if (req.file) {
      if (comingSoon.image) {
        try {
          const publicId = comingSoon.image.split("/").pop().split(".")[0];
          await deleteFromCloudinary(`ecommerce/${publicId}`);
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }

      const result = await uploadToCloudinary(req.file);
      imageUrl = result.secure_url;
    }

    await comingSoon.update({
      title: title || comingSoon.title,
      description: description || comingSoon.description,
      image: imageUrl,
      buttonText: buttonText || comingSoon.buttonText,
      buttonLink: buttonLink || comingSoon.buttonLink,
      displayOrder:
        displayOrder !== undefined
          ? parseInt(displayOrder)
          : comingSoon.displayOrder,
      isActive:
        isActive !== undefined
          ? isActive === "true" || isActive === true
          : comingSoon.isActive,
      backgroundColor: backgroundColor || comingSoon.backgroundColor,
      textColor: textColor || comingSoon.textColor,
      startDate: startDate ? new Date(startDate) : comingSoon.startDate,
      endDate: endDate ? new Date(endDate) : comingSoon.endDate,
    });

    res.json({
      message: "Coming soon section updated successfully",
      comingSoon,
    });
  } catch (error) {
    console.error("Error updating coming soon section:", error);
    res
      .status(500)
      .json({ error: "Server error updating coming soon section" });
  }
};

exports.deleteComingSoon = async (req, res) => {
  try {
    const comingSoon = await ComingSoon.findByPk(req.params.id);
    if (!comingSoon) {
      return res.status(404).json({ error: "Coming soon section not found" });
    }

    if (comingSoon.image) {
      try {
        const publicId = comingSoon.image.split("/").pop().split(".")[0];
        await deleteFromCloudinary(`ecommerce/${publicId}`);
      } catch (deleteError) {
        console.error("Error deleting image:", deleteError);
      }
    }

    await comingSoon.destroy();

    res.json({ message: "Coming soon section deleted successfully" });
  } catch (error) {
    console.error("Error deleting coming soon section:", error);
    res
      .status(500)
      .json({ error: "Server error deleting coming soon section" });
  }
};
