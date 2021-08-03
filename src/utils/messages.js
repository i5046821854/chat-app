const generateMessage = (text)=>{
    return {
        text, 
        createAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage
}