const { Review, Product, User } = require('../models');
const { validationResult } = require('express-validator');


exports.addReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, rating, title, comment } = req.body;
    const userId = req.user.id;


    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }


    const existingReview = await Review.findOne({
      where: { userId, productId }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    
    const review = await Review.create({
      userId,
      productId,
      rating: parseInt(rating),
      title,
      comment,
      isVerified: false 
    });

    await updateProductRatings(productId);

   
    const reviewWithUser = await Review.findByPk(review.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      message: 'Review added successfully',
      review: reviewWithUser
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Server error adding review' });
  }
};


exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    const offset = (page - 1) * limit;


    let order;
    switch (sort) {
      case 'highest':
        order = [['rating', 'DESC']];
        break;
      case 'lowest':
        order = [['rating', 'ASC']];
        break;
      case 'newest':
      default:
        order = [['createdAt', 'DESC']];
        break;
    }

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { 
        productId,
        isActive: true 
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order
    });


    const ratingDistribution = await Review.findAll({
      where: { productId, isActive: true },
      attributes: [
        'rating',
        [Review.sequelize.fn('COUNT', Review.sequelize.col('id')), 'count']
      ],
      group: ['rating'],
      raw: true
    });

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalReviews: count,
      ratingDistribution
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error fetching reviews' });
  }
};


exports.updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findOne({
      where: { id, userId }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.update({
      rating: rating || review.rating,
      title: title || review.title,
      comment: comment || review.comment
    });

    await updateProductRatings(review.productId);

    const updatedReview = await Review.findByPk(review.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Server error updating review' });
  }
};


exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({
      where: { id, userId }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const productId = review.productId;
    await review.destroy();

    
    await updateProductRatings(productId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Server error deleting review' });
  }
};


exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { userId },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'featuredImage']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalReviews: count
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: 'Server error fetching user reviews' });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, productId, userId, isVerified } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (productId) where.productId = productId;
    if (userId) where.userId = userId;
    if (isVerified !== undefined) where.isVerified = isVerified === 'true';

    const { count, rows: reviews } = await Review.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'featuredImage']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalReviews: count
    });
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ error: 'Server error fetching reviews' });
  }
};

exports.toggleReviewVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.update({ isVerified });

    res.json({
      message: `Review ${isVerified ? 'verified' : 'unverified'} successfully`,
      review
    });
  } catch (error) {
    console.error('Error toggling review verification:', error);
    res.status(500).json({ error: 'Server error toggling review verification' });
  }
};

async function updateProductRatings(productId) {
  try {
    const reviews = await Review.findAll({
      where: { productId, isActive: true },
      attributes: [
        [Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'avgRating'],
        [Review.sequelize.fn('COUNT', Review.sequelize.col('id')), 'totalReviews']
      ],
      raw: true
    });

    const avgRating = parseFloat(reviews[0].avgRating) || 0;
    const totalReviews = parseInt(reviews[0].totalReviews) || 0;

    await Product.update(
      {
        averageRating: avgRating.toFixed(2),
        totalReviews
      },
      { where: { id: productId } }
    );
  } catch (error) {
    console.error('Error updating product ratings:', error);
    throw error;
  }
}

exports.getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 50, productId, userId, isVerified } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (productId) where.productId = productId;
    if (userId) where.userId = userId;
    if (isVerified !== undefined) where.isVerified = isVerified === 'true';

    const { count, rows: reviews } = await Review.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'featuredImage']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalReviews: count
    });
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ error: 'Server error fetching reviews' });
  }
};


exports.toggleReviewVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const review = await Review.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'featuredImage']
        }
      ]
    });
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.update({ isVerified });

    
    if (isVerified) {
      await updateProductRatings(review.productId);
    }

    res.json({
      message: `Review ${isVerified ? 'verified' : 'unverified'} successfully`,
      review
    });
  } catch (error) {
    console.error('Error toggling review verification:', error);
    res.status(500).json({ error: 'Server error toggling review verification' });
  }
};

exports.getApprovedTestimonials = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const testimonials = await Review.findAll({
      where: { 
        isVerified: true,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'featuredImage']
        }
      ],
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching testimonials' });
  }
};