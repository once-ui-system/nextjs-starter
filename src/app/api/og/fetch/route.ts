import { NextRequest } from 'next/server';
import { handleOGFetch } from '@once-ui-system/core';

export async function GET(request: NextRequest) {
  return handleOGFetch(request);
}