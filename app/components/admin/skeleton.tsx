import React from 'react';

interface SkeletonProps {
  type: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ type }) => {
  switch (type) {
    case 'table':
      return (
        <table className="max-w-min md:min-w-full">
          <thead>
            <tr className="bg-stone-700 text-white text-left">
              <th className="px-4 py-2 border">
                <div className="bg-gray-300 h-4 w-24 rounded"></div>
              </th>
              <th className="px-4 py-2 border">
                <div className="bg-gray-300 h-4 w-24 rounded"></div>
              </th>
              <th className="px-4 py-2 border">
                <div className="bg-gray-300 h-4 w-24 rounded"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="bg-slate-100 border animate-pulse">
                <td className="text-sm px-4 py-4">
                  <div className="bg-gray-300 h-4 w-24 rounded"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="bg-gray-300 w-12 h-12 rounded-full"></div>
                </td>
                <td className="text-sm px-4 py-4">
                  <div className="bg-gray-300 h-4 w-48 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'card':
      return (
        <div className="p-4 border border-gray-300 rounded-lg shadow-sm animate-pulse">
          <div className="bg-gray-300 h-32 w-full rounded"></div>
          <div className="mt-4">
            <div className="bg-gray-300 h-6 w-3/4 rounded"></div>
            <div className="mt-2 bg-gray-300 h-4 w-full rounded"></div>
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-300 h-6 w-3/4 rounded"></div>
          <div className="bg-gray-300 h-4 w-full rounded"></div>
          <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
        </div>
      );

    default:
      return null;
  }
};

export default Skeleton;
