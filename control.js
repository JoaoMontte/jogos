class Control{
    constructor(){
        this.canvas = document.querySelector("canvas")
        this.ctx = this.canvas.getContext("2d")

        this.buttonX = this.canvas.width/6
        this.buttonY = 3 * this.canvas.height/4
        this.buttonRadius = this.canvas.width/8

        this.moveX = this.buttonX
        this.moveY = this.buttonY
        this.moveRadius = this.canvas.width/14
        this.comecou = false

        this.x = 0
        this.y = 0

        this.canvas.addEventListener("touchstart", (e) => {this.update(e.touches[0].clientX, e.touches[0].clientY)})
        this.canvas.addEventListener("touchend", (e) => {this.update(this.buttonX, this.buttonY)})
        this.canvas.addEventListener("touchmove", (e) => {this.update(e.changedTouches[0].clientX, e.changedTouches[0].clientY)})
    }

    update(x, y){
        var hipotenusa =(x-this.buttonX)**2 + (y-this.buttonY)**2 
        if(hipotenusa <= (this.buttonRadius)**2){
            this.moveX = x
            this.moveY = y
            this.comecou = true
        }
        if(x == this.buttonX && y == this.buttonY){
            this.moveX = x
            this.moveY = y
            this.comecou = false
        }
        if(hipotenusa > this.buttonRadius**2 && this.comecou){
            this.moveX = this.buttonX + ((x-this.buttonX)/Math.sqrt(hipotenusa)) * this.buttonRadius
            this.moveY = this.buttonY + ((y-this.buttonY)/Math.sqrt(hipotenusa)) * this.buttonRadius
        }

        if(hipotenusa > 0){
            this.x = (this.moveX-this.buttonX)/this.buttonRadius
            this.y = (this.moveY-this.buttonY)/this.buttonRadius
        }
        else{
            this.x = 0
            this.y = 0
        }
    }

    draw(){
        this.ctx.fillStyle = "rgba(128,128,128,0.5)"
        this.ctx.beginPath()
        this.ctx.arc(this.buttonX, this.buttonY, this.buttonRadius, 0, Math.PI*2)
        this.ctx.fill()
        this.ctx.beginPath()
        this.ctx.fillStyle = "rgba(100,100,100,0.7)"
        this.ctx.arc(this.moveX, this.moveY, this.moveRadius, 0, Math.PI*2)
        this.ctx.fill()
    }
}