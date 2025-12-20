const { Category, Product } = require("../models");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");
const { validationResult } = require("express-validator");

exports.createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      imageUrl = result.secure_url;
    }

    const category = await Category.create({
      name,
      description,
      image: imageUrl,
    });

    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ error: "Server error creating category" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Product,
          as: "products",
          where: { isActive: true },
          required: false,
        },
      ],
    });

    const categoriesWithCount = categories.map((category) => ({
      ...category.toJSON(),
      productCount: category.products ? category.products.length : 0,
    }));

    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching categories" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: "products",
          where: { isActive: true },
          required: false,
        },
      ],
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const categoryWithCount = {
      ...category.toJSON(),
      productCount: category.products ? category.products.length : 0,
    };

    res.json(categoryWithCount);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching category" });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: {
        categoryId: id,
        isActive: true,
      },
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.json({
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        image: category.image,
      },
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProducts: count,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Server error fetching products" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    let imageUrl = category.image;

    if (req.file) {
      if (category.image) {
        const publicId = category.image.split("/").pop().split(".")[0];
        await deleteFromCloudinary(`ecommerce/${publicId}`);
      }
      const result = await uploadToCloudinary(req.file);
      imageUrl = result.secure_url;
    }

    await category.update({
      name: name || category.name,
      description: description || category.description,
      image: imageUrl,
    });

    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ error: "Server error updating category" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await category.update({ isActive: false });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error deleting category" });
  }
};
