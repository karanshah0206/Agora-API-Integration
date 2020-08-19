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

// Canvas
function addCanvas (streamId) {
    let video = document.getElementById(`video${streamId}`);
    let canvas = document.createElement('canvas');
    canvasContainer.appendChild(canvas);
    let ctx = canvas.getContext('2d');

    video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    });
    video.addEventListener('play', () => {
        var $this = this;
        (function loop() {
            if (!$this.paused && !$this.ended) {
                if ($this.width !== canvas.width) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                }
                ctx.drawImage(loop, 1000/30); // 30 FPS
            }
        })();
    }, 0);
}