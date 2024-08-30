// import { auth } from '@/auth';
import Link from 'next/link';
import UserSection from './UserSection';

const Header = async () => {
  // const session = await auth();
  // console.log('session in Header - ',session);

  return (
    <header className="grid grid-cols-4 items-center px-4 py-4 bg-stone-700 text-white">
      <Link href="/admin" className="col-span-2 hidden md:block outline-none hover:text-yellow-300"></Link>
      <UserSection />
    </header>
  );
};

export default Header;
