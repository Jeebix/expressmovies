/* Dans package.json, rajouter dans "scripts/start" node app.js permet
avec npm start de démarrer l'application sur app.js avec node */
// Ajout de "dev": "nodemon app.js" permet en lancant npm run dev de lancer nodemon sur app.js
// Ordre des routes importante: routes spécialisées (add) à mettre avant route plus génériques (variables)
// Middleware = "poste de travail" qui ajoute des fonctionnalités
// EJS: template engine

const express = require('express');
const app = express(); // app appli express
const bodyParser = require('body-parser'); // on importe body-parser
const multer = require('multer'); // Multer middleware qui gère champs postés + photos uploadées côté serveur
const upload = multer(); // On utilise multer (standard: 'upload')

const PORT = 3000;
let frenchMovies = [];

// Méthode use() pour utiliser middleware
// express.static permet de définir un endroit où sont des fichiers statiques (images, pdf, ...)
// On peut préfixer le chemin qui s'affiche dans l'url (ici /public)
app.use('/public', express.static('public'));
// app.use(bodyParser.urlencoded({ extended: false })); // Pour utiliser body-parser (voir github body-parser)

// A configurer au départ (2 choses)
app.set('views', './views'); // Définit le répertoire utilisé pour EJS
app.set('view engine', 'ejs'); // Définit le moteur d'engine

// Méthode get() prends 2 paramètres
// 1 - la route (url)
// 2 - callback

// Pour utliser un template: méthode render()

// Avec route
app.get('/movies', (req, res) => {
	const title = 'Films Français des trente dernières années';
	frenchMovies = [
		{ title: 'Le fabuleux destin d\'Amélie Poulain', year: 2001 },
		{ title: 'Buffet froid', year: 1979 },
		{ title: 'Le diner de cons', year: 1998 },
		{ title: 'De rouille et d\'os', year: 2012 }
	];
	// Pour passer tableau d'objet à une vue
	res.render('movies', { movies: frenchMovies, title: title });
});

// pour utiliser body-parser sur une route spécifique
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Passer middleware en 2ème paramètre (peut y avoir plusieurs autres middlewares en paramètres)
// app.post('/movies', urlencodedParser, (req, res) => {
// 	console.log(req.body); // BP utilise le name de l'input pour récupérer la donnée
// 	const newMovie = { title: req.body.movietitle, year: req.body.movieyear };
	
// 	// frenchMovies.push(newMovie); // push rajoute un élément au tableau
// 	frenchMovies = [newMovie, ...frenchMovies]; // spreadoperator crée un nouveau tableau (immutabilité)
// 	console.log(frenchMovies);
	
// 	res.sendStatus(201); // Statut 201 = qqchose de créé
// });

// On gère le POST avec multer (méthode upload.fields([]))
app.post('/movies', upload.fields([]), (req, res) => {
	if ( !req.body ) {
		return res.sendStatus(500);
	}
	else {
		const formData = req.body;
		console.log('formdata', formData);
		const newMovie = { title: req.body.movietitle, year: req.body.movieyear };
		frenchMovies   = [newMovie, ...frenchMovies];
		res.sendStatus(201);
	}
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
	const id = req.params.id;
	// req avec méthode params permet de récupérer variable de l'url (:variable)
	// res.send(`film numéro ${id}`);
	// Objet passé à la vue: id accessible via movieid
	res.render('movie-details', { movieId: id });
});

// par défaut ('/' revient à localhost:port)
app.get('/', (req, res) => {
	// res.send('Hello world !!!!');
	res.render('index'); // Utilisation template 'index'
});

app.get('/movie-search', (req, res) => {
	res.render('movie-search');
});

app.get('/login', (req, res) => {
	res.render('login', { title: 'Connexion' });
});

const fakeUser = { email: 'testuser@testmail.fr', password: 'qsd' };

app.post('/login', urlencodedParser, (req, res) => {
	console.log('login post', req.body);
	if ( !req.body ) {
		res.sendStatus(500);
	}
	else {
		if ( fakeUser.email === req.body.email && fakeUser.password === req.body.password ) {
			res.json({
				email: 'testuser@testmail.fr',
				favoriteMovie: 'Test movie',
				favoriteMovieTheater: 'Pathé Le Mans',
				lastLoginDate: new Date()
			});
		}
		else {
			res.sendStatus(401);
		}
	}
});

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});