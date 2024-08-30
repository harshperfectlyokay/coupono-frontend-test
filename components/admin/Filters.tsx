// src/app/admin/components/Filters.tsx
import React from 'react';

const Filters: React.FC = () => {
  return (
    <div className="mb-4">
      <input type="text" placeholder="Search..." className="mr-2 border p-2" />
      <button className="p-2 bg-blue-500 text-white">Filter</button>
    </div>
  );
};

export default Filters;
