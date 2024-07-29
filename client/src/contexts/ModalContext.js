import React, { createContext, useContext, useState } from 'react';

export const ModalContext = createContext({});

export const ModalProvider = ({ children }) => {
  /*
    1. Set content modal 
    2. Trạng thái hiển thị
  */
  const [isPopup, setIsPopup] = useState(false);
  const [modalForm, setModalForm] = useState(null);

  const handleOutsideClick = (event) => {
    if (isPopup && event.target.className === 'wrap-modal') {
      setIsPopup(false);
    }
  };

  return (
    <ModalContext.Provider value={{
      setIsPopup,
      setModalForm
    }}>
      {children}
      <div className={isPopup ? 'd-block' : 'd-none'}>
            <div className="wrap-modal" onClick={handleOutsideClick}>{modalForm}</div>
        </div>
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  return context;
};
