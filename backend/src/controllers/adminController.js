const { User, Product, Category } = require("../models");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: "user" } });
    const totalProducts = await Product.count();
    const totalCategories = await Category.count();

    const totalOrders = 0;
    const totalRevenue = "0.00";

    const recentProducts = await Product.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [{ model: Category, as: "category" }],
    });

    const recentUsers = await User.findAll({
      where: { role: "user" },
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "name", "email", "createdAt"],
    });

    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue,
      },
      recentProducts,
      recentUsers,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    if (
      error.name === "SequelizeDatabaseError" &&
      error.message.includes("Order")
    ) {
      const totalUsers = await User.count({ where: { role: "user" } });
      const totalProducts = await Product.count();
      const totalCategories = await Category.count();

      const recentProducts = await Product.findAll({
        limit: 5,
        order: [["createdAt", "DESC"]],
        include: [{ model: Category, as: "category" }],
      });

      const recentUsers = await User.findAll({
        where: { role: "user" },
        limit: 5,
        order: [["createdAt", "DESC"]],
        attributes: ["id", "name", "email", "createdAt"],
      });

      return res.json({
        stats: {
          totalUsers,
          totalProducts,
          totalCategories,
          totalOrders: 0,
          totalRevenue: "0.00",
        },
        recentProducts,
        recentUsers,
      });
    }

    res.status(500).json({
      error: "Server error fetching dashboard data: " + error.message,
    });
  }
};
