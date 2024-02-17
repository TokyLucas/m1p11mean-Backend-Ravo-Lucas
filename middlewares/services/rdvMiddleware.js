const mongoose = require('mongoose');
var RendezVous = require('../../models/RendezVous');

var findRendezVous = async function(req, res, next){
    try{
        var {idClt, nomClient, prenomClient, datedebut, datefin, _date, empId, nomEmp, prenomEmp} = req.query;
        const criteria = {};

        if (nomClient != undefined) criteria["client.nom"] =  {$regex: nomClient, $options: 'i'};
        if (prenomClient != undefined) criteria["client.prenom"] = {$regex: prenomClient, $options: 'i'};

        if (empId != undefined) criteria["employe._id"] = new mongoose.Types.ObjectId(empId);
        if (nomEmp != undefined) criteria["employe.nom"] =  {$regex: nomEmp, $options: 'i'};
        if (prenomEmp != undefined) criteria["employe.prenom"] = {$regex: prenomEmp, $options: 'i'};

        if (_date != undefined) criteria["date"] = new Date(_date);
        
        if (datefin != undefined && datedebut != undefined)  criteria["date"] = { $gte: new Date(datedebut) ,  $lte: new Date(datefin) };        
        else if (datedebut != undefined && datefin == undefined) criteria["date"] = { $gte: new Date(datedebut) };
        else if (datefin != undefined && datedebut == undefined) criteria["date"] = { $lte: new Date(datefin) };

        console.log(criteria);
        
        var rendezVous = await RendezVous.aggregate([
            {
                $lookup: {
                    from: "clients",
                    localField: "client",
                    foreignField: "_id",
                    as: "client"
                }
            },
            { $unwind: '$client' },
            {
                $lookup: {
                    from: "services",
                    localField: "services",
                    foreignField: "_id",
                    as: "services"
                }
            },
            {
                $lookup: {
                    from: "employes",
                    localField: "employe",
                    foreignField: "_id",
                    as: "employe"
                }
            },
            { $unwind: '$employe' },
            {
                $lookup: {
                    from: "services",
                    localField: "tachesEffectue",
                    foreignField: "_id",
                    as: "tachesEffectue"
                }
            },
            {
                $match: criteria
            }
        ])
        .exec() ;

        req.rendezVous = rendezVous;
        next();
    } catch(error) {
        throw error;
    }
}

var suiviTacheEmp = async function(req, res, next){
    try{
        var {datedebut, datefin, _date, empId} = req.query;
        const criteria = {};

        if (empId != undefined) criteria["employe._id"] = new mongoose.Types.ObjectId(empId);

        if (_date != undefined) criteria["date"] = new Date(_date);
        
        if (datefin != undefined && datedebut != undefined)  criteria["date"] = { $gte: new Date(datedebut) ,  $lte: new Date(datefin) };        
        else if (datedebut != undefined && datefin == undefined) criteria["date"] = { $gte: new Date(datedebut) };
        else if (datefin != undefined && datedebut == undefined) criteria["date"] = { $lte: new Date(datefin) };

        var rendezVous = await RendezVous.aggregate([
            {
                $lookup: {
                    from: "clients",
                    localField: "client",
                    foreignField: "_id",
                    as: "client"
                }
            },
            { $unwind: '$client' },
            {
                $lookup: {
                    from: "services",
                    localField: "services",
                    foreignField: "_id",
                    as: "services"
                }
            },
            {
                $lookup: {
                    from: "employes",
                    localField: "employe",
                    foreignField: "_id",
                    as: "employe"
                }
            },
            { $unwind: '$employe' },
            {
                $lookup: {
                    from: "services",
                    localField: "tachesEffectue",
                    foreignField: "_id",
                    as: "tachesEffectue"
                }
            },
            { $unwind: { path: '$tachesEffectue', preserveNullAndEmptyArrays: true } },
            {
                $match: criteria
            },
            {
                $group: {
                    _id: { 
                        day: {
                            $concat: [
                                { $toString: { $year: "$date"} },
                                "-",
                                { $toString: { $month: "$date"} },
                                "-",
                                { $toString: { $dayOfMonth: "$date"} }
                            ]
                        }, 
                        employe: "$employe._id" },
                    perCommissionTotal: { $sum: "$tachesEffectue.commission" },
                    prixServiceTotal: { $sum: "$tachesEffectue.prix" },
                }
            },
            {
                $project: {
                    perCommissionTotal: "$perCommissionTotal",
                    montantCommision: {
                        $multiply: [ "$perCommissionTotal", "$prixServiceTotal", 0.01 ]
                    }
                }
            }
        ])
        .exec() ;

        req.rendezVous = rendezVous;
        next();
    } catch(error) {
        throw error;
    }
}

module.exports.findRendezVous = findRendezVous;
module.exports.suiviTacheEmp = suiviTacheEmp;