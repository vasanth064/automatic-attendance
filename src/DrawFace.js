import React, { useState } from 'react';

const DrawFace = ({ snapShots, snapShotDescription, macth }) => {
  const [shots] = useState(snapShots);
  const [shotsDescription] = useState(snapShotDescription);
  const [macthedShots] = useState(macth);



  return (
    <div>
      {
      shots&&shotsDescription&& macthedShots&&
      shotsDescription.map((detection, i) => {
        const relativeBox = detection.relativeBox;
        const dimension = detection._imageDims;
        let _X = imageWidth * relativeBox._x;
        let _Y =
          (relativeBox._y * imageWidth * dimension._height) / dimension._width;
        let _W = imageWidth * relativeBox.width;
        let _H =
          (relativeBox.height * imageWidth * dimension._height) /
          dimension._width;
      }&&
      shots.map((shot, index) => (
        <div key={index} className='imageContainer'>
          <img src={shot} alt={shot} id='image' />
        </div>
      ))}
    </div>
  )
};

export default DrawFace;
