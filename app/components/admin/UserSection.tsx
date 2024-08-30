'use client'
import { doLogout } from '@/app/actions';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface User {
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

const UserSection: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const {data} = useSession()

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data]);

  return (
    <>
      {!user ? (
        <Link
          href="/login"
          className="col-span-3 md:col-span-2 justify-self-end px-2 font-bold outline-none hover:text-yellow-300 hover:scale-110"
        >
          Sign in
        </Link>
      ) : (
        <>
          <div className="col-span-3 md:col-span-1 justify-self-end px-2 font-bold outline-none">
            {user.name ?? 'Unknown User'}
          </div>
          <button
            className="col-span-1 justify-self-end font-light outline-none hover:text-yellow-300 hover:scale-110"
            onClick={() => {
              doLogout();
              setUser(null);
            }}
          >
            Sign Out
          </button>
        </>
      )}
    </>
  );
};

export default UserSection;
