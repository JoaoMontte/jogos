const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const playerNumber = document.getElementById("name")
playerNumber.value = 2
var globalColor = "rgb(255, 0, 0)"

function fixAngle(a){if(a < 0)a+=Math.PI*2; if(a > Math.PI*2)a-=Math.PI*2; return a}

class Player{
    constructor(x, y){
        this.x = x
        this.y = y
        this.speed = 5
        this.radius = 10
        this.move = false
        this.angle = 0
        this.angleSpeed = 0.1
    }
    update(){
        if(this.move){
            this.x += Math.cos(this.angle) * this.speed
            this.y += Math.sin(this.angle) * this.speed
        }
        else{
            this.angle = fixAngle(this.angle+this.angleSpeed)
        }
    }
    draw(){
        ctx.fillStyle = globalColor
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x+Math.cos(this.angle)*10, this.y+Math.sin(this.angle)*10)
        ctx.stroke()
    }
}

function main(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for(var i = 0; i < player.length; i++){
        player[i].update()
        player[i].draw()
    }
    
}
function butao(){
    player = []
    for(var i = 0; i < playerNumber.value; i++){
        player.push(new Player(Math.floor(Math.random()*canvas.width), Math.floor(Math.random()*canvas.height)))
    }
}

var player = [new Player(250, 250), new Player(100, 100)]

function down(e){
    for(var i=0; i < player.length; i++){
        if(e.keyCode == 65+i) player[i].move = true
    }
}
function up(e){
    for(var i=0; i < player.length; i++){
        if(e.keyCode == 65+i) player[i].move = false
    }
}
function touch(e){
    player[0].move = true
}
function touchou(e){
    player[0].move = false
}

document.addEventListener("keydown", down)
document.addEventListener("keyup", up)
canvas.addEventListener("touchstart", touch)
canvas.addEventListener("touchend", touchou)
setInterval(main, 1000/60)