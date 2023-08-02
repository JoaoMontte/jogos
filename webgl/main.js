var vertexShaderText = [
"precision mediump float;",
"attribute vec3 vertPosition;",
"attribute vec2 vertTexCoord;",
"varying vec2 fragTexCoord;",
"uniform mat4 model;",
"uniform mat4 view;",
"uniform mat4 proj;",
"void main(){",
"gl_Position = proj * view * model * vec4(vertPosition, 1.0);",
"fragTexCoord = vertTexCoord;",
"}"
].join("\n")

var fragmentShaderText = [
"precision mediump float;",
"varying vec2 fragTexCoord;",
"uniform sampler2D sampler;",
"void main(){",
"gl_FragColor = texture2D(sampler, fragTexCoord);",
"}"
].join("\n")

const  canvas = document.getElementById("canvas")
const gl = canvas.getContext("webgl")

var front = false; var back = false; var left = false; var right = false
var cameraX = 0; var cameraY = 0; var cameraZ = -2;
var lookAtX = 0; var lookAtY = 0; var lookAtZ = 1;
var angle = 4.7;

function goFullScreen(){
    if(canvas.requestFullScreen) canvas.requestFullScreen(); 
    else if(canvas.webkitRequestFullScreen) canvas.webkitRequestFullScreen(); 
    else if(canvas.mozRequestFullScreen) canvas.mozRequestFullScreen(); 
}

function toca(e){
    goFullScreen();
    e.preventDefault();
    var touch = e.touches[0];
    var x = touch.pageX;
    var y = touch.pageY;
    if(y < canvas.height/2 && x > canvas.width/4 && x < canvas.width-canvas.width/4) front = true;
    if(y > canvas.height/2 && x > canvas.width/4 && x < canvas.width-canvas.width/4) back = true;
    if(x>canvas.width/2 && y>canvas.height/4 && y<3*canvas.height/4) right = true
    if(x<canvas.width/2 && y>canvas.height/4 && y<3*canvas.height/4) left = true
}
function tocou(e){
    e.preventDefault()
    var touch = e.changedTouches[0]
    var x = touch.pageX;
    var y = touch.pageY;
    if(y < canvas.height/2 && x > canvas.width/4 && x < canvas.width-canvas.width/4) front = false;
    if(y > canvas.height/2 && x > canvas.width/4 && x < canvas.width-canvas.width/4) back = false;
    if(x>canvas.width/2 && y>canvas.height/4 && y<3*canvas.height/4) right = false
    if(x<canvas.width/2 && y>canvas.height/4 && y<3*canvas.height/4) left = false

}
function fixAngle(a){if(a<0){a+=3.14*2}; if(a>3.14*2){a-=3.14*2};return a}

function main(){
    gl.enable(gl.DEPTH_TEST)
    
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    
    gl.shaderSource(vertexShader, vertexShaderText)
    gl.shaderSource(fragmentShader, fragmentShaderText)
    
    gl.compileShader(vertexShader)
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error(gl.getShaderInfoLog(vertexShader))
        return
    }
    gl.compileShader(fragmentShader)
    
    var program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    
    gl.linkProgram(program)
    gl.validateProgram(program)
    
    //buffer
    
    var triangleVertices = [
    0.0, 0.5, 0.5,   0.5, 0.5, //face da frente
    -0.5, -0.5, 0.0, 1.0, 1.0,
    0.5, -0.5, 0.0,  0.0, 1.0,
    
    0.0, 0.5, 0.5,   0.5, 0.5, //face direita
    -0.5, -0.5, 0.0, 1.0, 1.0,
    -0.5, -0.5, 1.0, 1.0, 0.0,
    
    0.0, 0.5, 0.5,   0.5, 0.5,
    0.5, -0.5, 0.0,  1.0, 1.0,
    0.5, -0.5, 1.0,  1.0, 0.0,
    
    0.0, 0.5, 0.5,   0.5, 0.5,
    0.5, -0.5, 1.0,  1.0, 0.0,
    -0.5, -0.5, 1.0, 0.0, 0.0,
    
    10.0, -1.0, 10.0, 1.0, 1.0,
    10.0, -1.0, -10.0, 1.0, 0.0,
    -10.0, -1.0, 10.0, 0.0, 1.0,
    
    10.0, -1.0, -10.0, 1.0, 0.0,
    -10.0, -1.0, 10.0, 0.0, 1.0,
    -10.0, -1.0, -10.0, 0.0, 0.0]
    
    var buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW)
    var atribLocation = gl.getAttribLocation(program, "vertPosition")
    gl.vertexAttribPointer(
    atribLocation,
    3,
    gl.FLOAT,
    gl.FALSE,
    5*Float32Array.BYTES_PER_ELEMENT,
    0)
    var atribTexLocation = gl.getAttribLocation(program, "vertTexCoord")
    gl.vertexAttribPointer(
    atribTexLocation,
    2,
    gl.FLOAT,
    gl.FALSE,
    5*Float32Array.BYTES_PER_ELEMENT,
    3*Float32Array.BYTES_PER_ELEMENT)
    
    gl.enableVertexAttribArray(atribLocation)
    gl.enableVertexAttribArray(atribTexLocation)
    
    var obamaTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, obamaTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
    gl.UNSIGNED_BYTE,
    document.getElementById('obama')
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
    
    gl.useProgram(program)
    
    var modelLocation = gl.getUniformLocation(program, "model")
    var viewLocation = gl.getUniformLocation(program, "view")
    var projLocation = gl.getUniformLocation(program, "proj")
    
    var modelMatrix = new Float32Array(16)
    var viewMatrix = new Float32Array(16)
    var projMatrix= new Float32Array(16)
    mat4.identity(modelMatrix)
    mat4.lookAt(viewMatrix, [0, 0, -2], [0, 0, 0], [1, 1, 1])
    mat4.perspective(projMatrix, 3.14/3, canvas.width/canvas.height, 0.1, 100.0)
    
    gl.uniformMatrix4fv(modelLocation, gl.FALSE, modelMatrix)
    gl.uniformMatrix4fv(viewLocation, gl.FALSE, viewMatrix)
    gl.uniformMatrix4fv(projLocation, gl.FALSE, projMatrix)
    
    
    gl.bindTexture(gl.TEXTURE_2D, obamaTexture);
    gl.activeTexture(gl.TEXTURE0);
    
    var loop = function(){
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        
        if(front){
            cameraZ -= Math.sin(angle)/10;
            cameraX += Math.cos(angle)/10
        }
        if(back){
            cameraZ += Math.sin(angle)/10;
            cameraX -= Math.cos(angle)/10;
        }
        if(right) angle = fixAngle(angle-0.05)
        if(left) angle = fixAngle(angle+0.05)
        mat4.lookAt(viewMatrix, [cameraX, cameraY, cameraZ], [cameraX+Math.cos(angle), cameraY+lookAtY, cameraZ-Math.sin(angle)], [0, 1, 0])
        gl.uniformMatrix4fv(viewLocation, gl.FALSE, viewMatrix)
        
        gl.drawArrays(gl.TRIANGLES, 0, 18)
    
        //mat4.rotate(modelMatrix, modelMatrix, 0.01, [0, 1, 0])
        //gl.uniformMatrix4fv(modelLocation, gl.FALSE, modelMatrix)
        
        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
}

main()
canvas.addEventListener("touchstart", toca)
canvas.addEventListener("touchend", tocou)
