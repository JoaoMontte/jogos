const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

var map =
[[[1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1], 
[1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1], 
[1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1]],
[[1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 0, 1, 1, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 1, 1],
[1, 1, 0, 0, 0, 0, 0, 1],
[1, 0, 1, 1, 1, 0, 1, 1], 
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 1, 1, 1, 1, 1, 1, 1]],
[[1, 1, 1, 1, 1, 1, 1, 1],
[1, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 1, 1, 1, 1, 1, 1, 1]],
[[1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1], 
[1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 0, 1, 1, 1],
[1, 1, 1, 1, 0, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1], 
[1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1]]]
const tile = 64

var player = {
    x: 200,
    y: 200,
    z: 96+64,
    a1: 0,
    a2: 0,
    fov1: Math.PI/2,
    fov2: Math.PI*0.4,
    speed: 5,
    turn: 0.1
}

var raio = {
    x: player.x,
    y: player.y,
    z: player.z,
    a1: player.a1,
    a2: player.a2
}

var light = {
    x: 300,
    y: 200,
    z: 64,
    rx: 0,
    ry: 0,
    rz: 0
}
var distancia = 0
var walk = right = left = lockado = false
function fixAngle(a){if(a<0)a+=Math.PI*2; if(a>Math.PI*2)a-=Math.PI*2; return a}
function tecla(e){
    if(e.key == "w") walk = true
    //if(e.key == "a") left = true
    //if(e.key == "d") right = true
}
function teclou(e){
    if(e.key == "w") walk = false
    //if(e.key == "a") left = false
    //if(e.key == "d") right = false
}
function mouse(e){if(lockado){player.a1 = fixAngle(player.a1 - e.movementX/500); player.a2 = fixAngle(player.a2 - e.movementY/500)}}
function clica(e){
    raio.x = player.x
    raio.y = player.y
    raio.z = player.z
    while(map[Math.floor(raio.z/tile)][Math.floor(raio.y/tile)][Math.floor(raio.x/tile)] == 0){
        raio.x += Math.cos(player.a1)
        raio.y -= Math.sin(player.a1)
        raio.z -= Math.tan(player.a2)
    }
    map[Math.floor(raio.z/tile)][Math.floor(raio.y/tile)][Math.floor(raio.x/tile)] = 0
}
function main(){
    //player.a1 = fixAngle(player.a1 - 0.1)
    //player.a2 = fixAngle(player.a2 + 0.1)
    //player.z -= 1
    //player.x += Math.cos(player.a1) * 5
    //player.y -= Math.sin(player.a1) * 5
    //light.x+=10
    
    if(walk){
        player.x += Math.cos(player.a1) * player.speed
        player.y -= Math.sin(player.a1) * player.speed
    }
    raio.x = player.x
    raio.y = player.y
    raio.z = player.z
    raio.a1 = fixAngle(player.a1 + player.fov1 / 2)
    raio.a2 = fixAngle(player.a2 + player.fov2 / 2)
    for(var y = 0; y < canvas.height; y++){
        for(var x = 0; x < canvas.width; x++){
            raio.x = player.x
            raio.y = player.y
            raio.z = player.z
            while(map[Math.floor(raio.z/tile)][Math.floor(raio.y/tile)][Math.floor(raio.x/tile)] == 0){
                if(raio.a2 > Math.PI/2 && raio.a2 < 3*Math.PI/2){
                    raio.x -= Math.cos(raio.a1)
                    raio.y += Math.sin(raio.a1)
                    raio.z += Math.tan(fixAngle(raio.a2-Math.PI))
                }
                else{
                    raio.x += Math.cos(raio.a1)
                    raio.y -= Math.sin(raio.a1)
                    raio.z -= Math.tan(raio.a2)
                }
                if((raio.z+2)/tile>map.length) raio.z = 1;
                if(raio.z<1) raio.z = 255
                //distancia = Math.sqrt((raio.x-player.x)**2 + (raio.y-player.y)**2)
            }
            //distancia = Math.sqrt((raio.x-player.x)**2 + (raio.y-player.y)**2)/1.5
            //distancia *= Math.cos(fixAngle(player.a1-raio.a1))
            distancia  = Math.sqrt((raio.x-light.x)**2 + (raio.y-light.y)**2)
            distancia = Math.sqrt(distancia**2 + (raio.z-light.z)**2) 
            if(distancia>255) distancia = 255
            distancia = 255-distancia
            ctx.fillStyle = "rgb("+distancia+", "+distancia+", "+distancia+")"
            ctx.fillRect(x, y, 1, 1)
            raio.a1 = fixAngle(raio.a1 - (player.fov1/canvas.width))
        }
        raio.a1 = fixAngle(player.a1 + player.fov1 / 2)
        raio.a2 = fixAngle(raio.a2 - (player.fov2/canvas.height))
    }
    ctx.fillStyle = "red"
    ctx.fillRect(canvas.width/2, canvas.height/2, 1, 1)
}

window.addEventListener("keydown", tecla)
window.addEventListener("keyup", teclou)
canvas.addEventListener("click", async () => {await canvas.requestPointerLock(); lockado = true}); canvas.addEventListener("mousemove", mouse, false)
canvas.addEventListener("click", clica);

setInterval(main, 1000/60)