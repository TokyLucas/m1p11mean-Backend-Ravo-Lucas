var express = require('express');
var router = express.Router();

const HoraireDeTravail = require('../../models/HoraireDeTravail');


router.get('/horaire', async(req, res, next) => {
    try {
        var { emp, _date } = req.query;
        console.log(new Date(_date));
        var horaireDeTravail = 
            (_date == null) ? await HoraireDeTravail.find({
                employe: emp
            }).sort({ '_id' : -1 }).limit(1)
            : await HoraireDeTravail.find({
                employe: emp,
                date: { $lte: new Date(_date) }
            }).sort({ '_id' : -1 }).limit(1);

        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(horaireDeTravail);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.post('/horaire',  async(req, res, next) => {
    try {
        var horaireDeTravail = await HoraireDeTravail.create(req.body);

        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(horaireDeTravail);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.put('/horaire/:id',  async(req, res, next) => {
    try {
        var {id} = req.params;
        if (id != null) {
            var criteria = {
                employe: id,
                date: req.body.date || new Date().toISOString().split("T")[0]
            }
            var updatedhoraireDeTravail = await HoraireDeTravail.findOneAndUpdate(criteria, req.body, {
                new: true, runValidators: true, upsert: true
            });
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(updatedhoraireDeTravail);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.delete('/horaire/:id', async(req, res, next) => {
    try {
        var {id} = req.params;
        if (id != null) {
            await HoraireDeTravail.findByIdAndDelete(id) ;
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json({ message: `HoraireDeTravail ${id} supprimé`});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

module.exports = router;