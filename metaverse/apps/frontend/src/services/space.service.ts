import { request } from './api';
import type {
  CreateSpaceRequest,
  CreateSpaceResponse,
  ElementsResponse,
  SpaceDetailResponse,
  SpacesResponse,
} from '../types/api';

export interface AddElementRequest {
  spaceId: string;
  elementId: string;
  x: number;
  y: number;
}

export const spaceService = {
  async getAllSpaces(): Promise<SpacesResponse> {
    return request<SpacesResponse>('/api/v1/space/all', {
      method: 'GET',
      requiresAuth: true,
    });
  },

  async getSpace(spaceId: string): Promise<SpaceDetailResponse> {
    return request<SpaceDetailResponse>(`/api/v1/space/${spaceId}`, {
      method: 'GET',
      requiresAuth: false,
    });
  },

  async createSpace(data: CreateSpaceRequest): Promise<CreateSpaceResponse> {
    return request<CreateSpaceResponse>('/api/v1/space', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  async deleteSpace(spaceId: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/v1/space/${spaceId}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },

  async getElements(): Promise<ElementsResponse> {
    return request<ElementsResponse>('/api/v1/elements', {
      method: 'GET',
      requiresAuth: false,
    });
  },

  async addElement(data: AddElementRequest): Promise<{ message: string }> {
    return request<{ message: string }>('/api/v1/space/element', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  async deleteElement(elementId: string): Promise<{ message: string }> {
    return request<{ message: string }>('/api/v1/space/element', {
      method: 'DELETE',
      body: JSON.stringify({ id: elementId }),
      requiresAuth: true,
    });
  },
};
