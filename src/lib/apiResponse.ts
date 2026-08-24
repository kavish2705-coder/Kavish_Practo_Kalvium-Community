import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>({ success: true, data }, { status });
}

export function errorResponse(error: string, status = 400, fieldErrors?: Record<string, string>) {
  return NextResponse.json<ApiResponse>({ success: false, error, fieldErrors }, { status });
}
