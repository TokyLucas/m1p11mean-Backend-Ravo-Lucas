const express = require("express");
const app = express();
const paiementRoute = express.Router();

var Paiement = require('../../models/Paiement');

paiementRoute.route('/paiement').post(async(req, res, next) => {
    try {
        var paiementInfo = req.body.paiementInfo;
        var paiement = new Paiement();
        paiement.cardNumber = paiementInfo.cardNumber;
        paiement.expirationDate = paiementInfo.expirationDate;
        paiement.cvv = paiementInfo.cvv;
        paiement.rendezVous = paiementInfo.rendezVousId;

        await Paiement.create(paiement);

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

module.exports = paiementRoute;