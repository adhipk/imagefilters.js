export default /* glsl */`
#define NO_FILTER 0
#define GREYSCALE_FILTER 1
#define SOBEL_FILTER 2

precision mediump float;

uniform int filter_id;
uniform float width;
uniform float height;
uniform sampler2D uTexture;
varying vec2 vUv;

// utils
vec4 rgb2rgba(vec3 color) {
	return vec4(color, 1.0);
}

// filters
vec3 img_greyscale(vec3 color) {	
	const vec3 grey = vec3(0.2116, 0.7152, 0.0722);
	return vec3(dot(grey, color));
}

void make_kernel(inout vec4 n[9], sampler2D tex, vec2 coord) {
	float w = 1.0 / width;
	float h = 1.0 / height;

	n[0] = texture2D(tex, coord + vec2(-w, -h));
	n[1] = texture2D(tex, coord + vec2( 0.0, -h));
	n[2] = texture2D(tex, coord + vec2( w, -h));
	n[3] = texture2D(tex, coord + vec2(-w,  0.0));
	n[4] = texture2D(tex, coord);
	n[5] = texture2D(tex, coord + vec2( w,  0.0));
	n[6] = texture2D(tex, coord + vec2(-w,  h));
	n[7] = texture2D(tex, coord + vec2( 0.0, h));
	n[8] = texture2D(tex, coord + vec2( w,  h));
}

vec3 sobel_filter() {
	vec4 n[9];
	make_kernel(n, uTexture, vUv);

	vec4 sobel_edge_h = n[2] + 2.0 * n[5] + n[8] - (n[0] + 2.0 * n[3] + n[6]);
	vec4 sobel_edge_v = n[0] + 2.0 * n[1] + n[2] - (n[6] + 2.0 * n[7] + n[8]);
	vec4 sobel = sqrt((sobel_edge_h * sobel_edge_h) + (sobel_edge_v * sobel_edge_v));

	return vec3(1.0 - sobel.rgb);
}

void main() {
	vec3 color = texture2D(uTexture, vUv).rgb;
	vec3 finalColor;

	if (filter_id == NO_FILTER) {
		finalColor = color;
	} else if (filter_id == GREYSCALE_FILTER) {
		finalColor = img_greyscale(color);
	} else if (filter_id == SOBEL_FILTER) {
		finalColor = sobel_filter();
	} else {
		finalColor = color; // fallback (optional)
	}

	gl_FragColor = rgb2rgba(finalColor);
}
`;
