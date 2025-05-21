import React from "react";

interface DayInputProps {
  label?: string;
  register: any; // Передаём `register` из `useForm()`
  dayName: string; // Название поля для дня
  monthName: string; // Название поля для месяца
  yearName: string; // Название поля для года
  defaultDay?: string | number;
  defaultMonth?: string | number;
  defaultYear?: string | number;
}

function DayInput({
  label,
  register,
  dayName,
  monthName,
  yearName,
  defaultDay = "",
  defaultMonth = "",
  defaultYear = "",
}: DayInputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold mb-1">{label}</label>
      )}
      <div className="flex gap-2">
        <select
          className="w-1/3 border bg-white border-gray-300 p-2 
                                         focus:outline-none focus:border-black bg-transparent"
          defaultValue={defaultDay}
          {...register(dayName)}
        >
          <option value="">Day</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <select
          className="w-1/3 border bg-white border-gray-300 p-2 
                                         focus:outline-none focus:border-black bg-transparent"
          defaultValue={defaultMonth}
          {...register(monthName)}
        >
          <option value="">Month</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        <select
          className="w-1/3 border bg-white border-gray-300 p-2 
                                         focus:outline-none focus:border-black bg-transparent"
          defaultValue={defaultYear}
          {...register(yearName)}
        >
          <option value="">Year</option>
          {Array.from(
            { length: 80 },
            (_, i) => new Date().getFullYear() - i
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default DayInput;
