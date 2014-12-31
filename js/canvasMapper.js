var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var img = new Image();

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

function init(mapSource, parentID) {
    img.src = "textures/map.png";
    img.onload = function() {
        ctx.drawImage(this, 0, 0);
        texture.needsUpdate = true;
        canvas.width  = img.width;
        canvas.height = img.height;
    };
}
