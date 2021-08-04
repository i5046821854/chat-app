const path = require('path')
const http = require('http')
const Filter = require("bad-words")
const express = require("express")
const app = express()
const server  = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)  //파라미터로 서버가 들어가야함 (그래서 http.createServer 해준 것)
const {generateMessage, generateLocation} = require('./utils/messages')

const port = process.env.PORT || 3000

const publicPath = path.join(__dirname, "../public")

app.use(express.static(publicPath))

let count = 0

io.on('connection',(socket)=>{   //소켓 이벤트리스너, 콜백
    console.log("new websocket connected")
    
    socket.emit("message", generateMessage("welcome")) //utils의 index.js에 전달됨
    // socket.emit('countUpdated', count)  //서버에서 클라이언트로 전송, 2nd param으로 전해주는 데이터는 클라이언트 사이드에서 콜백으로 접근 가능
    
    // socket.on('increment', ()=>{  //클라이언트에서 들어오는 정보를 받음
    //     count++
    //     //socket.emit("countUpdated", count)  //클라이언트로 던져 (얘는 하나의 클라이언트로 던짐)
    //     io.emit("countUpdated", count) //얘는 모든 클라이언트로 던짐 (count가 다른 클라이언트에게도 전달됨)
    // })

    socket.broadcast.emit("message", "new member join") //타겟 클라이언트를 제외한 모든 클라이언트로 던짐

    socket.on('send', (msg, callback)=>{ //클라이언트에서 들어오는 정보를 받음
        const filter = new Filter()
        console.log(msg)
        if(filter.isProfane(msg)){
            return callback("profanity not allowed")  //욕설이 들어오면 callback function
        }
        
        io.emit("message", msg) //모든 클라이언트로 던짐 (msg가 다른 클라이언트에게도 전달됨)
        callback()  //송신 측에 acknowledge 전달
    })

    socket.on('disconnect', ()=>{   //disconnect 시에는 io.on이 아니라 socket.on으로 처리
        io.emit("message", "user has left")  //disconnect에는 io로 줘도 타겟 클라이언트 제외한 모든 클라이언트로 다 전달됨 (걔는 나갔으니까)
    })

    socket.on('sendLocation', (coords, callback)=>{
        //io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)  //전달할 떄 구글 맵 url에다가 위,경도 띄워서 전달해주기 (링크타고 구글 맵 이동할 수 있음)
        io.emit('locationMessage', generateLocation(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))  //전달할 떄 구글 맵 url에다가 위,경도 띄워서 전달해주기 (링크타고 구글 맵 이동할 수 있음)
        callback("well delivered") //ack 전송
    })
})

server.listen(port, ()=>{   //2nd param : 새로운 커넥션에 대한 소켓
    console.log(`server is up on port ${port}`)
    
})  //app.listen을 다른 방법으로 만든 것 (socket.io를 이용하기 위해서)

// app.listen(port, ()=>{
//     console.log(`server is up on port ${port}`)
// })