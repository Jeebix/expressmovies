/* Dans package.json, rajouter dans "scripts/start" node app.js permet
avec npm start de démarrer l'application sur app.js avec node */
// Ajout de "dev": "nodemon app.js" permet en lancant npm run dev de lancer nodemon sur app.js
// Ordre des routes importante: routes spécialisées (add) à mettre avant route plus génériques (variables)
// Middleware = "poste de travail" qui ajoute des fonctionnalités
// EJS: template engine

const express = require('express');
const app = express(); // app appli express

const PORT = 3000;

// Méthode use() pour utiliser middleware
// express.static permet de définir un endroit où sont des fichiers statiques (images, pdf, ...)
// On peut préfixer le chemin qui s'affiche dans l'url (ici /public)
app.use('/public', express.static('public'));

// A configurer au départ (2 choses)
app.set('views', './views'); // Définit le répertoire utilisé pour EJS
app.set('view engine', 'ejs'); // Définit le moteur d'engine

// Méthode get() prends 2 paramètres
// 1 - la route (url)
// 2 - callback

// Pour utliser un template: méthode render()

// Avec route
app.get('/movies', (req, res) => {
	// res.send('Bientôt des films ici-même');
	res.render('movies');
});

// app.get('/movie-details', (req, res) => {
// 	res.render('movie-details');
// });

// Pour ajout de film
app.get('/movies/add', (req, res) => {
	res.send('prochainement, un formulaire d\'ajout');
});

// Route + paramètre
app.get('/movies/:id', (req, res) => {
	const id    = req.params.id;
	// req avec méthode params permet de récupérer variable de l'url (:variable)
	// res.send(`film numéro ${id}`);
	// Objet pass à la vue: id accessible via movieid
	res.render('movie-details', { movieId: id });
});

// par défaut ('/' revient à localhost:port)
app.get('/', (req, res) => {
	// res.send('Hello world !!!!');
	res.render('index'); // Utilisation template 'index'
});

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});