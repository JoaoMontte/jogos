const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
//variaveis
var bx = 250
var by = 250
var ba = Math.PI
var raio = 8
var reflexox = 1
var reflexoy = 1
var bvel = 5

//player
var p1x = 10
var p1y = 200
var largura = 10
var altura = 100
var p2x = 480
var p2y = 200
var pvel = 5

var up = down = up1 = down1 = false

var ponto1 = 0
var ponto2 = 0
var t = 50

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "w") {
        up = true;
    }
    else if(e.key == "s") {
        down = true
    }
    if(e.key == "ArrowUp") {
        up1 = true;
    }
    else if(e.key == "ArrowDown") {
        down1 = true
    }
}

function keyUpHandler(e) {
    if(e.key == "w") {
        up = false;
    }
    else if(e.key == "s") {
        down = false
    }
    if(e.key == "ArrowUp") {
        up1 = false;
    }
    else if(e.key == "ArrowDown") {
        down1 = false
    }
}

function Input(){
    if (up == true){
        p1y -= pvel
    } 
    if(down == true){
        p1y += pvel
    }
    if(up1 == true){
        p2y -= pvel
    }
    if(down1 == true){
        p2y += pvel
    }
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    Input()

    //bola
    bx += Math.cos(ba) * bvel * reflexox
    by -= Math.sin(ba) * bvel * reflexoy
    if (by - raio < 0 || by + raio > canvas.height){
        reflexoy = -reflexoy
    }
    if (bx <= p1x + largura + raio && bx >= p1x && by >= p1y && by <= p1y + altura){
        reflexox = -1
        ba = 2 * Math.PI / 3 + ((Math.PI / 150) * (by - p1y))
        bx = p1x + raio + largura
        reflexoy = 1
    }
    if(bx + raio >= p2x && bx <= p2x + largura && by + raio >= p2y && by <= p2y + altura){
        reflexox = 1
        ba = 2 * Math.PI / 3 + ((Math.PI / 150) * (by - p2y))
        bx = p2x - raio
        reflexoy = 1
    }
    if (bx < -100){
        ponto2++
        bx = 250
        bvel = 5
    }
    if(bx > canvas.width + 100){
        ponto1++
        bx = 250
        bvel = 5
    }

    ctx.beginPath()
    ctx.arc(bx, by, raio, 0, Math.PI * 2)
    ctx.fillStyle = "#FFFFFF"
    ctx.fill()
    ctx.font = "48px Arial"
    


    ctx.fillStyle = "#FF0000"
    ctx.fillRect(p1x, p1y, largura, altura)
    ctx.fillText(ponto1.toString(), 0, 48)
    ctx.fillStyle = "#0000FF"
    ctx.fillRect(p2x, p2y, largura, altura)
    ctx.fillText(ponto2.toString(), 452, 48)

    t--
    if(t <= 0){
        t = 50
        bvel += 0.1
    }
}

setInterval(draw, 20)
