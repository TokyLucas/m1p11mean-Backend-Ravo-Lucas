const successResponseMiddleware = async (data, session, status = 200) => {
    return async (req, res, next) => {
        if (session) {
            await session.commitTransaction();
            session.endSession();
        }
        res.send({
            status: status,
            data: data
        });
    }
}

module.exports = successResponseMiddleware;