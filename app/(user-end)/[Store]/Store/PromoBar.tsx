import React from 'react';
import Link from 'next/link';
import { StoreType } from '../../types/store';
import Image from 'next/image';

interface PromoBarProps{
  MyStore : StoreType | null;
}

const PromoBar: React.FC<PromoBarProps> = ({MyStore}) => {
  return (
    <div className="mt-4 bg-white shadow-md">
      <div className="flex items-center py-2 xl:py-2.5 pl-6 lg:pl-16 md:flex-row container">
        {/* Replaced title with an image */}
        <div className="flex-shrink-0 mb-2 md:mb-0 md:mr-4">
          <Image
            src="/images/sample image/instacart.webp" // Update this path with the actual image path
            alt="Promo Image"
            className="object-cover w-20 h-20 rounded"
            width={80}
            height={80}
          />
        </div>

        <div className="mx-3 text-center md:text-left">
          <h1 className="text-2xl font-semibold">{MyStore?.store_name} Coupons</h1>
        </div>
      </div>
    </div>
  );
};

export default PromoBar;
