const router = require("express").Router();
const articlesRoutes = require("./articles");

// Book routes
router.use("/articles", articlesRoutes);

module.exports = router;
