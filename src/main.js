
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const Papa = require('papaparse');
import Framework from './framework'

var zipToIncome = [];
Papa.parse("https://echiu1997.github.io/FNAR266-A06/data/zip_median-income.csv", {
    download: true,
    complete: function(results) {
        zipToIncome = results;
        console.log(results);
        console.log(zipToIncome.data[0][0]);
    }
});

var zipToLatLng = [];
//TODO


var Sliders = function() {
    this.lineThickness = 0.3;
    this.lineFrequency = 0.6;
};
var sliders = new Sliders();

var startTime = Date.now();

var geometry1 = new THREE.Geometry();
var plane1 = new THREE.Mesh();
var geometry2 = new THREE.Geometry();
var plane2 = new THREE.Mesh();

////////////////////////////////////////////////////////////////////

// create the shader material      
var shaderMaterial1 = new THREE.ShaderMaterial( {
    uniforms: {
        // float initialized to 0
        time: { type: "f", value: 0.0 },
        // float initialized to 0
        freq: { type: "f", value: 0.0 },
        //float initialized to 25
        amp: { type: "f", value: 10.0 },

        lineThickness: { type: "f", value: 0.3},
        lineFrequency: { type: "f", value: 0.6}
    },
    vertexShader: require('./shaders/iridescence-vert.glsl'),
    fragmentShader: require('./shaders/iridescence-frag.glsl'),
    side: THREE.DoubleSide
} );

// create the shader material      
var shaderMaterial2 = new THREE.ShaderMaterial( {
    uniforms: {
        // float initialized to 0
        time: { type: "f", value: 0.0 },
        // float initialized to 0
        freq: { type: "f", value: 0.0 },
        //float initialized to 25
        amp: { type: "f", value: 50.0 },

        lineThickness: { type: "f", value: 0.3},
        lineFrequency: { type: "f", value: 0.6}
    },
    vertexShader: require('./shaders/iridescence-vert.glsl'),
    fragmentShader: require('./shaders/iridescence-frag.glsl'),
    side: THREE.DoubleSide
} );

////////////////////////////////////////////////////////////////////

// called after the scene loads
function onLoad(framework) {
    var scene = framework.scene;
    var camera = framework.camera;
    var renderer = framework.renderer;
    var gui = framework.gui;
    var stats = framework.stats;

    // Set light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.color.setHSL(0.1, 1, 0.95);
    directionalLight.position.set(2, 2, 2);
    directionalLight.position.multiplyScalar(10);
    scene.add(directionalLight);

    // set skybox
    var loader = new THREE.CubeTextureLoader();
    var urlPrefix = './images/skymap/';
    /*
    var skymap = new THREE.CubeTextureLoader().load([
        urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
        urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
        urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
    ] );
    */
    var skymap = new THREE.CubeTextureLoader().load([
        urlPrefix + 'grey.png', urlPrefix + 'grey.png',
        urlPrefix + 'grey.png', urlPrefix + 'grey.png',
        urlPrefix + 'grey.png', urlPrefix + 'grey.png'
    ] );
    scene.background = skymap;

    // set camera position
    camera.position.set(0, 50, 100);
    camera.lookAt(new THREE.Vector3(0,0,0));

    geometry1 = new THREE.PlaneGeometry(60, 60, 199, 199);
    plane1 = new THREE.Mesh(geometry1, shaderMaterial1);
    plane1.position.x = 60;
    rotateAroundObjectAxis(plane1, new THREE.Vector3(1,0,0), -Math.PI/2.0);
    scene.add(plane1);

    geometry2 = new THREE.PlaneGeometry(60, 60, 199, 199);
    plane2 = new THREE.Mesh(geometry2, shaderMaterial2);
    plane2.position.x = -60;
    rotateAroundObjectAxis(plane2, new THREE.Vector3(1,0,0), -Math.PI/2.0);
    scene.add(plane2);

    gui.add(sliders, 'lineThickness', 0.1, 0.5).onChange(function(newVal) {
        shaderMaterial1.uniforms[ 'lineThickness' ].value = newVal;
        shaderMaterial2.uniforms[ 'lineThickness' ].value = newVal;
    });
    gui.add(sliders, 'lineFrequency', 0.1, 0.8).onChange(function(newVal) {
        shaderMaterial1.uniforms[ 'lineFrequency' ].value = newVal;
        shaderMaterial2.uniforms[ 'lineFrequency' ].value = newVal;
    });
}

// Rotate an object around an arbitrary axis in object space
var rotObjectMatrix;
function rotateAroundObjectAxis(object, axis, radians) {
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
    object.matrix.multiply(rotObjectMatrix);
    object.rotation.setFromRotationMatrix(object.matrix);
}

// called on frame updates
function onUpdate(framework) {
    var zAxis = new THREE.Vector3(0,0,1);
    rotateAroundObjectAxis(plane1, zAxis, 0.005);
    rotateAroundObjectAxis(plane2, zAxis, 0.005);
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);

