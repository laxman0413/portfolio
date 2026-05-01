const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:4200')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);

app.use(
	cors({
		origin(origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
				return;
			}

			callback(new Error('Not allowed by CORS'));
		},
	})
);
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_request, response) => {
	response.json({ status: 'ok' });
});

app.use('/api', apiRoutes);

app.use((error, _request, response, _next) => {
	const statusCode = error.statusCode || 500;
	response.status(statusCode).json({
		success: false,
		message: error.message || 'Internal server error',
	});
});

app.listen(port, () => {
	console.log(`Portfolio API running on http://localhost:${port}`);
});
