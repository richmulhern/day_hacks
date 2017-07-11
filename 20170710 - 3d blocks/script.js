var scene, camera, renderer;
var geometry, material, mesh;

const maxSpeed = 0.04;
const minSpeed = 0.0001;
const boxSize = 200;
const baseScale = 1;
const scaleMax = 0.5;
const spacing = 460;
const numBoxes = 40;
const numPerRow = 8;
const numRows = numBoxes / numPerRow;

let ySpeed = 0.01;
let scale = baseScale;

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    geometry = new THREE.BoxGeometry( boxSize, boxSize, boxSize );

    for (let i = 0; i < numBoxes; i++ ) {
        const column = i % numPerRow;
        const row = Math.floor(i / numPerRow);
        const halfXPoint = (numPerRow - 1) / 2;
        const halfYPoint = (numRows - 1) / 2;
        const xPosPercent = Math.abs(column - halfXPoint) / halfXPoint;

        const boxX = spacing * (column - halfXPoint);
        const boxY = spacing * Math.round(row - halfYPoint);

        const box = new Box();
        box.setOpacity(1.20 - xPosPercent);
        box.setPosition(boxX, boxY);
        mesh = box.getMesh();

        scene.add( mesh );
    }

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.addEventListener('mousemove', setSpeed);
    document.body.appendChild( renderer.domElement );
}

class Box {

    constructor() {
        this.boxSize = 200;
        this.baseScale = 1;
        this.scaleMax = .5;
        this.defaultHue = 20;

        this.box = new THREE.BoxGeometry( boxSize, boxSize, boxSize );
        this.material = new THREE.MeshBasicMaterial( { wireframe: true } );
        this.material.color = new THREE.Color(`rgb(${this.defaultHue}, ${this.defaultHue}, ${this.defaultHue})`);
        this.mesh = new THREE.Mesh( this.box, this.material );
        this.setOpacity(1);
    }

    setOpacity(value) {
        this.material.opacity = value;
    }

    setPosition(x, y) {
        this.mesh.position.x = x;
        this.mesh.position.y = y;

        return this.mesh;
    }

    getMesh() {
        return this.mesh;
    }
}

function animate() {
    requestAnimationFrame( animate );

    scene.children.forEach(mesh => {
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
