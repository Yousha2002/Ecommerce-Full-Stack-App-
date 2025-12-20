const { User } = require('../models');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ where: { email: process.env.ADMIN_EMAIL } });
    
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

module.exports = { createAdminUser };