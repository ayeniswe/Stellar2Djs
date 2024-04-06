import '../../../style.css';
import React, { memo } from 'react';
import { ProgressBarsProps } from '../type';

/**
 * Displays a series of progress bars.
 * @returns {JSX.Element} - The `memoized` rendered ProgressBars component.
 */
const ProgressBars = memo(({ scaling, step, width }: ProgressBarsProps) => {
  const numOfBars = width / (scaling * step) + 1;

  return (
    <div className="Progress">
      {Array.from({ length: numOfBars }, (_, index) => {
        if (index > 0) {
          return (
            <div key={index} className="bar" style={{ left: `${index * scaling * step}px` }}>
              <span className="unit">{index * step}</span>
            </div>
          );
        }
      })}
    </div>
  );
});

ProgressBars.displayName = 'ProgressBars';

export default ProgressBars;
