
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true, 
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  flashSaleId: {
    type: DataTypes.UUID, 
    allowNull: true,
    references: {
      model: 'FlashSales',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  itemType: {
    type: DataTypes.ENUM('product', 'flash_sale'),
    defaultValue: 'product'
  }
}, {
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['userId', 'productId']
    },
    {
      fields: ['userId', 'flashSaleId']
    }
  ]
});



module.exports = Cart;