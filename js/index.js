const video = document.getElementById("myvideo");
const handimg = document.getElementById("handimage");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let nextImageButton = document.getElementById("reset");
let pauseButton = document.getElementById("pause");
let updateNote = document.getElementById("updatenote");

let imgindex = 1
let isVideo = false;
let model = null;
let draw = 1
let drawnpoints = []
// video.width = 500
// video.height = 400

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}


trackButton.addEventListener("click", function () {
    toggleVideo();
});
nextImageButton.addEventListener('click',function (){
    drawnpoints = []
})
pauseButton.addEventListener('click',function (){
    draw = !draw
    pauseButton.innerText = draw?'pause':'play'
})

function runDetection() {
    model.detect(video).then(predictions => {
        console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, video);
        if (predictions[0] && predictions[0].score>.7 && draw) {
            drawnpoints.push([predictions[0].bbox[0], predictions[0].bbox[1],10,10])
        }
        for (let i = 0; i < drawnpoints.length; i++){
            context.fillRect(...drawnpoints[i])
        }
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}



// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    toggleVideo()
    trackButton.disabled = false
    nextImageButton.disabled = false
    pauseButton.disabled= false
});
