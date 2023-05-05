const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

if(window.innerHeight<window.innerWidth){
    canvas.height = window.innerHeight-11
    canvas.width = canvas.height*(16/21)
}
else if(window.innerWidth < window.innerHeight){
    canvas.width = window.innerWidth-11
    canvas.height = canvas.width*(21/16)
}

var gridx = canvas.width/16
var gridy = canvas.height/21

window.addEventListener("touchstart", toca, {passive: false})
window.addEventListener("keydown", tleca, {passive: false})

var map = [[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]

var J = [[[0, 0, 0, 0], 
[0, 0, 2, 0], 
[0, 0, 2, 0], 
[0, 2, 2, 0]], 
[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[2, 0, 0, 0], 
[2, 2, 2, 0]], 
[[0, 0, 0, 0], 
[0, 2, 2, 0], 
[0, 2, 0, 0], 
[0, 2, 0, 0]], 
[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[0, 2, 2, 2], 
[0, 0, 0, 2]]]

var L = [[[0, 0, 0, 0], 
[0, 3, 0, 0], 
[0, 3, 0, 0], 
[0, 3, 3, 0]], 
[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[3, 3, 3, 0], 
[3, 0, 0, 0]], 
[[0, 0, 0, 0], 
[0, 3, 3, 0], 
[0, 0, 3, 0], 
[0, 0, 3, 0]], 
[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[0, 0, 0, 3], 
[0, 3, 3, 3]]]

var I = [[[0, 0, 4, 0], 
[0, 0, 4, 0], 
[0, 0, 4, 0], 
[0, 0, 4, 0]], 
[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[0, 0, 0, 0], 
[4, 4, 4, 4]], 
[[0, 0, 4, 0], 
[0, 0, 4, 0], 
[0, 0, 4, 0], 
[0, 0, 4, 0]], 
[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[0, 0, 0, 0], 
[4, 4, 4, 4]]]

var O = [[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[0, 5, 5, 0], 
[0, 5, 5, 0]], 
[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[0, 5, 5, 0], 
[0, 5, 5, 0]], 
[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[0, 5, 5, 0], 
[0, 5, 5, 0]], 
[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[0, 5, 5, 0], 
[0, 5, 5, 0]]]

var T = [[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[0, 6, 6, 6], 
[0, 0, 6, 0]], 
[[0, 0, 0, 0], 
[0, 0, 6, 0], 
[0, 6, 6, 0], 
[0, 0, 6, 0]], 
[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[0, 0, 6, 0], 
[0, 6, 6, 6]], 
[[0, 0, 0, 0], 
[0, 6, 0, 0], 
[0, 6, 6, 0], 
[0, 6, 0, 0]]]

var P = [[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[0, 0, 7, 7], 
[0, 7, 7, 0]], 
[[0, 0, 0, 0], 
[0, 7, 0, 0], 
[0, 7, 7, 0], 
[0, 0, 7, 0]], 
[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[0, 0, 7, 7], 
[0, 7, 7, 0]], 
[[0, 0, 0, 0], 
[0, 7, 0, 0], 
[0, 7, 7, 0], 
[0, 0, 7, 0]]]

var Q = [[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[0, 8, 8, 0], 
[0, 0, 8, 8]], 
[[0, 0, 0, 0], 
[0, 0, 8, 0], 
[0, 8, 8, 0], 
[0, 8, 0, 0]], 
[[0, 0, 0, 0], 
[0, 0, 0, 0], 
[0, 8, 8, 0], 
[0, 0, 8, 8]], 
[[0, 0, 0, 0], 
[0, 0, 8, 0], 
[0, 8, 8, 0], 
[0, 8, 0, 0]]]

var cores = ["rgba(255, 255, 255, 0)", "black", "blue", "orange", "cyan", "yellow", "purple", "green", "red"]
var lista = [J, L, I, O, T, P, Q]

var choice = Math.floor(Math.random()*lista.length)
var peca = lista[choice]
choice = Math.floor(Math.random()*lista.length)
var proxima = lista[choice]
var pecax = 4
var pecay = 0
var roda = 0

var move = false

var fps = 60
var t = fps

var left = right = false

var amarelo = vermelho = azul = 0
var tetris = 0
var foda = 0
var pt = 0
var coord = 0

var vel = 42

var cena = "jogo"

function toca(event){
    var x = event.targetTouches[0].pageX
    var y = event.targetTouches[0].pageY
    
    if(y < canvas.height/2){
        amarelo = 0.5
        roda++
        if(roda>3) roda = 0
        for(var y = 0; y<4; y++){
            for(var x = 0; x<4; x++){
                if(peca[roda][y][x] != 0 && map[pecay+y][pecax+x] != 0){
                    move = false
                    break
                }
            }
            if(move == false){
                roda--
                if(roda<0) roda=3
                break
            }
        }
    }
    if(y > canvas.height/2 && x < canvas.width/2) {
        vermelho = 0.5
        left = true
        right = false
    }
    else if (y > canvas.height/2 && x > canvas.width/2){
        azul = 0.5
        right = true
        left = false
    }
}

function tleca(event){
    
    if(event.key == "w" || event.keyCode == 38){
        roda++
        if(roda>3) roda = 0
        for(var y = 0; y<4; y++){
            for(var x = 0; x<4; x++){
                if(peca[roda][y][x] != 0 && map[pecay+y][pecax+x] != 0){
                    move = false
                    break
                }
            }
            if(move == false){
                roda--
                if(roda<0) roda=3
                break
            }
        }
    }
    if(event.key == "a" || event.keyCode == 38) {
        left = true
        right = false
    }
    else if (event.key == "d" || event.keyCode == 39){
        right = true
        left = false
    }
}
function update(){
    for(var y = 0; y<4; y++){
        for(var x = 0; x < 4; x++){
            if(pecax + x > 0 && pecax + x < 11 && pecay + y >= 0 && pecay + y < 20 && map[pecay + y][pecax + x] < 1){
                map[pecay + y][pecax + x] = peca[roda][y][x]
            }
        }
    }
    
    render()
    for(var y = 0; y<4; y++){
            for(var x = 0; x < 4; x++){
                if(pecax + x > 0 && pecax + x < 11 && pecay + y >= 0 && pecay + y < 20 && peca[roda][y][x] != 0){
                    map[pecay + y][pecax + x] = 0
                }
            }
        }
    if(left == true && pecay > -2){
        for(var y = 0; y<4; y++){
        for(var x = 0; x<4; x++){
            if(peca[roda][y][x] != 0 && map[pecay+y][pecax+(x-1)] != 0){
                move = false
                break
            }
            else{
                move = true
            }
        }
            if (move==false) break
        }
        
        if(move==true){
            pecax--
            left = false
        }
    }
    if(right == true){
        for(var y = 1; y<4; y++){
        for(var x = 2; x<4; x++){
            if(peca[roda][y][x] != 0 && map[pecay+y][pecax+(x+1)] != 0){
                move = false
                break
            }
            else{
                move = true
            }
        }
            if (move==false) break
        }
        
        if(move==true){
            pecax++
            right = false
        }
    }
    left = right = false
    t--
    if(t<=vel){
        for(var y = 1; y<4; y++){
        for(var x = 0; x<4; x++){
            if(peca[roda][y][x] != 0 && map[pecay+(y+1)][pecax+x] != 0){
                move = false
                break
            }
            else{
                move = true
            }
        }
            if (move==false) break
        }
        
        if(move==true) pecay++
        else{
            for(var y = 0; y<4; y++){
        for(var x = 0; x < 4; x++){
            if(pecax + x > 0 && pecax + x < 11 && pecay + y >= 0 && pecay + y < 20 && map[pecay + y][pecax + x] == 0){
                map[pecay + y][pecax + x] = peca[roda][y][x]
            }
        }
    }
            if(pecay <= -1) cena = "gameover"
            pecax = 4
            pecay = -1
            var choice = Math.floor(Math.random()*(lista.length))
            peca = proxima
            proxima = lista[choice]
            roda = 0
        }
        
        t=fps
        for(var y = 0; y<20; y++){
        for(var i = 1; i<11; i++){
            if(map[y][i] != 0){
                tetris++
            }
            if (tetris >= 10){
            for(var i = 1; i<11; i++){
                map[y][i] = 0
            }
                foda++
                if(coord==0) coord = y
        }
        }
            tetris=0
        }
        if(foda>0){
            for(var y = coord-1; y>0; y--){
                for(var x = 1; x<11; x++){
                    map[y+foda][x] = map[y][x]
                }
            }
            pt += foda*foda
            foda=0
            coord = 0
            vel += 0.2
        }
    }
    if(amarelo>0){
        amarelo-=0.02
        if(amarelo<0) amarelo=0
    }
    if(vermelho>0){
        vermelho-=0.02
        if(vermelho<0) vermelho=0
    }
    if(azul>0){
        azul-=0.02
        if(azul<0) azul=0
    }
}

function render(){
    for (var y = 0; y < map.length; y++){
        for (var x = 0; x < map[0].length; x++) {
            ctx.fillStyle = cores[map[y][x]]
            ctx.fillRect(x * gridx, y * gridy, gridx, gridy)
        }
    }
    ctx.fillStyle = "black"
    ctx.fillRect(gridx*12, 0, gridx*5, canvas.height)
    for(var y = 0; y<4; y++){
        for(var x=0; x<4; x++){
            ctx.fillStyle = cores[proxima[0][y][x]]
            ctx.fillRect(gridx*11+(x*gridx), gridy + y * gridy, gridx, gridy)
        }
    }
    ctx.globalAlpha = amarelo
    ctx.fillStyle = "yellow"
    ctx.fillRect(0, 0, canvas.width, canvas.height/2)
    ctx.globalAlpha = vermelho
    ctx.fillStyle = "red"
    ctx.fillRect(0, canvas.height/2, canvas.width/2, canvas.height/2)
    ctx.globalAlpha = azul
    ctx.fillStyle = "blue"
    ctx.fillRect(canvas.width/2, canvas.height/2, canvas.width/2, canvas.height/2)
    ctx.globalAlpha = 1
    
    ctx.fillStyle = "black"
    ctx.font = "30px Arial"
    ctx.textAlign = "center"
    ctx.fillText(pt.toString(), canvas.width/2, 30)
}

function main(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if(cena == "jogo") update()
    else if(cena == "gameover") {
        ctx.font = "30px Arial"
        ctx.fillText("PERDEU", canvas.width/2, canvas.height/2)
        ctx.font = "20px Arial"
        ctx.fillText("recarrega o site pra reiniciar", canvas.width/2, canvas.height/2 + 50)
    }
    
    
}

setInterval(main, 1000/fps)