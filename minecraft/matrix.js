export default class Matrix{
    constructor(gl, program){
        this.modelLocation = gl.getUniformLocation(program, "model")
        this.viewLocation = gl.getUniformLocation(program, "view")
        this.projLocation = gl.getUniformLocation(program, "proj")
        
        this.modelMatrix = new Float32Array(16)
        this.viewMatrix = new Float32Array(16)
        this.projMatrix= new Float32Array(16)
        mat4.identity(this.modelMatrix)
        mat4.lookAt(this.viewMatrix, [0, 0, -2], [0, 0, 0], [0, 1, 0])
        mat4.perspective(this.projMatrix, 3.14/3, canvas.width/canvas.height, 0.1, 100.0)
        
        gl.uniformMatrix4fv(this.modelLocation, gl.FALSE, this.modelMatrix)
        gl.uniformMatrix4fv(this.viewLocation, gl.FALSE, this.viewMatrix)
        gl.uniformMatrix4fv(this.projLocation, gl.FALSE, this.projMatrix)
    }
    updateView(cam, gl){
        mat4.lookAt(this.viewMatrix, [cam.x, cam.y, cam.z], [cam.x+cam.lookX, cam.y+cam.lookY, cam.z-cam.lookZ], [0, 1, 0])
        gl.uniformMatrix4fv(this.viewLocation, gl.FALSE, this.viewMatrix)
        
    }
    projUpdate(gl){
mat4.perspective(this.projMatrix, 3.14/3, canvas.width/canvas.height, 0.1, 100.0)
        gl.uniformMatrix4fv(this.projLocation, gl.FALSE, this.projMatrix)

    }
}
