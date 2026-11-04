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
    elRef.current.className =
      "max-h-[calc(100dvh-2rem)] w-full max-w-[900px] overflow-y-auto rounded-[30px] bg-background p-[15px] text-center";
  }

  useEffect(() => {
    const modalRoot = document.getElementById("modal");
    const element = elRef.current;

    if (!modalRoot || !element) {
      return;
    }

    modalRoot.appendChild(element);
    const previousFocus = document.activeElement;
    const appRoot = document.getElementById("root");
    const wasInert = appRoot?.inert ?? false;
    if (appRoot) appRoot.inert = true;
    element.tabIndex = -1;
    element.focus();

    function keepFocusInDialog(event: KeyboardEvent) {
      if (event.key !== "Tab" || !element) return;
      const controls = element.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) {
        event.preventDefault();
        element.focus();
      } else if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === element)
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    element.addEventListener("keydown", keepFocusInDialog);

    return () => {
      element.removeEventListener("keydown", keepFocusInDialog);
      if (appRoot) appRoot.inert = wasInert;
      modalRoot.removeChild(element);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Order details">
      {children}
    </div>,
    elRef.current,
  );
};

export default Modal;
