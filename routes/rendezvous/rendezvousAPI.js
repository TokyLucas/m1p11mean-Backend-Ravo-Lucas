var express = require('express');
var router = express.Router();
var rdvMiddleware = require('../../middlewares/services/rdvMiddleware');

var RendezVous = require('../../models/RendezVous');
var Employe = require('../../models/Employe');
var Client = require('../../models/Client');
var Service = require('../../models/Service');

// find Rendez-vous
router.get('/findRendezVous', rdvMiddleware.findRendezVous , async(req, res, next) => {
    try {    
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(req.rendezVous);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// suivi de tache pour emp
router.get('/suiviTacheEmp', rdvMiddleware.suiviTacheEmp , async(req, res, next) => {
    try {    
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(req.rendezVous);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// get rdv by id
router.get('/rendezVous/:id?', async(req, res, next) => {
    try {
        var {id} = req.params;
        var rendezVous = (id == null) 
            ? await RendezVous.find({}).populate(['services', 'employe', 'client', 'tachesEffectue']).exec()
            : await RendezVous.findById(id).populate(['services', 'employe', 'client', 'tachesEffectue']).exec() ;
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(rendezVous);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})


// create rdv
router.post('/rendezVous', async(req, res, next) => {
    try {
        var rendezVous = await RendezVous.create(req.body);
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(rendezVous);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// update rdv info
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

// update service effectue pour rdv
router.put('/rendezVous/:rdvId/tacheeffectue', async(req, res, next) => {
    try {
        var {rdvId} = req.params;
        var { servId } = req.query;

        var check = await RendezVous.findById(rdvId);
        if(!check.services.includes(servId)) throw new Error("Ce service n'est pas inclus dans ce rendez-vous");
        
        if (rdvId != null) {
            var updatedRendezVous = await RendezVous.findByIdAndUpdate(rdvId,
                { $addToSet: { tachesEffectue: servId }},
                { new: true }
            )
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(updatedRendezVous);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// delete rdv
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