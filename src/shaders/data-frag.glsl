
uniform sampler2D texture;
uniform int u_useTexture;
uniform vec3 u_albedo;
uniform vec3 u_ambient;
uniform vec3 u_lightPos;
uniform vec3 u_lightCol;
uniform float u_lightIntensity;

varying float noise;

varying vec3 vertPos;
varying vec3 vertNor;
//varying vec2 f_uv;

uniform float lineThickness;
uniform float lineFrequency;

void main() {
    vec4 color = vec4(u_albedo, 1.0);
    
    /*
    if (u_useTexture == 1) {
        color = texture2D(texture, f_uv);
    }
    */

    //lambert
    //float d = clamp(dot(vertNor, normalize(u_lightPos - vertPos)), 0.0, 1.0);
    //color = vec4(d * color.rgb * u_lightCol * u_lightIntensity, 1.0);

    //iridescent
    //vec3 lookVector = normalize(vertPos - cameraPosition);
    //float angle = dot(lookVector, vertNor);
    //float r = 0.5*abs(cos(3.0*angle + 1.0));
    //float g = 0.5*abs(cos(3.0*angle + 2.0));
    //float b = 0.5*abs(cos(3.0*angle + 3.0));
    //gl_FragColor = color + vec4(r, g, b, 0.0);

    if (mod(vertPos.y, lineFrequency) < lineThickness) {
        gl_FragColor = vec4(0.1, 0.1, 0.1, 0.0);
    }
    else {
        gl_FragColor = vec4(0.8, 0.8, 0.8, 0.0);
    }
}