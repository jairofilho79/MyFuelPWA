const express = require('express');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/user.routes.js');

app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);

app.listen(3333, () => {
  console.log('server is on');
});
