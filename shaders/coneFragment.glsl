varying vec3 vertexNormal;

void main() {
    float intensity = pow(-dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0) + 0.2;
    //toggle globe intensity
    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
}