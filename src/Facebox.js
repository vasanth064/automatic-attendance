import React from 'react';

const Facebox = ({ alignedRect }) => {
  return (
    <>
      {alignedRect.map((item, index) => (
        <div
          style={{
            position: 'absolute',
            width: `${item._box.width}px)`,
            height: `${item._box.height}px)`,
            top: `${item._box.top}px`,
            left: `${item._box.left}px`,
            border: '1px solid black',
          }}
          key={index}>
          <span
            style={{
              fontSize: '1.8rem',
              width: '100%',
              background: 'black',
              color: 'white',
              display: 'block',
            }}>
            {index}
          </span>
        </div>
      ))}
    </>
  );
};

export default Facebox;
