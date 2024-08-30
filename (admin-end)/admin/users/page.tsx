import Link from "next/link";
import UserTable from "../../../components/admin/UserTable";

const Users: React.FC = () => {
  return (
    <>
      <div className="w-full p-1">
        <Link href={'user/add'} className="flex justify-center btn-full-width">
          New User
        </Link>
      </div>
      <UserTable />
    </>
  );
};

export default Users;