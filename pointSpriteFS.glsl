precision mediump float;

uniform sampler2D texture0;

varying vec4 spriteColor;
varying vec2 uv;
            
void main(void) {
	vec4 tex = texture2D(texture0, uv);
	float alpha = spriteColor.a * (((tex.r + tex.g + tex.b) < 0.1) ? 0.0 : tex.a);
	gl_FragColor = vec4(spriteColor.rgb * tex.rgb, alpha);
}