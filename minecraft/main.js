import {Camera} from "./camera.js"
import Shader from "./shader.js"
import Texture from "./texture.js"
import Matrix from "./matrix.js"

const  canvas = document.getElementById("canvas")
const gl = canvas.getContext("webgl")

canvas.width= window.innerWidth
canvas.height= window.innerHeight

function main(){
    var program = new Shader().setup(gl)
    
    //buffer
    var triangleVertices = []
    
    var size = 200;
    noise.seed(Math.random())
    cam.x = size/2
    cam.z= size/2
    cam.y = Math.floor(noise.perlin2(size/2/30, size/2/30)*30)+4
    for(var z= 0; z < size; z++){
        for(var x = 0; x < size; x++){
            var h = Math.floor(noise.perlin2(x/30, z/30)*20)
    if(h > Math.floor(noise.perlin2(x/30, (z+1)/30)*20)){triangleVertices.push(0.0+x, 0.0+h, 1.0+z,    0.25, 0.5, //canto inferior esquerdo
    1.0+x, 0.0+h, 1.0+z,   0.5, 0.5, //canto inferior direito
    0.0+x, 1.0+h, 1.0+z,   0.25, 0.25,//canto superior esquerdo
    
    1.0+x, 0.0+h, 1.0+z,   0.5, 0.5,
    0.0+x, 1.0+h, 1.0+z,   0.25, 0.25,
    1.0+x, 1.0+h, 1.0+z,   0.5, 0.25,)}  //canto superior direito
            
    if(h > Math.floor(noise.perlin2((x+1)/30, (z)/30)*20)){        
    triangleVertices.push(1.0+x, 0.0+h, 1.0+z,   0.5, 0.5,
    1.0+x, 1.0+h, 1.0+z,   0.5, 0.25,
    1.0+x, 0.0+h, 0.0+z,   0.75,0.5,
    
    1.0+x, 1.0+h, 1.0+z,   0.5, 0.25,
    1.0+x, 0.0+h, 0.0+z,   0.75,0.5, //canto inferior direito
    1.0+x, 1.0+h, 0.0+z,   0.75,0.25,) }//canto superior direito
    
            if(h > Math.floor(noise.perlin2((x-1)/30, (z)/30)*20)){
    triangleVertices.push(0.0+x, 0.0+h, 1.0+z,   0.25, 0.5,
    0.0+x, 1.0+h, 1.0+z,   0.25, 0.25,
    0.0+x, 0.0+h, 0.0+z,   0.0, 0.5,
    
    0.0+x, 1.0+h, 1.0+z,   0.25, 0.25, 
    0.0+x, 0.0+h, 0.0+z,   0.0, 0.5,
    0.0+x, 1.0+h, 0.0+z,   0.0, 0.25)}
            
            if(h > Math.floor(noise.perlin2((x)/30, (z-1)/30)*20)){
    
    triangleVertices.push(0.0+x, 0.0+h, 0.0+z,    0.75, 0.5, //canto inferior esquerdo
    1.0+x, 0.0+h, 0.0+z,   1.0, 0.5, //canto inferior direito
    0.0+x, 1.0+h, 0.0+z,   0.75, 0.25,//canto superior esquerdo
    
    1.0+x, 0.0+h, 0.0+z,   1.0, 0.5,
    0.0+x, 1.0+h, 0.0+z,   0.75, 0.25,
    1.0+x, 1.0+h, 0.0+z,   1.0, 0.25,)} //canto superior direito
    
    triangleVertices.push(
    0.0+x, 1.0+h, 1.0+z,   0.25, 0.25,
    1.0+x, 1.0+h, 1.0+z,   0.5, 0.25,
    0.0+x, 1.0+h, 0.0+z,   0.25, 0.0,
    
    1.0+x, 1.0+h, 1.0+z,   0.5, 0.25,
    0.0+x, 1.0+h, 0.0+z,   0.25, 0.0,
    1.0+x, 1.0+h, 0.0+z,   0.5, 0.0,)
    
    /**0.0+x, 0.0+h, 1.0+z,   0.25, 0.5,
    1.0+x, 0.0+h, 1.0+z,   0.5, 0.5,
    0.0+x, 0.0+h, 0.0+z,   0.25, 0.75,
    
    1.0+x, 0.0+h, 1.0+z,   0.5, 0.5,
    0.0+x, 0.0+h, 0.0+z,   0.25, 0.75,
    1.0+x, 0.0+h, 0.0+z,   0.5, 0.75)**/
        }
    }
    
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
    
    var texture = new Texture(true).setup(gl, "grass")
    var matrix = new Matrix(gl, program)
    
    gl.clearColor(0.4, 0.7, 1.0, 1.0)
    var loop = function(){
        gl.enable(gl.DEPTH_TEST)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        
        cam.update()
        matrix.updateView(cam, gl)
        
        gl.drawArrays(gl.TRIANGLES, 0, triangleVertices.length/5)
        
        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
}

const cam = new Camera
main()