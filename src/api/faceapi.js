import * as faceapi from 'face-api.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const getData = async (table, q) => {
  const dataRef = collection(db, table);
  try {
    if (q) {
      const qq = query(dataRef, ...q);
      const data = await getDocs(qq);
      return data.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));
    } else {
      const data = await getDocs(dataRef);
      return data.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));
    }
  } catch {
    return `Failed to Get Data from ${table}`;
  }
};

const maxDescriptorDistance = 0.5;
let snapShotDescription = [];
let macth = [];

export async function loadModels() {
  const MODEL_URL = process.env.PUBLIC_URL + '/models';
  await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
  await faceapi.loadFaceLandmarkModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

export async function getFullFaceDescription(blob, inputSize = 512) {
  let scoreThreshold = 0.5;
  const OPTION = new faceapi.SsdMobilenetv1Options({
    inputSize,
    scoreThreshold,
  });
  let img = await faceapi.fetchImage(blob);
  let fullDesc = await faceapi
    .detectAllFaces(img, OPTION)
    .withFaceLandmarks()
    .withFaceDescriptors();
  return fullDesc;
}

export async function createMatcher(faceProfile) {
  let labeledDescriptors = faceProfile.map(
    (member) =>
      new faceapi.LabeledFaceDescriptors(
        member.rollno,
        member.face_data.map((descriptor) => new Float32Array(descriptor.des))
      )
  );
  let faceMatcher = new faceapi.FaceMatcher(
    labeledDescriptors,
    maxDescriptorDistance
  );
  return faceMatcher;
}

export async function getFaceRecognition(snapShots, department, batch) {
  const faceData = await getData('faceData', [
    where('batch', '==', batch),
    where('department', '==', department),
  ]);
  macth = [];
  snapShotDescription = [];
  for (let shot of snapShots) {
    let fullFaceDescription = await getFullFaceDescription(shot);
    snapShotDescription.push(fullFaceDescription);
  }
  for (let item of snapShotDescription) {
    for (let i of item) {
      const faceMatcher = await createMatcher(faceData);
      macth.push(faceMatcher.findBestMatch(i.descriptor));
    }
  }
  return macth;
}
