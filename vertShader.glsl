attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVPMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uWorldMatrix;
uniform mat4 uShadowMatrix;

varying vec3 normal;
varying vec4 shadowPosition;

void main(void) 
{
	gl_Position = uMVPMatrix * vec4(aVertexPosition, 1.0);
	normal = uNormalMatrix * normalize(aVertexNormal);

	vec4 worldPosition = uWorldMatrix * vec4(aVertexPosition, 1.0);
	shadowPosition = uShadowMatrix* worldPosition;
	//shadowPosition = worldPosition;
}