const express = require('express');
const app = express();
const server = require('http').Server(app);
var bodyParser = require('body-parser')
const {v4: uuidv4} = require('uuid');
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {  
    port: 3000,
    host: 'localhost',
    path: '/',
    debug: true 
});

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use( urlencodedParser)
app.use('/peerjs', peerServer);
app.get('/', (req, res) => {
    res.render('home');
});

app.post('/join', (req, res) => {
    res.redirect(`/${req.body.username}/${req.body.roomid}`)
});

app.post('/create', (req, res) => { 
    res.redirect(`/${req.body.username}/${uuidv4()}`)
});

app.get('/:uname/:room/', (req, res) => {
    res.render('room', {uname: req.params.uname, roomId: req.params.room});
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);

        socket.on('message', (uname, text) => {
            const message = {name: uname, text: text};
            io.to(roomId).emit('create-message', message);
        })
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        });
    })
 })  

server.listen(process.env.PORT || 3000, ()=>{
    console.log('listening on port', process.env.PORT || 3000);
});
