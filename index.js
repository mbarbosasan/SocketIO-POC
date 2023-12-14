const express = require('express');
const { createServer } = require('http');
const {Server} = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});
let id = 0
let json = []

app.get('/', (req, res) => {
    res.send('Hello from express');
});



async function getUser() {
    if (!json.length) {
        console.log('called MOCKAPI!')
        const response = await fetch(`URL_MOCK_API`);
        json = await response.json();
        return await json[Math.ceil(Math.random() * (50 - 1) + 1)]
    }
    return json[Math.ceil(Math.random() * (50 - 1) + 1)]
}

io.on('connection', socket => {
    console.log(`connect ${socket.id} ${new Date()}`);

    setInterval(async () => {
        const user = await getUser()
        socket.emit('user-created', user)
    }, 3000)

    socket.on('disconnect', reason => {
        console.log(`disconnect ${socket.id} due to ${reason}`);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000')
})