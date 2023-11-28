class vec2{
  constructor(x = 0, y = 0){
    this.x = x
    this.y = y
  }
  add(coordenada, multiply = 1){
    this.x += coordenada.x * multiply
    this.y += coordenada.y * multiply
  }
  update(canvas, camera){
    canvas.getContext("2d").fillRect(this.x-10, this.y-10, 20, 20)
  }
}
class Camera{
  constructor(up = new vec2(0, 0), down = new vec2(0,0)){
    this.up = up
    this.down = down
    this.canvas = document.querySelector("canvas")
  }
  zoom(quantity = 0){
    this.up.x += this.canvas.width/(1000-quantity)
    this.up.y += this.canvas.height/(1000-quantity)
    this.down.x -= this.canvas.width/(1000-quantity)
    this.down.y -= this.canvas.height/(1000-quantity)
  }
  zoomOut(quantity = 0){
    this.up.x -= this.canvas.width/(1000-quantity)
    this.up.y -= this.canvas.height/(1000-quantity)
    this.down.x += this.canvas.width/(1000-quantity)
    this.down.y += this.canvas.height/(1000-quantity)
  }
  follow(sprite, smooth = 1){
    var deltaX = this.down.x - this.up.x
    var deltaY = this.down.y - this.up.y
    this.up.x += ((sprite.position.x - deltaX/2 + sprite.size.x/2) - this.up.x) / smooth
    this.up.y += ((sprite.position.y - deltaY/2 + sprite.size.y/2) - this.up.y) / smooth
    this.down.x = this.up.x + deltaX
    this.down.y = this.up.y + deltaY
  }
}
class sprite{
  constructor(src = "https://mystickermania.com/cdn/stickers/super-mario/mario-mushroom-pixel-512x512.png", frameX = 1, frameY = 1, x = 0, y = 0, width = 64, height = 64, type = "sprite"){
    this.image = new Image()
    this.image.src = src
    this.position = new vec2(x, y)
    this.size = new vec2(width, height)
    this.imageFrames = new vec2(frameX, frameY)

    this.animation = [0]
    this.currentFrame = 0
    this.currentIndex = 0
    this.currentTime = Date.now()
    this.timing = 500
    this.flipH = false
    this.flipV = false

    this.type = type
  }
  update(canvas, camera){
    var time = Date.now()
    if(time-this.currentTime >= this.timing) {this.currentIndex++; this.currentTime = Date.now()}
    if(this.currentIndex >= this.animation.length) this.currentIndex = 0
    this.currentFrame = this.animation[this.currentIndex]

    var sWidth = this.image.width/this.imageFrames.x
    var sHeight = this.image.height/this.imageFrames.y
    var sy = Math.floor(this.currentFrame/this.imageFrames.x) * sHeight
    var sx = (this.currentFrame - (Math.floor(this.currentFrame/this.imageFrames.x))*this.imageFrames.x) * sWidth
    var dx = ((this.position.x - camera.up.x) / (camera.down.x-camera.up.x)) * canvas.width    
    var dy = ((this.position.y - camera.up.y) / (camera.down.y-camera.up.y)) * canvas.height
    var dWidth = (this.size.x / (camera.down.x - camera.up.x)) * canvas.width
    var dHeight = (this.size.y / (camera.down.y - camera.up.y)) * canvas.height
    var ctx = canvas.getContext("2d")
    //bagulho pra virar a imagem, ingonre
    ctx.save()
    ctx.translate(dx + this.size.x/2, dy + this.size.y/2)
    ctx.scale(this.flipH ? -1 : 1, this.flipV ? -1 : 1)
    dx = -this.size.x/2
    dy = -this.size.y/2
    ctx.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    ctx.restore()
  }
  collide(sprite){
    if(this.position.x < sprite.position.x + sprite.size.x && this.position.x + this.size.x > sprite.position.x && this.position.y < sprite.position.y + sprite.size.y && this.position.y + this.size.y > sprite.position.y) return true
    else return false
  }
}
class control{
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

        this.canvas.addEventListener("touchstart", (e) => {this.change(e.touches[0].clientX, e.touches[0].clientY)})
        this.canvas.addEventListener("touchend", (e) => {this.change(this.buttonX, this.buttonY)})
        this.canvas.addEventListener("touchmove", (e) => {this.change(e.changedTouches[0].clientX, e.changedTouches[0].clientY)})
    }

    change(x, y){
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

    update(){
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
class game{
  constructor(){
    this.canvas = document.querySelector("canvas")
    //this.canvas.width = window.innerWidth
    //this.canvas.height = window.innerHeight
    //this.canvas.style = "margin: 0; padding: 0; top: 0; left: 0; position: fixed; display: blocked"
    this.ctx = this.canvas.getContext("2d")
    this.ctx.imageSmoothingEnabled = false
    this.camera = new Camera(new vec2(0, 0), new vec2(this.canvas.width, this.canvas.height))
    this.children = []
    this.fps = 60
  }
  update(){
    var bodies = []
    var solids = []
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    //bagulho GIGANTE pra detectar colisao (depois eu ajeito essa porra pra ficar menor ou pra ficar numa funcao)
    for(var i = 0; i < this.children.length; i++){
      if(this.children[i].type == "body") bodies.push(this.children[i])
      if(this.children[i].type == "solid") solids.push(this.children[i])
    }
    for(var b = 0; b < bodies.length; b++){
      for(var s = 0; s < solids.length; s++){
        if(bodies[b].collide(solids[s])){
          var cima = solids[s].position.y - (bodies[b].position.y + bodies[b].size.y)
          var baixo = (solids[s].position.y + solids[s].size.y) - bodies[b].position.y 
          var esquerda = solids[s].position.x - (bodies[b].position.x + bodies[b].size.x)
          var direita = (solids[s].position.x + solids[s].size.x) - bodies[b].position.x
          var listinha = Math.min(Math.abs(cima), Math.abs(baixo), Math.abs(esquerda), Math.abs(direita))
          if(listinha == Math.abs(cima)) bodies[b].position.y += cima
          if(listinha == Math.abs(baixo)) bodies[b].position.y += baixo
          if(listinha == Math.abs(esquerda)) bodies[b].position.x += esquerda
          if(listinha == Math.abs(direita)) bodies[b].position.x += direita
        } 
      }
    }
    //renderizacao de vdd
    for(var i = 0; i < this.children.length; i++){
      this.children[i].update(this.canvas, this.camera)
    }

  }
  run(frame = () => {}){
    setInterval(() => {
      frame()
      this.update()
    }, 1000/this.fps);
  }
  add(object){
    this.children.push(object)
  }
}
