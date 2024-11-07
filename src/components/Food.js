// src/components/Food.js
import React from 'react';
import './Food.css';

function Food({ position }) {
  return (
    <div
      className="food"
      style={{ left: `${position.x * 20}px`, top: `${position.y * 20}px` }}
    />
  );
}

export default Food;
