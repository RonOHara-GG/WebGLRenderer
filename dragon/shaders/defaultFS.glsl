precision mediump float;

uniform vec3 uDLightDir0;
uniform vec3 uDLightColor0;

uniform vec3 uPLightPos0;
uniform vec3 uPLightColor0;
uniform vec3 uPLightAtt0;

varying vec3 normal;
varying vec4 viewPos;

vec3 directionalLights(vec3 n)
{
	float lit = max(dot(n, -uDLightDir0), 0.0);
	vec3 litColor = uDLightColor0 * lit;
	return litColor;
}

vec3 pointLights(vec3 n)
{
	vec3 lightDir = uPLightPos0 - viewPos.xyz;

	float dist = length(lightDir);

	float ndotl = max(dot(n, normalize(lightDir)), 0.0);
	vec3 litColor = vec3(0);
	if( ndotl > 0.0 )
	{
		float att = 1.0 / (uPLightAtt0.x + (uPLightAtt0.y * dist) + (uPLightAtt0.z * dist * dist));
		litColor = uPLightColor0 * ndotl * att;
	}
	
	return litColor;
}
            
void main(void) {
	vec3 n = normalize(normal);	
	vec3 dlit = directionalLights(n);
	vec3 plit = pointLights(n);

	vec3 litColor = dlit + plit;

	gl_FragColor = vec4(litColor.x, litColor.y, litColor.z, 1.0);
}