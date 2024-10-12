import React from 'react';

import "./numbers.css";

interface NumbersDisplayProps {
  numbers: number[];
}

const NumbersDisplay: React.FC<NumbersDisplayProps> = ({ numbers }) => {
  const threedots = numbers.length > 20;
  const ending = threedots ? "...]" : "]";
  numbers = threedots ? numbers.slice(0, 20) : numbers;

  return (
    <div className="numbers-display">
      {"["}{numbers.map((number, index) => (
        <span key={index} className="number-item">
          {number}
          {index < numbers.length - 1 && ', '} {/* Add comma between numbers except for the last one */}
        </span>
      ))}{ending}
    </div>
  );
};

export default NumbersDisplay;
