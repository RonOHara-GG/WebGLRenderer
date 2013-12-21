attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVPMatrix;
uniform mat3 uNormalMatrix;

varying vec3 normal;

void main(void) 
{
	gl_Position = uMVPMatrix * vec4(aVertexPosition, 1.0);
	normal = uNormalMatrix * normalize(aVertexNormal);
}