import type { ReactNode } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

//Karena ReactNode dapat menerima JSX, teks, angka, fragment, dan nilai renderable lainnya.
type ModalProps = {
  children: ReactNode;
};

const Modal = ({ children }: ModalProps) => {
  const elRef = useRef<HTMLDivElement>(null);

  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const modalRoot = document.getElementById("modal");
    const element = elRef.current;

    if (!modalRoot || !element) {
      return;
    }

    modalRoot.appendChild(element);

    return () => {
      modalRoot.removeChild(element);
    };
  }, []);

  return createPortal(<div className="">{children}</div>, elRef.current);
};

export default Modal;
