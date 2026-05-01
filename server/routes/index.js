const { Router } = require('express');
const { getPortfolio } = require('../controllers/portfolioController');
const { sendContactMessage } = require('../controllers/contactController');

const router = Router();

router.get('/portfolio', getPortfolio);
router.post('/contact', sendContactMessage);

module.exports = router;