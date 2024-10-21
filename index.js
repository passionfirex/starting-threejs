import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);

document.body.appendChild(renderer.domElement);

// creating scene & camera
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 50;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(11, -3, 20);

const axesHelper = new THREE.AxesHelper(5);

const scene = new THREE.Scene();

// zscene.add(axesHelper);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03

const loader = new THREE.TextureLoader();

function addCircle(posx, posz, texture, name, bounceDistance, size) {
    const geo = new THREE.IcosahedronGeometry(size, 6);
    const mat = new THREE.MeshStandardMaterial({
        map: loader.load(texture),
    });
    const ball = new THREE.Mesh(geo, mat);
    ball.position.x = posx;
    ball.position.z = posz;
    ball.position.y = 0;
    ball.name = name;  // Use the passed-in name parameter
    scene.add(ball);

    // Calculate initial speed and time counter for this ball
    const acceleration = 9.8;
    const timeCounter = Math.sqrt(bounceDistance * 2 / acceleration);
    const initSpeed = acceleration * timeCounter;

    // Return ball with its unique bounce data
    return {
        ball,
        bounceDistance,
        initSpeed,
        timeCounter,
        timeStep: 0.02,
        bottomPositionY: -8
    };
};

let balls = [
    addCircle(-7, 0, "./textures/mercurymap.jpg", 'mercury', 5, 1),
    addCircle(-3, 0, "./textures/venusmap.jpg", 'venus', 4, 1.2),
    addCircle(1, 0, "./textures/earthmap1k.jpg", 'earth', 5, 1.5),
    addCircle(6, 0, "./textures/mars_1k_color.jpg", 'mars', 3, 1.5),
    addCircle(13, 0, "./textures/jupitermap.jpg", 'jupiter', 2, 3),
    addCircle(21, 0, "./textures/saturnmap.jpg", 'saturn', 4, 2.3),
    addCircle(28, 0, "./textures/uranusmap.jpg", 'uranus', 6, 1.4),
    addCircle(33, 0, "./textures/neptunemap.jpg", 'neptune', 3, 1.4),

];

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000);
scene.add(hemiLight);


// animation numbers 
let acceleration = 9.8;
let bounceDistance = 4;

function animate() {
    requestAnimationFrame(animate);

    // Update each ball individually
    balls.forEach((ballData) => {
        const { ball, initSpeed, timeStep, bottomPositionY } = ballData;

        if (ball.position.y < bottomPositionY) {
            ballData.timeCounter = 0;  // Reset bounce
        }

        ball.position.y = bottomPositionY + initSpeed * ballData.timeCounter - 0.5 * 9.8 * ballData.timeCounter * ballData.timeCounter;
        ballData.timeCounter += timeStep;  // Update time for next frame
    });

    camera.lookAt(11, -3, 0);

    renderer.render(scene, camera);
    controls.update();
}

animate();
