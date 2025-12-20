const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HeroBanner = sequelize.define('HeroBanner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobileImage: {
    type: DataTypes.STRING
  },
  button1Text: {
    type: DataTypes.STRING,
    defaultValue: 'Shop Now'
  },
  button1Link: {
    type: DataTypes.STRING,
    defaultValue: '/products'
  },
  button2Text: {
    type: DataTypes.STRING,
    defaultValue: 'Learn More'
  },
  button2Link: {
    type: DataTypes.STRING,
    defaultValue: '/about'
  },
  textPosition: {
    type: DataTypes.ENUM('left', 'center', 'right'),
    defaultValue: 'center'
  },
  backgroundColor: {
    type: DataTypes.STRING
  },
  overlayColor: {
    type: DataTypes.STRING,
    defaultValue: 'rgba(0,0,0,0.3)'
  },
  position: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  startDate: {
    type: DataTypes.DATE
  },
  endDate: {
    type: DataTypes.DATE
  }
});

module.exports = HeroBanner;