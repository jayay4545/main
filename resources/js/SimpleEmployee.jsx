import React from 'react';

// Simple Employee component for testing
const SimpleEmployee = () => {
  console.log('SimpleEmployee component rendering');
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'lightgreen', 
      border: '2px solid green', 
      borderRadius: '5px', 
      margin: '20px', 
      fontSize: '18px' 
    }}>
      <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Simple Employee Component Loaded</h3>
      <p>This is a simplified version of the Employee component for testing.</p>
    </div>
  );
};

export default SimpleEmployee;