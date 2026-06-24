import { httpClient } from "@/services/httpClient";
import type { ApiResponse } from "@/models/api";

export async function getResource<T>(url: string) {
  const response = await httpClient.get<ApiResponse<T>>(url);
  return response.data;
}

export async function postResource<TPayload, TResult>(url: string, payload: TPayload) {
  const response = await httpClient.post<ApiResponse<TResult>>(url, payload);
  return response.data;
}
