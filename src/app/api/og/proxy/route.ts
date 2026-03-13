import { NextRequest } from 'next/server';
import { handleOGProxy } from '@once-ui-system/core/server';

export async function GET(request: NextRequest) {
  return handleOGProxy(request);
}