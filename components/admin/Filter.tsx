import React, { useState } from 'react';

interface FilteredComponentProps {
  dynamicOptions: string[]; // The dynamic options passed as props
  onFilterApply: (filters: Filters) => void; // Callback function for filter logic
}

interface Filters {
  staticOption1: string;
  staticOption2: string;
  dynamicOption: string;
  startDate: Date | null;
  endDate: Date | null;
}

const FilteredComponent: React.FC<FilteredComponentProps> = ({ dynamicOptions, onFilterApply }) => {
  const [staticOption1, setStaticOption1] = useState<string>('Option 1');
  const [staticOption2, setStaticOption2] = useState<string>('Option A');
  const [dynamicOption, setDynamicOption] = useState<string>(dynamicOptions[0]);
  const [timeOption, setTimeOption] = useState<string>('Today');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleStaticOption1Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStaticOption1(event.target.value);
  };

  const handleStaticOption2Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStaticOption2(event.target.value);
  };

  const handleDynamicOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDynamicOption(event.target.value);
  };

  const handleTimeOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setTimeOption(value);

    if (value === 'Custom') {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleApplyFilters = () => {
    const filters: Filters = {
      staticOption1,
      staticOption2,
      dynamicOption,
      startDate,
      endDate,
    };

    onFilterApply(filters);
  };

  return (
    <div>
      <div>
        <label>Static Option 1:</label>
        <select value={staticOption1} onChange={handleStaticOption1Change}>
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
        </select>
      </div>

      <div>
        <label>Static Option 2:</label>
        <select value={staticOption2} onChange={handleStaticOption2Change}>
          <option value="Option A">Option A</option>
          <option value="Option B">Option B</option>
          <option value="Option C">Option C</option>
        </select>
      </div>

      <div>
        <label>Dynamic Option:</label>
        <select value={dynamicOption} onChange={handleDynamicOptionChange}>
          {dynamicOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Time:</label>
        <select value={timeOption} onChange={handleTimeOptionChange}>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
          <option value="Custom">Custom</option>
        </select>
      </div>

      {timeOption === 'Custom' && (
        <div>
          <label>Start Date:</label>
          {/* <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
          <label>End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          /> */}
        </div>
      )}

      <button onClick={handleApplyFilters}>Apply Filters</button>
    </div>
  );
};

export default FilteredComponent;
