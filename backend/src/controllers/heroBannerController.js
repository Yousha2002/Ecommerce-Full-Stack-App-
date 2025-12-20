const { HeroBanner } = require('../models');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const { Op } = require('sequelize');
exports.createHeroBanner = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      button1Text,
      button1Link,
      button2Text,
      button2Link,
      textPosition,
      backgroundColor,
      overlayColor,
      position,
      startDate,
      endDate,
      isActive = true
    } = req.body;

    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const imageResult = await uploadToCloudinary(req.files.image[0]);
    const imageUrl = imageResult.secure_url;

    let mobileImageUrl = imageUrl;
    if (req.files.mobileImage) {
      const mobileResult = await uploadToCloudinary(req.files.mobileImage[0]);
      mobileImageUrl = mobileResult.secure_url;
    }

    const heroBanner = await HeroBanner.create({
      title,
      subtitle,
      description,
      button1Text: button1Text || 'Shop Now',
      button1Link: button1Link || '/products',
      button2Text: button2Text || '',
      button2Link: button2Link || '',
      textPosition: textPosition || 'center',
      backgroundColor,
      overlayColor: overlayColor || 'rgba(0,0,0,0.3)',
      position: position || 0,
      startDate,
      endDate,
      isActive: isActive === 'true' || isActive === true,
      image: imageUrl,
      mobileImage: mobileImageUrl
    });

    res.status(201).json({
      message: 'Hero banner created successfully',
      heroBanner
    });
  } catch (error) {
    console.error('Error creating hero banner:', error);
    res.status(500).json({ error: 'Server error creating hero banner' });
  }
};

exports.getAdminHeroBanners = async (req, res) => {
  try {
    const banners = await HeroBanner.findAll({
      order: [['position', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(banners);
  } catch (error) {
    console.error('Error fetching admin hero banners:', error);
    res.status(500).json({ error: 'Server error fetching hero banners' });
  }
};
exports.getActiveHeroBanners = async (req, res) => {
  try {
    const now = new Date();
    const banners = await HeroBanner.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { startDate: null, endDate: null },
          { startDate: { [Op.lte]: now }, endDate: { [Op.gte]: now } },
          { startDate: null, endDate: { [Op.gte]: now } },
          { startDate: { [Op.lte]: now }, endDate: null }
        ]
      },
      order: [['position', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json(banners);
  } catch (error) {
    console.error('Error fetching hero banners:', error);
    res.status(500).json({ error: 'Server error fetching hero banners' });
  }
};

exports.getAllHeroBanners = async (req, res) => {
  try {
    const banners = await HeroBanner.findAll({
      order: [['position', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(banners);
  } catch (error) {
    console.error('Error fetching all hero banners:', error);
    res.status(500).json({ error: 'Server error fetching hero banners' });
  }
};

exports.getHeroBannerById = async (req, res) => {
  try {
    const banner = await HeroBanner.findByPk(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: 'Hero banner not found' });
    }
    res.json(banner);
  } catch (error) {
    console.error('Error fetching hero banner:', error);
    res.status(500).json({ error: 'Server error fetching hero banner' });
  }
};

exports.updateHeroBanner = async (req, res) => {
  try {
    const banner = await HeroBanner.findByPk(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: 'Hero banner not found' });
    }

    const {
      title,
      subtitle,
      description,
      button1Text,
      button1Link,
      button2Text,
      button2Link,
      textPosition,
      backgroundColor,
      overlayColor,
      position,
      startDate,
      endDate,
      isActive
    } = req.body;

    let imageUrl = banner.image;
    let mobileImageUrl = banner.mobileImage;

    if (req.files && req.files.image) {
      if (banner.image) {
        const publicId = banner.image.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`herobanners/${publicId}`);
      }
      const result = await uploadToCloudinary(req.files.image[0]);
      imageUrl = result.secure_url;
    }

    if (req.files && req.files.mobileImage) {
      if (banner.mobileImage) {
        const publicId = banner.mobileImage.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`herobanners/mobile/${publicId}`);
      }
      const result = await uploadToCloudinary(req.files.mobileImage[0]);
      mobileImageUrl = result.secure_url;
    }

    await banner.update({
      title: title || banner.title,
      subtitle: subtitle !== undefined ? subtitle : banner.subtitle,
      description: description || banner.description,
      button1Text: button1Text || banner.button1Text,
      button1Link: button1Link || banner.button1Link,
      button2Text: button2Text !== undefined ? button2Text : banner.button2Text,
      button2Link: button2Link || banner.button2Link,
      textPosition: textPosition || banner.textPosition,
      backgroundColor: backgroundColor || banner.backgroundColor,
      overlayColor: overlayColor || banner.overlayColor,
      position: position || banner.position,
      startDate: startDate || banner.startDate,
      endDate: endDate || banner.endDate,
      isActive: isActive !== undefined ? isActive === 'true' : banner.isActive,
      image: imageUrl,
      mobileImage: mobileImageUrl
    });

    res.json({
      message: 'Hero banner updated successfully',
      heroBanner: banner
    });
  } catch (error) {
    console.error('Error updating hero banner:', error);
    res.status(500).json({ error: 'Server error updating hero banner' });
  }
};

exports.deleteHeroBanner = async (req, res) => {
  try {
    const banner = await HeroBanner.findByPk(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: 'Hero banner not found' });
    }

    if (banner.image) {
      const publicId = banner.image.split('/').pop().split('.')[0];
      await deleteFromCloudinary(`herobanners/${publicId}`);
    }

    if (banner.mobileImage) {
      const publicId = banner.mobileImage.split('/').pop().split('.')[0];
      await deleteFromCloudinary(`herobanners/mobile/${publicId}`);
    }

    await banner.destroy();
    res.json({ message: 'Hero banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting hero banner:', error);
    res.status(500).json({ error: 'Server error deleting hero banner' });
  }
};