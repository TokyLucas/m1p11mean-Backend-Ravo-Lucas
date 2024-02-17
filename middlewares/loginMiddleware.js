var Compte = require('../models/Compte');
var jwt = require('jsonwebtoken');

const loginMiddleware = (compteType) => {

    return async (req, res, next) => {
        try {
            var { login, motdepasse } = req.body;

            var compte = await Compte.aggregate([
                {
                    $lookup: {
                        from: `${compteType}s`,
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: '$user' },
                {
                    $match: {
                        "login": login,
                        "motdepasse": motdepasse
                    }
                }
            ])
            .exec();
            if (compte.length <= 0) throw new Error("Login ou mot de passe invalide");
            var token = jwt.sign(compte[0], process.env.JWT_KEY, { expiresIn: "1h"}); 
            res.token = token;
            next();
        } catch (error) {
            return res.status(403).json({ message: error.message});
        }
    }
};

module.exports = loginMiddleware;