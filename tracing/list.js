
export default class List{
    constructor(){
        this.spheres = [];
    }
    add(sphere){
        this.spheres.push(sphere)
    }
    hittable(ray){
        var hittable = false
        for(var i = 0; i < this.spheres.length; i++){
            if(this.spheres[i].hit(ray) > 0){
                hittable = true
            }
        }
        return hittable
    }
    smallest(){
        var current = 0
        for(var i = 0; i<this.spheres.length; i++){
            if(current!=i){
            if(this.spheres[current].t < 0 || this.spheres[i].t<this.spheres[current].t && this.spheres[i].t>0){
                current = i
                i = 0
            }
            }
        }
        return current
    }
}