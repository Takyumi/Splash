varying vec3 vertexNormal;

void main() {
    float intensity = pow(-dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0)/1.25;
    //toggle globe intensity
    gl_FragColor = vec4(1.0, 0.5, 0.0, 0.1) * (3.0 - intensity);
}