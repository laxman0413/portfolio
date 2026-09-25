const { Router } = require('express');
const { getPortfolio } = require('../controllers/portfolioController');
const { sendContactMessage } = require('../controllers/contactController');
const { chat } = require('../controllers/chatController');

const router = Router();

router.get('/portfolio', getPortfolio);
router.post('/contact', sendContactMessage);
router.post('/chat', chat);

module.exports = router;