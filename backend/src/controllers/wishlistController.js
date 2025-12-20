const { Wishlist, Product, Category } = require("../models");

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingWishlistItem = await Wishlist.findOne({
      where: { userId, productId },
    });

    if (existingWishlistItem) {
      return res.status(400).json({ error: "Product already in wishlist" });
    }

    const wishlistItem = await Wishlist.create({
      userId,
      productId,
    });

    const wishlistWithProduct = await Wishlist.findByPk(wishlistItem.id, {
      include: [
        {
          model: Product,
          as: "product",

          include: [{ model: Category, as: "category" }],
        },
      ],
    });

    res.status(201).json({
      message: "Product added to wishlist",
      wishlistItem: wishlistWithProduct,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ error: "Server error adding to wishlist" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const wishlistItem = await Wishlist.findOne({
      where: { id, userId },
    });

    if (!wishlistItem) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }

    await wishlistItem.destroy();

    res.json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ error: "Server error removing from wishlist" });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",

          include: [{ model: Category, as: "category" }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(wishlistItems);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Server error fetching wishlist" });
  }
};

exports.checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlistItem = await Wishlist.findOne({
      where: { userId, productId },
    });

    res.json({ isInWishlist: !!wishlistItem });
  } catch (error) {
    console.error("Error checking wishlist:", error);
    res.status(500).json({ error: "Server error checking wishlist" });
  }
};
