const express = require("express");
const { handleWebhook } = require("../controllers/webhookController");
const webhookRouter = express.Router();


webhookRouter.post("/", handleWebhook);

module.exports = webhookRouter;
