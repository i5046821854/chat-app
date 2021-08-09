const socket = io() //얘가 받음

// socket.on('countUpdated', (count)=>{  //서버에서 1param으로 보낸 것을 받음, 2nd: 서버의 2nd param
//     console.log("the count has been updated" + count)
// })


//입력 시 버튼, 폼들을 변환시키기 위한 변수들
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = document.querySelector("input")
const $messageFormButton = document.querySelector("button")
const $setlocationButton = document.querySelector("#send-location")
const $locationMessageTemplate = document.querySelector("#location-message-template")


const $messages = document.querySelector('#messages')
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const messageTemplate = document.querySelector("#message-template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML
//options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix : true //쿼리스트링의 '?' 삭제
})   //location.search : 쿼리스트링을 반환

const autoscroll = () =>{
    //get the new message element
    const $newMessage = $messages.lastElementChild  //마지막 메시지 리턴
    //height of the new message
    const newMessageStyles = getComputedStyle($newMessage)  //파라미터에 해당하는 css 반환
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageheight = $newMessage.offsetHeight + newMessageMargin   //지금까지의 메시지의 길이 + 마진 //마지막 메시지의 마진

    //visible height
    const visibleheight = $messages.offsetHeight

    //height of the container
    const containerHeight = $messages.scrollHeight  //스크롤 할 수 있는 길이

    //how foar have i scrolled
    const scrollOffset = $messages.scrollTop + visibleheight  //위에서부터 얼마나 스크롤했는지

    if(containerHeight - newMessageheight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message',(Message)=>{
    const html = Mustache.render(messageTemplate, {
        username: Message.username,
        message: Message.text,
        createAt : moment(Message.createdAt).format("h:mm a") //(momontjs 라이브러리가 제공하는 시간 포맷 지정)
    })  //2nd param : html에서 끌어다 쓸 값들 {{}} 로 씀
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users}) =>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

// document.querySelector("#increment").addEventListener('click', ()=>{  //html 컴포넌트에 대해 이벤트 리스너 정의 
//     console.log("clicked")
    
//     socket.emit('increment')  //client -> server
// })

socket.on('locationMessage', (message) =>{
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url : message.url,
        createAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
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
            return error
        }
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
        //console.log(position)  //navigator.geolocation : js에서 제공하는 사용자의 위치 정보 api
        socket.emit("sendLocation", {  //emit을 객체로 전달
            latitude : position.coords.latitude,
            longitude : position.coords.longitude,
        }, (msg)=>{  //ack를 수신측에서 받음
            $setlocationButton.removeAttribute("disabled")
            //console.log(msg)
        })
    })
})

socket.emit('join', {username, room}, (error)=>{
    if (error) {   //join에서 실패해서 콜백에 error을 담아왔을 떄
        alert(error)
        location.href = '/'  //에러 뜰 경우 루트로 리다이렉트해주기
    }
}) //join은 너의 유저네임과 방 이름을 받아들임  //167강