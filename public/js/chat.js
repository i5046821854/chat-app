const socket = io() //얘가 받음

// socket.on('countUpdated', (count)=>{  //서버에서 1param으로 보낸 것을 받음, 2nd: 서버의 2nd param
//     console.log("the count has been updated" + count)
// })


//입력 시 버튼, 폼들을 변환시키기 위한 변수들
const $messageForm = document.querySelector("#mess")
const $messageFormInput = document.querySelector("input")
const $messageFormButton = document.querySelector("button")
const $setlocationButton = document.querySelector("#send-location")
const $locationMessageTemplate = document.querySelector("#location-maeeage-template")


const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector("#message-template").innerHTML

socket.on('message',(Message)=>{
    console.log(Message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createAt : moment(message.createdAt).format("h:mm a") //(momontjs 라이브러리가 제공하는 시간 포맷 지정)
    })  //2nd param : html에서 끌어다 쓸 값들 {{}} 로 씀
    console.log("asdsa" + message)
    $messages.insertAdjacentHTML('beforeend', html)
})

document.querySelector("#increment").addEventListener('click', ()=>{  //html 컴포넌트에 대해 이벤트 리스너 정의 
    console.log("clicked")
    
    socket.emit('increment')  //client -> server
})

socket.on('locationMessage', (url) =>{
    console.log(url)
    const html = Mustache.render($locationMessageTemplate, {
        url
    })
    $messages.insertAdjacentHTML("beforeend",html)
})

$messageForm.addEventListener('submit', (e)=>{  //html 컴포넌트에 대해 이벤트 리스너 정의 
    e.preventDefault() //submit은 누르면 페이지가 리프레쉬되는데 이 기능을 막고자
    
    $messageFormButton.setAttribute("disabled", "disabled") //submit 누른 순간 버튼 비활성화
     
    const message = e.target.elements.message.value   //e.target.elements.message : 이벤트리스너가 감지하는 것 (form_) + elements.'name' => form 중에 name 속성이 'name' 것을 참조 (input 태그를 queryselector로 안 하는 것이 좋을 때)
    socket.emit("send", message, (error)=>{   //3param : acknowledge가 수신측으로 부터 들어왔을 때 핸들러
        
        //ack를 받으면, 버튼 활성화, 인풋에 들어있던 값 지워지고 커서가 들어감
        $messageFormButton.removeAttribute("disabled") 
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log("the message is delivered")
    }) //client -> server
})

//document.querySelector('#send-location').addEveneListenr 써도됨
$setlocationButton.addEventListener('click', ()=>{
    
    if(!navigator.geolocation) //지원하지 않을 경우
    {
        return alert("geolocation not support")
    }

    $setlocationButton.getAttribute("disabled", "disabled")

    navigator.geolocation.getCurrentPosition((position)=>{  //getcurrentposition : 비동기함수임 : 람다식으로 적어줌
        console.log(position)  //navigator.geolocation : js에서 제공하는 사용자의 위치 정보 api
        socket.emit("sendLocation", {  //emit을 객체로 전달
            latitude : position.coords.latitude,
            longitude : position.coords.longitude,
        }, (msg)=>{  //ack를 수신측에서 받음
            $setlocationButton.removeAttribute("disabled")
            console.log(msg)
        })
    })
})