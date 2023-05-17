const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d"); ctx.imageSmoothingEnabled = false;
const wall = new Image(); wall.src = "png/BRICK_1A.png"; const troll = new Image(); troll.src = "png/Trollface.png"
var map = [[1, 1, 1, 1, 1, 1, 1, 1], 
[1, 0, 1, 0, 0, 0, 0, 1], 
[1, 0, 1, 0, 1, 0, 0, 1], 
[1, 0, 1, 0, 1, 1, 0, 1], 
[1, 0, 0, 0, 1, 0, 0, 1],
[1, 0, 1, 0, 1, 0, 0, 1], 
[1, 0, 0, 1, 1, 0, 0, 1], 
[1, 1, 1, 1, 1, 1, 1, 1]]
var tile = 64; var meio = canvas.height/2; var px = py = 100; var pi = Math.PI; var fov = pi / 3; var rx = ry = ra = pa = 0; var pvel = 3
var front = back = left = right = left1 = right1 = up = down = false; 
var spriteX = [415]; var spriteY = [415];
var lockado = false
//movimentação
function fixAngle(a) {if(a < 0) a += pi*2; if(a > pi*2) a -= pi*2; return a;}
function inputa(e){if(e.key == "w") front = true; if(e.key == "a") left1 = true; if(e.key == "d") right1 = true; if(e.key == "s") back = true; if(e.keyCode == 37) left = true; if(e.keyCode == 39) right = true; if(e.keyCode == 38) down = true; if(e.keyCode == 40) up = true}
function inputou(e){if(e.key == "w") front = false; if(e.key == "a") left1 = false; if(e.key == "d") right1 = false; if(e.key == "s") back = false; if(e.keyCode == 37) left = false; if(e.keyCode == 39) right = false; if(e.keyCode == 38) down = false; if(e.keyCode == 40) up = false}
function input(){if(front){move(pa, 5)}; if(back){move(fixAngle(pa + pi), 1)}; if(left1){move(fixAngle(pa + pi/2), 3)} if(right1){move(fixAngle(pa - pi/2), 3)}
if(left)pa = fixAngle(pa + fov/canvas.width * 30); else if(right)pa = fixAngle(pa - fov/canvas.width * 30); if(up)meio--; if(down)meio++}
function move(angulo, distancia){if(map[Math.floor(py/tile)][Math.floor((px+Math.cos(angulo)*pvel*distancia)/tile)] == 0)px += Math.cos(angulo) * pvel;
if(map[Math.floor((py-Math.sin(angulo)*pvel*distancia)/tile)][Math.floor((px)/tile)] == 0) py -= Math.sin(angulo) * pvel}
function mouse(e){if(lockado){pa = fixAngle(pa - e.movementX/500); meio -= e.movementY}}
//raycasting
function main(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    input(); 
    ra = fixAngle(pa + (fov/2)); 
    var distancia = []
    for(var i = 0; i < canvas.width; i++){
        rx = px; ry = py; 
        while(map[Math.floor(ry/tile)][Math.floor(rx/tile)] == 0) {rx += Math.cos(ra); ry -= Math.sin(ra)}
        distancia.push(Math.sqrt((rx-px)**2 + (ry-py)**2) * Math.cos(fixAngle(pa - ra))); 
        var altura = (tile/distancia[i]) * 255
        if(Math.ceil(rx) % tile < Math.ceil(ry) % tile) var offset = Math.ceil(ry) % tile; else var offset = Math.ceil(rx) % tile
        ctx.drawImage(wall, offset, 0, 1, wall.height, i, meio-(altura/2), 1, altura)
        var brilho = distancia[i]/500; ctx.fillStyle = "rgba(0, 0, 0, "+brilho+")"; ctx.fillRect(i, meio-(altura/2), 1, altura); 
        //aumenta angulo
        ra = fixAngle(ra - fov/canvas.width)
    }
        //calculo pro sprite
        var angulo = fixAngle(fixAngle(Math.atan2((spriteY[0]-py+0.5), (spriteX[0]-px+0.5))) + fixAngle(pa + fov/2))
        var distanciasprite = Math.sqrt(Math.pow(px - spriteX[0], 2) + Math.pow(py - spriteY[0], 2)); 
        var spritealtura = Math.floor((64/distanciasprite)*255)
        var lugar = Math.floor(((angulo * canvas.width) / fov) - spritealtura/2); if(lugar > canvas.width*5){lugar %= canvas.width; lugar -= canvas.width}
        for(var i = 0; i < spritealtura; i++){
            if(distancia[lugar + i] > distanciasprite) ctx.drawImage(troll, i/spritealtura*64, 0, 1, troll.height, lugar + i, meio-(spritealtura/2), 1, spritealtura)
        }
    }
canvas.addEventListener("click", async () => {await canvas.requestPointerLock(); lockado = true}); canvas.addEventListener("mousemove", mouse, false)
window.addEventListener("keydown", inputa); window.addEventListener("keyup", inputou); setInterval(main, 30)