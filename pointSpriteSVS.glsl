attribute vec2 aCornerNormal;

uniform vec4 aSpritePosition;
uniform vec4 aSpriteColor;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;

uniform vec3 uViewUp;
uniform vec3 uViewRight;

varying vec4 spriteColor;
varying vec2 uv;


void main(void) 
{
	vec3 up = -uViewUp * aCornerNormal.y;
	vec3 right = uViewRight * aCornerNormal.x;

	vec3 cornerVec = normalize(up + right) * aSpritePosition.w;

	vec4 viewPos = uMVMatrix * vec4(aSpritePosition.xyz, 1.0);
	viewPos.xyz += vec3(aCornerNormal, 0) * aSpritePosition.w;

	gl_Position = uPMatrix * viewPos;
	spriteColor = aSpriteColor;
	
	uv = (aCornerNormal + vec2(1, 1)) * 0.5;
}