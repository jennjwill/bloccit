const express = require("express");
const router = express.Router();

const flairController = require("../controllers/flairController");

router.get("/posts/:postId/flairs/new", flairController.new);

module.exports = router;
