import React, { useState } from "react";

interface DatePickerProps {
  title: string;
  onChange: (date: Date | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ title, onChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value ? new Date(event.target.value) : null;
    setSelectedDate(date);
    onChange(date);
  };

  return (
    <div className='px-2 py-2 basic-dropdown'>
      <label>{title}:</label>
      <input
        type="date"
        value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
        onChange={handleChange}
      />
    </div>
  );
};

export default DatePicker;
