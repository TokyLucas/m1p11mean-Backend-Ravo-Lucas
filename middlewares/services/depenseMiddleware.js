const Depense = require('../../models/Depense');

var findDepense = async (req, res, next) => {
    try {
        var { type, prix, date} = req.query;
        var criteria = {}



        var count = await Depense.aggregate([
            {
                $match: criteria
            }
        ]).count("total");

        var depenses = await Depense.aggregate([
            {
                $match: criteria
            },
            { $sort: { "date": 1 } }
        ])
        .skip(req.paginateOptions.skip)
        .limit(req.paginateOptions.limit)
        .exec() ;

        res.depenses = {
            "data": depenses,
            "total": (count.length > 0) ? count[0].total : 0,
            "totalPage": (count.length > 0) ? Math.ceil( count[0].total / req.paginateOptions.limit ) : 0
        };

        next();
    } catch (error) {
        throw(error);
    }
}

var findDepenseTotal = async (req, res, next) => {
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

        var depenses = await Depense.aggregate([
            {
                $match: match
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
                    montantTotal: { $sum: "$prix" }
                }
            },
            { $sort: { "_id.day": 1 } }
        ])
        .exec() ;

        res.depenses = {
            time: time,
            data: depenses
        };

        next();
    } catch (error) {
        throw(error);
    }
}

var findDepenseTotalParType = async (req, res, next) => {
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

        var depenses = await Depense.aggregate([
            {
                $match: match
            },
            { $unwind: { path: '$tachesEffectue', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: { 
                        day: {
                            $toDate: {
                                $concat: aggregateTime
                            }
                        },
                        type: "$type"
                    },
                    montantTotal: { $sum: "$prix" }
                }
            },
            { $sort: { "_id.day": 1 } }
        ])
        .exec() ;

        res.depenses = {
            time: time,
            data: depenses
        };

        next();
    } catch (error) {
        throw(error);
    }
}

module.exports.findDepense = findDepense;
module.exports.findDepenseTotal = findDepenseTotal;
module.exports.findDepenseTotalParType = findDepenseTotalParType;