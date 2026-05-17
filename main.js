import * as THREE from "three";

// Scene
const scene = new THREE.Scene();

// Sphere
const geometry = new THREE.TorusGeometry(10, 3, 16, 100); // the shape
const material = new THREE.MeshStandardMaterial({
  // the material (color, shiny, etc.)
  color: "#00ff83",
});

const mesh = new THREE.Mesh(geometry, material); // combining the shape and material
scene.add(mesh); // adding the sphere to the canvas

// Light
const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(0, 10, 10);
scene.add(light);

// Render
const canvas = document.querySelector(".ring-model");
const container = document.querySelector(".blender-ring");
//  sizes:
const sizes = {
  width: container.clientWidth,
  height: container.clientHeight,
};
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height); // the number is the FOV value
camera.position.z = 40;
scene.add(camera);

renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);

// if the window is being resized -> update object size
window.addEventListener("resize", () => {
  sizes.width = container.clientWidth;
  sizes.height = container.clientHeight;
  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// The spin animation
let velocity = 0; //track the spin speed
let isDragging = false; // check if the user is spinning the ring
let prevXLocation = 0; // stores where the user is on the screen
let prevTime = 0; // get the current time
const maxVelocity = 1;

// when the user first presses down on the object
canvas.addEventListener("pointerdown", (e) => {
  console.log("Just pressed down on the ring");
  velocity = 0;
  isDragging = true; // true until pointer up
  prevXLocation = e.clientX; // get the current x position
  prevTime = performance.now(); // get timestamp in milliseconds
});

canvas.addEventListener("pointermove", (e) => {
  console.log("Pointer on the move");
  if (!isDragging) return;
  const currentXLocation = e.clientX;
  const currentTime = performance.now();
  const deltaX = currentXLocation - prevXLocation;
  const deltaTime = currentTime - prevTime;

  // rotate the object while dragging
  mesh.rotation.y += deltaX * 0.01;

  velocity = deltaX / deltaTime;
  if (Math.abs(velocity) > maxVelocity) {
    velocity = maxVelocity * Math.sign(velocity);
  }

  // update previous values!
  prevXLocation = currentXLocation;
  prevTime = currentTime;
});

canvas.addEventListener("pointerup", (e) => {
  console.log("Screen released!");
  console.log("velocity is: ", velocity);
  isDragging = false;
});

// loop
const loop = () => {
  if (!isDragging && Math.abs(velocity) > 0.0001) {
    mesh.rotation.y += velocity * 0.2; //rotate the ring
    velocity *= 0.98; // slow it down
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();
