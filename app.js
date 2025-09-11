require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const missionRoutes = require('./routes/missions');
const candidatureRoutes = require('./routes/candidatures');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Статические файлы (доступ к резюме)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Роуты
app.use('/auth', authRoutes);
app.use('/missions', missionRoutes);
app.use('/candidatures', candidatureRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
