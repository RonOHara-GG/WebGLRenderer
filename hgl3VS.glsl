#version 130

precision highp float;

uniform mat4 uProjMatrix;
uniform mat4 uViewMatrix;

in vec3 aVertexPosition;
in vec3 aVertexNormal;

out vec3 normal;

void main(void)
{
  //works only for orthogonal modelview
  normal = (uViewMatrix * vec4(aVertexNormal, 0)).xyz;
  
  gl_Position = uProjMatrix * uViewMatrix * vec4(aVertexPosition, 1);
}