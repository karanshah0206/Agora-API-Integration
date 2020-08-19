// Error Handling
let handleFail = function(err) {
    console.log("Error: ", err);
}

// Remote Feeds
let remoteContainer = document.getElementById('remote-container');
let canvasContainer = document.getElementById('canvas-container');

function addVideoStream (streamId) {
    let streamDiv = document.createElement('div');
    streamDiv.id = streamId;
    streamDiv.style.transform = 'rotateY(180deg)'; // Mirror
    remoteContainer.appendChild(streamDiv);
}

function removeVideoStream (evt) {
    let stream = evt.stream;
    stream.stop();
    let remDiv = document.getElementById(stream.getId());
    remDiv.parentNode.removeChild(remDiv);
}