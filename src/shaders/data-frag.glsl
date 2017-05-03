varying vec3 vertPos;
varying vec3 vertNor;

uniform float lineThickness;
uniform float lineFrequency;

void main() {
	
	/*
    if (vertPos.y < 0.1) {
        gl_FragColor = vec4(0.8, 0.8, 0.8, 0.1);
    }
    else if (mod(vertPos.y, lineFrequency) < lineThickness) {
        gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
    }
    else {
        gl_FragColor = vec4(0.8, 0.8, 0.8, 1.0);
    }
    */

    if (vertPos.z < 0.1) {
        gl_FragColor = vec4(0.8, 0.8, 0.8, 0.1);
    }
    else {
    	gl_FragColor = vec4(min(0.2+vertPos.z/5.0, 0.9), min(0.2+vertPos.z/5.0, 0.9), min(0.2+vertPos.z/5.0, 0.9), 1.0);
    }
}