import React, { useEffect, useState } from 'react';
import { loadModels } from './api/faceapi';
import { getVideoDuration, getSnapShot } from './api/snapShotapi';
import './App.css';

function App() {
  const [shots, setShots] = useState([]);
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('Input A Video');
  const [stausCode, setStausCode] = useState(0);

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    switch (stausCode) {
      case 0:
        setStatus('Input A Video');
        break;
      case 1:
        setStatus('Video Uploaded');
        break;
      case 2:
        setStatus('Talking Snapshots');
        break;
      case 3:
        setStatus('Doing Face Recogination');
        break;
      case 4:
        setStatus('Sorting Students');
        break;
      case 5:
        setStatus('Completed');
        break;
      default:
        break;
    }
  }, [stausCode]);

  const handleChange = async (e) => {
    setShots([]);
    setStudents([]);
    if (e.target.files[0]) {
      setStausCode(1);
      const duration = await getVideoDuration(e.target.files[0]);
      setStausCode(2);
      const snapShotTime = [
        2,
        Math.round(duration / 4),
        Math.round(duration / 2),
        Math.round(duration - 2),
      ];
      const shot = await getSnapShot(e.target.files[0], snapShotTime);
      shot[0].map((item) => setShots((prevItems) => [...prevItems, item]));
      setStausCode(3);
      let macth = await shot[1];
      setStausCode(4);
      let studentnames = [];
      macth.map((item) => studentnames.push(item._label));
      studentnames = [...new Set(studentnames)];
      studentnames = studentnames.filter((value) => {
        return value !== 'unknown';
      });
      setStudents(studentnames);
      setStausCode(5);
    }
    setStausCode(0);
  };

  return (
    <div style={{ postion: 'relative' }}>
      <div className={stausCode === 0 ? 'status' : 'statusActive'}>
        <h1>{status}</h1>
      </div>
      <div className='container'>
        <input
          type='file'
          onChange={(e) => handleChange(e)}
          className='fileInput'
        />
        <div className='imageContainer'>
          {shots &&
            shots.map((item, index) => (
              <img src={item} alt={item} key={index} id='image' width='50%' />
            ))}
        </div>
        {students.length >= 1 ? <h1>Students Present In Video</h1> : null}
        <div className='attendess'>
          {students &&
            students.map((item, index) => <h3 key={index}>{item}</h3>)}
        </div>
      </div>
    </div>
  );
}

export default App;
