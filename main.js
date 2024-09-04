// Initialize Scene
const scene = new THREE.Scene();

// Initialize Camera (First-Person Perspective)
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.set(0, 1.6, 5); // Typical eye height

// Initialize Renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Handle Window Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Add Lighting
const light = new THREE.HemisphereLight(0xffffff, 0x444444);
light.position.set(0, 20, 0);
scene.add(light);

// Add Chessboard
const boardSize = 8;
const squareSize = 1;
const boardGeometry = new THREE.BoxGeometry(boardSize * squareSize, 0.1, boardSize * squareSize);
const boardMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const board = new THREE.Mesh(boardGeometry, boardMaterial);
scene.add(board);

// Render Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
function createChessPiece(type, position) {
    let geometry;
    let material = new THREE.MeshStandardMaterial({ color: 0xffffff });

    switch(type) {
        case 'pawn':
            geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
            break;
        case 'rook':
            geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
            break;
        // Add more cases for other piece types
        default:
            geometry = new THREE.SphereGeometry(0.3, 32, 32);
    }

    const piece = new THREE.Mesh(geometry, material);
    piece.position.set(position.x, position.y, position.z);
    scene.add(piece);
}
// Add Pawns for White
for(let i = 0; i < boardSize; i++) {
    createChessPiece('pawn', { 
        x: (i - boardSize / 2) * squareSize + squareSize / 2, 
        y: 0.35, 
        z: - (boardSize / 2 - 1) * squareSize 
    });
}

// Add Pawns for Black
for(let i = 0; i < boardSize; i++) {
    createChessPiece('pawn', { 
        x: (i - boardSize / 2) * squareSize + squareSize / 2, 
        y: 0.35, 
        z: (boardSize / 2 - 2) * squareSize 
    });
}
// Initialize Pointer Lock Controls
const controls = new THREE.PointerLockControls(camera, document.body);

document.body.addEventListener('click', () => {
    controls.lock();
}, false);

scene.add(controls.getObject());

// Movement Variables
const moveForward = false;
const moveBackward = false;
const moveLeft = false;
const moveRight = false;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// Key Controls
const onKeyDown = function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
    }
};

const onKeyUp = function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
};

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

// Update Movement in Render Loop
function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked === true) {
        velocity.x -= velocity.x * 10.0 * 0.016;
        velocity.z -= velocity.z * 10.0 * 0.016;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * 0.016;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * 0.016;

        controls.moveRight(-velocity.x * 0.016);
        controls.moveForward(-velocity.z * 0.016);
    }

    renderer.render(scene, camera);
}
animate();