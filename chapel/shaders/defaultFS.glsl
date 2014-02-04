precision mediump float;

uniform sampler2D texture0;

uniform vec3 uLightDir0;
uniform vec3 uLightColor0;

varying vec3 normal;
varying vec2 uv;
            
void main(void) {	
	vec4 tex = texture2D(texture0, uv);
	float lit = max(dot(normal, -uLightDir0), 0.0);
	vec4 litColor = vec4(uLightColor0 * lit, 1.0);
	gl_FragColor = vec4(/*litColor.xyz */ tex.rgb, tex.a);
}