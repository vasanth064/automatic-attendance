import React, { useState, useRef, useEffect } from 'react';
import { loadModels, getFullFaceDescription } from '../api/faceapi';

import { CopyToClipboard } from 'react-copy-to-clipboard';

const DescriptorsGenerator = () => {
  useEffect(() => {
    loadModels();
  }, []);
  const [image, setImage] = useState();

  const [descriptors, setDescriptors] = useState([]);
  const imageRef = useRef();
  const handleFileChange = () => {
    setImage();
    setDescriptors([]);
    setImage(URL.createObjectURL(imageRef.current.files[0]));
  };
  const getDescriptors = async () => {
    setDescriptors([]);
    const fullFaceDescription = await getFullFaceDescription(image);

    for (let item of fullFaceDescription) {
      setDescriptors((prevItem) => [...prevItem, [item.descriptor]]);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <h1>Descriptors Generator</h1>
      <br />
      <br />
      <input type='file' ref={imageRef} onChange={handleFileChange} />
      <br />
      <br />
      {imageRef.current?.files[0] && (
        <button onClick={getDescriptors}>submit</button>
      )}

      <br />
      <br />
      {descriptors && image && (
        <h2>
          {descriptors ? `${descriptors.length} Face Found` : 'Face Not Found'}
        </h2>
      )}
      {image && (
        <div
          style={{
            position: 'relative',
          }}>
          <img src={image} alt='des' height='15%' width='15%' />
        </div>
      )}
      {image &&
        descriptors.map((item, index) => (
          <div
            key={index}
            style={{
              margin: '10px',
              padding: '10px',
            }}>
            <CopyToClipboard text={`[${item}]`}>
              <div
                style={{
                  margin: '10px',
                  background: 'black',
                  color: 'white',
                  padding: '50px',
                }}>
                <h1>{index}</h1>
                <span
                  style={{
                    wordBreak: 'break-all',
                  }}>{`[${item}]`}</span>
              </div>
            </CopyToClipboard>
          </div>
        ))}
    </div>
  );
};

export default DescriptorsGenerator;
