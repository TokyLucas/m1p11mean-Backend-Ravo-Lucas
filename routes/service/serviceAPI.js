var express = require('express');
var router = express.Router();

const Service = require('../../models/Service');

var serviceMiddleware = require('../../middlewares/services/serviceMiddleware');

router.get('/service/:id?', async(req, res, next) => {
    try {
        var {id} = req.params;

        var service = 
            (id == null) ? await Service.find({})
            : await Service.findById(id);

        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/findService', serviceMiddleware.findService , async(req, res, next) => {
    try {    
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(req.service);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.post('/service',  async(req, res, next) => {
    try {
        var service = await Service.create(req.body);

        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.put('/service/:id',  async(req, res, next) => {
    try {
        var {id} = req.params;
        if (id != null) {
            var updateService = await Service.findByIdAndUpdate(id, req.body, {
                new: true
            });
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(updateService);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.delete('/service/:id', async(req, res, next) => {
    try {
        var {id} = req.params;
        if (id != null) {
            await Service.findByIdAndDelete(id) ;
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json({ message: `Service ${id} supprimé`});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

module.exports = router;