var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75 // Field of View
                                        , window.innerWidth / window.innerHeight // Aspect Ratio
                                        , 0.1 // Near clipping plane
                                        , 1000 // Far clipping plane
                                        );

var light1 = new THREE.PointLight( 0x404040 // color
                                 , 5        // intensity
                                 , 100      // falloff distance
                                 );
light1.position.set(10,10,10);

var light2 = new THREE.PointLight(0x808080, 3, 100);
light2.position.set(10,-10,10);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


var lastX = null;
var lastY = null;

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var img = new Image();
// var material = new THREE.MeshBasicMaterial({color: 0xc2b280});
img.src = "textures/map.png";

img.onload = function() {
    ctx.drawImage(this, 0, 0);
     texture.needsUpdate = true;
     canvas.width  = img.width;
     canvas.height = img.height;
};

// var texture = THREE.ImageUtils.loadTexture("textures/map.png" , THREE.SphericalReflectionMapping);
// texture.needsUpdate = true;

/* Create a sphere (radius, width segments, height segments) */
// var geometry = new THREE.SphereGeometry(3,16,16);

var geometry = new THREE.PlaneGeometry(canvas.width, canvas.height);
var texture = new THREE.Texture(canvas);
// var texture = new THREE.Texture(canvas, THREE.SphericalReflectionMapping);
// var texture = THREE.ImageUtils.loadTexture("textures/map.png" , THREE.SphericalReflectionMapping);
texture.needsUpdate = true;
var material = new THREE.MeshBasicMaterial({map: texture});
var cube = new THREE.Mesh(geometry , material);
scene.add(cube);
scene.add(light1);
scene.add(light2);
camera.position.z = canvas.width;

function getStep(cur,last) {
    return (last - cur) / 100;
}

document.onmousedown = function(d) {
    document.onmousemove = function(e) {
        e = e || event;
        lastX = lastX || e.pageX;
        lastY = lastY || e.pageY;
        cube.rotation.y += getStep(lastX,e.pageX);
        lastX = e.pageX;
        cube.rotation.x += getStep(lastY,e.pageY);
        lastY = e.pageY;
        requestAnimationFrame(render);
    };
}

document.onmouseup = function() {
    document.onmousemove = null;
    lastX = null;
    lastY = null;
}

function Projection() {
    Projection.prototype.spherical =
        function(latitude, longitude, standardParallels) {
            /* Check to see if we recieved a JSON object instead
             * of an expanded parameter list */
            if(latitude.latitude && latitude.longitude) {
                l = latitude.longitude;
            }
            return {x: (longitude * Math.cos(standardParallels)), y: latitude};
    }
    Projection.prototype.plateCarree =
        function(latitude,longitude) {
            return {x: longitude, y: latitude};
    }
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene,camera);
}

function drawPoint(latitude,longitude,radius,color) {
    proj = Projection.plateCarree(latitude,longitude);
}

render();
