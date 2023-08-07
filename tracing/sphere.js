export default class Sphere{
    constructor(center, r, color){
        this.center = center
        this.r = r
        this.color = color
        this.normal;
        this.t;
    }
    hit(ray){
        var oc = ray.origin.subtraction(this.center)
        var a = ray.direction.length_squared()
        var b = ray.direction.dot(oc)
        var c = oc.length_squared()-(this.r*this.r)
        var delta = b*b-a*c
        if(delta<0) {this.t = -1; return this.t};
        this.t = (-b -Math.sqrt(delta)/a)
        //this.normal = ray.at(this.t).subtraction(this.center)
        return this.t;
        //var normal = ray.at(t).subtraction(sphere.vec3)
        //return normal
    }
}