const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.style = "position: fixed; top: 0; left: 0; outline: none;"
ctx.imageSmoothingEnabled= false

var cameraX = 0
var cameraY = 0

const player = new Image()
player.src = "player.png"
const map = new Image()
map.src = "map.png"

var playerX = canvas.width/2
var playerY = canvas.height/2
const velocidade = 2

const buttonX = canvas.width/6
const buttonY = 3 * canvas.height/4
const buttonRadius = canvas.width/8

var moveX = buttonX
var moveY = buttonY
var comecou = false

var currentFrame = 0
var frameX = 0
var frameY = 0
var timer = 0
var timing = 60

function start(e){
    var x = e.touches[0].clientX
    var y = e.touches[0].clientY
    if((x-buttonX)**2 + (y-buttonY)**2 <= (buttonRadius)**2){
        moveX = x
        moveY = y
        comecou = true
    }
}

function end(e){
    moveX = buttonX
    moveY = buttonY
    frameX = 0
    timing = 60
    comecou = false
}

function move(e){
    var x = e.changedTouches[0].clientX
    var y = e.changedTouches[0].clientY
    if((x-buttonX)**2 + (y-buttonY)**2 <= (buttonRadius)**2){
        moveX = x
        moveY = y
    }
    else if(comecou){
        var tamanho = Math.sqrt((x-buttonX)**2 + (y-buttonY)**2)
        moveX = buttonX + ((x-buttonX)/tamanho)*buttonRadius
        moveY = buttonY + ((y-buttonY)/tamanho)*buttonRadius
    }
}

function main(){
    ctx.clearRect(0,0,canvas.width, canvas.height)
 
    var deltaX = moveX - buttonX
    var deltaY = moveY - buttonY
    
    cameraX += (playerX-(canvas.width/2)-cameraX)/10
    cameraY += (playerY-(canvas.height/2)-cameraY)/10
    
    playerX += deltaX/buttonRadius * velocidade
    playerY += deltaY/buttonRadius * velocidade
    
    if(deltaX + deltaY != 0){
        frameX = 2
        timing = 30-(Math.sqrt(deltaX**2+deltaY**2)/buttonRadius*30)+30
    if(Math.abs(deltaX) > Math.abs(deltaY)){
        if(deltaX>0) frameY = 3
        else frameY = 2
    }
    else{
        if(deltaY > 0) frameY = 0
        else frameY = 1
    }
    }
    
    ctx.drawImage(map, -500-cameraX , -600-cameraY, 960*1.5, 703*1.5)
    //desenha o player
    ctx.drawImage(player, (frameX+currentFrame)*player.width/4, (frameY)*player.height/4, player.width/4, player.width/4, playerX-player.width/8-cameraX, playerY-player.height/8-cameraY, 80, 80)
       
    //desenha os dois circulos dos butao
    ctx.fillStyle = "rgba(128,128,128,0.5)"
    ctx.beginPath()
    ctx.arc(buttonX, buttonY, buttonRadius, 0, Math.PI*2)
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = "rgba(100,100,100,0.7)"
    ctx.arc(moveX, moveY, canvas.width/14, 0, Math.PI*2)
    ctx.fill()
    
    
    timer++
    if(timer >= timing/2 && timer < timing) currentFrame = 1
    if(timer >= timing) {currentFrame = 0; timer = 0}
    
    requestAnimationFrame(main)
}
canvas.addEventListener("touchstart", start)
canvas.addEventListener("touchend", end)
canvas.addEventListener("touchmove", move)
main()