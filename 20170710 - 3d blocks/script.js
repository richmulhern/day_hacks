var scene, camera, renderer;
var geometry, material, mesh;

const maxSpeed = 0.04;
const minSpeed = 0.0001;
const boxSize = 200;
const baseScale = 1;
const scaleMax = .5;
const meshes = [];
const spacing = 460;
const numBoxes = 47;
const numPerRow = 7;
const numRows = numBoxes / numPerRow;
const hue = 150;

let ySpeed = 0.01;
let scale = baseScale;

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    geometry = new THREE.BoxGeometry( boxSize, boxSize, boxSize );

    for (let i = 0; i < numBoxes; i++ ) {

        const hueSlice = hue / Math.floor(numPerRow / 2);
        const newHue = 30 + Math.round(hueSlice * Math.abs(Math.floor(Math.abs((i % 7) - ((numPerRow - 1)/2)))));

        material = new THREE.MeshBasicMaterial( { wireframe: true } );
        material.color = new THREE.Color(`rgb(${newHue}, ${newHue}, ${newHue})`);

        mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = spacing * ((i % numPerRow) - ((numPerRow - 1) / 2));
        mesh.position.y = spacing * Math.floor(((numRows - 1) / 2) - Math.floor(i / numPerRow));

        meshes[i] = mesh;
        scene.add( meshes[i] );
    }


    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.addEventListener('mousemove', setSpeed);

    document.body.appendChild( renderer.domElement );
}

function animate() {
    requestAnimationFrame( animate );

    meshes.forEach(mesh => {
        mesh.rotation.y += ySpeed;
        mesh.scale.set(scale, scale, scale);
    });

    renderer.render( scene, camera );
}

function setSpeed(e) {
    const x = e.offsetX;
    const width = e.target.offsetWidth;

    const walk = maxSpeed - minSpeed;

    ySpeed = (x / width * walk) - (walk / 2);

    scale = baseScale + (scaleMax * Math.abs(x - (width/2)) / (width/2));
}

init();
animate();
