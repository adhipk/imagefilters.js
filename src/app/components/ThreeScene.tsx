"use client";

import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";
import * as THREE from "three";
import DefaultFragShader from "~/shaders/fragShader.glsl";
import vertShader from "~/shaders/vertShader.glsl";

const Texture = ({
	texture,
	filter,
}: {
	texture: THREE.Texture;
	filter: number;
}) => {
	const uniforms = useMemo(
		() => ({
			uTexture: {
				value: texture,
			},
			filter_id: {
				value: filter,
			},
		}),
		[texture, filter]
	);

	return (
		<mesh position={[0, 0, -10]}>
			<planeGeometry attach='geometry' args={[10, 10]} />
			<shaderMaterial
				key={`shader-${filter}`}
				attach='material'
				fragmentShader={DefaultFragShader}
				vertexShader={vertShader}
				uniforms={uniforms}
			/>
		</mesh>
	);
};

const Image = ({ url, filter }: { url: string; filter: number }) => {
	const loader = new THREE.TextureLoader();
	const texture = useMemo(() => loader.load(url), [url]);
	return <Texture texture={texture} filter={filter} />;
};

export default function ThreeScene({ imageSrc }: { imageSrc: string }) {
	const [filter, setfilter] = useState<number>(0);
	return (
		<div className='flex flex-col'>
			<Canvas
				camera={{ position: [0, 0, 0], fov: 75 }}
				style={{
					width: "800px",
					height: "600px",
				}}
				className='canvas'
			>
				<Image url={imageSrc} filter={filter} />
				<OrbitControls />
				<Stats />
			</Canvas>
			<button
				onClick={() => {
					setfilter((filter + 1) % 2);
					console.log(filter);
				}}
				className='bg-red rounded p-4'
			>
				click me
			</button>
		</div>
	);
}
