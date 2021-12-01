import React, { useState, useRef, useEffect } from 'react';
import { loadModels, getFullFaceDescription } from './faceApi/faceapi';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const DescriptorsGenerator = () => {
  useEffect(() => {
    loadModels();
  }, []);
  const [image, setImage] = useState();
  const [descriptors, setDescriptors] = useState([]);
  const imageRef = useRef();
  const handleFileChange = async () => {
    setDescriptors([]);
    setImage();
    setImage(URL.createObjectURL(imageRef.current.files[0]));
  };
  const getDescriptors = async () => {
    const fullFaceDescription = await getFullFaceDescription(image);
    fullFaceDescription.map((item) =>
      item.descriptor.map((item) =>
        setDescriptors((prevItem) => [item, ...prevItem])
      )
    );
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <br />
      <br />
      <input
        accept='.jpg, .jpeg, .png'
        type='file'
        ref={imageRef}
        onChange={handleFileChange}
      />
      <br />
      {image && (
        <img src={image} alt='des' style={{ height: '500px', width: 'auto' }} />
      )}
      {descriptors && image && (
        <>
          <h1>Click to Copy Descriptors</h1>
          <CopyToClipboard text={`[${descriptors}]`}>
            <div
              style={{
                margin: '10px',
                background: 'black',
                color: 'white',
                padding: '50px',
              }}>
              <span
                style={{
                  wordBreak: 'break-all',
                }}>{`[${descriptors}]`}</span>
            </div>
          </CopyToClipboard>
        </>
      )}
      <br />
      <br />
      <button onClick={getDescriptors}>submit</button>
    </div>
  );
};

export default DescriptorsGenerator;
