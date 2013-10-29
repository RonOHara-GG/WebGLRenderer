attribute vec3 aVertexPosition;
attribute vec2 aVertexUV;

uniform mat4 uMVPMatrix;
varying vec2 uv;

void main(void) 
{
//http://media.tojicode.com/webgl-samples/depth-texture.html
	vec3 pos = (uMVPMatrix * vec4(aVertexPosition, 1.0)).xyz;
	gl_Position = vec4(pos.xy, 0.0, 1.0);
	uv = aVertexUV;
}