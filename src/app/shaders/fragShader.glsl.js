export default /* glsl */`
#define NO_FILTER 0
#define GREYSCALE_FILTER 1
precision mediump float;
uniform int filter_id;

uniform sampler2D uTexture;
varying vec2 vUv;

vec3 img_greyscale(vec3 color){	
	const vec3 grey = vec3(0.2116,0.7152, 0.0722);
	return vec3(dot(grey,color));
}
vec4 rgb2rgba(vec3 color){
	return vec4(vec3(color),1);
}
void main() {
	vec3 color = texture2D(uTexture, vUv).xyz;
	vec3 finalColor;
	switch(filter_id){
		case NO_FILTER:
			finalColor = color;
			break;
		case GREYSCALE_FILTER:
			finalColor = img_greyscale(color);
			break;
	}
	gl_FragColor = rgb2rgba(finalColor);
	
}
`;
