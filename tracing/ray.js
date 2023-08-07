import vec3 from "./vec3.js"

export default class Ray{
    constructor(origin, direction){
        this.origin = origin
        this.direction = direction
    }
    at(t){
        return new vec3(this.origin.x+this.direction.x*t, this.origin.y+this.direction.y*t, this.origin.z+this.direction.z*t)
    }
}