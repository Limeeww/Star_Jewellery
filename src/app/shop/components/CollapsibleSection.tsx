import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

type CollapsibleSectionProps = {
  title: string;
  count: number;
  children: React.ReactNode;
};

export function CollapsibleSection({
  title,
  count,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full justify-between items-center font-semibold mb-4 text-sm"
      >
        <span className="flex items-center space-x-1">
          <span>{title}</span>
          {count > 0 && <span>({count})</span>}
        </span>

        <span className="text-xs">
          {open ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </span>
      </button>
      {open && <div className="pl-2 space-y-2">{children}</div>}
      <hr className="my-4 border-gray-200" />
    </div>
  );
}
