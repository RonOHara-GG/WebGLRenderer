attribute vec2 aCornerNormal;

attribute vec4 aSpritePosition;
attribute vec4 aSpriteColor;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;

uniform vec3 uViewUp;
uniform vec3 uViewRight;

varying vec4 spriteColor;


void main(void) 
{
	vec3 cornerVec = normalize((-uViewUp * aCornerNormal.y) + (uViewRight * aCornerNormal.x)) * aSpritePosition.w;

	vec4 viewPos = uMVMatrix * vec4(aSpritePosition, 1.0);
	viewPos.xyz += cornerVec;

	gl_Position = uPMatrix * viewPos;
	spriteColor = aSpriteColor;
}