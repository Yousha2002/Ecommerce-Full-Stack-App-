
const { Product } = require('../models');

exports.getSeasonalCollections = async (req, res) => {
  try {
    const { collection } = req.params;
    
    const products = await Product.findAll({
      where: {
        seasonalCollection: collection,
        isActive: true
      },
      order: [['createdAt', 'DESC']],
      limit: 8,
      include: [{ model: require('./Category'), as: 'category' }]
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching seasonal collection' });
  }
};

exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Product.findAll({
      attributes: [
        'seasonalCollection',
        [sequelize.fn('COUNT', sequelize.col('id')), 'productCount']
      ],
      where: {
        seasonalCollection: { [Op.not]: null },
        isActive: true
      },
      group: ['seasonalCollection'],
      having: sequelize.where(sequelize.fn('COUNT', sequelize.col('id')), '>=', 1)
    });

    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching collections' });
  }
};