// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Set the camera position
camera.position.set(20, 10, 20);
controls.update();

// Function to create an orbit (elliptical path)
function createOrbit(radiusX, radiusZ, segments, color = 0xffffff) {
    const curve = new THREE.EllipseCurve(
        0, 0,            // Center of the ellipse (X, Y)
        radiusX, radiusZ, // Radii for the ellipse (X and Z axis radii)
        0, 2 * Math.PI,   // Start and end angle (0 to 360 degrees)
        false,            // Clockwise?
        0                // Start angle
    );

    const points = curve.getPoints(segments);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: color });

    // Create the final object to add to the scene
    const orbit = new THREE.Line(geometry, material);
    orbit.rotation.x = Math.PI / 2; // Rotate to make it horizontal
    return orbit;
}

// Create and add orbits for planets
scene.add(createOrbit(3.87, 3.87, 100, 0xffc107)); // Mercury
scene.add(createOrbit(7.23, 7.23, 100, 0xff8f00)); // Venus
scene.add(createOrbit(10, 10, 100, 0x2196f3)); // Earth
scene.add(createOrbit(15.2, 15.2, 100, 0xff5722)); // Mars
scene.add(createOrbit(52, 52, 100, 0xffeb3b)); // Jupiter
scene.add(createOrbit(86, 86, 100, 0x03a9f4)); // Saturn
scene.add(createOrbit(120, 120, 100, 0x8e44ad)); // Uranus
scene.add(createOrbit(165, 165, 100, 0x3498db)); // Neptune

// Asteroid Belt - represented as multiple orbits
for (let i = 55; i < 70; i += 1) {
    scene.add(createOrbit(i, i, 100, 0xaaaaaa));
}

// OBJ Loader to load models
const objLoader = new THREE.OBJLoader();

// Helper function to load and add an OBJ model
function loadOBJModel(path, position, scale = 1) {
    objLoader.load(
        path,
        function (obj) {
            obj.position.copy(position);
            obj.scale.set(scale, scale, scale);
            scene.add(obj);
        },
        undefined,
        function (error) {
            console.error(`Error loading ${path}:`, error);
        }
    );
}

// Load and add planet models at their initial positions
loadOBJModel('hackathon 3D model/Mercury done/Mercury.obj', new THREE.Vector3(3.87, 0, 0), 0.1); // Mercury
loadOBJModel('hackathon 3D model/venus done/Venus.obj', new THREE.Vector3(7.23, 0, 0), 0.2);   // Venus
loadOBJModel('', new THREE.Vector3(10, 0, 0), 0.25);    // Earth
loadOBJModel('hackathon 3D model/mars done/untitled.obj', new THREE.Vector3(15.2, 0, 0), 0.15);   // Mars
loadOBJModel('hackathon 3D model/Jupyter done/untitled.obj', new THREE.Vector3(52, 0, 0), 0.5);   // Jupiter
loadOBJModel('', new THREE.Vector3(86, 0, 0), 0.4);    // Saturn
loadOBJModel('hackathon 3D model/uranus done/uranus.obj', new THREE.Vector3(120, 0, 0), 0.35);  // Uranus
loadOBJModel('', new THREE.Vector3(165, 0, 0), 0.35); // Neptune

// Rendering function
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Adjust scene on window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
