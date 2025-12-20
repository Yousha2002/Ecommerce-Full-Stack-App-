

const sequelize = require("../config/database");
const User = require("./User");
const Category = require("./Category");
const Product = require("./Product");
const Cart = require("./Cart");
const Wishlist = require("./Wishlist");
const Review = require("./Review");
const FlashSale = require("./FlashSale");
const ComingSoon = require("./ComingSoon");
const HeroBanner = require("./HeroBanner");



Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });




User.hasMany(Cart, { foreignKey: "userId", as: "cartItems" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });
Cart.belongsTo(Product, { foreignKey: "productId", as: "product" });

User.hasMany(Wishlist, { foreignKey: "userId", as: "wishlistItems" });
Wishlist.belongsTo(User, { foreignKey: "userId", as: "user" });
Wishlist.belongsTo(Product, { foreignKey: "productId", as: "product" });

User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "productId", as: "product" });
Cart.belongsTo(FlashSale, { 
  foreignKey: "flashSaleId", 
  as: "flashSale" 
});
FlashSale.hasMany(Cart, { 
  foreignKey: "flashSaleId", 
  as: "cartItems" 
});

// ComingSoon associations (agar product ke saath link karna hai toh)
// ComingSoon.belongsTo(Product, {
//   foreignKey: "productId",
//   as: "product"
// });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Cart,
  Wishlist,
  Review,
  HeroBanner,
 ComingSoon,
  FlashSale,
};
