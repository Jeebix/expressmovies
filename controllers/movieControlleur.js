const Movie = require('../models/Movie');

exports.getMovies = (req, res) => {
	console.log('depuis movieController.getMovies');

	const title = "Films français des 30 dernières années";
	frenchMovies = [];
	// Récupérer des données de mongoDB
	Movie.find((err, movies) => {
		if ( err ) {
			console.log('could not retrieve movies from DB');
			res.sendStatus(500);
		}
		else {
			frenchMovies = movies;
			res.render('movies', { title: title, movies: frenchMovies });
		}
	});
}

// Passer middleware en 2ème paramètre (peut y avoir plusieurs autres middlewares en paramètres)
// On gère le POST avec multer (méthode upload.fields([]))
exports.postMovie = (req, res) => {
	console.log('depuis movieController.postMovie');

	if ( !req.body ) {
		return res.sendStatus(500);
	}
	else {
		const formData = req.body;
		console.log('form data: ', formData);

		const title = req.body.movietitle;
		const year = req.body.movieyear;
		const myMovie = new Movie({ movietitle: title, movieyear: year });

		myMovie.save((err, savedMovie) => {
			if ( err ) {
				console.error(err);
				return;
			}
			else {
				console.log(savedMovie);
				res.sendStatus(201); // Statut 201 = qqchose de créé
			}
		});
	}
};

exports.getMoviesOldBrowsers = (req, res) => {
	if ( !req.body ) {
		return res.sendStatus(500);
	}
	else {
		frenchMovies = [...frenchMovies, { title: req.body.movietitle, year: req.body.movieyear }];
		res.sendStatus(201);
	}
};

// Pour ajout de film
exports.getMoviesAdd = (req, res) => {
	res.send('prochainement, un formulaire d\'ajout ici');
};

// Route + paramètre
exports.getMovieById = (req, res) => {
	const id = req.params.id;
	// req avec méthode params permet de récupérer variable de l'url (:variable)
	// res.send(`film numéro ${id}`);
	// Objet passé à la vue: id accessible via movieid
	res.render('movie-details', { movieId: id });
};

exports.postMovieDetails = (req, res) => {
	console.log('movietitle: ', req.body.movietitle, 'movieyear: ', req.body.movieyear);
	if ( !req.body ) {
		return res.sendStatus(500);
	}
	const id = req.params.id;
	// Méthode de mongoose findByIdAndUpdate avec 2 arguments: id et ce que l'on veut modifier ($set: {...})
	Movie.findByIdAndUpdate(id,
		{ $set: { movietitle: req.body.movietitle, movieyear: req.body.movieyear } },
		{ new: true }, // Ce qui est récupéré dans callback movie est le movie après modification
		(err, movie) => {
			if ( err ) {
				console.error(err);
				return res.send('le film n\'a pas pu être mis à jour');
			}
			else {
				res.redirect('/movies');
			}
		});
	// Test avec Postman
	// const id = req.params.id; // On récupère l'id de l'url
	// res.send(`PUT request to movie of id ${id}`);
};

exports.getMovieDetails = (req, res) => {
	const id = req.params.id;
	// Récupérer document par id avec mongoose
	Movie.findById(id, (err, movie) => {
		console.log('movie-details', movie);
		res.render('movie-details', { movie: movie });
	})
};

exports.deleteMovie = (req, res) => {
	const id = req.params.id;
	Movie.findOneAndRemove(id, (err, movie) => {
		console.log(movie);
		res.sendStatus(202); // Statut suppression
	});
};

exports.movieSearch = (req, res) => {
	res.render('movie-search');
};