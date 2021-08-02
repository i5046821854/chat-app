const socket = io() //얘가 받음

socket.on('countUpdated', (count)=>{  //서버에서 1param으로 보낸 것을 받음, 2nd: 서버의 2nd param
    console.log("the count has been updated" + count)
})

document.querySelector("#increment").addEventListener('click', ()=>{  //html 컴포넌트에 대해 이벤트 리스너 정의 
    console.log("clicked")
    
    socket.emit('increment')  //client -> server
})

