precision mediump float;

uniform vec3 uLightDir0;
uniform vec3 uLightColor0;

uniform sampler2D texture0;

varying vec3 normal;
varying vec4 shadowPosition;
            
void main(void) {
	vec3 depth = shadowPosition.xyz / shadowPosition.w;
	float shadowValue = (texture2D(texture0, depth.xy).r > (depth.z * 0.98)) ? 1.0 : 0.0;
	
	float lit = max(dot(normal, -uLightDir0), 0.0);
	vec4 litColor = vec4(uLightColor0 * lit * shadowValue, 1.0);
	gl_FragColor = vec4(litColor.x, litColor.y, litColor.z, 1.0);
}