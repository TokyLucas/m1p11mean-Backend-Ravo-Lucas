const HoraireDeTravail = require('../../models/HoraireDeTravail');
const RendezVous = require('../../models/RendezVous');

var tempsMoyenne = async (req, res, next) => {
    try {
        var tempsMoyenne = await HoraireDeTravail.aggregate([
            {
                $set: {
                    "heure_debut": {
                        $toDate: { 
                            $concat : [ { $first: { $split: [{ $toString: "$date" }, "T"] } }, "T", "$heure_debut"] }
                    },
                    "heure_fin": {
                        $toDate: { 
                            $concat : [ { $first: { $split: [{ $toString: "$date" }, "T"] } }, "T", "$heure_fin"] }
                    }
                }
            },
            {
                $set: {
                    "heure_de_travail": {
                        $dateDiff: {
                            startDate: { $toDate: "$heure_debut" },
                            endDate: { $toDate:  "$heure_fin" },
                            unit: "minute"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: { employe: "$employe" },
                    tempsMoyenneDeTravail: { $avg: "$heure_de_travail" }
                }
            },
            {
                $lookup: {
                    from: "employes",
                    localField: "_id.employe",
                    foreignField: "_id",
                    as: "employe"
                }
            },
        ]);
        res.tempsMoyenne = tempsMoyenne;
        next();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

var nombreDeReservation = async (req, res, next) => {
    try {
        var time = (req.query.time != undefined) ? req.query.time : "jour";

        if (time == "jour") {
            var aggregateTime = [
                { $toString: { $year: "$date"} },
                "-",
                { $toString: { $month: "$date"} },
                "-",
                { $toString: { $dayOfMonth: "$date"} }
            ];

            var interval = req.query.interval || `${new Date().getFullYear()}-${new Date().getMonth()+1}`;
            var match = {
                "date": { 
                    $gte: new Date(`${interval}-01`),
                    $lte: new Date(`${interval}-31`)
                }
            }
        } else {
            var aggregateTime = [
                { $toString: { $year: "$date"} },
                "-",
                { $toString: { $month: "$date"} }
            ];

            var interval = req.query.interval;

            var match = {
                "date": { 
                    $gte: new Date(`${interval}-01-01`),
                    $lte: new Date(`${interval}-12-31`)
                }
            }
        }

        var nombreRendezVous = await RendezVous.aggregate([
            {
                $match: match
            },
            {
                $group: {
                    _id: { 
                        day: {
                            $toDate: {
                                $concat: aggregateTime
                            }
                        }
                    },
                    count : { $sum: 1 } 
                }
            }
        ])
        .exec() ;

        res.nombreRendezVous = {
            time: time,
            data: nombreRendezVous
        };

        next();
    } catch (error) {
        throw(error);
    }
}

var chiffreDaffaires = async (req, res, next) => {
    try {
        var time = (req.query.time != undefined) ? req.query.time : "jour";

        if (time == "jour") {
            var aggregateTime = [
                { $toString: { $year: "$date"} },
                "-",
                { $toString: { $month: "$date"} },
                "-",
                { $toString: { $dayOfMonth: "$date"} }
            ];

            var interval = req.query.interval || `${new Date().getFullYear()}-${new Date().getMonth()+1}`;
            var match = {
                "date": { 
                    $gte: new Date(`${interval}-01`),
                    $lte: new Date(`${interval}-31`)
                }
            }
        } else {
            var aggregateTime = [
                { $toString: { $year: "$date"} },
                "-",
                { $toString: { $month: "$date"} }
            ];

            var interval = req.query.interval;

            var match = {
                "date": { 
                    $gte: new Date(`${interval}-01-01`),
                    $lte: new Date(`${interval}-12-31`)
                }
            }
        }

        var chiffreDaffaires = await RendezVous.aggregate([
            {
                $match: match
            },
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
                $group: {
                    _id: { 
                        day: {
                            $toDate: {
                                $concat: aggregateTime
                            }
                        }
                    },
                    perCommissionTotal: { $sum: "$tachesEffectue.commission" },
                    prixServiceTotal: { $sum: "$tachesEffectue.prix" }
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

        res.chiffreDaffaires = {
            time: time,
            data: chiffreDaffaires
        };

        next();
    } catch (error) {
        throw(error);
    }
}

module.exports.tempsMoyenne = tempsMoyenne;
module.exports.nombreDeReservation = nombreDeReservation;
module.exports.chiffreDaffaires = chiffreDaffaires;