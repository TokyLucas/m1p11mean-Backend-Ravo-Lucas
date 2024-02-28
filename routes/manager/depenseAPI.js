var express = require('express');
var router = express.Router();

const Depense = require('../../models/Depense');

var depenseMiddleware = require('../../middlewares/services/depenseMiddleware');
var paginateMiddleware = require('../../middlewares/services/paginateMiddleware');

router.get('/depense/:id?', async(req, res, next) => {
    try {
        var {id} = req.params;

        var depense = 
            (id == null) ? await Depense.find({})
            : await Depense.findById(id);

        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(depense);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/findDepense', paginateMiddleware.paginate, depenseMiddleware.findDepense, async(req, res, next) => {
    try {    
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(res.depenses);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/depenseTotal', paginateMiddleware.paginate, depenseMiddleware.findDepenseTotal, async(req, res, next) => {
    try {    
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(res.depenses);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/depenseParType', paginateMiddleware.paginate, depenseMiddleware.findDepenseTotalParType, async(req, res, next) => {
    try {    
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(res.depenses);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.post('/depense',  async(req, res, next) => {
    try {
        var depense = await Depense.create(req.body);

        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(depense);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.put('/depense/:id',  async(req, res, next) => {
    try {
        var {id} = req.params;
        if (id != null) {
            var updateService = await Depense.findByIdAndUpdate(id, req.body, {
                new: true
            });
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(updateService);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.delete('/depense/:id', async(req, res, next) => {
    try {
        var {id} = req.params;
        if (id != null) {
            await Depense.findByIdAndDelete(id) ;
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json({ message: `Depense ${id} supprimé`});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

module.exports = router;