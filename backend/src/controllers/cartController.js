const { Cart, Product, FlashSale } = require("../models");
const { Op } = require("sequelize");

exports.getCart = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Product,
          as: "product",
          where: { isActive: true },
          required: false,
        },
        {
          model: FlashSale,
          as: "flashSale",
          required: false,
        },
      ],
    });

    const validCartItems = cartItems.filter(
      (item) => item.product !== null || item.flashSale !== null
    );

    res.json(validCartItems);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching cart" });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, flashSaleId, quantity = 1 } = req.body;

    if (!productId && !flashSaleId) {
      return res
        .status(400)
        .json({ error: "Either productId or flashSaleId is required" });
    }

    if (productId && flashSaleId) {
      return res
        .status(400)
        .json({
          error: "Only one of productId or flashSaleId can be provided",
        });
    }

    let item, itemType;

    if (productId) {
      item = await Product.findOne({
        where: { id: productId, isActive: true },
      });
      itemType = "product";

      if (!item) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (item.stock < quantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }
    } else if (flashSaleId) {
      item = await FlashSale.findOne({
        where: {
          id: flashSaleId,
          isActive: true,
          startDate: { [Op.lte]: new Date() },
          endDate: { [Op.gte]: new Date() },
        },
      });
      itemType = "flash_sale";

      if (!item) {
        return res
          .status(404)
          .json({ error: "Flash sale not found or expired" });
      }
    }

    const whereClause = { userId: req.user.id };
    if (productId) {
      whereClause.productId = productId;
    } else {
      whereClause.flashSaleId = flashSaleId;
    }

    const existingCartItem = await Cart.findOne({ where: whereClause });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + parseInt(quantity);

      if (productId && item.stock < newQuantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }

      if (flashSaleId) {
      }

      await existingCartItem.update({
        quantity: newQuantity,
        itemType: itemType,
      });

      const updatedCartItem = await Cart.findByPk(existingCartItem.id, {
        include: [
          { model: Product, as: "product" },
          { model: FlashSale, as: "flashSale" },
        ],
      });

      return res.json({
        message: "Cart updated successfully",
        cartItem: updatedCartItem,
      });
    }

    const cartData = {
      userId: req.user.id,
      quantity: parseInt(quantity),
      itemType: itemType,
    };

    if (productId) {
      cartData.productId = productId;
    } else {
      cartData.flashSaleId = flashSaleId;
    }

    const cartItem = await Cart.create(cartData);

    const cartItemWithDetails = await Cart.findByPk(cartItem.id, {
      include: [
        { model: Product, as: "product" },
        { model: FlashSale, as: "flashSale" },
      ],
    });

    res.status(201).json({
      message: "Item added to cart",
      cartItem: cartItemWithDetails,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Server error adding to cart" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await Cart.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        { model: Product, as: "product" },
        { model: FlashSale, as: "flashSale" },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (cartItem.itemType === "product" && cartItem.product) {
      if (cartItem.product.stock < quantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }
    } else if (cartItem.itemType === "flash_sale" && cartItem.flashSale) {
      const now = new Date();
      if (
        now < cartItem.flashSale.startDate ||
        now > cartItem.flashSale.endDate
      ) {
        return res.status(400).json({ error: "Flash sale has ended" });
      }
    }

    await cartItem.update({ quantity });

    res.json({ message: "Cart item updated successfully", cartItem });
  } catch (error) {
    res.status(500).json({ error: "Server error updating cart item" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await cartItem.destroy();

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ error: "Server error removing from cart" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.destroy({ where: { userId: req.user.id } });
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error clearing cart" });
  }
};
