import React, { useState } from 'react';

export default function ToggleButton() {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <label className="switch">
        <input type="checkbox" checked={isChecked} onChange={handleToggle} />
        <span className="slider round"></span>
      </label>
    </div>
  );
}
