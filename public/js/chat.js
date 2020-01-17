const socket=io()
//elements
const $messageform=document.querySelector('#message_form')
const $messageforminput=$messageform.querySelector('input')
const $messageformbutton=$messageform.querySelector('button')

const $locationform=document.querySelector('#send_location')




socket.on('message',(message)=>{
    console.log(message)
    socket.emit('message_recieved')
})  
socket.on('location_recieved',(coords)=>{
    console.log(coords)
})
$messageform.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageformbutton.setAttribute('disabled','disabled')
    let x=e.target.elements.message.value
   
    socket.emit('sendMessage',x,(error)=>{
        
        $messageformbutton.removeAttribute('disabled')
        $messageforminput.value=''
        $messageforminput.focus()

        if(error)
        {
            return console.log(error)
        }
        console.log('message delivered!')
    })
})

$locationform.addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('geolocation is not supported on your browser')
    }
    $locationform.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('send_location',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            
            $locationform.removeAttribute('disabled')
            console.log('location shared')
        })
    })
})