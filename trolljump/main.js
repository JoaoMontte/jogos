const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const trollface = document.getElementById("trollface")
const ground = document.getElementById("ground")
const ceu = document.getElementById("ceu")
const lula = document.getElementById("lula")

var positionX = canvas.width/2 - 32;
var positionY = canvas.height/2+64;
var velocityX = 0.0;
var velocityY = 0.0;
var gravity = 0.5;
var onGround = false;

var groundx = 0
var groundvel = 4

var ceux = 0
var ceuvel = 2

var lulax = []
var lulavel = 4
var lulas = 1
var aleatoiro = Math.floor(Math.random() * 200)
var t = 0

var cena = "jogo"

var distancia = 60

var ponto = 0

window.addEventListener("mousedown", StartJump, false);
window.addEventListener("mouseup", EndJump, false);
window.addEventListener("touchstart", StartJump);
window.addEventListener("touchend", EndJump);
function StartJump()
{
    if(onGround)
    {
        velocityY = -14.0;
        onGround = false;
    }
}

function EndJump()
{
    if(velocityY < -5.0)
        velocityY = -5.0;
}

function Update()
{
    ponto++
    t++
    groundvel += 0.0005
    lulavel += 0.0005
    distancia == 0.0005
    groundx -= groundvel
    if(groundx <= -122){
        groundx = 0
    }
    for(var i = 0; i < lulax.length; i ++) {
        lulax[i] -= lulavel
        if (lulax[i] <= -64){
            lulax.splice(1, i)
        }

        if(positionX + 64 >= lulax[i] && positionX <= lulax[i] + 64 && positionY > canvas.height/2){
            cena = "gameover"
        }
    }

    if(t >= distancia + aleatoiro){
        t = 0
        aleatoiro = Math.floor(Math.random() * 200)
        lulax.push(canvas.width)
    }

    ceux -= ceuvel
    if(ceux <= -500){
        ceux = 0
    }

    velocityY += gravity;
    positionY += velocityY;
    positionX += velocityX;

    if(positionY > canvas.height/2+64)
    {
        positionY = canvas.height/2+64;
        velocityY = 0.0;
        onGround = true;
    }
}

function Render(){

    ctx.beginPath()
    ctx.moveTo(0, canvas.height/2+128)
    ctx.lineTo(canvas.width, canvas.height/2+128)
    ctx.stroke()

    ctx.drawImage(ceu, ceux, -100, 500, 500)
    ctx.drawImage(ceu, ceux + 500, -100, 500, 500)

    for(var i = 0; i < canvas.width/122 + 1; i++) {
        ctx.drawImage(ground, groundx + (i*121), canvas.height / 2 + 128, 122, 122)
    }

    ctx.drawImage(trollface, positionX, positionY, 64, 64)
    for(var i = 0; i < lulax.length; i ++) {
        ctx.drawImage(lula, lulax[i], canvas.height / 2 + 64, 64, 64)
    }
    ctx.font = "48px Arial";
    ctx.textAlign = "center"
    ctx.fillText(ponto.toString(), canvas.width / 2, 48)
}


function main(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if(cena == "jogo") {
        Update()
        Render()
    }
    if(cena == "gameover") {
        ctx.fillStyle = "red"
        ctx.font = "48px Arial";
        ctx.textAlign = "center"
        ctx.fillText("FAÇA O L", canvas.width / 2, canvas.height / 2)

        ctx.fillRect(150, 300, 200, 70)
        ctx.fillStyle = "black"
        ctx.font = "14px Arial";
        ctx.fillText("reinicia o site pra jogar denovo to com preguiça de fazer o botao funcionar", 250, 340)
        ctx.font = "48px Arial";
        ctx.fillText(ponto.toString(), 48, 48)
    }
}

setInterval(main, 10)