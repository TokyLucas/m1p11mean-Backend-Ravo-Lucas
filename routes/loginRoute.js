var express = require('express');
var router = express.Router();
var loginMiddleware = require('../middlewares/loginMiddleware');

router.post('/employe', loginMiddleware("employe"), async(req, res, next) => {
    try {
        console.log(res.token);
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json({
            "token": {
                "value": res.token,
                "expires": 60
            }
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.post('/manager', loginMiddleware("manager"), async(req, res, next) => {
    try {
        console.log(res.token);
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json({
            "token": {
                "value": res.token,
                "expires": 60
            }
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.post('/client', loginMiddleware("client"), async(req, res, next) => {
    try {
        console.log(res.token);
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json({
            "token": {
                "value": res.token,
                "expires": 60
            }
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

module.exports = router;