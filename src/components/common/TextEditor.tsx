"use client";

import React, { useMemo } from "react";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import dynamic from "next/dynamic";
import { ReactQuillProps } from "react-quill";

function TextEditor(Props: ReactQuillProps) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };
  return (
    <ReactQuill
      {...Props}
      className="flex flex-col h-full [&_*]:p-0"
      modules={modules}
    />
  );
}

export default TextEditor;
