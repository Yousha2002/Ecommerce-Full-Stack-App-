const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const {  Op } = require('sequelize');
const ComingSoon = sequelize.define('ComingSoon', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  buttonText: {
    type: DataTypes.STRING,
    defaultValue: 'Notify Me'
  },
  buttonLink: {
    type: DataTypes.STRING,
    defaultValue: '#'
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  backgroundColor: {
    type: DataTypes.STRING,
    defaultValue: '#FFFFFF'
  },
  textColor: {
    type: DataTypes.STRING,
    defaultValue: '#000000'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['isActive']
    },
    {
      fields: ['displayOrder']
    },
    {
      fields: ['startDate', 'endDate']
    }
  ]
});


ComingSoon.getActiveSections = async function() {
  const now = new Date();
  return await this.findAll({
    where: {
      isActive: true,
      [Op.or]: [
        {
          startDate: null,
          endDate: null
        },
        {
          startDate: { [Op.lte]: now },
          endDate: { [Op.gte]: now }
        },
        {
          startDate: { [Op.lte]: now },
          endDate: null
        },
        {
          startDate: null,
          endDate: { [Op.gte]: now }
        }
      ]
    },
    order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']]
  });
};

module.exports = ComingSoon;