// Error Handling
function handleFail (err) {
    console.log("Error: " + err);
}

// Querying Remote Feeds
var remoteContainer = document.getElementById("remote-container");
var canvasContainer = document.getElementById("canvas-container");

// Add Remote Streams To Remote Container
function addVideoStream (streamId) {
    var streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.classList.add("mirrorStream");
    remoteContainer.appendChild(streamDiv);
}

// Remove Remote Video Stream On User Disconnect
function removeVideoStream (evt) {
    var stream = evt.stream;
    stream.stop();
    var remDiv = document.getElementById(stream.getId());
    remDiv.parentNode.removeChild(remDiv);
}

// Add Canvas To Render Remote Video Stream
function addCanvas (streamId) {
    var video = document.getElementById(`video${streamId}`);
    var canvas = document.createElement("canvas");
    canvasContainer.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    });
    video.addEventListener("play", () => {
        var $this = this;
        (function loop () {
            if (!$this.paused && !$this.ended) {
                if ($this.width !== canvas.width) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;s
                }
                ctx.drawImage($this, 0, 0);
                setTimeout(loop, 1000/30); // 30 FPS
            }
        })();
    }, 0);
}

// Initiating Agora Client
var client = AgoraRTC.createClient({
    mode: 'live',
    codec: 'h264'
});

client.init("c0041179099d492fa2dafcc82ec735c0", () => {
    console.log("Client Initialized!");
});

// Join Agora Client To Channel
client.join(null, 'heavyhurdle', null, (uid) => {  // First Parameter is ID, null dynamically generates. Second parameter is channel name.
    var localStream = AgoraRTC.createStream({
        streamID: uid,
        audio: true,
        video: true,
        screen: false
    });
    localStream.init(() => {
        localStream.play("local-container");
        client.publish(localStream, handleFail); // Publish the stream

        client.on("stream-added", (evt) => { // Check for any published remote streams
            client.subscribe(evt.stream, handleFail);
        });

        client.on("stream-subscribed", (evt) => { // Add Video Stream If Subscribed
            var stream = evt.stream;
            addVideoStream(stream.getId());
            stream.play(stream.getId());
            addCanvas(stream.getId());
        });

        client.on("stream-remove", removeVideoStream); // Remove Remote Video At User Disconnect
    }, handleFail);
}, handleFail);