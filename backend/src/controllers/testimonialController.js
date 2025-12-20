
const { Testimonial, Review, User, Product } = require('../models');

exports.getFeaturedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { 
        isActive: true,
        isFeatured: true 
      },
      include: [{
        model: Review,
        as: 'review',
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
      }],
      order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']],
      limit: 10
    });

    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching testimonials' });
  }
};

exports.addTestimonial = async (req, res) => {
  try {
    const { reviewId, isFeatured, displayOrder } = req.body;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const existingTestimonial = await Testimonial.findOne({ where: { reviewId } });
    if (existingTestimonial) {
      return res.status(400).json({ error: 'Testimonial already exists for this review' });
    }

    const testimonial = await Testimonial.create({
      reviewId,
      isFeatured: isFeatured || false,
      displayOrder: displayOrder || 0
    });

    const testimonialWithDetails = await Testimonial.findByPk(testimonial.id, {
      include: [{
        model: Review,
        as: 'review',
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
      }]
    });

    res.status(201).json({ message: 'Testimonial added successfully', testimonial: testimonialWithDetails });
  } catch (error) {
    res.status(500).json({ error: 'Server error adding testimonial' });
  }
};