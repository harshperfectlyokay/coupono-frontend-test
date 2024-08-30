"use client";
import { updateAccess } from "@/services/accessControlService";
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

export const AccessTable = ({
  pagesAccess,
  apisAccess,
}: {
  pagesAccess: PageAccess[];
  apisAccess: ApiAccess[];
}) => {
  const [pagesAccessData, setPagesAccessData] = useState<PageAccess[]>(pagesAccess);
  const [apisAccessData, setApisAccessData] = useState<ApiAccess[]>(apisAccess);

  const loadAccessData = async () => {
    const res = await fetch("/api/private/routes-access");
    const data: RoutesAccessResponse = await res.json();
    if (data.success) {
      // const { pagesAccess, apisAccess } = await fetchAccessData();
      setPagesAccessData(data.data.pagesAccess);
      setApisAccessData(data.data.apisAccess);
    }
  };

  useEffect(() => {
    loadAccessData();
  }, []);
  return (
    <>
      <PagesTable pagesAccess={pagesAccessData} reloadAccessData={loadAccessData} />
      <APIsTable apisAccess={apisAccessData} />
    </>
  );
};

const PagesTable = ({ pagesAccess,reloadAccessData }: { pagesAccess: PageAccess[];reloadAccessData: () => void; }) => {
  const togglePageAccess = async (e: any, page: string | null, access: any) => {
    e.preventDefault();
    const res = await updateAccess(page, access);
    console.log("res - ", res);
    if (res.success) {
      reloadAccessData(); // Reload data after successful update
    }
  };
  return (
    <div className="container px-2 py-4 mx-auto">
      <div className="overflow-x-auto sm:w-full">
        <table id="accessTable" className="max-w-min md:min-w-full">
          <thead>
            <tr className="bg-stone-700 text-white text-left">
              <th className="px-4 py-2 border">Pages</th>
              <th className="px-4 py-2 border">ADMIN</th>
              <th className="px-4 py-2 border">USER</th>
              <th className="px-4 py-2 border">MERCHANT</th>
            </tr>
          </thead>
          <tbody>
            {pagesAccess.length > 0 ? (
              pagesAccess.map((page, index) => (
                <tr key={index} className="border">
                  <td className="px-4 py-2 border">{page.referer}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={async (e) =>
                        await togglePageAccess(
                          e,
                          page.referer,
                          page.access.includes("ADMIN")
                            ? page.access.filter((role) => role != "ADMIN")
                            : [...page.access, "ADMIN"]
                        )
                      }
                    >
                      {page.access.includes("ADMIN") ? "✅" : "❌"}
                    </button>
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={async (e) =>
                        await togglePageAccess(
                          e,
                          page.referer,
                          page.access.includes("USER")
                            ? page.access.filter((role) => role != "USER")
                            : [...page.access, "USER"]
                        )
                      }
                    >
                      {page.access.includes("USER") ? "✅" : "❌"}
                    </button>
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={async (e) =>
                        await togglePageAccess(
                          e,
                          page.referer,
                          page.access.includes("MERCHANT")
                            ? page.access.filter((role) => role != "MERCHANT")
                            : [...page.access, "MERCHANT"]
                        )
                      }
                    >
                      {page.access.includes("MERCHANT") ? "✅" : "❌"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const APIsTable = ({ apisAccess }: { apisAccess: ApiAccess[] }) => {
  return (
    <div className="container px-2 py-4 mx-auto">
      <div className="overflow-x-auto sm:w-full">
        <table id="accessTable" className="max-w-min md:min-w-full">
          <thead>
            <tr className="bg-stone-700 text-white text-left">
              <th className="px-4 py-2 border">Referer</th>
              <th className="px-4 py-2 border">API</th>
              <th className="px-4 py-2 border">ADMIN</th>
              <th className="px-4 py-2 border">USER</th>
              <th className="px-4 py-2 border">MERCHANT</th>
            </tr>
          </thead>
          <tbody>
            {apisAccess.length > 0 ? (
              apisAccess.map((api, index) => (
                <tr key={index} className="border">
                  <td className="px-4 py-2 border">
                    {api.referer ? api.referer : "/"}
                  </td>
                  <td className="px-4 py-2 border">{api.path}</td>
                  <td className="px-4 py-2 border">
                    {api.access.includes("ADMIN") ? "✅" : "❌"}
                  </td>
                  <td className="px-4 py-2 border">
                    {api.access.includes("USER") ? "✅" : "❌"}
                  </td>
                  <td className="px-4 py-2 border">
                    {api.access.includes("MERCHANT") ? "✅" : "❌"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
