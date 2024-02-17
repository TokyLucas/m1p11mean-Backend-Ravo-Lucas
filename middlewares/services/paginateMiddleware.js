var paginate = async function(req, res, next){
    try{
        var page = (parseInt(req.query.page)) ? parseInt(req.query.page) : 1;
        var limit = (parseInt(req.query.limit)) ? parseInt(req.query.limit) : 10;

        req.paginateOptions = {
            limit: limit,
            skip: (page - 1) * limit,
        }

        next();
    } catch(error) {
        throw error;
    }
}

module.exports.paginate = paginate;