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

/* Create a cube */
var geometry = new THREE.SphereGeometry( 3  // radius
                                       , 32 // width segments
                                       , 32 // height segments
                                       );

var material = new THREE.MeshLambertMaterial({color: 0xc2b280});
var texture = THREE.ImageUtils.loadTexture( "textures/map.png"
                                          , THREE.SphericalReflectionMapping
                                          );
material.map = texture;
var cube = new THREE.Mesh( geometry
                         , material
                         );
scene.add(cube);
scene.add(light1);
scene.add(light2);
camera.position.z = 5;

function render() {
    requestAnimationFrame(render);
    renderer.render(scene,camera);
    cube.rotation.x += 0.003;
    cube.rotation.y += 0.003;
}

render();
