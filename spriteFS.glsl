precision mediump float;

uniform sampler2D texture0;

varying vec2 uv;
     
void main(void) {
	
	vec4 tex = texture2D(texture0, uv);
	gl_FragColor = vec4(tex.rgb, 1.0);
	//gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}