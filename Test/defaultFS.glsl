precision mediump float;

uniform vec3 uLightDir0;
uniform vec3 uLightColor0;

varying vec3 normal;
            
void main(void) {	
	float lit = max(dot(normal, -uLightDir0), 0.0);
	vec4 litColor = vec4(uLightColor0 * lit, 1.0);
	//gl_FragColor = vec4(litColor.x, litColor.y, litColor.z, 1.0);
	gl_FragColor = vec4(normal.x, normal.y, normal.z, 1.0);
}