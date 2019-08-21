const express = require("express");
const router = express.Router();

const flairController = require("../controllers/flairController");

router.get("/posts/:postId/flairs/new", flairController.new);

router.post("/posts/:postId/flairs/create", flairController.create);

router.get("/posts/:postId/flairs/:id", flairController.show);

module.exports = router;
