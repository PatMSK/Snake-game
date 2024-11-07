// src/components/Snake.js
import React from 'react';
import './Snake.css';

function Snake({ segments }) {
  return (
    <>
      {segments.map((segment, index) => (
        <div
          key={index}
          className="snake-segment"
          style={{ left: `${segment.x * 20}px`, top: `${segment.y * 20}px` }}
        />
      ))}
    </>
  );
}

export default Snake;
