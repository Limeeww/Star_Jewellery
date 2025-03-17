import React from "react";
import { AiOutlineWarning, AiOutlineReload } from "react-icons/ai";

interface ErrorMessageProps {
  message: string;
  retry?: () => void; 
}

function ErrorMessage({ message, retry }: ErrorMessageProps) {
    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 bg-red-50 rounded-md text-center">
            <AiOutlineWarning className="text-red-600 w-8 h-8 mb-2" />
            <p className="text-red-600 font-semibold mb-1">
                Oops! Something went wrong.
            </p>
            <p className="text-red-500 text-sm mb-4">{message}</p>

            {retry && (
                <button
                    onClick={retry}
                    className="inline-flex items-center bg-red-600 text-white text-sm px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                    <AiOutlineReload className="mr-1" /> Try again
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;
