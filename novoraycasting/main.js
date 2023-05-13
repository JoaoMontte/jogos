const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const offscreenCanvas = document.createElement('canvas')
offscreenCanvas.width = canvas.width
offscreenCanvas.height = canvas.height
const offscreenCanvasContext = offscreenCanvas.getContext('2d')
const offscreenCanvasPixels =  offscreenCanvasContext.getImageData(0,0,canvas.width, canvas.height)

var imageData = undefined
var wallData = undefined
var brickData
var wall = new Image()
wall.src = "bricks.png"
wall.crossOrigin = "Anonymous";
wall.onload = () => {
    ctx.drawImage(wall, 0, 0, wall.width, wall.height)
    brickData = ctx.getImageData(0, 0, wall.width, wall.height).data
}

var floor = new Image()
floor.src = "grass1.png"
floor.crossOrigin = "Anonymous";
floor.onload = () => {
    ctx.drawImage(floor, 0, 0, floor.width, floor.height)
    imageData = ctx.getImageData(0, 0, floor.width, floor.height).data
}

var trollData
var trollface = new Image()
trollface.src = "parede.png"
trollface.crossOrigin = "Anonymous";
trollface.onload = () => {
    ctx.drawImage(trollface, 0, 0, trollface.width, trollface.height)
    trollData = ctx.getImageData(0, 0, trollface.width, trollface.height).data
}

window.addEventListener("keydown", input)
window.addEventListener("keyup", inputou)

var up = down = left = right = front = back = strokel = stroker = false

//mapa
var map =
        [[0, 1, 1, 1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 2, 2, 2, 0, 1],
        [1, 0, 2, 0, 0, 2, 0, 1],
        [1, 0, 2, 0, 0, 2, 0, 1],
        [1, 0, 2, 2, 0, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 1, 1, 1, 1, 1, 0]]
var tile = 64
var mapylength = map.length
var mapxlength = map[0].length
var mapheight = map.length * tile
var mapwidth = map[0].length * tile
var meio = Math.floor(canvas.height/2)

//player
var px = py = 100
var pa = 3 * Math.PI / 2
var pheight = 32
var fov = Math.PI / 3
var ra = pa
var distproj = (canvas.width/2) / Math.tan(fov/2)
var pvel = 5

function fixAngle(angle){
    if(angle < 0) angle+=Math.PI*2
    else if(angle > Math.PI * 2) angle -= Math.PI * 2
    return angle
}

function input(e){
    if(e.key == "w")front = true
    if(e.key == "s")back = true
    if(e.key == "a")strokel = true
    if(e.key == "d")stroker = true
    if(e.keyCode == 37) left = true
    if(e.keyCode == 39) right = true
    if(e.keyCode == 38) up = true
    if(e.keyCode == 40) down = true
}

function inputou(e){
    if(e.key == "w")front = false
    if(e.key == "s")back = false
    if(e.key == "a")strokel = false
    if(e.key == "d")stroker = false
    if(e.keyCode == 37) left = false
    if(e.keyCode == 39) right = false
    if(e.keyCode == 38) up = false
    if(e.keyCode == 40) down = false
}

var lastCalledTime;
var fps;

function requestAnimFrame() {

    if(!lastCalledTime) {
        lastCalledTime = Date.now();
        fps = 0;
        return;
    }
    delta = (Date.now() - lastCalledTime)/1000;
    lastCalledTime = Date.now();
    fps = 1/delta;
}

function drawWall(x, y, width, altura, offset){
    //parede
    //ctx.drawImage(wall, Math.floor(offset*(wall.width/tile)), 0, 1, wall.height, row, (meio) - (altura/2), 1, altura)
    if(wallData == undefined) return;
    var source = 4*Math.floor(offset)
    var lastSourceIndex=source+(wall.width*wall.height*4);
    var targetIndex=(offscreenCanvasPixels.width*4)*y+(4*x);
    var heightToDraw = altura;
    // clip bottom
    if (y+heightToDraw>offscreenCanvasPixels.height)
        heightToDraw=offscreenCanvasPixels.height-(y);
    var yError = 0
    if (heightToDraw<0)
        return;
    while(true) {
        yError += altura
        var red = Math.floor(wallData[source]);
        var green = Math.floor(wallData[source + 1]);
        var blue = Math.floor(wallData[source + 2]);
        var alpha = Math.floor(wallData[source + 3]);
        while(yError>=wall.width) {
            yError -= wall.width
            if(targetIndex>=0 && targetIndex <= canvas.width*canvas.height*4) {
                offscreenCanvasPixels.data[targetIndex] = red;
                offscreenCanvasPixels.data[targetIndex + 1] = green;
                offscreenCanvasPixels.data[targetIndex + 2] = blue;
                offscreenCanvasPixels.data[targetIndex + 3] = alpha
            }
            targetIndex += (4 * offscreenCanvasPixels.width)
            heightToDraw--;
            if (heightToDraw<1)
                return;
        }
        source += Math.floor((4 * wall.width))
        if (source>lastSourceIndex)
            source=lastSourceIndex;
    }
}

function Ray(){
    if(brickData==undefined || trollData==undefined) return;
    var data1, data2
    var rx, ry, xo, yo, dof, tan = 0
    ra = fixAngle(pa + (fov/2))

    for(var row = 0; row < canvas.width; row++){
        rx = ry = xo = yo = dof = tan = 0
        dof = 0
        tan = Math.tan(ra)
        ry = py - Math.floor(py%tile) -1; yo = -tile;

        if(ra > Math.PI && ra < Math.PI * 2){
            ry += tile + 1; yo = tile
        }
        rx =(py-ry) * (1/tan) + px; xo = -yo*(1/tan)
        if(ra==0 || ra==Math.PI){
            rx = px; ry = py; dof = map.length
        }
        while(dof < map.length){
            if(rx >= 0 && ry >= 0 && rx <= mapwidth && ry <= mapheight && map[Math.floor(ry/tile)][Math.floor(rx/tile)] > 0){
                dof = map.length
                switch(map[Math.floor(ry/tile)][Math.floor(rx/tile)]){
                    case 1:
                        data1 = brickData
                        break;
                    case 2:
                        data1 = trollData
                        break;
                }
            }
            else{
                rx += xo; ry += yo; dof++
            }
        }
        var rx1 = rx
        var ry1 = ry
        var hipo1 = Math.sqrt((rx-px)**2 + (ry-py)**2)

        dof = 0
        rx = Math.floor(px/tile)*tile - 1; xo = -tile
        if(ra < Math.PI/2 || ra > 3*Math.PI / 2){
            rx += tile + 1; xo = tile
        }
        if(ra == Math.PI/2 || ra == 3*Math.PI / 2){
            rx = px; ry = py; dof = map.length
        }
        ry = py + (px-rx) * tan; yo = -xo*tan
        while(dof < map.length){
            if(rx>=0 && ry>=0 && rx<=mapwidth && ry<=mapheight && map[Math.floor(ry/tile)][Math.floor(rx/tile)] > 0){
                dof = map.length
                switch(map[Math.floor(ry/tile)][Math.floor(rx/tile)]){
                    case 1:
                        data2 = brickData
                        break;
                    case 2:
                        data2 = trollData
                        break;
                }
            }
            else{
                rx += xo; ry += yo; dof++
            }
        }

        var hipo2 = Math.sqrt((rx-px)**2 + (ry-py)**2)
        if(hipo1 < hipo2){ var hipo = hipo1; var offset = rx1 % tile; var brighnessLevel = meio; wallData = data1}
        else if(hipo2 < hipo1){ var hipo = hipo2; var offset = ry % tile; var brighnessLevel = meio; wallData = data2 }

        hipo = hipo * Math.cos(fixAngle(pa-ra))

        var altura = (tile/hipo) * distproj

        //parede
        drawWall(row, meio - Math.floor(altura/2), 1, ((meio + Math.floor(altura/2) - (meio - Math.floor(altura/2)))) + 1, offset, rx, ry)

        //chao
        if(imageData != undefined){
            var baixo = Math.floor(meio)+Math.floor(altura/2)
            var targetIndex=baixo*(canvas.width*4)+(4*row);
            for(var i = baixo; i < canvas.height; i++){
                var diagonalDistance=Math.floor((distproj*(pheight)/(i-(meio))))

                var yEnd = py - (Math.floor(diagonalDistance * Math.sin(ra)))
                var xEnd = px + (Math.floor(diagonalDistance * Math.cos(ra)))
                var cellX = Math.floor(xEnd / tile);
                var cellY = Math.floor(yEnd / tile);
                if ((cellX<map[0].length) &&
                    (cellY<map.length) &&
                    cellX>=0 && cellY>=0)
                {
                    var tileRow = Math.floor(yEnd % tile);
                    var tileColumn = Math.floor(xEnd % tile) ;
                    var sourceIndex=(tileRow*floor.width*4)+(4*tileColumn)
                    var red=Math.floor(imageData[sourceIndex]);
                    var green=Math.floor(imageData[sourceIndex+1]);
                    var blue=Math.floor(imageData[sourceIndex+2]);
                    var alpha=Math.floor(imageData[sourceIndex+3]);

                    offscreenCanvasPixels.data[targetIndex] = red;
                    offscreenCanvasPixels.data[targetIndex+1] = green;
                    offscreenCanvasPixels.data[targetIndex+2] = blue;
                    offscreenCanvasPixels.data[targetIndex+3] = alpha;
                    // Go to the next pixel (directly under the current pixel)
                    targetIndex+=4*canvas.width;
                    //ctx.fillStyle = "rgba("+red+", "+green+", "+blue+", "+alpha+")"
                    //ctx.fillRect(row, i, 1, 1)
                }
            }
        }

        ra = fixAngle(ra - (fov/canvas.width))

    }
}

function move(){
    if(front){
        if(map[Math.floor((py-(Math.sin(pa) * pvel * 7)) / tile)][Math.floor((px) / tile)] == 0){
            py -= Math.sin(pa) * pvel
        }
        if(map[Math.floor((py) / tile)][Math.floor((px+(Math.cos(pa) * pvel * 7)) / tile)] == 0){
            px += Math.cos(pa) * pvel
        }
    }
    if(back){
        if(map[Math.floor((py+(Math.sin(pa) * pvel * 2)) / tile)][Math.floor((px) / tile)] == 0){
            py += Math.sin(pa) * pvel
        }
        if(map[Math.floor((py) / tile)][Math.floor((px-(Math.cos(pa) * pvel * 2)) / tile)] == 0){
            px -= Math.cos(pa) * pvel
        }
    }
    if(strokel){
        var ca = fixAngle(pa-(Math.PI/2))
        if(map[Math.floor((py+(Math.sin(ca) * pvel * 4)) / tile)][Math.floor((px) / tile)] == 0){
            py += Math.sin(ca) * pvel
        }
        if(map[Math.floor((py) / tile)][Math.floor((px-(Math.cos(ca) * pvel * 4)) / tile)] == 0){
            px -= Math.cos(ca) * pvel
        }
    }
    if(stroker){
        var ca = fixAngle(pa+(Math.PI/2))
        if(map[Math.floor((py+(Math.sin(ca) * pvel * 4)) / tile)][Math.floor((px) / tile)] == 0){
            py += Math.sin(ca) * pvel
        }
        if(map[Math.floor((py) / tile)][Math.floor((px-(Math.cos(ca) * pvel * 4)) / tile)] == 0){
            px -= Math.cos(ca) * pvel
        }
    }
    if(left) pa = fixAngle(pa+0.1)
    if(right) pa = fixAngle(pa-0.1)
    if(up) {meio += 20}
    if(down) meio -= 20
}
function main(){
    requestAnimFrame()

    move()

    for(var y = 0; y < canvas.width*meio*4; y+= 4){
        offscreenCanvasPixels.data[y+3] = 0
    }
    Ray()
    ctx.putImageData(offscreenCanvasPixels, 0, 0);

    ctx.font = "12px Arial"
    ctx.fillText("fps: "+Math.floor(fps), 0, 12)
}

setInterval(main, 10)