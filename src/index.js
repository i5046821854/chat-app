const path = require('path')
const http = require('http')

const express = require("express")
const app = express()
const server  = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)  //파라미터로 서버가 들어가야함 (그래서 http.createServer 해준 것)

const port = process.env.PORT || 3000

const publicPath = path.join(__dirname, "../public")

app.use(express.static(publicPath))

let count = 0

io.on('connection',(socket)=>{   //소켓 이벤트리스너, 콜백
    console.log("new websocket connected")
    socket.emit('countUpdated', count)  //서버에서 클라이언트로 전송, 2nd param으로 전해주는 데이터는 클라이언트 사이드에서 콜백으로 접근 가능
    
    socket.on('increment', ()=>{  //클라이언트에서 들어오는 정보를 받음
        count++
        //socket.emit("countUpdated", count)  //클라이언트로 던져 (얘는 하나의 클라이언트로 던짐)
        io.emit("countUpdated", count) //얘는 모든 클라이언트로 던짐
    })
})

server.listen(port, ()=>{   //2nd param : 새로운 커넥션에 대한 소켓
    console.log(`server is up on port ${port}`)
    
})  //app.listen을 다른 방법으로 만든 것 (socket.io를 이용하기 위해서)

// app.listen(port, ()=>{
//     console.log(`server is up on port ${port}`)
// })