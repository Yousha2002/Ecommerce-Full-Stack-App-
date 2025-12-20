const { DataTypes, Op } = require("sequelize");
const sequelize = require("../config/database");

const FlashSale = sequelize.define(
  "FlashSale",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discountPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    buttonText: {
      type: DataTypes.STRING,
      defaultValue: "Shop Now",
    },
    buttonLink: {
      type: DataTypes.STRING,
      defaultValue: "/products",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    saleCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    oldPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    currentPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Products",
        key: "id",
      },
    },
    flashSalePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    stockLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    soldCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    targetUrl: {
      type: DataTypes.STRING,
      defaultValue: "/products",
    },
    backgroundColor: {
      type: DataTypes.STRING,
      defaultValue: "#C9B59C",
    },
    textColor: {
      type: DataTypes.STRING,
      defaultValue: "#FFFFFF",
    },
  },
  {
    indexes: [
      {
        fields: ["startDate", "endDate"],
      },
      {
        fields: ["isActive"],
      },
      {
        fields: ["saleCode"],
      },
    ],
  }
);

FlashSale.getActiveFlashSales = async function () {
  const now = new Date();
  return await this.findAll({
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
};

FlashSale.generateSaleCode = function () {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "FLASH";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = FlashSale;
