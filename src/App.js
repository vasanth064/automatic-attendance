import React, { useEffect, useState } from 'react';
import VideoSnapshot from 'video-snapshot';
import {
  getFullFaceDescription,
  loadModels,
  createMatcher,
} from './faceApi/faceapi';
const faceData = require('./faceApi/faceData/faceData.json');
function App() {
  const [shots, setShots] = useState([]);
  let snapShots = [];
  let snapShotDescription = [];
  let macth = [];

  useEffect(() => {
    loadModels();
  }, []);
  const getVideoDuration = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const media = new Audio(reader.result);
        media.onloadedmetadata = () => resolve(media.duration);
      };
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
    });

  const handleChange = async (e) => {
    const duration = await getVideoDuration(e.target.files[0]);
    const snapShotTime = [
      3,
      Math.round(duration / 4),
      Math.round(duration / 2),
      Math.round(duration - 3),
    ];

    await getSnapShot(e.target.files[0], snapShotTime);
  };

  const getSnapShot = async (video, snapShotTime) => {
    for (let time in snapShotTime) {
      let snapshoter = new VideoSnapshot(video);
      let previewSrc = await snapshoter.takeSnapshot(snapShotTime[time]);
      snapShots.push(previewSrc);
      setShots((prevItems) => [...prevItems, previewSrc]);
    }
    getFaceRecognition(snapShots);
  };

  const getFaceRecognition = async (snapShots) => {
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
    console.log(macth);
  };

  return (
    <div>
      <input type='file' onChange={(e) => handleChange(e)} />
      <div className='container'>
        {shots &&
          shots.map((shot, index) => (
            <div key={index} className='imageContainer'>
              <img src={shot} alt={shot} id='image' />
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
