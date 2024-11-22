import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";

import useOutsideClick from "../hooks/useOutsideClick";

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;
  return (
    <ModalContext.Provider value={{ open, close, openName }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: openWindowName }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(openWindowName) });
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-full bg-[rgba(255, 255, 255, 0.1)] backdrop-blur-md z-50 transition-all duration-500 dark:bg-[rgba(0, 0, 0, 0.3)] z-2">
      <div
        className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-8 transition-all duration-500 dark:bg-[#18212f]"
        ref={ref}
      >
        <button
          className="bg-blue border-violet-300 p-1 rounded-sm transform translate-x-2 transition-all duration-200 absolute top-3 right-4 hover:bg-[#f3f4f6] dark:text-[#9ca3af]"
          onClick={close}
        >
          <HiXMark />
        </button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
}

Modal.Window = Window;
Modal.Open = Open;

export default Modal;
