const portfolioData = require('../data/data.json');

function getPortfolio(_request, response) {
  response.json({
    success: true,
    data: portfolioData,
  });
}

module.exports = {
  getPortfolio,
};