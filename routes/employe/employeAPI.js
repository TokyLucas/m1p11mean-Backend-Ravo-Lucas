var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

var empMiddleware = require('../../middlewares/services/empMiddleware');
var paginateMiddleware = require('../../middlewares/services/paginateMiddleware');
var reponseMiddleware = require('../../middlewares/reponseMiddleware');

var multer = require('multer');
var uploadMiddleware = require('../../middlewares/uploadMiddleware');
var fs = require('fs');

var Employe = require('../../models/Employe');
var Compte = require('../../models/Compte');
var HoraireDeTravail = require('../../models/HoraireDeTravail');

router.get('/employe/:id?', async(req, res, next) => {
    try {
        var {id} = req.params;
        var employe = (id == null) 
            ? await Employe.find({})
            : await Employe.findById(id);
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(employe);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/employe/compte/:id', async(req, res, next) => {
    try {
        var {id} = req.params;
        var compte = await Compte.findOne({
            "userId": id
        });
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(compte);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/findEmploye', paginateMiddleware.paginate, empMiddleware.findEmploye , async(req, res, next) => {
    try {    
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(res.employe);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

var fileFields = [{ name: 'photoDeProfil', maxCount: 12 }, { name: 'photoDeProfil'}];
router.post('/employe',  uploadMiddleware(fileFields, 'public/uploads/employes/'), async(req, res, next) => {
    try {
        const session = await mongoose.startSession();

        var employe = new Employe();
        employe.nom = req.body.nom;
        employe.prenom = req.body.prenom;
        employe.dateDeNaissance = req.body.dateDeNaissance;
        employe.sexe = req.body.sexe;

        var files = JSON.parse(JSON.stringify(req.files));
        Object.keys(files).forEach( key => {
            files[key].forEach( file => { 
                employe.photoDeProfil = file.filename;
            })
        })

        await session.withTransaction(() => {
            return Employe.create([employe], { session: session })
            .then( 
                (next) => {
                    console.log(next);
                    var compte = new Compte();
                    compte.login = req.body.login;
                    compte.motdepasse = req.body.motdepasse;
                    compte.userId = employe._id;
                    compte.typeUser = "Employe";

                    return Compte.create([compte], {session: session});
                }
            )
        });

        res.session = session;
        res.data = employe;

        next();
    } catch (error) {
        var files = JSON.parse(JSON.stringify(req.files));
        Object.keys(files).forEach( key => {
            files[key].forEach( file => {
                fs.unlinkSync(file.path);
            })
        })

        res.status(500).json({message: error.message});
    }
}, reponseMiddleware.successResponseMiddleware);

var fileFields = [{ name: 'photoDeProfil', maxCount: 12 }, { name: 'photoDeProfil'}];
router.put('/employe/:id', uploadMiddleware(fileFields, 'public/uploads/employes/'), async(req, res, next) => {
    try {
        const session = await mongoose.startSession();

        var {id} = req.params;
        if (id != null) {
            var employe = {};
            employe.nom = req.body.nom;
            employe.prenom = req.body.prenom;
            employe.dateDeNaissance = req.body.dateDeNaissance;
            employe.sexe = req.body.sexe;

            var files = JSON.parse(JSON.stringify(req.files));
            Object.keys(files).forEach( key => {
                files[key].forEach( file => {
                    employe.photoDeProfil = file.filename;
                })
            })

            // var updatedEmploye = await Employe.findByIdAndUpdate(id, employe, {
            //     new: true
            // });

            var updatedEmploye = await session.withTransaction(() => {
                return Employe.findByIdAndUpdate(id, employe, { session: session })
                .then( 
                    (next) => {
                        var options = { session: session, upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true };

                        var compte = {
                            login: req.body.login,
                            motdepasse: req.body.motdepasse,
                            typeUser: "Employe"
                        };

                        return Compte.updateOne({userId: id}, compte, options);
                    }
                )
            });
        }
        
        res.session = session;
        res.data = updatedEmploye;

        next();
    } catch (error) {
        var files = JSON.parse(JSON.stringify(req.files));
        Object.keys(files).forEach( key => {
            console.log(files[key]);
            files[key].forEach( file => {
                fs.unlinkSync(file.path);
            })
        })

        res.status(500).json({message: error.message});
    }
}, reponseMiddleware.successResponseMiddleware)

router.delete('/employe/:id', async(req, res, next) => {
    try {
        var {id} = req.params;
        if (id != null) {
            await Employe.findByIdAndDelete(id) ;
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json({ message: `Employe ${id} supprimé`});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/employeDispo', async(req, res, next) => {
    try {

        var  {_date, _time } = req.query;
        const horaireTravailQuery = { date:  new Date(_date),  heure_debut: { $gte: _time }  };
        const horaireTravailResults = await HoraireDeTravail.find(horaireTravailQuery);

        const employeIds = Array.from(new Set(horaireTravailResults.map(horaire => horaire.employe)));

        const employeQuery = { _id: { $in: employeIds } };
        const employeResults = await Employe.find(employeQuery);

        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(employeResults);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

module.exports = router;