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