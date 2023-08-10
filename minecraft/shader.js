export default class Shader{
    constructor(){
        this.vertexShaderText = [
        "precision mediump float;",
        "attribute vec3 vertPosition;",
        "attribute vec2 vertTexCoord;",
        "varying vec2 fragTexCoord;",
        "uniform mat4 model;",
        "uniform mat4 view;",
        "uniform mat4 proj;",
        "void main(){",
        "gl_Position = proj * view * vec4(vertPosition, 1.0);",
        "fragTexCoord = vertTexCoord;",
        "}"
        ].join("\n")
        
        this.fragmentShaderText = [
        "precision mediump float;",
        "varying vec2 fragTexCoord;",
        "uniform sampler2D sampler;",
        "void main(){",
        "gl_FragColor = texture2D(sampler, fragTexCoord);",
        "}"
        ].join("\n")
    }
    setup(gl){
        gl.viewport(0, 0, canvas.width, canvas.height)
        var vertexShader = gl.createShader(gl.VERTEX_SHADER)
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        
        gl.shaderSource(vertexShader, this.vertexShaderText)
        gl.shaderSource(fragmentShader, this.fragmentShaderText)
        
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
        
        gl.useProgram(program)
        
        return program
    }
}