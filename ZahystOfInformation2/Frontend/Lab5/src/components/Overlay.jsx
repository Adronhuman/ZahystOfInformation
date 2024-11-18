import 'react';

/* eslint-disable react/prop-types */
export const LoadingOverlay = (props) => {
    return props.active ? (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',  // Semi-transparent background
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'all',
        }}
      >
        <div style={{ color: 'white', fontSize: '20px' }}>Set keys first👺</div>
      </div>
    ) : null;
  };
  