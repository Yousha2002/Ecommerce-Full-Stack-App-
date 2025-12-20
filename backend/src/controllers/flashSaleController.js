const { FlashSale } = require("../models");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

exports.createFlashSale = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      discountPercentage,
      startDate,
      endDate,
      buttonText,
      buttonLink,
      displayOrder,
      isActive,
      targetUrl,
      backgroundColor,
      textColor,
      oldPrice,
      currentPrice,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const result = await uploadToCloudinary(req.file);
    const imageUrl = result.secure_url;

    const saleCode = FlashSale.generateSaleCode();

    const flashSale = await FlashSale.create({
      title,
      description,
      image: imageUrl,
      discountPercentage: parseInt(discountPercentage),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      buttonText: buttonText || "Shop Now",
      buttonLink: buttonLink || "/products",
      displayOrder: parseInt(displayOrder) || 0,
      isActive: isActive === "true" || isActive === true,
      saleCode,
      targetUrl: targetUrl || "/products",
      backgroundColor: backgroundColor || "#C9B59C",
      textColor: textColor || "#FFFFFF",
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      currentPrice: currentPrice ? parseFloat(currentPrice) : null,
    });

    res.status(201).json({
      message: "Flash sale created successfully",
      flashSale,
    });
  } catch (error) {
    console.error("Error creating flash sale:", error);
    res.status(500).json({ error: "Server error creating flash sale" });
  }
};

exports.getAllFlashSales = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (isActive !== undefined) where.isActive = isActive === "true";

    const { count, rows: flashSales } = await FlashSale.findAndCountAll({
      where,
      order: [
        ["displayOrder", "ASC"],
        ["createdAt", "DESC"],
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      flashSales,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalFlashSales: count,
    });
  } catch (error) {
    console.error("Error fetching flash sales:", error);
    res.status(500).json({ error: "Server error fetching flash sales" });
  }
};

exports.getActiveFlashSales = async (req, res) => {
  try {
    const now = new Date();

    const flashSales = await FlashSale.findAll({
      where: {
        isActive: true,
        startDate: { [Op.lte]: now },
        endDate: { [Op.gte]: now },
      },
      order: [
        ["displayOrder", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    res.json(flashSales);
  } catch (error) {
    console.error("Error fetching active flash sales:", error);
    res.status(500).json({ error: "Server error fetching flash sales" });
  }
};

exports.getFlashSaleById = async (req, res) => {
  try {
    const flashSale = await FlashSale.findByPk(req.params.id);

    if (!flashSale) {
      return res.status(404).json({ error: "Flash sale not found" });
    }

    res.status(200).json(flashSale);
  } catch (error) {
    console.error("Error fetching flash sale:", error);
    res.status(500).json({ error: "Server error fetching flash sale" });
  }
};

exports.getFlashSaleByCode = async (req, res) => {
  try {
    const flashSale = await FlashSale.findOne({
      where: { saleCode: req.params.code },
    });

    if (!flashSale) {
      return res.status(404).json({ error: "Flash sale not found" });
    }

    res.json(flashSale);
  } catch (error) {
    console.error("Error fetching flash sale:", error);
    res.status(500).json({ error: "Server error fetching flash sale" });
  }
};

exports.updateFlashSale = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const flashSale = await FlashSale.findByPk(req.params.id);
    if (!flashSale) {
      return res.status(404).json({ error: "Flash sale not found" });
    }

    const {
      title,
      description,
      discountPercentage,
      startDate,
      endDate,
      buttonText,
      buttonLink,
      displayOrder,
      isActive,
      targetUrl,
      backgroundColor,
      textColor,
      oldPrice,
      currentPrice,
    } = req.body;

    let imageUrl = flashSale.image;
    if (req.file) {
      if (flashSale.image) {
        try {
          const publicId = flashSale.image.split("/").pop().split(".")[0];
          await deleteFromCloudinary(`ecommerce/${publicId}`);
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }

      const result = await uploadToCloudinary(req.file);
      imageUrl = result.secure_url;
    }

    await flashSale.update({
      title: title || flashSale.title,
      description: description || flashSale.description,
      image: imageUrl,
      discountPercentage:
        discountPercentage !== undefined
          ? parseInt(discountPercentage)
          : flashSale.discountPercentage,
      startDate: startDate ? new Date(startDate) : flashSale.startDate,
      endDate: endDate ? new Date(endDate) : flashSale.endDate,
      buttonText: buttonText || flashSale.buttonText,
      buttonLink: buttonLink || flashSale.buttonLink,
      displayOrder:
        displayOrder !== undefined
          ? parseInt(displayOrder)
          : flashSale.displayOrder,
      isActive:
        isActive !== undefined
          ? isActive === "true" || isActive === true
          : flashSale.isActive,
      targetUrl: targetUrl || flashSale.targetUrl,
      backgroundColor: backgroundColor || flashSale.backgroundColor,
      textColor: textColor || flashSale.textColor,
      oldPrice:
        oldPrice !== undefined ? parseFloat(oldPrice) : flashSale.oldPrice,
      currentPrice:
        currentPrice !== undefined
          ? parseFloat(currentPrice)
          : flashSale.currentPrice,
    });

    res.json({
      message: "Flash sale updated successfully",
      flashSale,
    });
  } catch (error) {
    console.error("Error updating flash sale:", error);
    res.status(500).json({ error: "Server error updating flash sale" });
  }
};

exports.deleteFlashSale = async (req, res) => {
  try {
    const flashSale = await FlashSale.findByPk(req.params.id);
    if (!flashSale) {
      return res.status(404).json({ error: "Flash sale not found" });
    }

    if (flashSale.image) {
      try {
        const publicId = flashSale.image.split("/").pop().split(".")[0];
        await deleteFromCloudinary(`ecommerce/${publicId}`);
      } catch (deleteError) {
        console.error("Error deleting image:", deleteError);
      }
    }

    await flashSale.destroy();

    res.json({ message: "Flash sale deleted successfully" });
  } catch (error) {
    console.error("Error deleting flash sale:", error);
    res.status(500).json({ error: "Server error deleting flash sale" });
  }
};
