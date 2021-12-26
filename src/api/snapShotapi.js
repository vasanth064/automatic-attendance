import VideoSnapshot from 'video-snapshot';
import { getFaceRecognition } from './faceapi';

let snapShots = [];

export function getVideoDuration(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const media = new Audio(reader.result);
			media.onloadedmetadata = () => resolve(media.duration);
		};
		reader.readAsDataURL(file);
		reader.onerror = (error) => reject(error);
	});
}

export async function getSnapShot(video, snapShotTime) {
	snapShots = [];
	for (let time in snapShotTime) {
		let snapshoter = new VideoSnapshot(video);
		let previewSrc = await snapshoter.takeSnapshot(snapShotTime[time]);
		snapShots.push(previewSrc);
	}
	let v = getFaceRecognition(snapShots);
	return [snapShots, v];
}
