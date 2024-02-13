const jwt = require('jsonwebtoken');

const jwtAuth = (compteType = "Client") => {
    return async (req, res, next) =>{
        try {
            var bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                var bearer = bearerHeader.split(" ");
                bearerToken = bearer[1];

                var user = jwt.verify(bearerToken, process.env.JWT_KEY);
                req.user = user;

                next();
            } else {
                throw new Error("Authentification echoué.");
            }
        } catch (error) {
            return res.status(403).json({ "message": error.message });
        }
    }
}

module.exports = jwtAuth;