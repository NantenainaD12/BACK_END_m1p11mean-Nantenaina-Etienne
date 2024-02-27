// auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret_key =  "2439e411506396bd15aa959f1ab09eaf2efa2d8d17dea832bdcafaba98a8da5d"; // Votre clé secrète

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // si aucun token, renvoyer une erreur 401

    jwt.verify(token, secret_key, (err, user) => {
        if (err) return res.sendStatus(403); // si le token est invalide, renvoyer une erreur 403
        req.user = user;
        next(); // passer au prochain middleware
    });
}

module.exports = authenticateToken;
