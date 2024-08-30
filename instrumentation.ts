
import axios from "axios";


type FormattedPageRoute = {
  referer: string;
  pageName: string;
  access: string[];
  description: string;
};

type ApiRoute = {
  route: string;
  methods: string[];
};

type FormattedApiRoute = {
  apiUrl: string;
  apiName: string;
  method: string;
  referer: string;
  description: string;
  access: string[];
};


export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { connectToDB } = await import("./utils/db");
    const fs = await import('fs');
    const path = await import('path');
    const db = await connectToDB();

    try {
      // Check if Super Admin exists
      const user = await db.collection("users").findOne({ email: "admin@perfectlyokay.com" });
      if (!user) {
        await db.collection("users").insertOne({
          name: "super admin",
          email: "admin@perfectlyokay.com",
          password: "123",
          role: "ADMIN",
        });
        console.log("Super Admin Created Successfully.");
      } else {
        console.log("Super Admin Already Exists");
      }

      // Get all pages and API routes
      const allPagesRoutes = getAllPageRoutes('(admin-end)', fs, path);
      const allApisRoutes = getAllApisEndPoint(fs, path);

      // Fetch existing routes from the database
      const existingRoutes = await db.collection("routes").findOne({});
      const existingPages = existingRoutes?.pages || [];
      const existingApis = existingRoutes?.apis || [];

      // Filter out routes that are already in the database
      const newPages = allPagesRoutes.filter(route =>
        !existingPages.some((existing : any) => existing.referer === route.referer)
      );
      const newApis = allApisRoutes.filter(route =>
        !existingApis.some((existing :any) => existing.apiUrl === route.apiUrl && existing.method === route.method)
      );

      // If there are new routes, update the database
      if (newPages.length > 0 || newApis.length > 0) {
        await db.collection("routes").updateOne(
          {},
          {
            $addToSet: {
              pages: { $each: newPages },
              apis: { $each: newApis },
            },
          },
          { upsert: true } // Create the document if it doesn't exist
        );
        console.log("Routes Updated Successfully.");
      } else {
        console.log("No New Routes to Update.");
      }

    } catch (error) {
      console.error("Error during Super Admin setup:", error);
    }
  }
}




const apiEndpoint = 'http://localhost:3000/api/private/cron';
const timeoutDuration = 10000; // 10 seconds
const maxRetries = 10;

const makeApiCall = async () => {
  const source = axios.CancelToken.source();

  const timeout = setTimeout(() => {
    source.cancel('Request timed out');
  }, timeoutDuration);

  try {
    const { data: { data } } = await axios.get(apiEndpoint, { cancelToken: source.token });
    clearTimeout(timeout);
    return data;
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.error('API Request timed out');
    } else {
      console.error('API Error:', error.message);
    }
    clearTimeout(timeout);
    return false;
  }
};

const checkServerAndMakeApiCall = async (attempts = 0) => {
  if (attempts >= maxRetries) {
    console.error("Max retry attempts reached. Exiting...");
    return;
  }

  const apiCallSuccess = await makeApiCall();
  if (!apiCallSuccess) {
    console.log(`Retry attempt ${attempts + 1}...`);
    return setTimeout(() => checkServerAndMakeApiCall(attempts + 1), 10000);
  }

  if (!apiCallSuccess.length) {
    console.log("No Job Scheduled yet!");
    return;
  }

  for (const cron of apiCallSuccess) {
    const response = await fetch(`http://localhost:3000/api/private/cron`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cronJob: cron, warmUp: true }),
    });
    console.log(await response.json());
    console.log(`\x1b[33mAdding\x1b[34m ${cron.type}\x1b[33m Cron in Scheduler:\x1b[32m ${cron.description}`);
  }
};

function getAllPageRoutes(parentFolder: string, fs: typeof import('fs'), path: typeof import('path')): FormattedPageRoute[] {

  const getRoutes = (dirPath: string, basePath = '/'): string[] => {
    let routes: string[] = [];

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        routes = routes.concat(getRoutes(filePath, path.join(basePath, file)));
      } else if (stat.isFile() && /page\.(js|ts|jsx|tsx)$/.test(file)) {
        const route = path.join(basePath, file.replace(/page\.(js|ts|jsx|tsx)$/, ''));
        const formattedRoute = route.replace(/\\/g, '/').replace(/\/$/, '');  // Convert to URL format
        routes.push(formattedRoute === '/index' ? '/' : formattedRoute);  // Replace '/index' with '/' for root pages
      }
    }

    return routes;
  };

  const formatRoutes = (routes: string[]): FormattedPageRoute[] => {
    return routes.map(route => {
      const pageName = route.split('/').pop() || 'Home';
      const formattedPageName = pageName === '' ? 'Admin Home' : pageName.charAt(0).toUpperCase() + pageName.slice(1);

      return {
        referer: route,
        pageName: formattedPageName.replace(/-/g, ' '),
        access: ["ADMIN"],
        description: `This is the ${formattedPageName.replace(/-/g, ' ')} Page where administrators and editors can view dashboard summaries and key metrics.`,
      };
    });
  };

  const adminFolder = path.join(process.cwd(), 'app', parentFolder);
  const adminRoutes = getRoutes(adminFolder);
  const formattedRoutes = formatRoutes(adminRoutes);
  return formattedRoutes;
}

function getAllApisEndPoint(fs: typeof import('fs'), path: typeof import('path')): FormattedApiRoute[] {

  const getApiRoutes = (dirPath: string, basePath: string = '/api/private'): ApiRoute[] => {
    let routes: ApiRoute[] = [];
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        routes = routes.concat(getApiRoutes(filePath, path.join(basePath, file)));
      } else if (stat.isFile() && /(route)\.(js|ts)$/.test(file)) {
        const routePath = path.join(basePath).replace(/\\/g, '/').replace(/\/$/, '');
        const methods = extractMethods(filePath);
        routes.push({ route: routePath, methods });
      }
    }

    return routes;
  };

  const formatRoutes = (routes: ApiRoute[], baseFolder: string): FormattedApiRoute[] => {
    return routes.flatMap(({ route, methods }) => {
      const apiUrl = route.startsWith(`/${baseFolder}`) ? route : `/${baseFolder}${route}`;
      const apiName = route.split('/').pop() || '';

      return methods.map(method => ({
        apiUrl: apiUrl,
        apiName: apiName,
        method: method.toUpperCase(),
        referer: '',
        description: `This is the ${apiName.charAt(0).toUpperCase() + apiName.slice(1)} API endpoint.`,
        access: ["ADMIN"]
      }));
    });
  };

  const extractMethods = (filePath: string): string[] => {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const cleanedContent = fileContent.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

    const methodRegex = /(?:export\s+async\s+function\s+|export\s+function\s+|async\s+function\s+|function\s+)(GET|POST|PATCH|DELETE|PUT|HEAD|OPTIONS)\s*\([^)]*\)\s*{[^}]*}/gi;

    const methodMatches = cleanedContent.match(methodRegex) || [];

    const methods = methodMatches.map((match: string) => {
      const methodNameMatch = match.match(/(?:export\s+async\s+function\s+|export\s+function\s+|async\s+function\s+|function\s+)(GET|POST|PATCH|DELETE|PUT|HEAD|OPTIONS)/i);
      return methodNameMatch ? methodNameMatch[1].toUpperCase() : '';
    }).filter((method: string, index: number, self: string[]) => method && self.indexOf(method) === index);

    return methods;
  };

  const baseFolder = 'private';
  const privateFolder = path.join(process.cwd(), 'app', 'api', baseFolder);
  const apiRoutes = getApiRoutes(privateFolder, `/${baseFolder}`);
  const formattedRoutes = formatRoutes(apiRoutes, baseFolder);
  return formattedRoutes;
}