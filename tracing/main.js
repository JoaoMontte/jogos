const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

import vec3 from "./vec3.js"
import Sphere from "./sphere.js"
import Ray from "./ray.js"
import List from "./list.js"

var camera = new vec3(0, 0, 4)
const aspectRatio = canvas.width/canvas.height; 
const verticalSize = 2; const horizontalSize = verticalSize*aspectRatio; const focalLength = -1;
var screen = new vec3(-(horizontalSize/2), -(verticalSize/2), focalLength)
var sphere = new Sphere(new vec3(0, 0, 0), 1.0, new vec3(1, 0.3, 0.2))
var world = new List()
world.add(sphere)
world.add(new Sphere(new vec3(0, 100, 0), 99, new vec3(0.0, 1.0, 0.0)))

function rayColor(ray, list){
    if(list.hittable(ray)){
        return list.spheres[list.smallest()].color
    }
    else return new vec3(0.3, 0.6, 1.0)
}

function render(){
for(var y = 0; y<canvas.height; y++){
    for(var x = 0; x < canvas.width; x++){
        var pixelX = screen.x + x*(horizontalSize/canvas.width)
        var pixelY = screen.y + y*(verticalSize/canvas.height)
        var direction = new vec3(pixelX, pixelY, focalLength)
        //direction = direction.unitVector()
        var ray = new Ray(camera, direction)
        ctx.fillStyle=rayColor(ray, world).color()
        ctx.fillRect(x, y, 1, 1)
    }
}
}

render()