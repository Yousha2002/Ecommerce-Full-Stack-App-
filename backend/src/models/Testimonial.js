
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Testimonial = sequelize.define('Testimonial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reviewId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Reviews',
      key: 'id'
    }
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Testimonial;