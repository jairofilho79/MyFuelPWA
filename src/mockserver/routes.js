const express = require('express');
const router = express.Router();
const axios = require('axios').default;

const { db } = require('./config.js');

router.get('', (req, res) => {
  res.send('Hello, World');
});

router.post('/user/login', async (req, res) => {
  const params = req.body;
  try {
    const response = await axios.get(db + 'user', { params });
    res.end(JSON.stringify(response.data));
  } catch (e) {
    console.error(e);
  }
});

router.post('/user', async (req, res) => {
  const params = req.body;
  try {
    if(!params.username) return res.status(404).end("username not found");
    if(!params.email) return res.status(404).end("email not found");
    if(!params.password) return res.status(404).end("password not found");
    res.status(204).end();
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
