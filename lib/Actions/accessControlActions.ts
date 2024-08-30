import { signOut } from "@/auth";
import { connectToDB } from "@/utils/db";
interface Route {
    path: string;
    access: string[];
}
export async function isAccessible(
    pathname: string,
    referer: string,
    token: {email: string; role: string}
  ): Promise<boolean> {

    try {
        const db = await connectToDB();
        const usersCollection = db.collection('users');
        const routesCollection = db.collection('routes');
        const user = await usersCollection.findOne({email:token?.email});
        if(!user || user.role != token.role) {
            await signOut();
            return false
        }
        const isApi = pathname.startsWith('/api');
        const key = isApi ? 'api' : 'page';

        if(isApi) {
            const document = await routesCollection.findOne({ referer });
            const route = document?.api?.find((route: Route) => route.path === pathname);
            if (!route) {
                console.log('No api route found.');
                return false;
            }else {
                console.log('checking route.access.includes(token.role) - ',route.access.includes(token.role));
                return route.access.includes(token.role);
            }
        } else {
            const document = await routesCollection.findOne({ referer:pathname=='/'?null : `${process.env.BASE_URL}${pathname}` });
            if (!document) {
                console.log('No page found.');
                return false;
            }else {
                console.log('checking document.access.includes(token.role) - ',document.access.includes(token.role));
                return document.access.includes(token.role);
            }
        }
    } catch (error) {
        console.log('Some error occured while checking access.');
        return false
    }
}