import { Field, Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useFirestore } from '../context/FirestoreContext';
import { loadModels } from './../api/faceapi';
import { getVideoDuration, getSnapShot } from './../api/snapShotapi';

function Home() {
  const [shots, setShots] = useState([]);
  const [studentsPresent, setStudentsPresent] = useState([]);
  const [status, setStatus] = useState('Input A Video');
  const [stausCode, setStausCode] = useState(0);
  const [rollno, setRollno] = useState('');
  const [department, setDepartment] = useState('');
  const [batch, setBatch] = useState('');
  const { addData } = useFirestore();
  useEffect(() => {
    loadModels();
  }, []);
  const videoInputRef = useRef();
  useEffect(() => {
    setStausCode(0);
    setStudentsPresent([]);
    setShots([]);
    if (department && batch) {
      videoInputRef.current.value = '';
    }
  }, [department, batch]);
  useEffect(() => {
    switch (stausCode) {
      case 0:
        setStatus('Input Class Video');
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
    setStudentsPresent([]);
    setStausCode(0);
    if (e.target.files[0]) {
      setStausCode(1);
      const duration = await getVideoDuration(e.target.files[0]);
      setTimeout(() => {
        setStausCode(2);
      }, 1000);
      const snapShotTime = [
        2,
        Math.round(duration / 4),
        Math.round(duration / 2),
        Math.round(duration - 2),
      ];
      const shot = await getSnapShot(
        e.target.files[0],
        snapShotTime,
        department,
        batch
      );
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
      setStudentsPresent(studentnames);
      setStausCode(5);
    }
  };

  return (
    <div style={{ postion: 'relative' }}>
      <div
        className={
          stausCode === 0 || stausCode === 5 ? 'status' : 'statusActive'
        }>
        <h1 style={{ marginBottom: '1rem' }}>{status}</h1>
      </div>

      <div
        className='container'
        style={
          stausCode === 0 || stausCode === 5
            ? null
            : { overflow: 'hidden', height: '89vh' }
        }>
        <div className='imageContainer'>
          {shots &&
            shots.map((item, index) => (
              <img src={item} alt={item} key={index} id='image' width='50%' />
            ))}
        </div>
        {studentsPresent.length >= 1 ? (
          <h1>Students Present In Video</h1>
        ) : null}
        {stausCode === 5 && (
          <ul className='attendess'>
            {studentsPresent &&
              studentsPresent.map((item, index) => (
                <li
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <h3>{item}</h3>
                  <button
                    style={{
                      marginLeft: '1rem',
                      padding: '0.5rem 1rem',
                    }}
                    onClick={() => {
                      const ref = studentsPresent.filter(
                        (student) => student !== item
                      );
                      setStudentsPresent(ref);
                    }}>
                    &#x274C;
                  </button>
                </li>
              ))}
            <li
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30rem',
              }}>
              <input
                value={rollno}
                onChange={(e) => setRollno(e.target.value)}
              />
              <button
                style={{
                  marginLeft: '1rem',
                  padding: '0.5rem 1rem',
                  width: '15%',
                }}
                onClick={() => {
                  setStudentsPresent((prevData) => [...prevData, rollno]);
                  setRollno('');
                }}>
                Add
              </button>
            </li>
          </ul>
        )}
        <Formik
          initialValues={{
            department: '',
            courseCode: '',
            semester: '',
            staffID: '',
            hour: '',
            batch: '',
            date: '',
          }}
          onSubmit={async (values) => {
            const data = {
              ...values,
              studentsPresent,
            };
            await addData('attendance', data);
            document.querySelector('#attendance').reset();
          }}>
          {({ isSubmitting, setFieldValue }) => (
            <Form id='attendance'>
              <label>Department :</label>
              <Field
                as='select'
                name='department'
                value={department}
                required
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setFieldValue('department', e.target.value);
                }}>
                <option>Select</option>
                <option value='Apparel Technology'>DAT</option>
                <option value='Automobile Engneering'>DAE</option>
                <option value='Computer Engneering'>DCE</option>
                <option value='Computer Networking'>DCN</option>
                <option value='Electrical and Electronics Engneering'>
                  DEEE
                </option>
                <option value='Electronics and Communication Engneering'>
                  DECE
                </option>
                <option value='Foundary Technology'>DFT</option>
                <option value='Information Technology'>DIT</option>
                <option value='Mechanical Engneering'>DME</option>
                <option value='Mechatronics Engneering'>DMT</option>
                <option value='Textile Technology'>DFT</option>
              </Field>

              <label>Batch :</label>
              <Field
                as='select'
                name='batch'
                value={batch}
                required
                onChange={(e) => {
                  setBatch(e.target.value);
                  setFieldValue('batch', e.target.value);
                }}>
                <option>Select</option>
                <option value='2019'>2019</option>
                <option value='2020'>2020</option>
                <option value='2021'>2021</option>
                <option value='2022'>2022</option>
              </Field>
              {department && batch && (
                <>
                  <label>Class Video</label>
                  <input
                    type='file'
                    onChange={(e) => handleChange(e)}
                    ref={videoInputRef}
                  />
                </>
              )}

              <label>Course Code :</label>
              <Field type='text' name='courseCode' required />

              <label>Semester :</label>
              <Field as='select' name='semester' required>
                <option>Select</option>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
                <option value='6'>6</option>
                <option value='7'>7</option>
                <option value='8'>8</option>
              </Field>
              <label>Staff ID :</label>
              <Field type='text' name='staffID' required />
              <label>Date</label>
              <Field type='date' name='date' required />
              <label>Hour :</label>
              <Field type='text' name='hour' required />
              {stausCode === 5 && (
                <button type='submit' disabled={isSubmitting}>
                  Submit
                </button>
              )}
            </Form>
          )}
        </Formik>
        <br />
      </div>
    </div>
  );
}

export default Home;
