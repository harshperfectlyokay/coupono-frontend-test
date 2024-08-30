import React from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

interface SortableHeaderProps {
  title: string;
  className: string;
  sortField: string;
  currentSort: { field: string; direction: 'asc' | 'desc' | null };
  onSortChange: (field: string, direction: 'asc' | 'desc') => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  title,
  sortField,
  className,
  currentSort,
  onSortChange
}) => {
  const handleSort = () => {
    if (currentSort.field === sortField) {
      const newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
      onSortChange(sortField, newDirection);
    } else {
      onSortChange(sortField, 'asc');
    }
  };

  return (
    <th className={`${className} px-2 py-2 border cursor-pointer`} onClick={handleSort}>
      {title}
      {currentSort.field === sortField ? (
        currentSort.direction === 'asc' ? (
          <FaSortUp className="inline ml-2" />
        ) : (
          <FaSortDown className="inline ml-2" />
        )
      ) : (
        <FaSort className="inline ml-2" />
      )}
    </th>
  );
};

export default SortableHeader;
