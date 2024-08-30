import Link from 'next/link';
import { FC } from 'react';

const SignInSignUpButtons: FC = () => {
  return (
    <div className="hidden md:flex items-center gap-x-4">
      <Link href="/signin">
        <button className="px-0 xl:px-4 py-2 rounded-full hover:bg-gray-200 focus:bg-gray-200">
          Sign In
        </button>
      </Link>
      <Link href="/signup">
        <button className="px-0 xl:px-4 py-2 rounded-full hover:bg-gray-200 focus:bg-gray-200">
          Sign Up
        </button>
      </Link>
    </div>
  );
};

export default SignInSignUpButtons;
