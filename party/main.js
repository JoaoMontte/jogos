const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const playerNumber = document.getElementById("name")
playerNumber.value = 2
var globalColor = "rgb(255, 0, 0)"
var teamColors = ["red", "blue"]
const campo = new Image(); campo.src = "campo.png"

var bolaX = canvas.width/2
var bolaY = canvas.height/2
var bolaRaio = 15
var bolaXVel = 0
var bolaYVel = 0

var p1 = 0
var p2 = 0

function fixAngle(a){if(a < 0)a+=Math.PI*2; if(a > Math.PI*2)a-=Math.PI*2; return a}

class Player{
    constructor(x, y, n, color){
        this.x = x
        this.y = y
        this.speed = 2
        this.radius = 10
        this.move = false
        this.angle = 0
        this.angleSpeed = 0.08
        this.n = n
        this.color = color
    }
    update(){
        if(this.move && this.x - this.radius + Math.cos(this.angle) * this.speed > 0 && this.x + this.radius + Math.cos(this.angle) * this.speed < canvas.width){
            this.x += Math.cos(this.angle) * this.speed
            this.y += Math.sin(this.angle) * this.speed
        }
        else{
            this.angle = fixAngle(this.angle+this.angleSpeed)
        }
    }
    draw(){
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2)
        ctx.fill()
        ctx.fillStyle = "white"
        ctx.font = "20px serif"
        ctx.fillText(String.fromCharCode(65+this.n), this.x-this.radius/2, this.y+this.radius/2)
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x+Math.cos(this.angle)*10, this.y+Math.sin(this.angle)*10)
        ctx.stroke()
    }
}

function main(){
    bolaXVel -= bolaXVel/50
    bolaYVel -= bolaYVel/50
    bolaX += bolaXVel
    bolaY -= bolaYVel
    if(bolaX-bolaRaio < 0 || bolaX+bolaRaio > canvas.width) bolaXVel = -bolaXVel
    if(bolaY-bolaRaio < 0 && bolaX - bolaRaio < canvas.width/3 || bolaX + bolaRaio > canvas.width-canvas.width/3 || bolaY+bolaRaio >= canvas.height && bolaX - bolaRaio < canvas.width/3 || bolaX + bolaRaio > canvas.width-canvas.width/3) bolaYVel = -bolaYVel
    if(bolaY < 0){p2++; butao()}
    if(bolaY > canvas.height){p1++; butao()}
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    ctx.drawImage(campo, 0, 0, canvas.width, canvas.height)
    
    for(var i = 0; i < player.length; i++){
        player[i].update()
        player[i].draw()
        if(Math.sqrt((bolaY-player[i].y)**2+(bolaX-player[i].x)**2)<=player[i].radius+bolaRaio){
            bolaXVel += Math.cos(player[i].angle)
            bolaYVel -= Math.sin(player[i].angle)
        }
    }
    ctx.beginPath()
    ctx.arc(bolaX, bolaY, bolaRaio, 0, Math.PI*2)
    ctx.fillStyle = "white"
    ctx.fill()
    ctx.stroke()
    
    ctx.font = "20px serif"
    ctx.fillStyle = "red"
    ctx.fillText(p1.toString(), 20, 20)
    ctx.fillRect(0, 0, canvas.width/3, 1)
    ctx.fillRect(canvas.width-canvas.width/3, 0, canvas.width/3, 1)
    ctx.fillStyle = "blue"
    ctx.fillText(p2.toString(), 20, canvas.height-5)
    ctx.fillRect(0, canvas.height-1, canvas.width/3, 1)
    ctx.fillRect(canvas.width-canvas.width/3, canvas.height-1, canvas.width/3, 1)
}
function butao(){
    player = []
    for(var i = 0; i < playerNumber.value; i++){
        player.push(new Player(Math.floor(Math.random()*(canvas.width-canvas.width/4))+canvas.width/8, Math.floor(Math.random()*canvas.height/2)+(canvas.height/2*(i%2)), i, teamColors[i%2]))
    }
    bolaX = canvas.width/2
    bolaY = canvas.height/2
    bolaXVel = 0
    bolaYVel = 0
}

var player = [new Player(250, 250, 0, "red"), new Player(100, 100, 1, "blue")]

function down(e){
    for(var i=0; i < player.length; i++){
        if(e.keyCode == 65+i) {player[i].move = true; player[i].angleSpeed = -player[i].angleSpeed}
    }
}
function up(e){
    for(var i=0; i < player.length; i++){
        if(e.keyCode == 65+i) player[i].move = false
    }
}
function touch(e){
    player[0].move = true
    player[0].angleSpeed = -player[0].angleSpeed
}
function touchou(e){
    player[0].move = false
}

document.addEventListener("keydown", down)
document.addEventListener("keyup", up)
canvas.addEventListener("touchstart", touch)
canvas.addEventListener("touchend", touchou)
setInterval(main, 1000/60)