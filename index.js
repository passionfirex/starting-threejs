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
camera.position.set(15, 1, 0);

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03

const loader = new THREE.TextureLoader();

// adding balls 
function addCircle(posx, posz) {
    const geo = new THREE.IcosahedronGeometry(1.0, 2);
    const mat = new THREE.MeshStandardMaterial({
        map: loader.load("./textures/earthmap1k.jpg"),
    });
    const ball = new THREE.Mesh(geo, mat);
    ball.position.x = posx;
    ball.position.z = posz;
    ball.position.y = 0;
    ball.name = 'theBall';
    scene.add(ball);
};

let ball = addCircle(5, 0);


function addFloor() {
    let geometry = new THREE.BoxGeometry(50, 1, 50);
    let material = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0 });
    const floor = new THREE.Mesh(geometry, material);
    floor.position.set(0, -10, 0);
    floor.name = 'my-floor';
    scene.add(floor);
}
addFloor();

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000);
scene.add(hemiLight);


// animation numbers 
let acceleration = 9.8;
let bounceDistance = 4;
let bottomPositionY = -8;
let timeStep = 0.02;
let timeCounter = Math.sqrt(bounceDistance * 2 / acceleration);
let initSpeed = acceleration * timeCounter;
let sphere = scene.getObjectByName('theBall');


function animate(ball) {
    requestAnimationFrame(animate);
    if (sphere.position.y < bottomPositionY) {
        timeCounter = 0;
    }
    sphere.position.y = bottomPositionY + initSpeed * timeCounter - .5 * acceleration * timeCounter * timeCounter;
    timeCounter += timeStep;

    renderer.render(scene, camera);
    controls.update;
}

animate(ball);
