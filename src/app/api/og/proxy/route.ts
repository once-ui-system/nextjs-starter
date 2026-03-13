import { NextRequest } from 'next/server';
import { handleOGProxy } from '@once-ui-system/core';

export async function GET(request: NextRequest) {
  return handleOGProxy(request);
}