attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVPMatrix;
uniform mat4 uMVMatrix;

uniform mat3 uNormalMatrix;

varying vec3 normal;
varying vec4 viewPos;

void main(void) 
{
	gl_Position = uMVPMatrix * vec4(aVertexPosition, 1.0);
	normal = uNormalMatrix * normalize(aVertexNormal);

	viewPos = uMVMatrix * vec4(aVertexPosition, 1.0);
}