const mongoose = require('mongoose');
var Employe = require('../../models/Employe');

var findEmploye = async function(req, res, next){
    try{
        var {empId, nomEmp, prenomEmp, sexe, dateDeNaissance} = req.query;
        const criteria = {};

        if (empId != undefined) criteria["_id"] = new mongoose.Types.ObjectId(empId);
        if (nomEmp != undefined) criteria["nom"] =  {$regex: nomEmp, $options: 'i'};
        if (prenomEmp != undefined) criteria["prenom"] = {$regex: prenomEmp, $options: 'i'};
        if (sexe != undefined) criteria["sexe"] = sexe;
        if (dateDeNaissance != undefined) criteria["dateDeNaissance"] = new Date(dateDeNaissance);
        
        // console.log(criteria);
        
        var count = await Employe.aggregate([
            {
                $match: criteria
            }
        ]).count("total");

        var employe = await Employe.aggregate([
            {
                $match: criteria
            }
        ])
        .skip(req.paginateOptions.skip)
        .limit(req.paginateOptions.limit)
        .exec();

        res.employe = {
            "data": employe,
            "total": (count.length > 0) ? count[0].total : 0,
            "totalPage": (count.length > 0) ? Math.ceil( count[0].total / req.paginateOptions.limit ) : 0
        };

        next();
    } catch(error) {
        throw error;
    }
}

module.exports.findEmploye = findEmploye;