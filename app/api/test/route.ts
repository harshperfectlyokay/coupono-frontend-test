import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  
  const getApiRoutes = (dirPath: string, basePath: string = '/api/private'): Array<{ route: string, methods: string[] }> => {
    let routes: Array<{ route: string, methods: string[] }> = [];
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

  const formatRoutes = (routes: Array<{ route: string, methods: string[] }>, baseFolder: string): Array<{ apiUrl: string, apiName: string, method: string, referer: string, description: string, access: string[] }> => {
    return routes.flatMap(({ route, methods }) => {
      // Ensure the route starts with the correct base folder
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

  // Determine the dynamic base folder
  const baseFolder = 'private'; // Change this as needed
  const privateFolder = path.join(process.cwd(), 'app', 'api', baseFolder);
  const apiRoutes = getApiRoutes(privateFolder, `/${baseFolder}`);
  const formattedRoutes = formatRoutes(apiRoutes, baseFolder);

  return NextResponse.json({
    data: formattedRoutes
  });
}

// Extract Methods Function
const extractMethods = (filePath: string): string[] => {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Remove single-line and multi-line comments
  const cleanedContent = fileContent.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

  // Regex to match exported method declarations, case-insensitive
  const methodRegex = /(?:export\s+async\s+function\s+|export\s+function\s+|async\s+function\s+|function\s+)(GET|POST|PATCH|DELETE|PUT|HEAD|OPTIONS)\s*\([^)]*\)\s*{[^}]*}/gi;

  // Find all matches
  const methodMatches = cleanedContent.match(methodRegex) || [];

  // Extract method names, ensuring they are unique and valid
  const methods = methodMatches.map(match => {
    const methodNameMatch = match.match(/(?:export\s+async\s+function\s+|export\s+function\s+|async\s+function\s+|function\s+)(GET|POST|PATCH|DELETE|PUT|HEAD|OPTIONS)/i);
    return methodNameMatch ? methodNameMatch[1].toUpperCase() : '';
  }).filter((method, index, self) => method && self.indexOf(method) === index);  // Remove duplicates

  return methods;
};
