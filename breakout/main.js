const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

var blocos = [[1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],]
var largura = 40
var altura = 15
var espaco = 15

var px = 200
var py = 460
var pl = 100
var pa = 20
var pvel = 5

var bx = 250
var by = 250
var ba = 3 * Math.PI / 2
var raio = 10
var bvel = 2
var reflexox = 1
var reflexoy = 1

var left = right = false

var cena = "jogo"

var conta = 0

var t = 60000
var ponto = 0

window.addEventListener('keydown', function(e){
    if (e.key == "a"){
        left = true
    }
    if (e.key == "d"){
        right = true
    }
})
window.addEventListener('keyup', function(e){
    if (e.key == "a"){
        left = false
    }
    if (e.key == "d"){
        right = false
    }
})

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
canvas.addEventListener("click", function (evt) {
    var mousePos = getMousePos(canvas, evt);
    if (cena == "gameover" || cena == "venceu" && mousePos.x >= 10 && mousePos.y >= 300 && mousePos.x <= 350 && mousePos.y <= 370){
        blocos = [[1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],]
        largura = 40
        altura = 15
        espaco = 15

        px = 200
        py = 460
        pl = 100
        pa = 20
        pvel = 5

        bx = 250
        by = 250
        ba = 3 * Math.PI / 2
        raio = 10
        bvel = 2
        reflexox = 1
        reflexoy = 1

        left = right = false

        cena = "jogo"
        t = 60000
        ponto = 0
    }
}, false);

function Draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if(cena == "jogo") {
        bx += Math.cos(ba) * bvel * reflexox
        by -= Math.sin(ba) * bvel * reflexoy

        if (bx - raio < 0 || bx + raio > canvas.width) {
            reflexox = -reflexox
        }
        if (by - raio < 0) {
            reflexoy = -reflexoy
        }
        if (by - 50 > canvas.height){
            cena = "gameover"
        }
        if (by + raio >= py && by - raio <= py + pa && bx + raio >= px && bx - raio <= px + pl) {
            reflexoy = 1
            reflexox = 1
            by = py - raio

            ba = (Math.PI - Math.PI / 4) - ((Math.PI / 2 / pl) * (bx - px))
        }

        if (left == true && px - pvel >= 0) {
            px -= pvel
        } else if (right == true && px + pvel + pl <= canvas.width) [
            px += pvel
        ]

        for (var y = 0; y < blocos.length; y++) {
            for (var x = 0; x < blocos[0].length; x++) {
                if (by - raio <= ((y * (altura + espaco) + espaco) + altura) && by + raio >= y * (altura + espaco) + espaco) {
                    if (blocos[y][x] == 1 && bx + raio >= x * (largura + espaco) + espaco / 2 && bx - raio <= (x * (largura + espaco) + espaco / 2) + largura) {
                        blocos[y][x] = 0
                        reflexoy = -reflexoy
                        ponto += Math.floor(t / 1000)
                    }
                }
                if (blocos[y][x] == 1) {
                    ctx.fillStyle = "blue"
                    ctx.fillRect(x * (largura + espaco) + espaco / 2, y * (altura + espaco) + espaco, largura, altura)
                }
                else if(blocos[y][x] == 0){
                    conta++
                }
                if(conta == blocos.length * blocos[0].length){
                    cena = "venceu"
                }
            }
        }
        conta = 0
        ctx.fillStyle = "green"
        ctx.fillRect(px, py, pl, pa)
        ctx.fillStyle = "red"
        ctx.beginPath()
        ctx.arc(bx, by, raio, 0, Math.PI * 2)
        ctx.fill()
        ctx.font = "48px Arial";
        ctx.textAlign = "center"
        ctx.fillText(ponto.toString(), canvas.width/2, 48)
        bvel += 0.0005
        t--
    }
    if(cena == "gameover"){
        ctx.fillStyle = "red"
        ctx.font = "48px Arial";
        ctx.textAlign = "center"
        ctx.fillText("PERDEU OTARIO", canvas.width/2, canvas.height/2)

        ctx.fillRect(150, 300, 200, 70)
        ctx.fillStyle = "black"
        ctx.font = "24px Arial";
        ctx.fillText("clique pra reiniciar", 250, 340)
        ctx.fillText(ponto.toString(), 48, 48)
    }
    if(cena == "venceu"){
        ctx.fillStyle = "green"
        ctx.font = "48px Arial";
        ctx.textAlign = "center"
        ctx.fillText("VENCEU OTARIO", canvas.width/2, canvas.height/2)

        ctx.fillRect(150, 300, 200, 70)
        ctx.fillText(ponto.toString(), 48, 48)
        ctx.fillStyle = "white"
        ctx.font = "24px Arial";
        ctx.fillText("clique pra reiniciar", 250, 340)
    }
}

setInterval(Draw, 10)
