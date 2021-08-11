const users = []

//addUser

const addUser = ({id,username,room}) =>{

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room)
    {
        return {
            error : "username and room are required"
        }
    }

    const existingUser = users.find((user)=>{  //모든 users의 아이템에 대해 실행됨
        return user.room === room && user.username === username
    })

    if(existingUser)
    {
       return {
           error: "username is in use"
        }
    }

    const user = {id, username, room}
    users.push(user)
    return {user}
}

const removeUser = (id) =>{
    const index = users.findIndex((user)=>{ //하나만만 찾으면 끝남
        return user.id === id
    })

    if (index != -1) //찾을 값이 발견되었을 때
    {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) =>{
    return users.find((user)=>{
        return user.id === id
    }) 
}

const getUsers = () =>{
    return users
}

const getUsersInRoom = (room) =>{
    return users.filter((user)=>{
        return user.room === room
    })
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getUsers
}
//https://yslee-chat.herokuapp.com/ 에 배포됨