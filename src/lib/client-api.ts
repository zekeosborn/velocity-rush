import type { UserDto, UserPatchDto } from '@/types/dtos';
import axios from 'axios';

interface CreateUsernameParams {
  id: string;
  data: UserPatchDto;
}

const createUsernameApi = axios.create({
  baseURL: '/api/create-username',
});

export async function createUsername({ id, data }: CreateUsernameParams) {
  try {
    const response = await createUsernameApi.patch<UserDto>(`/${id}`, data);
    return response.data;
  } catch (error) {
    logError(error, 'createUsername');
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
