"use client";

import React from "react";
import GenericListForm from "@/app/components/FormComponents/GenericListForm";
import InputField from "@/app/components/FormComponents/InputField";

interface CollectionImagesFormProps {
  images: string[];
  onChange: (newImages: string[]) => void;
}

export default function CollectionImagesForm({
  images,
  onChange,
}: CollectionImagesFormProps) {
  return (
    <GenericListForm
      label="Image URLs"
      items={images}
      onChange={onChange}
      createNewItem={() => ""}
      addButtonLabel="Add Image URL"
      removeButtonLabel="Delete Image"
      renderItem={(url: string, idx: number, setUrl: (u: string) => void) => (
        <InputField
          value={url}
          onChange={setUrl}
          placeholder="https://example.com/image.jpg"
        />
      )}
    />
  );
}
