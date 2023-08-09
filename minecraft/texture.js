export default class Texture{
    construct(transparent){
        this.transparent = transparent
    }
    setup(gl, src){
        var  obamaTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, obamaTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
        if(this.transparent){
        gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE,
        document.getElementById(src)
        );
        }
        else {        gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGB, gl.RGB,
        gl.UNSIGNED_BYTE,
        document.getElementById(src)
        );}
        
        gl.bindTexture(gl.TEXTURE_2D, null);
        
        gl.bindTexture(gl.TEXTURE_2D, obamaTexture);
        gl.activeTexture(gl.TEXTURE0);
    }
}