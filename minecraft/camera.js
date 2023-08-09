var front = false; var back = false; var left = false; var right = false; var up = false; var down = false;
var anglexis = 0; var angleyis = 0;
var startX = 0; var startY = 0;

export class Camera{
    constructor(){
        this.x = 50
        this.y = 3
        this.z = 50
        this.angleX = 1.5
        this.angleY = 0
        this.lookX = this.x + Math.cos(this.angleX) * Math.cos(this.angleY)
        this.lookY = this.y + Math.sin(this.angleY)
        this.lookZ = this.z + Math.sin(this.angleX)*Math.cos(this.angleY)
        
        this.walkSpeed = 0.1
        
        this.first = true
        window.addEventListener("touchstart", this.toca, false)
        window.addEventListener("touchend", this.tocou, false)
        window.addEventListener("touchmove", this.tocando, false)

    }
    fullscreen(){ if(canvas.requestFullscreen){canvas.requestFullscreen} else if(canvas.webkitRequestFullScreen) { canvas.webkitRequestFullScreen(); } else { canvas.mozRequestFullScreen(); } }
    toca(e){
        if(this.first){
        this.fullscreen()
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
            gl.viewport(0, 0, canvas.width, canvas.height)
     
            this.first = false
        }
        //e.preventDefault();
        var touch = e.touches;
        for(var i = 0; i < touch.length; i++){
        var x = touch[i].clientX;
        var y = touch[i].clientY;
        if(y < canvas.height/4 && x < canvas.width/2) {front = true;}
        if(y > 3*canvas.height/4 && x < canvas.width/2) back = true;
        if(x>canvas.width/4 && x < canvas.width/2 && y>canvas.height/4 && y<3*canvas.height/4) right = true
        if(x<canvas.width/4 && y>canvas.height/4 && y<3*canvas.height/4) left = true
        if(x>3*canvas.width/4 && y < canvas.height/4) up = true
        if(x>3*canvas.width/4 && y > 3*canvas.height/4) down = true
            
        if(x > canvas.width/2){
            startX = x;
            startY= y;
        }
    }
    }
    tocou(e){
        //e.preventDefault()
        var touch = e.changedTouches
        for(var i = 0; i < touch.length;i++){
        var x = touch[i].clientX;
        var y = touch[i].clientY;
        if(y < canvas.height/4 && x < canvas.width/2) front = false;
        if(y > 3*canvas.height/4 && x < canvas.width/2) back = false;
        if(x>canvas.width/4 && x < canvas.width/2 && y>canvas.height/4 && y<3*canvas.height/4) right = false
        if(x<canvas.width/4 && y>canvas.height/4 && y<3*canvas.height/4) left = false
            if(x>3*canvas.width/4 && y < canvas.height/4) up = false
        if(x>3*canvas.width/4 && y > 3*canvas.height/4) down = false
     
        }
        anglexis=0
        angleyis=0
 
    }
    tocando(e){
        const touches = e.changedTouches;
        for(var i = 0; i < touches.length; i++){
            var x = touches[i].clientX
            var y = touches[i].clientY
            if(x>canvas.width/2){
            anglexis = (startX-x)/1000
            angleyis = (startY-y)/1000
            }
        }
    }
    fixAngle(a){if(a<0){a+=3.14*2}; if(a>3.14*2){a-=3.14*2};return a}
    update(){
        if(anglexis != 0)this.angleX += anglexis
        if(angleyis != 0)this.angleY += angleyis
        if (front){
            this.z -= Math.sin(this.angleX)*this.walkSpeed;
            this.x += Math.cos(this.angleX)*this.walkSpeed;
        }
        if(back){
            this.z += Math.sin(this.angleX)*this.walkSpeed;
            this.x -= Math.cos(this.angleX)*this.walkSpeed;
        }
        if(right){
            this.z -= Math.sin(this.fixAngle(this.angleX-3.14/2))*this.walkSpeed;
            this.x += Math.cos(this.fixAngle(this.angleX-3.14/2))*this.walkSpeed;
        }
        if(left){
            this.z -= Math.sin(this.fixAngle(this.angleX+3.14/2))*this.walkSpeed;
            this.x += Math.cos(this.fixAngle(this.angleX+3.14/2))*this.walkSpeed;
   
        }
        if(up)this.y+=this.walkSpeed;
        if(down)this.y-=this.walkSpeed
        this.lookX = Math.cos(this.angleX) * Math.cos(this.angleY)
        this.lookY = Math.sin(this.angleY)
        this.lookZ = Math.sin(this.angleX)*Math.cos(this.angleY)
    }
}

