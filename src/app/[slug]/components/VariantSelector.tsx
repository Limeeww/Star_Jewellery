"use client";

import React from "react";
import { useForm } from "react-hook-form";
import SelectField from "../../components/FormComponents/SelectField";
import SubmitButton from "../../components/FormComponents/SubmitButton";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { ProductVariant } from "../../types/product";

export interface FormValues {
  size: string;
  inserts: string;
  materialColor: string;
}

interface Props {
  sizeOptions: { label: string; value: string }[];
  insertOptions: { label: string; value: string }[];
  materialColorOptions: { label: string; value: string }[];
  variant: ProductVariant;
  onAddToCart: (data: FormValues) => void;
  onInsertChange?: (value: string) => void;
  onColorChange?: (value: string) => void;
}

export default function VariantSelector({
  sizeOptions,
  insertOptions,
  materialColorOptions,
  variant,
  onAddToCart,
  onInsertChange,
  onColorChange,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      size: "",
      inserts: variant.insert,
      materialColor: variant.materialColor,
    },
  });

  return (
    <form onSubmit={handleSubmit(onAddToCart)} className="space-y-6">
      <div className="flex space-x-4">
        <SelectField
          label="Available Sizes"
          id="size"
          register={register("size", { required: "Size is required" })}
          error={errors.size}
          options={sizeOptions}
          placeholder="Select size"
          className="w-1/2"
        />

        <SelectField
          label="Inserts"
          id="inserts"
          register={register("inserts", {
            required: true,
            onChange: (e) => onInsertChange?.(e.target.value),
          })}
          error={errors.inserts}
          options={insertOptions}
          placeholder="Select insert"
          className="w-1/2"
        />
      </div>

      <SelectField
        label="Material Color"
        id="materialColor"
        register={register("materialColor", {
          required: true,
          onChange: (e) => onColorChange?.(e.target.value),
        })}
        error={errors.materialColor}
        options={materialColorOptions}
        placeholder="Select Material Color"
        className="w-full"
      />

      <SubmitButton
        label={
          <>
            <AiOutlineShoppingCart className="inline mr-2 text-lg" /> Add to
            basket
          </>
        }
        isLoading={false}
        className="w-full"
      />
    </form>
  );
}
