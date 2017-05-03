//for more given uniform variables, go to:
//https://threejs.org/docs/api/renderers/webgl/WebGLProgram.html

varying vec3 vertPos;
varying vec3 vertNor;

uniform float time;
uniform float amp;
uniform float lineThickness;
uniform float lineFrequency;

void main() {

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    //vertPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vertPos = position;
    vertNor = normalMatrix * normal;
}

