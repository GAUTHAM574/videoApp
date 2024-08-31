const socket = io();
const videoGrid = document.querySelector("#video-grid")
const myVideo = document.createElement('video');
let myVideoStream;
let myId;
myVideo.muted = true;

let peer = new Peer()

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then( stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    peer.on('call', call => {
        call.answer(myVideoStream); 
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            console.log("StreamEvent")
            addVideoStream(video, userVideoStream);
        })
      })
    
    socket.on('user-connected', (userId)=>{
        connectToNewUser(userId, myVideoStream);
    })
    
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
    console.log(id);
})

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        console.log("StreamEvent 2")
        addVideoStream(video, userVideoStream);
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video)
}


let text = $('#chat_input')

$('html').keydown((e) => {
    if (e.which == 13 && text.val().length!= 0) {
        console.log(text.val());
        socket.emit('message', text.val());
        text.val('');
    }
})

socket.on('create-message', (message) => {
    $('#chat_messages').append(
        `<div class="message">
            <div class="user-name">
                <b>User</b>
            </div>
            <div class="user-text"> 
                ${message.text}
            </div>
        </div>`
    )
    scrollToBottom("chat_container");
})

const scrollToBottom = (id) => {
    const element = document.getElementById(id);
    console.log(element.scrollHeight);
    element.scrollTop = element.scrollHeight;
}

const muteEventHandler = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setUnmuteButton = () => {
    const elem = `
    <i class="fas fa-microphone-slash red-txt"></i>
    <span>Unmute</span>`;
    document.getElementById('mute_button').innerHTML = elem;
}

const setMuteButton = () => {
    const elem = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>`;
    document.getElementById('mute_button').innerHTML = elem;
}

const videoEventHandler = () => {
    console.log('video event handler');
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setStopVideo();
    } else {
        setPlayVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setPlayVideo = () => {
    const elem = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>`;
    document.getElementById('video_button').innerHTML = elem;
}

const setStopVideo = () => {
    const elem = `
    <i class="fas fa-video-slash red-txt"></i>
    <span>Stop Video</span>`;
    document.getElementById('video_button').innerHTML = elem;
}