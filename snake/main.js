const canvas =  document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const fps = 60
var t = 60
var gamevel = 55

const divide = 20
var gridx = canvas.width/divide
var gridy = canvas.height/divide

var up = down = left = right = false

var fx = Math.floor(Math.random() * (Math.floor(canvas.width/ gridx))) * gridx
var fy = Math.floor(Math.random() * (Math.floor(canvas.height/ gridy))) * gridy

var cena = "jogo"


//Get Mouse Position
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
class Snake{
    constructor() {
        this.x = (canvas.width/gridx) * gridx/2
        this.y = (canvas.height/gridy) * gridy/2
        this.dir = [1, 0]
        this.tamanho = 2
        this.tailx = [this.x - gridx, this.x - gridx - gridx]
        this.taily = [this.y, this.y]
        this.ponto = 0
    }
    update(){
        if (t <= gamevel){
            //input
            if(up == true && this.dir != [0, 1]){
                this.dir = [0, -1]
                if(this.y + (this.dir[1] * gridy) == this.taily[0]){
                    this.dir = [0, 1]
                }
            }
            else if(down == true && this.dir != [0, -1]){
                this.dir = [0, 1]
                if(this.y + (this.dir[1] * gridy) == this.taily[0]){
                    this.dir = [0, -1]
                }
            }
            if(left == true && this.dir != [1, 0]){
                this.dir = [-1, 0]
                if(this.x + (this.dir[0] * gridx) == this.tailx[0]){
                    this.dir = [1, 0]
                }
            }
            else if(right == true && this.dir != [-1, 0]){
                this.dir = [1, 0]
                if(this.x + (this.dir[0] * gridx) == this.tailx[0]){
                    this.dir = [-1, 0]
                }
            }
            up = down = left = right = false

            if(this.x == fx && this.y == fy){
                fx = Math.floor(Math.random() * (Math.floor(canvas.width/ gridx))) * gridx
                fy = Math.floor(Math.random() * (Math.floor(canvas.height/ gridy))) * gridy
                this.ponto++
                this.tamanho++
                this.tailx.push(this.x)
                this.taily.push(this.y)
            }

            t = fps

            if(this.tamanho > 0) {
                for (var i = this.tamanho; i >= 0; i--) {

                    this.tailx[i] = this.tailx[i -1]
                    this.taily[i] = this.taily[i -1]
                    if(i == 0) {
                        this.tailx[i] = this.x
                        this.taily[i] = this.y
                    }
                }
            }

            this.x += this.dir[0] * gridx
            this.y += this.dir[1] * gridy

            if(this.x < 0 || this.y < 0 || this.x >= canvas.width || this.y >= canvas.height){
                cena = "gameover"
            }
            for(var i = 0; i < this.tamanho; i++){
                if(this.x == this.tailx[i] && this.y == this.taily[i]){
                    cena = "gameover"
                }
            }
        }
    }
    draw(){
        ctx.fillRect(this.x, this.y, gridx, gridy)
        if(this.tamanho > 0){
            for(var i = 0; i < this.tamanho; i ++) {
                ctx.fillRect(this.tailx[i], this.taily[i], gridx, gridy)
            }
        }
    }
    input(e){
        if(e.key == "w"){
            up = true
        }
        if (e.key == "s"){
            down = true
        }
        if (e.key == "a"){
            left = true
        }
        if (e.key == "d"){
            right = true
        }
    }
}

function Draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if(cena == "jogo") {
        ctx.fillStyle = "black"
        s.update()
        s.draw()

        ctx.fillStyle = "red"
        ctx.fillRect(fx, fy, gridx, gridy)

        ctx.font = "48px Arial";
        ctx.textAlign = "center"
        ctx.fillText(s.ponto.toString(), canvas.width/2, 35)
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
    }

    t--
}

const s = new Snake()
setInterval(Draw, (1000/fps))

document.addEventListener("keydown", s.input, false);
canvas.addEventListener("click", function (evt) {
    var mousePos = getMousePos(canvas, evt);
    if (cena == "gameover" && mousePos.x >= 10 && mousePos.y >= 300 && mousePos.x <= 350 && mousePos.y <= 370){
        cena = "jogo"
        s.x = (canvas.width/gridx) * gridx/2
        s.y = (canvas.height/gridy) * gridy/2
        s.dir = [1, 0]
        s.tamanho = 2
        s.tailx = [s.x - gridx, s.x - gridx - gridx]
        s.taily = [s.y, s.y]
        s.ponto = 0
    }
}, false);
