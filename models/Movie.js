const mongoose = require('mongoose');

// Schéma mongoose (constructeur Schema)
const movieSchema = mongoose.Schema({
	movietitle: String,
	movieyear: Number
});

// Modèle mongoose (correspond à 1 collection mongoDB)
// 2 arguments: objet représentant la base (Movie si base movies) + schéma
module.exports = mongoose.model('Movie', movieSchema);