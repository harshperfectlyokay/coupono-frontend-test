import { NextResponse } from 'next/server';

interface NextJsResponseProps {
  success: boolean;
  message: string;
  data?: Record<string, any>; // Use a more specific type if you know the structure of data
}

interface StatusOptions {
  code?: number; // HTTP status code
  text?: string; // Status text
}

export default function NextJsResponse(
  { success, message, data = {} }: NextJsResponseProps,
  { code, text }: StatusOptions = {}
) {
  const statusObj: ResponseInit = {};
  if (code) statusObj.status = code;
  if (text) statusObj.statusText = text;

  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    statusObj
  );
}

