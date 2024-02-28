const successResponseMiddleware = async (req, res, next)=> {
    res.set('Access-Control-Allow-Origin', '*');
    var session = res.session;
    var status = 200;
    var body = {};
    
    try{
        if (session) {
            await session.commitTransaction();
        }
        body = res.data;
    } catch (error) {
        if (session) session.abortTranscation();
        status = 500;
        body = {message: error.message};
    } finally {
        if (session) session.endSession();
        res.status(status).json(body);
    }
}

module.exports.successResponseMiddleware = successResponseMiddleware;