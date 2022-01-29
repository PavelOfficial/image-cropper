import React from 'react';

import './Button.css';

type Props = {
  onClick: () => void,
};

export const Button:React.FC<Props> = ({ children, onClick }) => {
  return (
    <button type="button"
            className="primary-button"
            onClick={onClick}
    >
      {children}
    </button>
  );
}
