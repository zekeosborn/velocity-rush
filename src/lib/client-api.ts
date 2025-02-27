import type { UserDto, UserPatchDto } from '@/types/dtos';
import axios from 'axios';

interface UpdateUserParams {
  id: string;
  data: UserPatchDto;
}

const userApi = axios.create({
  baseURL: '/api/users',
});

export async function updateUser({ id, data }: UpdateUserParams) {
  try {
    const response = await userApi.patch<UserDto>(`/${id}`, data);
    return response.data;
  } catch (error) {
    logError(error, 'updateUser');
    throw error;
  }
}

function logError(error: unknown, context: string) {
  if (axios.isAxiosError(error)) {
    console.error(`[${context}] Axios error:`, error.message);
  } else {
    console.error(`[${context}] Unexpected error:`, error);
  }
}
