const path= require('path')
const http=require('http')
const express = require('express')
const publicDirectoryPath=path.join(__dirname,'../public')
const socketio= require('socket.io')
const Filter =require ('bad-words')


const app = express()
const server=http.createServer(app)
const io=socketio(server)
const port = process.env.PORT || 3002
app.use(express.static(publicDirectoryPath))

//server(emit)->client(recieve)-countupdated
//client(emit)->server(recieve)-increment
//io.emit->gives message to each user
//socket.emit->gives message one to one
//socket.broadcast.emit->gives mesage to everyone but the user 
io.on('connection',(socket)=>{
    socket.broadcast.emit('message','Anew user has joined')
    socket.on('sendMessage',(message,callback)=>{
        const filter=new Filter;
        if(filter.isProfane(message))
        {
            return callback('profanity is not allowed')
        }
        io.emit('message',message)
        callback()
    })
    socket.on('disconnect',()=>{
        io.emit('message','user has left')
    })
    socket.on('send_location',(coords,callback)=>{
        io.emit('location_recieved',`https://google.com/maps/?q=${coords.latitude},${coords.longitude}`)
        callback()
    })
    
})



server.listen(port, () => {
    console.log('Server is up on port ' + port)
})

