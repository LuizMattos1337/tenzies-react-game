import React, { useState } from 'react';
import './die.css';

export default function Die(props) {
  const { isHeld, id, value, holdDice } = props;
  return (
    <div className={isHeld ? 'die held' : 'die'} id={id} onClick={holdDice}>
      <h2 className="die-value">{value}</h2>
    </div>
  );
}
