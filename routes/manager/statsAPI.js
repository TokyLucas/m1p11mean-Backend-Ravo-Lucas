var express = require('express');
var router = express.Router();

var depenseMiddleware = require('../../middlewares/services/depenseMiddleware');
var statMiddleware = require('../../middlewares/services/statMiddleware');

router.get('/statsemployehoraire', statMiddleware.tempsMoyenne , async(req, res, next) => {
    try {
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(res.tempsMoyenne);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/nombreDeRendezVous', statMiddleware.nombreDeReservation , async(req, res, next) => {
    try {
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(res.nombreRendezVous);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/chiffreDaffaires', statMiddleware.chiffreDaffaires , async(req, res, next) => {
    try {
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(res.chiffreDaffaires);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/benefice', statMiddleware.chiffreDaffaires , depenseMiddleware.findDepenseTotal, statMiddleware.benefices,async(req, res, next) => {
    try {
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(res.benefice);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})


module.exports = router;