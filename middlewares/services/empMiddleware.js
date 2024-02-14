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
        

        console.log(criteria);
        
        var employe = await Employe.aggregate([
            {
                $match: criteria
            }
        ])
        .exec() ;

        req.employe = employe;
        next();
    } catch(error) {
        throw error;
    }
}

module.exports.findEmploye = findEmploye;