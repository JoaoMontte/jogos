export default class vec3{
    constructor(x, y, z){
        this.x = x
        this.y = y
        this.z = z
    }
    subtraction(sub){return new vec3(this.x-sub.x, this.y-sub.y, this.z-sub.z)}
    multiple(mul){return new vec3(this.x*mul.x, this.y*mul.y, this.z*mul.z)}
    length_squared(){return this.x*this.x+this.y*this.y+this.z*this.z}
    dot(d){return this.x*d.x+this.y*d.y+this.z*d.z}
    color(){return "rgb("+this.x*255+", "+this.y*255+", "+this.z*255+")"}
    unitVector(){
        var foda =(1/Math.sqrt(this.length_squared()))
        return new vec3(this.x*foda, this.y*foda, this.z*foda)}
}