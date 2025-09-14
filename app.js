const express = require('express');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/missions', require('./routes/missions'));
app.use('/candidatures', require('./routes/candidatures'));

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});




