const router = require("express").Router();
const userRoutes = require("./userRoutes");
const thoughtsRoutes = require("./thoughtsRoutes");

router.use("/user", userRoutes);
router.use("/thoughts", thoughtsRoutes);

module.exports = router;
