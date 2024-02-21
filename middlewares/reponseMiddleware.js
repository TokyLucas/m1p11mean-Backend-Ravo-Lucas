const successResponseMiddleware = async (req, res, next)=> {
    res.set('Access-Control-Allow-Origin', '*');
    var session = res.session;
    try{
        if (session) {
            await session.commitTransaction();
        }
        res.status(200).json(res.data);
    } catch (error) {
        session.abortTranscation();
        res.status(500).json({message: error.message});
    } finally {
        session.endSession();
    }
}

module.exports.successResponseMiddleware = successResponseMiddleware;