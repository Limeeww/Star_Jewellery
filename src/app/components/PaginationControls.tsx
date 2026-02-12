"use client";
import React from "react";
import ActionButton from "@/app/components/FormComponents/ActionButton";

interface Props {
  hasPrev: boolean;
  hasNext: boolean;
  prevPage: () => void;
  nextPage: () => void;
  page: number;
  totalPages: number;
}

export function PaginationControls({
  hasPrev,
  hasNext,
  prevPage,
  nextPage,
  page,
  totalPages,
}: Props) {
  return (
    <div className="mt-8 flex justify-center items-center space-x-4">
      <ActionButton
        onClick={prevPage}
        disabled={!hasPrev}
        text="Previous"
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      />
      <span className="text-sm">
        Page {page + 1} of {totalPages}
      </span>
      <ActionButton
        onClick={nextPage}
        disabled={!hasNext}
        text="Next"
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      />
    </div>
  );
}
