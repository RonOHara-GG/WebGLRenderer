attribute vec3 aVertexPosition;
attribute vec2 aVertexUV;

uniform mat4 uMVPMatrix;
varying vec2 uv;

void main(void) 
{
	vec3 pos = (uMVPMatrix * vec4(aVertexPosition, 1.0)).xyz;
	//vec3 pos = (vec4(aVertexPosition, 1.0) * uMVPMatrix).xyz;
	gl_Position = vec4(pos.xy, 0.0, 1.0);
	//gl_Position = vec4(aVertexPosition, 1.0);
	uv = aVertexUV;
}