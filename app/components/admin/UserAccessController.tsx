'use client';
import React from "react";
import { AccessTable } from "./AccessTable";
import { APIAccessForm, PageAccessForm } from "./AccessForms";
import { useEffect, useState } from "react";

interface PageAccess {
  referer: string;
  access: string[];
}

interface ApiAccess {
  origin: string;
  referer: string | null;
  path: string;
  access: string[];
}
interface RoutesAccessResponse {
  success: boolean;
  data: {
    pagesAccess: PageAccess[];
    apisAccess: ApiAccess[];
  };
}
const UserAccessController = () => {
  const [pagesAccess, setPagesAccess] = useState<PageAccess[]>([]);
  const [apisAccess, setApisAccess] = useState<ApiAccess[]>([]);

  useEffect(() => {
    async function getData() {
      const res = await fetch('/api/private/routes-access');
      const data: RoutesAccessResponse = await res.json();
      if (data.success) {
        setPagesAccess(data.data.pagesAccess);
        setApisAccess(data.data.apisAccess);
      }
    }
    getData();
  }, []);
  return (
    <>
      <div  className="flex flex-col md:flex-row mb-5">
        <PageAccessForm pagesAccess={pagesAccess} />
        <APIAccessForm apisAccess={apisAccess} />
      </div>
      <AccessTable pagesAccess={pagesAccess} apisAccess={apisAccess}/>
    </>
  );
};
export default UserAccessController