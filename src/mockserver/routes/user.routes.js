const express = require('express');
const router = express.Router();
const axios = require('axios').default;

const { db } = require('../config.js');

router.post('', async (req, res) => {
  const params = req.body;
  try {
    if(!params.name) return res.status(400).end(JSON.stringify({
      "titulo": "Um ou mais campos inválidos",
      "campos": [
        {
          "nome": "nome",
          "mensagem": "deve ser um nome válido"
        }
      ]
    }));
    if(!params.email) return res.status(400).end(JSON.stringify({
      "titulo": "Um ou mais campos inválidos",
      "campos": [
        {
          "nome": "email",
          "mensagem": "deve ser um e-mail válido"
        }
      ]
    }));
    if(!params.email.includes("user@")) return res.status(400).end(JSON.stringify({
      "titulo": "Email já cadastrado"
    }));
    if(!params.password) return res.status(400).end(JSON.stringify({
      "titulo": "Um ou mais campos inválidos",
      "campos": [
        {
          "nome": "senha",
          "mensagem": "deve ser uma senha válida"
        }
      ]
    }));
    res.status(200).end();
  } catch (e) {
    console.error(e);
  }
});

router.post('/login', async (req, res) => {
  const params = req.body;
  try {
    const response = await axios.get(db + 'user', { params });
    res.end(JSON.stringify(response.data));
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
