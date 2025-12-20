const { Product, Category, Review, User  } = require('../models');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const { validationResult } = require('express-validator');


exports.createProduct = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      price,
      comparePrice,
      categoryId,
      stock,
      sku,
      isFeatured,
       discount,
      isNew,
      discountStartDate,
      discountEndDate,
      newUntil,
      showInNewArrivals,
      showInTrending,
      showInBestSelling,
      showInMostPopular,
      showInFeatured,
      showInHeroBanner,
      heroBannerOrder,
      trendingOrder
    } = req.body;


    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Category not found' });
    }

    let images = [];
    let featuredImage = null;

    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          console.log('Uploading file:', file.originalname);
          const result = await uploadToCloudinary(file);
          images.push(result.secure_url);
        }
        featuredImage = images[0];
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ 
          error: 'Failed to upload images', 
          details: uploadError.message 
        });
      }
    }

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      categoryId: parseInt(categoryId),
      stock: parseInt(stock),
      sku,
      isFeatured: isFeatured === 'true',
      images,
      featuredImage,
       discount: discount || 0,
      isNew: isNew === 'true',
      discountStartDate: discountStartDate || null,
      discountEndDate: discountEndDate || null,
      newUntil: newUntil || null,
       showInNewArrivals: showInNewArrivals === 'true',
      showInTrending: showInTrending === 'true',
      showInBestSelling: showInBestSelling === 'true',
      showInMostPopular: showInMostPopular === 'true',
      showInFeatured: showInFeatured === 'true',
      showInHeroBanner: showInHeroBanner === 'true',
      heroBannerOrder: heroBannerOrder || 0,
      trendingOrder: trendingOrder || 0
    });

    const productWithCategory = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }]
    });

    res.status(201).json({ 
      message: 'Product created successfully', 
      product: productWithCategory 
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ 
      error: 'Server error creating product',
      details: error.message 
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 10, minRating } = req.query;
    const offset = (page - 1) * limit;

    const where = { isActive: true };
    if (category) where.categoryId = category;
    if (featured === 'true') where.isFeatured = true;
    if (minRating) where.averageRating = { [Op.gte]: parseFloat(minRating) };

    const products = await Product.findAndCountAll({
      where,
      include: [
        { 
          model: Category, 
          as: 'category' 
        }
      ],
      attributes: {
        include: [
    
        ]
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      products: products.rows,
      totalPages: Math.ceil(products.count / limit),
      currentPage: parseInt(page),
      totalProducts: products.count
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { 
          model: Category, 
          as: 'category' 
        },
        {
          model: Review,
          as: 'reviews',
          where: { isActive: true },
          required: false,
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }]
        }
      ]
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching product' });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const {
      name,
      description,
      price,
      comparePrice,
      categoryId,
      stock,
      sku,
      isFeatured,
       discount,
      isNew,
      discountStartDate,
      discountEndDate,
      newUntil,
       showInNewArrivals,
      showInTrending,
      showInBestSelling,
      showInMostPopular,
      showInFeatured,
      showInHeroBanner,
      heroBannerOrder,
      trendingOrder
    } = req.body;

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }
    }

    let images = product.images;
    let featuredImage = product.featuredImage;

    if (req.files && req.files.length > 0) {
 
      for (const file of req.files) {
        const result = await uploadToCloudinary(file);
        images.push(result.secure_url);
      }
      featuredImage = images[0];
    }

    await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      comparePrice: comparePrice || product.comparePrice,
      categoryId: categoryId || product.categoryId,
      stock: stock || product.stock,
      sku: sku || product.sku,
      isFeatured: isFeatured !== undefined ? isFeatured === 'true' : product.isFeatured,
      images,
      featuredImage,
      discount: discount !== undefined ? discount : product.discount,
      isNew: isNew !== undefined ? isNew === 'true' : product.isNew,
      discountStartDate: discountStartDate || product.discountStartDate,
      discountEndDate: discountEndDate || product.discountEndDate,
      newUntil: newUntil || product.newUntil,
       showInNewArrivals: showInNewArrivals !== undefined ? showInNewArrivals === 'true' : product.showInNewArrivals,
      showInTrending: showInTrending !== undefined ? showInTrending === 'true' : product.showInTrending,
      showInBestSelling: showInBestSelling !== undefined ? showInBestSelling === 'true' : product.showInBestSelling,
      showInMostPopular: showInMostPopular !== undefined ? showInMostPopular === 'true' : product.showInMostPopular,
      showInFeatured: showInFeatured !== undefined ? showInFeatured === 'true' : product.showInFeatured,
      showInHeroBanner: showInHeroBanner !== undefined ? showInHeroBanner === 'true' : product.showInHeroBanner,
      heroBannerOrder: heroBannerOrder || product.heroBannerOrder,
      trendingOrder: trendingOrder || product.trendingOrder
    });

    const updatedProduct = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }]
    });

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }


    await product.update({ isActive: false });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting product' });
  }
};


exports.getHeroBannerProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { 
        showInHeroBanner: true,
        isActive: true 
      },
      order: [['heroBannerOrder', 'ASC'], ['createdAt', 'DESC']],
      limit: 5,
      include: [{ model: Category, as: 'category' }]
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching hero banner products:', error);
    res.status(500).json({ error: 'Server error fetching hero banner products' });
  }
};

exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { 
        showInNewArrivals: true,
        isActive: true 
      },
      order: [['createdAt', 'DESC']],
      limit: 8,
      include: [{ model: Category, as: 'category' }]
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    res.status(500).json({ error: 'Server error fetching new arrivals' });
  }
};

exports.getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { 
        showInTrending: true,
        isActive: true 
      },
      order: [['trendingOrder', 'ASC'], ['averageRating', 'DESC']],
      limit: 8,
      include: [{ model: Category, as: 'category' }]
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching trending products:', error);
    res.status(500).json({ error: 'Server error fetching trending products' });
  }
};

exports.getBestSelling = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { 
        showInBestSelling: true,
        isActive: true 
      },
      order: [['totalSales', 'DESC'], ['createdAt', 'DESC']],
      limit: 8,
      include: [{ model: Category, as: 'category' }]
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching best selling products:', error);
    res.status(500).json({ error: 'Server error fetching best selling products' });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { 
        showInFeatured: true,
        isActive: true 
      },
      order: [['isFeatured', 'DESC'], ['createdAt', 'DESC']],
      limit: 8,
      include: [{ model: Category, as: 'category' }]
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ error: 'Server error fetching featured products' });
  }
};

exports.getMostPopular = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { 
        showInMostPopular: true,
        isActive: true 
      },
      order: [['averageRating', 'DESC'], ['totalReviews', 'DESC']],
      limit: 8,
      include: [{ model: Category, as: 'category' }]
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching most popular products:', error);
    res.status(500).json({ error: 'Server error fetching most popular products' });
  }
};