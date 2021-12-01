import * as faceapi from 'face-api.js';

const maxDescriptorDistance = 0.5;

export async function loadModels() {
	const MODEL_URL = process.env.PUBLIC_URL + '/models';
	await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
	await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
	await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

export async function getFullFaceDescription(blob, inputSize = 512) {
	let scoreThreshold = 0.5;
	const OPTION = new faceapi.TinyFaceDetectorOptions({
		inputSize,
		scoreThreshold,
	});
	const useTinyModel = true;
	let img = await faceapi.fetchImage(blob);
	let fullDesc = await faceapi
		.detectAllFaces(img, OPTION)
		.withFaceLandmarks(useTinyModel)
		.withFaceDescriptors();
	return fullDesc;
}

export async function createMatcher(faceProfile) {
	let labeledDescriptors = faceProfile.map(
		(member) =>
			new faceapi.LabeledFaceDescriptors(
				member.name,
				member.descriptors.map((descriptor) => new Float32Array(descriptor))
			)
	);
	let faceMatcher = new faceapi.FaceMatcher(
		labeledDescriptors,
		maxDescriptorDistance
	);
	return faceMatcher;
}

export function isFaceDetectionModelLoaded() {
	return !!faceapi.nets.tinyFaceDetector.params;
}
