import React from 'react';
import { Offer } from '../../(user-end)/types/offer';

interface CouponTableProps {
  coupons: Offer[];
}

const CouponTable:React.FC<CouponTableProps> = ({ coupons }) => {

  const firstFiveCoupons = coupons.length> 0 ? coupons.slice(0, 5) : [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full max-w-full table-auto divide-y divide-gray-200 border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              Discount
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              Description
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expiration Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {firstFiveCoupons.map((coupon) => (
            <tr key={coupon.id}>
              <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-300">
                {coupon.offer_benefit}%
              </td>
              <td className="px-2 py-4 whitespace-normal break-words text-sm text-gray-500 border-r border-gray-300">
                {coupon.offer_description}
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {coupon.offer_end_date ? new Date(coupon.offer_end_date).toLocaleDateString() : <span className="text-xl"> - </span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponTable;
