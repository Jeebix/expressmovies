/* Dans package.json, rajouter dans "scripts/start" node app.js permet
avec npm start de démarrer l'application sur app.js avec node */
// Ajout de "dev": "nodemon app.js" permet en lancant npm run dev de lancer nodemon sur app.js
// Ordre des routes importante: routes spécialisées (add) à mettre avant route plus génériques (variables)
// Middleware = "poste de travail" qui ajoute des fonctionnalités
// EJS: template engine

const express = require('express');
const app = express(); // app appli express
var favicon = require('serve-favicon'); // Middleware pour favicon
const bodyParser = require('body-parser'); // on importe body-parser
const multer = require('multer'); // Multer middleware qui gère champs postés + photos uploadées côté serveur
const path = require('path'); // Pour serve-favicon
const upload = multer(); // On utilise multer (standard: 'upload')
const config = require('./config');
const movieController = require('./controllers/movieControlleur');
const authController = require('./controllers/authController');

const jwt        = require('jsonwebtoken');
const expressJwt = require('express-jwt'); // Pour vérifier si token dans header de la requête

const faker      = require('faker'); // Librairie pour générer des données en phase de dev (mettre dans devDependencies)
faker.locale = "fr";
// const title = faker.lorem.sentence(3); // phrase de 3 mots
// const year  = Math.floor(Math.random() * 80) + 1950; // génère un nombre entre 1 et 80 ajouté à 1950

const mongoose   = require('mongoose');
mongoose.Promise = Promise;
// Connection mongoose
mongoose.connect(`mongodb://${config.db.user}:${config.db.password}@ds227939.mlab.com:27939/expressmovies`);
// Code pour notification d'état de connection à la base MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: cannot connect to my DB'));
db.once('open', () => {
	console.log('connected to the DB :)');
});

const PORT = 3000;
let frenchMovies = [];

// A configurer au départ (2 choses)
app.set('views', './views'); // Définit le répertoire utilisé pour EJS
app.set('view engine', 'ejs'); // Définit le moteur d'engine

// Méthode use() pour utiliser middleware
// express.static permet de définir un endroit où sont des fichiers statiques (images, pdf, ...)
// On peut préfixer le chemin qui s'affiche dans l'url (ici /public)
app.use('/public', express.static('public'));
// app.use(bodyParser.urlencoded({ extended: false })); // Pour utiliser body-parser (voir github body-parser)

const secret = 'zydfhldjfeoQQSffgkofkdDGLfgdfqdfdFDSfq3545hj43HGFGH344cjqdl65433FGerezFSgfe5vVC336';
// Création middleware expressJwt
// Permet de protéger les urls à l'aide du token (pas de token = pas de page)
// Méthode unless() d'expressJwt permet de faire une exception pour l'url spécifié
// Client doit fournir un token pour accéder aux urls (pages) sauf page de login, ...
app.use(expressJwt({ secret: secret }).unless({
	path: ['/', '/movies', '/movie-search', '/login', new RegExp('/movies.*/', 'i'), new RegExp('/movie-details.*/', 'i')]
	// Expression régulière: movies suivi de n'importe quel caractère répété 0 ou à l'infini, case insensitive ('i')
}));

// Méthode get() prends 2 paramètres
// 1 - la route (url)
// 2 - callback
// Pour utliser un template: méthode render()

// Pour utiliser body-parser sur une route spécifique (granularité)
// créé une application/x-www-form-urlencoded parser
// https://github.com/expressjs/body-parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/movies', movieController.getMovies);

//!\ In upload.fields([]), the empty array '[]' is required
app.post('/movies', upload.fields([]), movieController.postMovie);

app.post('/movies-old-browser', urlencodedParser, movieController.getMoviesOldBrowsers);

app.get('/movies/add', movieController.getMoviesAdd);

app.get('/movies/:id', movieController.getMovieById);

// Pour récupérer données formulaire: multer ou bodyparser (ici, bodyparser)
app.post('/movie-details/:id', urlencodedParser, movieController.postMovieDetails);

app.get('/movie-details/:id', movieController.getMovieDetails);

app.delete('/movie-details/:id', movieController.deleteMovie)

app.get('/movie-search', movieController.movieSearch);

app.get('/login', authController.login);

app.post('/login', urlencodedParser, authController.postLogin);

app.get('/member-only', authController.getMemberOnly);

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});

// // Avec route
// app.get('/movies', (req, res) => {
// 	const title = 'Films Français des trente dernières années';
// 	frenchMovies = [];
// 	// Récupérer des données de mongoDB
// 	Movie.find((err, movies) => {
// 		if ( err ) {
// 			console.error('could not retrive movies from DB');
// 			res.sendStatus(500);
// 		}
// 		else {
// 			frenchMovies = movies;
// 			// Pour passer tableau d'objet à une vue
// 			res.render('movies', { movies: frenchMovies, title: title });
// 		}
// 	});
// });


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
// app.post('/movies', upload.fields([]), (req, res) => {
// 	if ( !req.body ) {
// 		return res.sendStatus(500);
// 	}
// 	else {
// 		const formData = req.body;
// 		console.log('formdata', formData);
// 		// const newMovie = { title: req.body.movietitle, year: req.body.movieyear };
// 		// frenchMovies   = [newMovie, ...frenchMovies];
// 		// res.sendStatus(201);
// 		const title = req.body.movietitle;
// 		const year  = req.body.movieyear;
// 	// Se brancher à un formulaire (mongoose)	
// 		// Instance de Movie
// 		const myMovie = new Movie({ movietitle: title, movieyear: year }); // Propriétés du schéma
// 		// Fonction callback appelée avec méthode save() de mongoose
// 		// "error first" de Node: on teste erreur en 1er, sinon OK
// 		myMovie.save((err, savedMovie) => {
// 			if (err) {
// 				console.error(err);
// 				return;
// 			}
// 			else {
// 				console.log('savedMovie', savedMovie);
// 				res.sendStatus(201);
// 			}
// 		});
// 	}
// });

// app.get('/movie-details', (req, res) => {
// 	res.render('movie-details');
// });

// Pour ajout de film
// app.get('/movies/add', (req, res) => {
// 	res.send('prochainement, un formulaire d\'ajout');
// });

// Route + paramètre
// app.get('/movies/:id', (req, res) => {
// 	const id = req.params.id;
// 	// req avec méthode params permet de récupérer variable de l'url (:variable)
// 	// res.send(`film numéro ${id}`);
// 	// Objet passé à la vue: id accessible via movieid
// 	res.render('movie-details', { movieId: id });
// });

// app.get('/movie-details/:id', (req, res) => {
// 	const id = req.params.id;
// 	// Récupérer document par id avec mongoose
// 	Movie.findById(id, (err, movie) => {
// 		console.log('movie', movie);
// 		res.render('movie-details', { movie: movie });
// 	});
// });

// Pour récupérer données formulaire: multer ou bodyparser (ici, bodyparser)
// app.post('/movie-details/:id', urlencodedParser, (req, res) => {
// 	console.log('req.body', req.body);
// 	if ( !req.body ) {
// 		return res.sendStatus(500);
// 	}
// 	else {
// 		console.log('movietitle: ', req.body.movietitle, 'movieyear: ', req.body.movieyear);
// 		const id = req.params.id;
// 		// Méthode de mongoose findByIdAndUpdate avec 2 arguments: id et ce que l'on veut modifier ($set: {...})
// 		Movie.findByIdAndUpdate(id,
// 			{ $set: { movietitle: req.body.movietitle, movieyear: req.body.movieyear } },
// 			{ new: true }, // Ce qui est récupéré dans callback movie est le movie après modification
// 			(err, movie) => {
// 				if ( err ) {
// 					console.log(err);
// 					return res.send('le film n\'a pas pu être mis à jour');
// 				}
// 				else {
// 					res.redirect('/movies');
// 				}
// 		});
// 	}
// 	// Test avec Postman
// 	// const id = req.params.id; // On récupère l'id de l'url
// 	// res.send(`PUT request to movie of id ${id}`);
// });

// app.delete('/movie-details/:id', (req, res) => {
// 	const id = req.params.id;
// 	Movie.findByIdAndRemove(id, (err, movie) => {
// 		res.sendStatus(202); // Statut suppression
// 	});
// });

// // par défaut ('/' revient à localhost:port)
// app.get('/', (req, res) => {
// 	// res.send('Hello world !!!!');
// 	res.render('index'); // Utilisation template 'index'
// });

// app.get('/movie-search', (req, res) => {
// 	res.render('movie-search');
// });

// app.get('/login', (req, res) => {
// 	res.render('login', { title: 'Espace membre' });
// });

// const fakeUser = { email: 'testuser@testmail.fr', password: 'qsd' };

// app.post('/login', urlencodedParser, (req, res) => {
// 	console.log('login post', req.body);
// 	if ( !req.body ) {
// 		res.sendStatus(500);
// 	}
// 	else {
// 		if ( fakeUser.email === req.body.email && fakeUser.password === req.body.password ) {
// 			 // Dans méthode sign() on met le payload qu'on veut en 1er paramètre
// 			 // 2ème paramètre : secret
// 			 // iss = issuer (d'où cela vient)
// 			const myToken = jwt.sign({ iss: 'http://expressmovies.fr', user: 'Sam', role: 'moderator' }, secret);
// 			res.json(myToken); // On retourne le token (pour que l'utilisateur le renvoi pour chaque requête dans le header pour vérif)
// 			// res.json({
// 			// 	email: 'testuser@testmail.fr',
// 			// 	favoriteMovie: 'Test movie',
// 			// 	favoriteMovieTheater: 'Pathé Le Mans',
// 			// 	lastLoginDate: new Date()
// 			// });
// 		}
// 		else {
// 			res.sendStatus(401);
// 		}
// 	}
// });

// app.get('/member-only', (req, res) => {
// 	console.log('req.user', req.user);
// 	res.send(req.user);
// });
