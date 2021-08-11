const generateMessage = (username, text)=>{   //메시지 생성 로직
    return {
        username,
        text, 
        createAt: new Date().getTime()
    }
}

const generateLocation = (username, url)=>{  //위치 메시지 생성 로직
    return{
        username,
        url,
        createAt : new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocation
}