const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');

//importando rutas
const rutas = require('./routes/controller.js');

//settings 
app.set('port', process.env.PORT || 3000);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//middlewares
app.use(morgan('dev'));

//rutas
app.use('/',rutas);

//static files
app.use('/public',express.static(path.join(__dirname,'public')));

//start server
const server = app.listen(app.get('port'),()=>{
    console.log('server on port ',app.get('port'));
});

//web socket
const socketIO = require('socket.io');
const io = socketIO(server);

io.on('connection',(socket)=>{
    console.log('new connection ',socket.id);
});