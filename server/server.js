const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const { validateSession, fetchAthleteData, fetchLiveTagData } = require('./utils/db');
const { Connections } = require('./utils/connections');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const connections = new Connections();

const port = 8080;


app.use(express.static('public')); // point to root directory of react app, i.e. index.html

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/index.html'));
// });

// websockets ===============
io.on('connection', (socket) => {
    socket.on('join', (param, callback) => {
        const sessionArr = param.split('-');
        const [sessionId] = sessionArr;
        console.log(sessionId);
        socket.join(sessionId); // join the same grp as other 6-digit sessions to receive serverside
        connections.addUser(socket.id, param);
        callback();
    });

    socket.on('disconnect', () => {
        const conn = connections.removeUser(socket.id);
        if (conn) {
            console.log(conn);
        }
    });
});

setInterval(() => {
    const rooms = connections.getCurrentRooms();
    if (rooms.length > 0) {
        rooms.forEach(async (room) => {
            try {
                const sessionArr = room.split('-');
                const [sessionId] = sessionArr;
                const allAthData = await fetchAthleteData(sessionId);
                const liveTagData = await fetchLiveTagData(sessionId);
                io.to(sessionId).emit('datarefresh', { allAthData, liveTagData });
            } catch (error) {
                console.log(error);
            }
        });
    }
}, 5000); // 5 sec interval for broadcasting data to rooms


// api ==============================================
app.get('/api/valsession/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const session = await validateSession(id);
        if (session) res.status(200).send(session.data);
    } catch (error) {
        console.log(error);
        res.status(404).send(); // unable to validate the session, notify user
    }
});


server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = { app };
