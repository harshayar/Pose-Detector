let video;
let poseNet;
let poses = [];
let isModelReady = false;
let isFrozen = false;
let lastFrame;

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.position((windowWidth - width) / 2, 100);

    video = createCapture(VIDEO);
    video.size(800, 500);
    video.hide();

    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', (results) => {
        poses = results;
    });
}

function modelLoaded() {
    console.log("✅ PoseNet Model Loaded!");
    isModelReady = true;
    document.getElementById("status").innerHTML = "✅ Model Loaded! Move to detect poses.";
}

function draw() {
    if (!isFrozen) {
        image(video, 0, 0, width, height);
        lastFrame = get();
    } else {
        image(lastFrame, 0, 0, width, height);
    }
    
    drawKeypoints();
}

function drawKeypoints() {
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            if (keypoint.score > 0.3) {
                fill(255, 204, 0, 180);
                stroke(255);
                strokeWeight(2);
                ellipse(keypoint.position.x, keypoint.position.y, 15 + sin(frameCount * 0.1) * 5);
            }
        }
    }
}

function downloadImage() {
    saveCanvas('poseNet_snapshot', 'png');
}

function toggleFreeze() {
    isFrozen = !isFrozen;
    document.querySelector("button:nth-child(2)").innerText = isFrozen ? "▶️ Resume Screen" : "⏸️ Freeze Screen";
}
function drawKeypoints() {
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;
        
        drawSkeleton(pose);

        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            if (keypoint.score > 0.3) {
                fill(255, 204, 0, 180);
                stroke(255);
                strokeWeight(2);
                ellipse(keypoint.position.x, keypoint.position.y, 10);
            }
        }
    }
}


function drawSkeleton(pose) {
    let skeleton = [
        [pose.keypoints[0], pose.keypoints[1]], // Nose -> Left Shoulder
        [pose.keypoints[0], pose.keypoints[2]], // Nose -> Right Shoulder
        [pose.keypoints[1], pose.keypoints[3]], // Left Shoulder -> Left Elbow
        [pose.keypoints[2], pose.keypoints[4]], // Right Shoulder -> Right Elbow
        [pose.keypoints[3], pose.keypoints[5]], // Left Elbow -> Left Wrist
        [pose.keypoints[4], pose.keypoints[6]], // Right Elbow -> Right Wrist


        [pose.keypoints[5], pose.keypoints[9]], // Left Hip -> Left Knee
        [pose.keypoints[6], pose.keypoints[10]], // Right Hip -> Right Knee
        [pose.keypoints[9], pose.keypoints[11]], // Left Knee -> Left Ankle
        [pose.keypoints[10], pose.keypoints[12]], // Right Knee -> Right Ankle

       
        [pose.keypoints[1], pose.keypoints[9]], // Left Shoulder -> Left Hip
        [pose.keypoints[2], pose.keypoints[6]], // Right Shoulder -> Right Hip
    ];

    for (let i = 0; i < skeleton.length; i++) {
        let part = skeleton[i];
        let pointA = part[0].position;
        let pointB = part[1].position;

        if (part[0].score > 0.3 && part[1].score > 0.3) {
            stroke(255, 0, 0); 
            strokeWeight(2);
            line(pointA.x, pointA.y, pointB.x, pointB.y);
        }
    }
}
