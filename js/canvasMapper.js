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

function zipWith(f,a1,a2)
{
    var out = [];
    for(var i = 0; i < a1.length && i < a2.length; i++) {
        out.push(f(a1[i],a2[i]));
    }
    return out;
}

function zip(a1,a2)
{
    return zipWith(function(a,b){return new Tuple(a,b);},a1,a2);
}

function range(start,end,amount)
{
    var r = [];
    if(!valid(amount)) amount = 1;
    amount = start < end ? amount : -amount;
    if (start < end) {
        cmp = function(x,y){ return (x <= y); };
    }
    else {
        amount = -amount;
        cmp = function(x,y){ return (x >= y); };
    }
    for(var i = start; cmp(i,end); i += amount) {
        r.push(i);
    } return r;
}

function mapPure(data,f) {
    if(!valid(data) || !valid(f)) throw GOLException.InvalidParameterException;
    var tmp_ar = data.slice(0,data.length);
    return tmp_ar.map(f);
}

function Tuple(a,b)
{
    this.fst = a;
    this.snd = b;
    Tuple.prototype.toString = function() {return ("(" + this.fst + "," + this.snd + ")");}
}

function Canvas(mapImage,parentElem) {

    Canvas.FGColor   = "#000000";
    Canvas.BGColor   = "#FFFFFF";
    Canvas.GridColor = "#CCCCCC";
    Canvas.idIndex = 0;

    Canvas.prototype.nextID = function() {
    {
        return (Canvas.idIndex++);
    }

    Canvas.prototype.toString = function() {
        return ("<span class=NetworkMap><canvas width=" +
               this.width + " height="+this.height+" id='"+this.id+"'></canvas></span>");
    }

    Canvas.prototype.resize = function(x,y) {
        this.x = valid(x)?x:this.x;
        this.y = valid(y)?y:this.y;
    }

    Canvas.prototype.draw = function() {
        var ctx    = this.ctx;
        var width  = this.width;
        var height = this.height;

        var makeLine = function(startX,startY,endX,endY)
        {
            ctx.moveTo(startX,startY);
            ctx.lineTo(endX,endY);
            ctx.stroke();
        }

        this.elem.setAttribute("width",width + "px");
        this.elem.setAttribute("height",height + "px");

        this.ctx.fillStyle = Canvas.BGColor;
        this.ctx.fillRect(0,0,width,height);

        this.ctx.fillStyle = Canvas.FGColor;
        this.CA.activeCells().map(cellFunc);

        this.ctx.strokeStyle = Canvas.GridColor;
        range(0,width,cellGeometry.fst).map(function(x){makeLine(x,0,x,height);});
        range(0,height,cellGeometry.snd).map(function(y){makeLine(0,y,width,y);});

        this.CA.tick();
    }

    function addToDOM(obj)
    {
        obj.elem = document.createElement("canvas");
        obj.elem.setAttribute("id",obj.id);
        obj.parentObj.appendChild(obj.elem);
        obj.parentObj.style.width  = obj.width  + "px";
        obj.parentObj.style.height = obj.height + "px";
        obj.resize();
    }

    this.background_img     = new Image();
    this.background_img.src = "textures/map.png";
    this.width              = this.background_img.width;
    this.height             = this.background_img.height;
    this.id                 = ("canvas-"+Canvas.nextID());
    this.parentObj          = parentElem;
    this.elem               = null;
    addToDOM(this);
    this.ctx                = this.elem.getContext('2d');
}

function fetchParentElem(parentID)
{
    var canvasParent = null;
    if(valid(parentID)) {
        canvasParent = document.getElementById(parentID);
    }
    else {
        canvasParent = document.getElementsByTagName("body")[0];
    }
    if(!valid(canvasParent)) {
        throw GOLException.InvalidObjectException;
    }
    return canvasParent;
}

function init(img,parentID)
{
    var canvas = new Canvas(img,fetchParentElem(parentID));
    setInterval(function(){canvas.draw();},75);
}
