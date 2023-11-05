"use client";

import React, { useRef, useState } from "react";
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
  const [modalState, setModalState] = useState({
    position: {
      x: "0px",
      y: "0px",
    },
  });

  const HandleClose = () => {
    handleSubmit();
  };

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (modalRef.current) {
      const { clientX, clientY } = event;
      const rect = modalRef.current?.getBoundingClientRect();
      if (clientX === 0 && clientY === 0) return;
      const positionX = clientX - rect?.left;
      const positionY = clientY - rect?.top;
      setModalState((prev) => ({
        ...prev,
        position: { x: `${positionX}px`, y: `${positionY}px` },
      }));
    }
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
        className={`z-[1000] flex flex-col fixed right-0 bottom-0 w-[40%] min-w-[30%] max-w-full h-[60%] min-h-[55%] max-h-full dark:bg-light bg-light  m-auto rounded-md shadow-md resize overflow-auto ${
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-[30px] opacity-0 pointer-events-none"
        } duration-300 ease-in transition-[opacity,transform]   `}
      >
        <div
          draggable
          onDrag={handleDrag}
          className="drag- select-none cursor-pointer w-full flex justify-between items-center p-[10px] text-xl bg-dark text-light dark:bg-light dark:text-dark"
        >
          <div className="cursor-move">
            <MdOutlineDragIndicator />
          </div>
          <input
            onChange={(e) => onChange({ value: e.target.value, key: "title" })}
            value={data.title}
            placeholder="Title"
            className="bg-transparent text-white dark:text-dark outline-none text-center"
          />
          <button onClick={HandleClose}>
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
