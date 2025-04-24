"use client";

import React from "react";

interface Props {
  images: string[];
  onChange: (newImages: string[]) => void;
}

export default function VariantImagesForm({ images, onChange }: Props) {
  const handleChange = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    onChange(updated);
  };

  const handleAdd = () => onChange([...images, ""]);

  const handleRemove = (index: number) =>
    onChange(images.filter((_, i) => i !== index));

  return (
    <div>
      <h5 className="text-sm font-semibold mt-4 mb-1">Image URLs</h5>

      {images.map((url, index) => (
        <div key={index} className="flex items-center gap-4 mb-2">
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={url}
            onChange={(e) => handleChange(index, e.target.value)}
            className="border p-2 rounded w-full"
          />

          <button
            type="button"
            onClick={() => handleRemove(index)}
            title="Delete image"
            className="text-red-500 text-xl flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-100 transition"
          >
            🗑
          </button>
        </div>
      ))}

      {/* кнопка добавить */}
      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded"
      >
        Add image URL
      </button>
    </div>
  );
}
