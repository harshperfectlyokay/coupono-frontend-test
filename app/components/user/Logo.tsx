import Image from 'next/image';
import { FC } from 'react';

const Logo: FC = () => {
  return (
    <div className="border-2 border-black">
      <Image
        src="/images/logo/logo-white-productraters.avif"
        alt="Logo"
        width={100}
        height={100}
        className="block"
      />
    </div>
  );
};

export default Logo;
