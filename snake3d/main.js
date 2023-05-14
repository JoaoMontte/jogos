const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const canvas2 = document.getElementById("canvas2")
const ctx2 = canvas2.getContext("2d")

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

var corpo = new Image()
corpo.src = "corpo.png"
corpo.crossOrigin = "Anonymous";
corpo.onload = () => {
    ctx.drawImage(corpo, 0, 0, corpo.width, corpo.height)
    corpoData = ctx.getImageData(0, 0, corpo.width, corpo.height).data
}

var trollData
var trollface = new Image()
trollface.src = "parede.png"
trollface.crossOrigin = "Anonymous";
trollface.onload = () => {
    ctx.drawImage(trollface, 0, 0, trollface.width, trollface.height)
    trollData = ctx.getImageData(0, 0, trollface.width, trollface.height).data
}

var up = down = left = right = front = back = strokel = stroker = false

//mapa
var map =
            [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
var tile = 64
var mapylength = map.length
var mapxlength = map[0].length
var mapheight = map.length * tile
var mapwidth = map[0].length * tile
var meio = Math.floor(canvas.height/2)

//player
var px = py = 100
var pa = 0
var pheight = 32
var fov = Math.PI / 3
var ra = pa
var distproj = (canvas.width/2) / Math.tan(fov/2)
var pvel = 5
var direita = esquerda = false
var move = false
var cena = "jogo"
var gameoverx = 0
var gameovery = 0
var gameovervel = 10

function fixAngle(angle){
    if(angle < 0) angle+=Math.PI*2
    else if(angle > Math.PI * 2) angle -= Math.PI * 2
    return angle
}

var fx = Math.floor(Math.random() * (map[0].length - 2)) + 1
var fy = Math.floor(Math.random() * (map.length - 2)) + 1
map[fy][fx] = 2
var t = 60

class Snake{
    constructor() {
        this.x = Math.floor(map[0].length/2)
        this.y = Math.floor(map.length/2)
        this.direcoes = [[1, 0], [0, 1], [-1, 0], [0, -1]]
        this.agora = 0
        this.dir = this.direcoes[this.agora]
        this.tamanho = 2
        this.tailx = [this.x - 1, this.x - 2]
        this.taily = [this.y, this.y]
        this.ponto = 0
        this.targetAngle = pa
    }
    update(){
        t--
        if (t <= 30){
            //input
            if(left == true && this.dir != [1, 0]){
                this.agora--
                if(this.agora < 0) this.agora +=4
                this.dir = this.direcoes[this.agora]
                this.targetAngle = fixAngle(pa + Math.PI/2)
                esquerda = true
                move = true
            }
            else if(right == true && this.dir != [-1, 0]){
                this.agora++
                if(this.agora > 3) this.agora -= 4
                this.dir = this.direcoes[this.agora]
                this.targetAngle = fixAngle(pa - Math.PI/2)
                direita = true
                move = true
            }
            up = down = left = right = false

            t = fps
            map[this.taily[this.tamanho-1]][this.tailx[this.tamanho-1]] = 0
            if(this.tamanho > 0) {
                for (var i = this.tamanho; i >= 0; i--) {
                    this.tailx[i] = this.tailx[i -1]
                    this.taily[i] = this.taily[i -1]
                    if(i == 0) {
                        this.tailx[i] = this.x
                        this.taily[i] = this.y
                    }
                }
            }

            move = true
            this.x += this.dir[0]
            this.y += this.dir[1]
            if(this.x == fx && this.y == fy){
                map[fy][fx] = 0
                fx = Math.floor(Math.random() * (map[0].length - 2)) + 1
                fy = Math.floor(Math.random() * (map.length - 2)) + 1
                map[fy][fx] = 2
                this.ponto++
                this.tamanho++
                this.tailx.push(this.x)
                this.taily.push(this.y)
            }
            if(this.x < 1 || this.y < 1 || this.x > map[0].length - 2 || this.y > map.length - 2){
                cena = "gameover"
            }
            for(var i = 0; i < this.tamanho; i++){
                if(this.x == this.tailx[i] && this.y == this.taily[i]){
                    cena = "gameover"
                }
            }
        }
    }
    draw() {
        ctx.fillRect(this.x, this.y, gridx, gridy)
        if (this.tamanho > 0) {
            for (var i = 0; i < this.tamanho; i++) {
                ctx.fillRect(this.tailx[i], this.taily[i], gridx, gridy)
            }
        }
    }
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

function drawWall(x, y, width, altura, offset, hipo){
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
        var luz = 1
        var red = Math.floor(wallData[source]*luz);
        var green = Math.floor(wallData[source + 1]*luz);
        var blue = Math.floor(wallData[source + 2]*luz);
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
                    case 3:
                        data1 = corpoData
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
                    case 3:
                        data2 = corpoData
                        break;
                }
            }
            else{
                rx += xo; ry += yo; dof++
            }
        }

        var hipo2 = Math.sqrt((rx-px)**2 + (ry-py)**2)
        if(hipo1 < hipo2){ var hipo = hipo1; var offset = rx1 % tile; wallData = data1}
        else if(hipo2 < hipo1){ var hipo = hipo2; var offset = ry % tile; wallData = data2 }

        hipo = hipo * Math.cos(fixAngle(pa-ra))

        var altura = (tile/hipo) * distproj

        //parede
        drawWall(row, meio - Math.floor(altura/2), 1, ((meio + Math.floor(altura/2) - (meio - Math.floor(altura/2)))) + 1, offset, rx, ry, hipo)

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
                    var brighnessLevel=(200/diagonalDistance);
                    var red=Math.floor(imageData[sourceIndex]*brighnessLevel);
                    var green=Math.floor(imageData[sourceIndex+1]*brighnessLevel);
                    var blue=Math.floor(imageData[sourceIndex+2]*brighnessLevel);
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
function main(){
    if(cena == "jogo") {

        requestAnimFrame()
        for (var y = 0; y < canvas.width * meio * 4; y += 4) {
            offscreenCanvasPixels.data[y] = 100
            offscreenCanvasPixels.data[y + 1] = 100
            offscreenCanvasPixels.data[y + 2] = 255
            offscreenCanvasPixels.data[y + 3] = 255
        }
        if (direita == false && esquerda == false && move == false) s.update()
        if (direita == true) pa = fixAngle(pa - (Math.PI / 2 / 10))
        if (pa - (Math.PI / 2 / 10) < s.targetAngle && pa + (Math.PI / 2 / 10) > s.targetAngle) {
            direita = false
            pa = s.targetAngle
        }
        if (esquerda == true) pa = fixAngle(pa + (Math.PI / 2 / 30))
        if (pa + (Math.PI / 2 / 10) > s.targetAngle && pa - (Math.PI / 2 / 10) < s.targetAngle) {
            esquerda = false
            pa = s.targetAngle
        }
        if (move == true) {
            px += s.dir[0] * 10
            py += s.dir[1] * 10
        }
        if (Math.floor(px / tile) == s.x && Math.floor(py / tile) == s.y) move = false


        Ray()
        ctx.putImageData(offscreenCanvasPixels, 0, 0);

        ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[0].length; x++) {
                if (map[y][x] == 1) {
                    ctx2.fillStyle = "black"
                    ctx2.fillRect(x * (canvas2.width / map[0].length), y * (canvas2.height / map.length), canvas2.width / map[0].length, canvas2.height / map.length)
                }
                if (map[y][x] == 2) {
                    ctx2.fillStyle = "red"
                    ctx2.fillRect(x * (canvas2.width / map[0].length), y * (canvas2.height / map.length), canvas2.width / map[0].length, canvas2.height / map.length)
                }

            }
        }
        ctx2.fillStyle = "green"
        ctx2.fillRect(s.x * (canvas2.width / map[0].length), s.y * (canvas2.height / map.length), canvas2.width / map[0].length, canvas2.height / map.length)
        for (var y = 0; y < s.tamanho; y++) {
            map[s.taily[y]][s.tailx[y]] = 3
            ctx2.fillRect(s.tailx[y] * (canvas2.width / map[0].length), s.taily[y] * (canvas2.height / map.length), canvas2.width / map[0].length, canvas2.height / map.length)
        }

        ctx.font = "12px Arial"
        ctx.fillText("fps: " + Math.floor(fps), 0, 12)
        ctx.fillText("pontos:" + s.ponto, canvas.width / 2, 12)
    }
    if(cena == "gameover") {
        ctx.fillStyle = "white"
        ctx.fillRect(gameoverx, gameovery, 10, 10)
        gameovery += gameovervel
        if(gameovery > canvas.height || gameovery < 0){
            gameoverx += 10
            gameovervel = -gameovervel
        }
        ctx.fillStyle = "red"
        ctx.font = "30px Arial";
        ctx.textAlign = "center"
        ctx.fillText("PERDEU OTARIO", canvas.width / 2, canvas.height / 2)

        ctx.fillRect(150, 300, 200, 70)
        ctx.fillStyle = "black"
        ctx.font = "24px Arial";
        ctx.fillText("reinicia o site", canvas.width/2, canvas.height/2 + 50)
        ctx.fillText("pontos:" + s.ponto, canvas.width / 2, 24)
    }
}
const s = new Snake()
px = (s.x * tile) + (tile/2)
py = (s.y * tile) + (tile/2)
function input(e){
    if (e.key == "a"){
        left = true
    }
    if (e.key == "d"){
        right = true
    }
}
function toca(event){
    var x = event.targetTouches[0].pageX
    var y = event.targetTouches[0].pageY
    if(X > canvas.width/2) {
        right = true
    }
    else if (x < canvas.width/2){
        left = true
    }
}
window.addEventListener("keydown", input, false)
canvas.addEventListener("touchstart", toca, {passive: false})
setInterval(main, 10)
