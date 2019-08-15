const express = require("express");
const router = express.Router();

const advertisementController = require("../controllers/advertisementController");

router.get("/advertisements", advertisementController.index); //js file needs to match name plural

module.exports = router;
