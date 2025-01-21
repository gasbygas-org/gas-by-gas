const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const outletRoutes = require('./routes/outletRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const userAdminRoutes = require('./routes/userAdminRoutes');
const stocksRoutes = require('./routes/stockRoutes');


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/outlet', outletRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/user', userAdminRoutes);
app.use('/api/stock',stocksRoutes);

// Error handling (always at the bottom)
app.use((err, req, res, next) => {
    res.status(500).json({ message: 'An unexpected error occurred', error: err.message });
});

//server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
