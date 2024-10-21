import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./getStarfield.js";

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);

document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 200;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(40, 15, 40);

const axesHelper = new THREE.AxesHelper(5);

const scene = new THREE.Scene();
// scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03

const loader = new THREE.TextureLoader();
const starSprite = loader.load("./textures/circle.png");

const sunGeo = new THREE.SphereGeometry(11, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: loader.load("./textures/sun map.png"),
})
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function addCircle(position, texture, size, ring) {
    const geo = new THREE.IcosahedronGeometry(size, 6);
    const mat = new THREE.MeshStandardMaterial({
        map: loader.load(texture),
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if (ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: loader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }
    scene.add(obj);
    mesh.position.x = position;
    return {
        mesh, obj
    };
};

const mercury = addCircle(19, "./textures/mercurymap.jpg", 1);
const venus = addCircle(23, "./textures/venusmap.jpg", 1.2);
const earth = addCircle(27, "./textures/earthmap1k.jpg", 1.5);
const mars = addCircle(35, "./textures/mars_1k_color.jpg", 1.5);
const jupiter = addCircle(44, "./textures/jupitermap.jpg", 3);
const saturn = addCircle(52, "./textures/saturnmap.jpg", 2.3, {
    innerRadius: 2.9,
    outerRadius: 4.2,
    texture: "./textures/saturn ring.png"
});
const uranus = addCircle(57, "./textures/uranusmap.jpg", 1.4, {
    innerRadius: 1.6,
    outerRadius: 1.9,
    texture: "./textures/uranus ring.png"
});
const neptune = addCircle(62, "./textures/neptunemap.jpg", 1.4,);


const saturnRingGeo = new THREE.RingGeometry(10, 20, 32);
const saturnRingMat = new THREE.MeshStandardMaterial({
    map: loader.load("./textures/saturn ring.png"),
    side: THREE.DoubleSide,
});
const saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat);


const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000);
scene.add(hemiLight);


// animation numbers 
let acceleration = 9.8;
let bounceDistance = 4;

const stars = getStarfield({ numStars: 1000, sprite: starSprite });
scene.add(stars);

function animate() {
    requestAnimationFrame(animate);

    sun.rotateY(0.004);
    mercury.mesh.rotateY(0.004);
    venus.mesh.rotateY(0.002);
    earth.mesh.rotateY(0.02);
    mars.mesh.rotateY(0.018);
    jupiter.mesh.rotateY(0.04);
    saturn.mesh.rotateY(0.038);
    uranus.mesh.rotateY(0.03);
    neptune.mesh.rotateY(0.032);

    //Around-sun-rotation
    mercury.obj.rotateY(0.04);
    venus.obj.rotateY(0.015);
    earth.obj.rotateY(0.01);
    mars.obj.rotateY(0.008);
    jupiter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);

    camera.lookAt(11, -3, 0);

    renderer.render(scene, camera);
    controls.update();
}

animate();
