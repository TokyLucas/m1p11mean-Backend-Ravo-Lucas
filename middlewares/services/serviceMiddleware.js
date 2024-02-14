const mongoose = require('mongoose');
var Service = require('../../models/Service');

var findService = async function(req, res, next){
    try{
        var {serviceId, nom, duree, prixMin, prixMax, commission} = req.query;
        const criteria = {};

        if (serviceId != undefined) criteria["_id"] = new mongoose.Types.ObjectId(empId);
        if (nom != undefined) criteria["nom"] =  {$regex: nom, $options: 'i'};
        if (duree != undefined) criteria["duree"] = Number(duree);
        if (commission != undefined) criteria["commission"] = Number(commission);
    
        if (prixMin != undefined && prixMax != undefined)  criteria["prix"] = { $gte: Number(prixMin) ,  $lte: Number(prixMax) };        
        else if (prixMin != undefined && prixMax == undefined) criteria["prix"] = { $gte: Number(prixMin) };
        else if (prixMax != undefined && prixMin == undefined) criteria["prix"] = { $lte: Number(prixMax) };
        
        console.log(criteria);

        var service = await Service.aggregate([
            {
                $match: criteria
            }
        ])
        .exec() ;

        req.service = service;
        next();
    } catch(error) {
        throw error;
    }
}

module.exports.findService = findService;