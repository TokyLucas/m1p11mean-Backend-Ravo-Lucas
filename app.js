var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

var dotenv = require('dotenv');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var jwtAuth = require('./middlewares/jwtAuthMiddleware');
var loginRoute = require('./routes/loginRoute');
var rendezVousAPIRoute = require('./routes/rendezvous/rendezvousAPI');
var serviceAPIRoute = require('./routes/service/serviceAPI');
var managerAPIRoute = require('./routes/manager/managerAPI');
var depenseAPIRoute = require('./routes/manager/depenseAPI');
var statsAPIRoute = require('./routes/manager/statsAPI'); 
var employeAPIRoute = require('./routes/employe/employeAPI');
var horaireAPIRoute = require('./routes/employe/horaireAPI');
var clientAPIRoute = require('./routes/client/clientAPI');
var paiementAPIRoute = require('./routes/client/paiementAPI');
var notificationAPIRoute = require('./routes/notification/notificationAPI');



var app = express();
dotenv.config({ path: './dev.env'});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static('public'))

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/login', loginRoute);
app.use('/rendezvousAPI', jwtAuth(), rendezVousAPIRoute);
app.use('/serviceAPI', jwtAuth(), serviceAPIRoute);
app.use('/managerAPI', managerAPIRoute);
app.use('/managerAPI', depenseAPIRoute);
app.use('/managerAPI', statsAPIRoute);
app.use('/employeAPI', jwtAuth(), employeAPIRoute);
app.use('/employeAPI', jwtAuth(), horaireAPIRoute);
app.use('/clientAPI', clientAPIRoute);
app.use('/notificationAPI', jwtAuth(), notificationAPIRoute);
app.use('/paiementAPI', jwtAuth(), paiementAPIRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
