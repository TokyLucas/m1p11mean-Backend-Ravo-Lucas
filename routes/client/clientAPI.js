const express = require("express");
const app = express();
const clientRoute = express.Router();

var Client = require('../../models/Client');
var Compte = require('../../models/Compte');

clientRoute.route('/client').post(async(req, res, next) => {
    try {
        var clientInfo = req.body.clientInfo;
        var client = new Client();
        client.nom = clientInfo.nom;
        client.prenom = clientInfo.prenom;
        client.dateDeNaissance = clientInfo.dateDeNaissance;
        client.sexe = clientInfo.sexe;

        await Client.create(client);

        var compteInfo = req.body.compteInfo;
        var compte = new Compte();

        compte.login = compteInfo.login;
        compte.motdepasse = compteInfo.motdepasse;
        compte.typeUser = "Client";
        compte.userId = client._id;

        Compte.create(compte);


        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(compte);
    } catch (error) {
        var files = JSON.parse(JSON.stringify(req.files));
        Object.keys(files).forEach( key => {
            files[key].forEach( file => {
                fs.unlinkSync(file.path);
            })
        })

        res.status(500).json({message: error.message});
    }
});



clientRoute.route('/findUserByCompte').post(async(req, res, next) => {
    try {
        let login = req.body.login;
        let pwd = req.body.pwd;
        let compte = await Compte.findOne({ login, pwd });

        if(compte != null)  {
            var client = await Client.findOne({ login, pwd });
        }

        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(client);
    } catch (error) {
        var files = JSON.parse(JSON.stringify(req.files));
        Object.keys(files).forEach( key => {
            files[key].forEach( file => {
                fs.unlinkSync(file.path);
            })
        })

        res.status(500).json({message: error.message});
    }
});



module.exports = clientRoute;