const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  comparePrice: {
    type: DataTypes.DECIMAL(10, 2),
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Categories",
      key: "id",
    },
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  featuredImage: {
    type: DataTypes.STRING,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  sku: {
    type: DataTypes.STRING,
    unique: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  },
  isNew: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  discountStartDate: {
    type: DataTypes.DATE,
  },
  discountEndDate: {
    type: DataTypes.DATE,
  },
  newUntil: {
    type: DataTypes.DATE,
  },
 
  showInNewArrivals: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  showInTrending: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  showInBestSelling: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  showInMostPopular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  showInFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  showInHeroBanner: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  

  heroBannerOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  trendingOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalSales: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
  ,FlashSale: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  flashSalePrice: {
    type: DataTypes.DECIMAL(10, 2)
  },
  flashSaleStart: {
    type: DataTypes.DATE
  },
  flashSaleEnd: {
    type: DataTypes.DATE
  },
  flashSaleOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  

  seasonalCollection: {
    type: DataTypes.STRING 
  },
  
 
  showInHeroBanner: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  heroBannerTitle: {
    type: DataTypes.STRING
  },
  heroBannerDescription: {
    type: DataTypes.TEXT
  },
  heroBannerButtonText: {
    type: DataTypes.STRING,
    defaultValue: 'Shop Now'
  },
  heroBannerOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Product;
