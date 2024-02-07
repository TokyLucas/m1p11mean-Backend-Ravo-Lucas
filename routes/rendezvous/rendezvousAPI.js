var express = require('express');
var router = express.Router();

var RendezVous = require('../../models/RendezVous');
var Employe = require('../../models/Employe');
var Client = require('../../models/Client');
var Service = require('../../models/Service');

router.get('/findRendezVous', async(req, res, next) => {
    try {
        var {employe, client} = req.query;
        const criteria = {};
        if (client != undefined) criteria.client = client;
        if (employe != undefined) criteria.employe = employe;

        var rendezVous = await RendezVous.find(criteria).populate(['services', 'employe', 'client']).exec() ;
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(rendezVous);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/rendezVous/:id?', async(req, res, next) => {
    try {
        var {id} = req.params;
        var rendezVous = (id == null) 
            ? await RendezVous.find({}).populate(['services', 'employe', 'client']).exec()
            : await RendezVous.findById(id).populate(['services', 'employe', 'client']).exec() ;
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(rendezVous);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.post('/rendezVous', async(req, res, next) => {
    try {
        var rendezVous = await RendezVous.create(req.body);
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(rendezVous);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.put('/rendezVous/:id', async(req, res, next) => {
    try {
        var {id} = req.params;
        if (id != null) {
            var updatedRendezVous = await RendezVous.findByIdAndUpdate(id, req.body, {
                new: true
            });
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(updatedRendezVous);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.delete('/rendezVous/:id', async(req, res, next) => {
    try {
        var {id} = req.params;
        if (id != null) {
            await RendezVous.findByIdAndDelete(id) ;
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json({ message: `RendezVous ${id} supprimé`});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

module.exports = router;