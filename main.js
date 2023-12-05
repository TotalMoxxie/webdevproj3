import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.setZ(30);
//camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 } );
const torus = new THREE.Mesh( geometry, material );
scene.add( torus );

//const pointLight = new THREE.PointLight(0xffffff);
//pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add( ambientLight );

//const lightHelper = new THREE.PointLightHelper(pointLight);
//scene.add(lightHelper);

const controls = new OrbitControls(camera, renderer.domElement);

// Interaction functionality
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  event.preventDefault();

  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Raycasting to check if objects are intersected
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const selectedObject = intersects[0].object;
    if (selectedObject.type === 'Mesh') {
      const newColor = new THREE.Color(Math.random() * 0xffffff);
      selectedObject.material.color = newColor;
    }
  }
}

window.addEventListener('click', onMouseClick, false);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color:0xffffff});
  const star = new THREE.Mesh(geometry,material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

//Array(200).fill().forEach(addStar); 

// Function to add a new type of visual element - particles
function addParticles() {
  const particleGeometry = new THREE.BufferGeometry();
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x888888,
    size: 0.2,
  });

  const vertices = [];

  for (let i = 0; i < 500; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;

    vertices.push(x, y, z);
  }

  particleGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
}

addParticles(); // Call the function to add particles to the scene

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;

  controls.update();

  renderer.render(scene, camera);
}

if ( WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}