'use client'
import { updateAccess } from "@/services/accessControlService";
import React, { useEffect, useState } from "react";

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

export const PageAccessForm = ({
  pagesAccess,
}: {
  pagesAccess: PageAccess[];
}) => {
  const [selectedPageAccess, setSelectedPageAccess] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  useEffect(() => {
    console.log("selectedPageAccess updated: ", selectedPageAccess);
  }, [selectedPageAccess]);

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedReferer = event.target.value;
    const selectedPage = pagesAccess.find(
      (page) => page.referer === selectedReferer
    );
    setCurrentPage(selectedReferer);
    setSelectedPageAccess(selectedPage?.access || []);
  };

  const handleCheckboxChange = (role: string) => {
    setSelectedPageAccess((prevAccess) =>
      prevAccess.includes(role)
        ? prevAccess.filter((r) => r !== role)
        : [...prevAccess, role]
    );
  };

  const isChecked = (role: string) => selectedPageAccess.includes(role);

  const submitHandler = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!currentPage) return
    console.log('Current page : ',currentPage);
    console.log('Selected page access : ',selectedPageAccess);
    const res = await updateAccess(currentPage,selectedPageAccess)
    console.log('res - ',res);
  }

  return (
    <div className="p-1 m-1 bg-stone-200 shadow-md md:w-1/2 rounded-md">
      <h2 className="text-center py-2 text-lg font-semibold">Pages</h2>
      <form className="px-2" onSubmit={submitHandler}>
        <select
          className="w-full py-2 px-4 rounded-lg outline-none"
          name="page"
          onChange={handlePageChange}
          value={currentPage || ''}
        >
          <option value="" disabled>
            Select Page
          </option>
          {pagesAccess.map((page, index) => (
            <option key={index} value={page.referer?page.referer : '/'}>
              {page.referer?page.referer : '/'}
            </option>
          ))}
        </select>
        <div className="md:flex my-4 text-sm md:text-base border justify-center lg:space-x-4 md:space-x-2">
          <div>
            <label>
              <input
                className="mx-1"
                type="checkbox"
                name="role"
                value="ADMIN"
                checked={isChecked('ADMIN')}
                onChange={() => handleCheckboxChange('ADMIN')}
              />
              ADMIN
            </label>
          </div>
          <div>
            <label>
              <input
                className="mx-1"
                type="checkbox"
                name="role"
                value="USER"
                checked={isChecked('USER')}
                onChange={() => handleCheckboxChange('USER')}
              />
              USER
            </label>
          </div>
          <div>
            <label>
              <input
                className="mx-1"
                type="checkbox"
                name="role"
                value="MERCHANT"
                checked={isChecked('MERCHANT')}
                onChange={() => handleCheckboxChange('MERCHANT')}
              />
              MERCHANT
            </label>
          </div>
        </div>
        <button className="btn-full-width my-2" type="submit">
          Update
        </button>
      </form>
    </div>
  );
};

export const APIAccessForm = ({
  apisAccess,
}: {
  apisAccess: ApiAccess[];
}) => {

  const [selectedApiAccess, setSelectedApiAccess] = useState<string[]>([]);
  const [selectedApiReferer, setSelectedApiReferer] = useState<string | null>(null);
  const [currentApi, setCurrentApi] = useState<string | null>(null);

  useEffect(() => {
    console.log("selectedApiAccess updated: ", selectedApiAccess);
  }, [selectedApiAccess]);

  const handleApiChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPath = event.target.value;
    const selectedApi = apisAccess.find(
      (api) => api.path === selectedPath
    );
    setCurrentApi(selectedPath);
    setSelectedApiAccess(selectedApi?.access || []);
    setSelectedApiReferer(selectedApi?.referer ? selectedApi!.referer : '/')
  };

  const handleCheckboxChange = (role: string) => {
    setSelectedApiAccess((prevAccess) =>
      prevAccess.includes(role)
        ? prevAccess.filter((r) => r !== role)
        : [...prevAccess, role]
    );
  };

  const isChecked = (role: string) => selectedApiAccess.includes(role);

  const submitHandler = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!currentApi) return
    console.log("selectedApiReferer : ", selectedApiReferer);
    console.log("selectedApiAccess : ", selectedApiAccess);
    console.log("selectedApi : ", currentApi);
    const res = await updateAccess(currentApi,selectedApiAccess,selectedApiReferer)
    console.log('api update res - ',res);
  }

  return (
    <div className="p-1 m-1 bg-stone-200 shadow-md md:w-1/2 rounded-md">
      <div className="w-full mx-auto">
        <h2 className="text-center py-2 text-lg font-semibold">API's</h2>
        <form className="px-2" onSubmit={submitHandler}>
          <select
            className="w-full py-2 px-4 rounded-lg outline-none"
            name="api"
            onChange={handleApiChange}
            value={currentApi || ''}
          >
            <option value="" disabled>
              Select API
            </option>
            {apisAccess.map((api, index) => (
              <option key={index} value={`${api.path}`}>
                {api.referer ? `${api.path} - ${api.referer}` : `${api.path} - /`}
              </option>
            ))}
          </select>
          <div className="md:flex my-4 text-sm md:text-base border justify-center lg:space-x-4 md:space-x-2">
            <div>
              <label>
                <input
                  className="mx-1"
                  type="checkbox"
                  name="role"
                  value="ADMIN"
                  checked={isChecked('ADMIN')}
                  onChange={() => handleCheckboxChange('ADMIN')}
                />
                ADMIN
              </label>
            </div>
            <div>
              <label>
                <input
                  className="mx-1"
                  type="checkbox"
                  name="role"
                  value="USER"
                  checked={isChecked('USER')}
                  onChange={() => handleCheckboxChange('USER')}
                />
                USER
              </label>
            </div>
            <div>
              <label>
                <input
                  className="mx-1"
                  type="checkbox"
                  name="role"
                  value="MERCHANT"
                  checked={isChecked('MERCHANT')}
                  onChange={() => handleCheckboxChange('MERCHANT')}
                />
                MERCHANT
              </label>
            </div>
          </div>
          <button className="btn-full-width my-2" type="submit">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};
