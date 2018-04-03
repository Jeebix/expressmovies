const jwt    = require('jsonwebtoken');
const secret = 'zydfhldjfeoQQSffgkofkdDGLfgdfqdfdFDSfq3545hj43HGFGH344cjqdl65433FGerezFSgfe5vVC336';

exports.login = (req, res) => {
	res.render('login', { title: 'Espace membre' });
};

const fakeUser = { email: 'testuser@testmail.fr', password: 'qsd' };

exports.postLogin = (req, res) => {
	console.log('login post', req.body);
	if ( !req.body ) {
		return res.sendStatus(500);
	}
	else {
		if ( fakeUser.email === req.body.email && fakeUser.password === req.body.password ) {
			// Dans méthode sign() on met le payload qu'on veut en 1er paramètre
			// 2ème paramètre : secret
			// iss = issuer (d'où cela vient)
			const myToken = jwt.sign({ iss: 'http://expressmovies.fr', user: 'Sam', role: 'moderator' }, secret);
			console.log('myToken', myToken);
			res.json(myToken); // On retourne le token (pour que l'utilisateur le renvoi pour chaque requête dans le header pour vérif)
		}
		else {
			res.sendStatus(401);
		}
	}
};

exports.getMemberOnly = (req, res) => {
	console.log('req.user', req.user);
	if ( req.user.role === 'moderator' ) {
		res.send(req.user);
	};
};