import { httpAxios } from "@/utils/httpHelper";

export async function updateRoute(
  pathname: string,
  origin: string,
  referer: string,
  method: string
) {
  const { data } = await httpAxios.post(`${process.env.BASE_URL}/api/accesscontrol`, {
    pathname,
    origin,
    referer,
    method
  });
  return data;
}

// export async function checkAccess(
//   pathname: string,
//   origin: string,
//   referer: string,
//   role: string
// ) {
//   const { data } = await httpAxios.get(
//     `http://localhost:3000/api/accesscontrol/checkaccess?pathname=${pathname}&origin=${origin}&referer=${
//       referer || ""
//     }&role=${role}`
//   );
//   return data;
// }
export async function checkAccess(
  pathname: string,
  referer: string,
  token: { email: string; role: string }
) {
  const { data } = await httpAxios.post(`http://localhost:3000/api/accesscontrol/checkaccess`,{pathname,referer,token});
  return data;
}
export async function updateAccess(
  pathname: string | null,
  access: string[],
  referer: string | null = ""
) {
  const { data } = await httpAxios.put("http://localhost:3000/api/accesscontrol", {
    pathname,
    access,
    referer,
  });
  return data;
}
