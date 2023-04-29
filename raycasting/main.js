const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

//variaveis
var px = 250
var py = 250
var pa = 0

var map = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],]

var gridx = canvas.width / map[0].length
var gridy = canvas.height / map.length

var tamanhox = 10
var tamanhoy = 10

var up = down = left = right = troca = left1 = right1 = false

var raionumero = 100
var fov = Math.PI / 3
var renderdistance = 400

var cena = "3d"

window.addEventListener('keydown', function(e){
    if (e.key === "ArrowRight"){
        right = true
    }
    if (e.key === "ArrowLeft"){
        left = true
    }
    if (e.key == "w"){
        up = true
    }
    if (e.key == "s"){
        down = true
    }
    if(e.key =="m" && troca == false){
        if(cena == "2d"){
            cena = "3d"
        }
        else if(cena == "3d"){
            cena = "2d"
        }
        troca = true
    }
    if (e.key == "a"){
        left1 = true
    }
    if (e.key == "d"){
        right1 = true
    }
})
window.addEventListener('keyup', function(e){
    if (e.key === "ArrowRight"){
        right = false
    }
    if (e.key === "ArrowLeft"){
        left = false
    }
    if (e.key == "w"){
        up = false
    }
    if (e.key == "s"){
        down = false
    }
    if (e.key == "m"){
        troca = false
    }
    if (e.key == "a"){
        left1 = false
    }
    if (e.key == "d"){
        right1 = false
    }
})

function Input(){
    if(left == true){
        pa += 0.05
        if(pa >= Math.PI * 2){
            pa = 0
        }
    }
    if(right == true){
        pa -= 0.05
        if(pa <= 0){
            pa = Math.PI * 2
        }
    }
    if(up == true){
        px += Math.cos(pa)
        py -= Math.sin(pa)
        //floor arredonda pra baixo
        //ceil arredonda pra cima
        if(map[Math.floor((py) / gridy)][Math.floor((px) / gridx)] == 1){
            px -= Math.cos(pa)
            py += Math.sin(pa)
        }
    }
    if(down == true){
        px -= Math.cos(pa)
        py += Math.sin(pa)
        if(map[Math.floor((py) / gridy)][Math.floor((px) / gridx)] == 1){
            px += Math.cos(pa)
            py -= Math.sin(pa)
        }
    }
    if(left1 == true){
        var angle = pa - Math.PI / 2
        if(angle > Math.PI * 2){
            angle -= Math.PI * 2
        }
        px -= Math.cos(angle)
        py += Math.sin(angle)
    }
    if(right1 == true){
        var angle = pa - Math.PI / 2
        if(angle > Math.PI * 2){
            angle -= Math.PI * 2
        }
        px += Math.cos(angle)
        py -= Math.sin(angle)
    }
}

function drawMap(){
    for (var y = 0; y < map.length; y++){
        for(var x = 0; x < map[0].length; x++){
            if(map[y][x] == 1){
                ctx.fillRect(x * gridx + 1, y * gridy + 1, gridx - 2, gridy - 2)
            }
        }
    }
}

function Ray(){
    var ra = pa + (fov / 2)
    if (ra > Math.PI * 2) {
        ra -= Math.PI * 2
    }
    for(var i = 0; i < raionumero; i++) {
        var rn = 1
        var rx = px
        var ry = py
        var xo = yo = 0
        var dof = 0
        if (ra > 0 && ra < Math.PI) {
            ry = Math.floor(py / gridy) * gridy - 0.0001
            rx = px + (1 / Math.tan(ra)) * (py - ry)
            yo = -gridy
            xo = -yo * (1 / Math.tan(ra))
        } else if (ra > Math.PI && ra < Math.PI * 2) {
            ry = Math.ceil(py / gridy) * gridy
            rx = px + (1 / Math.tan(ra)) * (py - ry)
            yo = gridy
            xo = -yo * (1 / Math.tan(ra))
        } else if (ra == 0 || ra == Math.PI) {
            ry = py
            rx = px
            dof = map.length
        }
        while (dof < map.length) {
            if (ry >= 0 && rx >= 0 && ry / gridy < map.length && rx / gridx < map[0].length && map[Math.floor(ry / gridy)][Math.floor(rx / gridx)] == 1) {
                dof = map.length
            } else {
                rx += xo
                ry += yo
                dof++
            }
        }

        var rx1 = rx
        var ry1 = ry

        dof = 0

        if (ra > 3 * Math.PI / 2 || ra < Math.PI / 2) {
            rx = Math.ceil(px / gridx) * gridx
            ry = py + (Math.tan(ra) * (px - rx))
            xo = gridx
            yo = -xo * (Math.tan(ra))
        } else if (ra > Math.PI / 2 && ra < 3 * Math.PI / 2) {
            rx = Math.floor(px / gridx) * gridx - 0.0001
            ry = py + (Math.tan(ra) * (px - rx))
            xo = -gridx
            yo = -xo * (Math.tan(ra))
        } else if (ra == Math.PI / 2 || ra == 3 * Math.PI / 2) {
            rx = px
            ry = py
            dof = map.length
        }
        while (dof < map.length) {
            if (ry >= 0 && rx >= 0 && ry / gridy < map.length && rx / gridx < map[0].length && map[Math.trunc(ry / gridy)][Math.floor(rx / gridx)] == 1) {
                dof = map.length;
            } else {
                rx += xo
                ry += yo
                dof++
            }
        }

        var rx2 = rx
        var ry2 = ry

        if (Math.sqrt((rx1 - px) ** 2 + (ry1 - py) ** 2) < Math.sqrt((rx2 - px) ** 2 + (ry2 - py) ** 2)) {
            rx = rx1
            ry = ry1
            ctx.fillStyle = "#d8e7e5"
        } else if (Math.sqrt((rx1 - px) ** 2 + (ry1 - py) ** 2) > Math.sqrt((rx2 - px) ** 2 + (ry2 - py) ** 2)) {
            rx = rx2
            ry = ry2
            ctx.fillStyle = "#78818c"
        }
        /**ctx.fillStyle = "#00ff00"
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(rx, ry)
        ctx.stroke()
        ctx.fillRect(rx, ry, 10, 10)**/
        var ca = pa-ra
        if(ca<0){
            ca+=2*Math.PI
        }
        else if(ca>Math.PI*2){
            ca -= 2 * Math.PI
        }

        var hipotenusa = Math.sqrt((rx-px)*(rx-px) + (ry-py)*(ry-py))* Math.cos(ca)

        //parede
        var altura = (gridy * canvas.height)/hipotenusa
        if (altura > canvas.height){
            altura = canvas.height
        }

        ctx.fillRect(canvas.width / raionumero * i,  (canvas.height/2) - (altura/2), canvas.width / raionumero, altura)

        ra -= fov/raionumero
        if(ra < 0){
            ra += Math.PI * 2
        }
    }

}
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    Input()

    if(cena == "2d") {
        drawMap()
        ctx.fillStyle = "#000000"
        ctx.beginPath()
        ctx.arc(px, py, 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath();
        ctx.moveTo(px, py)
        ctx.lineTo(px + Math.cos(pa) * 10, py - Math.sin(pa) * 10)
        ctx.stroke()
    }
    if(cena == "3d"){
        ctx.fillStyle = "blue"
        ctx.fillRect(0, 0, 500, 250)
        ctx.fillStyle = "green"
        ctx.fillRect(0, 250, 500, 250)
        Ray()
    }

}

setInterval(draw, 10)