
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const Papa = require('papaparse');
import Framework from './framework'

//////////////////////////////////////////////////////////////////////

var cityToBoundary = new Map();
var promise1 = new Promise((resolve, reject) => { 
    cityToBoundary.set("New York City", [40.472818, -74.306861, 40.928760, -73.675888]);
    if (cityToBoundary.size == 1) {
        resolve();
    }
}); 

var cityToZip = new Map();
var promise2 = new Promise((resolve, reject) => { 
    cityToZip.set("New York City", [10001, 10002, 10003, 10004, 10005, 10006, 10007, 10009, 10010, 10011, 
                                    10012, 10013, 10014, 10016, 10017, 10018, 10019, 10020, 10021, 10022, 
                                    10023, 10024, 10025, 10026, 10027, 10028, 10029, 10030, 10031, 10032, 
                                    10033, 10034, 10035, 10036, 10037, 10038, 10039, 10040, 10044, 10065, 
                                    10069, 10075, 10103, 10110, 10111, 10112, 10115, 10119, 10128, 10152, 
                                    10153, 10154, 10162, 10165, 10167, 10168, 10169, 10170, 10171, 10172, 
                                    10173, 10174, 10177, 10199, 10271, 10278, 10279, 10280, 10282, 10301, 
                                    10302, 10303, 10304, 10305, 10306, 10307, 10308, 10309, 10310, 10311, 
                                    10312, 10314, 10451, 10452, 10453, 10454, 10455, 10456, 10457, 10458, 
                                    10459, 10460, 10461, 10462, 10463, 10464, 10465, 10466, 10467, 10468, 
                                    10469, 10470, 10471, 10472, 10473, 10474, 10475, 11001, 11003, 11004, 
                                    11005, 11040, 11101, 11102, 11103, 11104, 11105, 11106, 11109, 11201, 
                                    11203, 11204, 11205, 11206, 11207, 11208, 11209, 11210, 11211, 11212, 
                                    11213, 11214, 11215, 11216, 11217, 11218, 11219, 11220, 11221, 11222, 
                                    11223, 11224, 11225, 11226, 11228, 11229, 11230, 11231, 11232, 11233, 
                                    11234, 11235, 11236, 11237, 11238, 11239, 11351, 11354, 11355, 11356, 
                                    11357, 11358, 11359, 11360, 11361, 11362, 11363, 11364, 11365, 11366, 
                                    11367, 11368, 11369, 11370, 11371, 11372, 11373, 11374, 11375, 11377, 
                                    11378, 11379, 11385, 11411, 11412, 11413, 11414, 11415, 11416, 11417, 
                                    11418, 11419, 11420, 11421, 11422, 11423, 11424, 11425, 11426, 11427, 
                                    11428, 11429, 11430, 11432, 11433, 11434, 11435, 11436, 11451, 11691, 
                                    11692, 11693, 11694, 11697]);
    if (cityToZip.size == 1) {
        resolve();
    }
}); 

//http://stackoverflow.com/questions/31375531/how-to-use-promises-with-papaparse
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
Papa.parsePromise = function(file) {
  return new Promise(function(resolve, reject) {
    Papa.parse(file, { download: true, complete: resolve, error: reject });
  });
};

var maxIncome = 1.0;
var zipToIncome = new Map();
var promise3 = Papa.parsePromise("https://echiu1997.github.io/FNAR266-A06/data/zip_median-income.csv").then(
    function(results) { 
        //skip i = 0 because that is the column title
        for (var i = 1; i < results.data.length; i++) {
            //0 is zip, 1 is income
            zipToIncome.set(results.data[i][0], results.data[i][1]);
            if (parseInt(results.data[i][1]) > maxIncome) {
                maxIncome = parseInt(results.data[i][1]);
                console.log("maxIncome ZIP: " + results.data[i][0] + " is: " + maxIncome);
            }
        }
        console.log("final maxIncome: " + maxIncome);
    });

var zipToLocation = new Map();
var promise4 = Papa.parsePromise("https://echiu1997.github.io/FNAR266-A06/data/zip_lat_lng.csv").then(
    function(results) { 
        //skip i = 0 because that is the column title
        for (var i = 1; i < results.data.length; i++) {
            //0 is zip, 1 is lat, 2 is lng
            var location = [];
            location.push(results.data[i][1]);
            location.push(results.data[i][2]);
            zipToLocation.set(results.data[i][0], location);
        }
    });

var normalizedData = [];
Promise.all([promise1, promise2, promise3, promise4]).then(values => { 
    var latitudeStep = (planeRadius*2) / (cityToBoundary.get("New York City")[2] - cityToBoundary.get("New York City")[0]);
    var longitudeStep = (planeRadius*2) / (cityToBoundary.get("New York City")[3] - cityToBoundary.get("New York City")[1]);
    for (var i = 0; i < cityToZip.get("New York City").length; i++) {
        var zip = cityToZip.get("New York City")[i].toString();
        var zipLat = (zipToLocation.get(zip)[0] - cityToBoundary.get("New York City")[0]) * latitudeStep - planeRadius;
        var zipLng = (zipToLocation.get(zip)[1] - cityToBoundary.get("New York City")[1]) * longitudeStep - planeRadius;
        var zipIncome = parseInt(zipToIncome.get(zip))/maxIncome;
        //double check if any data is missing in one of the files
        if (!isNaN(zipLat) && !isNaN(zipLng) && !isNaN(zipIncome)) {
            //console.log(zip + ": " + zipLat + ", " + zipLng + ", " + zipIncome);
            normalizedData.push(new THREE.Vector3(zipLat, zipLng, zipIncome));
        }
    }
});

/*
var zipToIncome = new Map();
Papa.parse("https://echiu1997.github.io/FNAR266-A06/data/zip_median-income.csv", {
    download: true,
    complete: function(results) {
        //skip i = 0 because that is the column title
        for (var i = 1; i < results.data.length; i++) {
            //0 is zip, 1 is income
            zipToIncome.set(results.data[i][0], results.data[i][1]);
        }
    }
});

var zipToLocation = new Map();
Papa.parse("https://echiu1997.github.io/FNAR266-A06/data/zip_lat_lng.csv", {
    download: true,
    complete: function(results) {
        //skip i = 0 because that is the column title
        for (var i = 1; i < results.data.length; i++) {
            //0 is zip, 1 is lat, 2 is lng
            var location = [];
            location.push(results.data[i][1]);
            location.push(results.data[i][2]);
            zipToLocation.set(results.data[i][0], location);
        }
        //console.log(zipToLocation);
    }
});
*/

////////////////////////////////////////////////////////////////////////

var Sliders = function() {
    this.lineThickness = 0.3;
    this.lineFrequency = 0.6;
};
var sliders = new Sliders();

var startTime = Date.now();

var planeRadius = 30;
var geometry1 = new THREE.Geometry();
var plane1 = new THREE.Mesh();
var geometry2 = new THREE.Geometry();
var plane2 = new THREE.Mesh();

///////////////////////////////////////////////////////////////////////

// create the shader material      
var noiseMaterial1 = new THREE.ShaderMaterial( {
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
    vertexShader: require('./shaders/noise-vert.glsl'),
    fragmentShader: require('./shaders/noise-frag.glsl'),
    side: THREE.DoubleSide
} );

// create the shader material      
var noiseMaterial2 = new THREE.ShaderMaterial( {
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
    vertexShader: require('./shaders/noise-vert.glsl'),
    fragmentShader: require('./shaders/noise-frag.glsl'),
    side: THREE.DoubleSide
} );

/*
var latitudeStep = (planeRadius*2) / (cityToBoundary.get("New York City")[2] - cityToBoundary.get("New York City")[0]);
var longitudeStep = (planeRadius*2) / (cityToBoundary.get("New York City")[3] - cityToBoundary.get("New York City")[1]);
for (var i = 0; i < cityToZip.get("New York City").length; i++) {
    var zip = cityToZip.get("New York City")[i];
    var zipLat = (zipToLocation.get(zip)[0] - cityToBoundary.get("New York City")[0]) * latitudeStep - planeRadius;
    var zipLng = (zipToLocation.get(zip)[1] - cityToBoundary.get("New York City")[1]) * longitudeStep - planeRadius;
    console.log(zipLat + ", " + zipLng);
    normalizedData.push(new THREE.Vector3(zipLat, zipLng, zipToIncome.get(zip)));
}
*/

// create the shader material      
var dataMaterial1 = new THREE.ShaderMaterial( {
    uniforms: {
        // float initialized to 0
        time: { type: "f", value: 0.0 },
        // float initialized to 0
        freq: { type: "f", value: 0.0 },
        //float initialized to 25
        amp: { type: "f", value: 10.0 },

        lineThickness: { type: "f", value: 0.3},
        lineFrequency: { type: "f", value: 0.6},

        data: { type: "v3v", value: normalizedData}
    },
    vertexShader: require('./shaders/data-vert.glsl'),
    fragmentShader: require('./shaders/data-frag.glsl'),
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
    var skymap = new THREE.CubeTextureLoader().load([
        urlPrefix + 'grey.png', urlPrefix + 'grey.png',
        urlPrefix + 'grey.png', urlPrefix + 'grey.png',
        urlPrefix + 'grey.png', urlPrefix + 'grey.png'
    ] );
    scene.background = skymap;

    // set camera position
    camera.position.set(0, 50, 100);
    camera.lookAt(new THREE.Vector3(0,0,0));

    geometry1 = new THREE.PlaneGeometry(2*planeRadius, 2*planeRadius, 50, 50);
    plane1 = new THREE.Mesh(geometry1, dataMaterial1);
    plane1.position.x = 60;
    rotateAroundObjectAxis(plane1, new THREE.Vector3(1,0,0), -Math.PI/2.0);
    scene.add(plane1);

    geometry2 = new THREE.PlaneGeometry(2*planeRadius, 2*planeRadius, 50, 50);
    plane2 = new THREE.Mesh(geometry2, noiseMaterial2);
    plane2.position.x = -60;
    rotateAroundObjectAxis(plane2, new THREE.Vector3(1,0,0), -Math.PI/2.0);
    scene.add(plane2);

    gui.add(sliders, 'lineThickness', 0.1, 0.5).onChange(function(newVal) {
        dataMaterial1.uniforms[ 'lineThickness' ].value = newVal;
        noiseMaterial2.uniforms[ 'lineThickness' ].value = newVal;
    });
    gui.add(sliders, 'lineFrequency', 0.1, 0.8).onChange(function(newVal) {
        dataMaterial1.uniforms[ 'lineFrequency' ].value = newVal;
        noiseMaterial2.uniforms[ 'lineFrequency' ].value = newVal;
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

