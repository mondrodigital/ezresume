import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css"; // Import the Quill theme

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TextEditor({ value, onChange, placeholder }: Props) {
  const quillRef = useRef<ReactQuill>(null);

  // Define Quill toolbar options
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"]
    ]
  };

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      placeholder={placeholder}
    />
  );
} 