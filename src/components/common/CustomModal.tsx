"use client";

import React, { useEffect, useRef, useState } from "react";
import { MdOutlineDragIndicator } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import TextEditor from "./TextEditor";

type Props = {
  data: {
    id: number;
    title: string;
    richText: string;
    date: string;
  };
  onChange: (e: { key: "title" | "richText" | "date"; value: string }) => void;
  handleSubmit: () => void;
  isOpen: boolean;
};

function CustomModal({ onChange, data, handleSubmit, isOpen }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [modalState, setModalState] = useState({
    position: {
      x: "0px",
      y: "0px",
    },
  });

  const HandleClose = () => {
    handleSubmit();
  };

  useEffect(() => {
    if (modalRef.current && isOpen) {
      const clientWidthHalf = modalRef.current.clientWidth / 2;
      const clientHeighHalf = modalRef.current.clientHeight / 2;
      setModalState((prev) => ({
        ...prev,
        position: {
          x: `calc(50vw - ${clientWidthHalf}px)`,
          y: `calc(50svh - ${clientHeighHalf}px)`,
        },
      }));
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalRef.current) return;
    isDraggingRef.current = true;
    const initialX = e.clientX - modalRef.current?.getBoundingClientRect().left;
    const initialY = e.clientY - modalRef.current?.getBoundingClientRect().top;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const { clientX, clientY } = e;
        const positionX = clientX - initialX;
        const positionY = clientY - initialY;
        setModalState((prev) => ({
          ...prev,
          position: { x: `${positionX}px`, y: `${positionY}px` },
        }));
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <div
        onClick={HandleClose}
        className={`dark:bg-[#000000ad] bg-[#00000082] fixed top-0 left-0 right-0 bottom-0 h-full w-full z-[999] ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } duration-300 ease-in`}
      />

      <div
        ref={modalRef}
        style={{ top: modalState.position.y, left: modalState.position.x }}
        className={`z-[1000] flex flex-col fixed w-[40%] min-w-[30%] max-w-full h-[60%] min-h-[55%] max-h-full dark:bg-light bg-light  m-auto rounded-md shadow-md resize overflow-auto ${
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-[30px] opacity-0 pointer-events-none"
        } duration-300 ease-in transition-[opacity,transform]   `}
      >
        <div
          onMouseDown={handleMouseDown}
          className="drag- select-none cursor-pointer w-full flex justify-between items-center p-[10px] text-xl bg-dark text-light dark:bg-light dark:text-dark"
        >
          <div className="cursor-move active::scale-[1.2] duration-300 ease-in">
            <MdOutlineDragIndicator />
          </div>
          <input
            onChange={(e) => onChange({ value: e.target.value, key: "title" })}
            value={data.title}
            placeholder="Title"
            className="bg-transparent text-white dark:text-dark outline-none text-center"
          />
          <button
            onClick={HandleClose}
            className="hover:scale-[1.2] duration-300 ease-in"
          >
            <IoClose />
          </button>
        </div>
        <div className="h-full dark:bg-dark bg-light">
          <TextEditor
            theme="snow"
            value={data.richText}
            onChange={(value) => onChange({ value, key: "richText" })}
          />
        </div>
      </div>
    </>
  );
}

export default CustomModal;
