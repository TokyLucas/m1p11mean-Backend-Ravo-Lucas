var express = require('express');
var router = express.Router();

var multer = require('multer');
var uploadMiddleware = require('../../middlewares/uploadMiddleware');
var fs = require('fs');

var Manager = require('../../models/Manager');

router.get('/manager/:id?', async(req, res, next) => {
    try {
        var {id} = req.params;
        var manager = (id == null) 
            ? await Manager.find({})
            : await Manager.findById(id);
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(manager);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

var fileFields = [{ name: 'photoDeProfil', maxCount: 12 }, { name: 'photoDeProfil'}];
router.post('/manager',  uploadMiddleware(fileFields, 'public/uploads/employes/'), async(req, res, next) => {
    try {
        var manager = new Manager();
        manager.nom = req.body.nom;
        manager.prenom = req.body.prenom;
        manager.dateDeNaissance = req.body.dateDeNaissance;
        manager.sexe = req.body.sexe;

        var files = JSON.parse(JSON.stringify(req.files));
        Object.keys(files).forEach( key => {
            files[key].forEach( file => { 
                manager.photoDeProfil = file.filename;
            })
        })
        await Manager.create(manager);

        // var manager = await Manager.create(req.body);
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(manager);
    } catch (error) {
        var files = JSON.parse(JSON.stringify(req.files));
        Object.keys(files).forEach( key => {
            files[key].forEach( file => {
                fs.unlinkSync(file.path);
            })
        })

        res.status(500).json({message: error.message});
    }
})

var fileFields = [{ name: 'photoDeProfil', maxCount: 12 }, { name: 'photoDeProfil'}];
router.put('/manager/:id', uploadMiddleware(fileFields, 'public/uploads/managers/'), async(req, res, next) => {
    try {
        var {id} = req.params;
        if (id != null) {
            var manager = {};
            manager.nom = req.body.nom;
            manager.prenom = req.body.prenom;
            manager.dateDeNaissance = req.body.dateDeNaissance;
            manager.sexe = req.body.sexe;

            var files = JSON.parse(JSON.stringify(req.files));
            Object.keys(files).forEach( key => {
                files[key].forEach( file => {
                    manager.photoDeProfil = file.filename;
                })
            })

            var updatedManager = await Manager.findByIdAndUpdate(id, manager, {
                new: true, runValidators: true
            });

            // var updatedEmploye = await Manager.findByIdAndUpdate(id, req.body, {
            //     new: true
            // });
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(updatedManager);
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
})

router.delete('/manager/:id', async(req, res, next) => {
    try {
        var {id} = req.params;
        if (id != null) {
            await Manager.findByIdAndDelete(id) ;
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json({ message: `Manager ${id} supprimé`});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

module.exports = router;