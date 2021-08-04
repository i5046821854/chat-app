const generateMessage = (text)=>{
    return {
        text, 
        createAt: new Date().getTime()
    }
}

const generateLocation = (url)=>{
    return{
        url,
        createAt : new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocation
}