import { request } from './api';

export interface CreateElementPayload {
  imageUrl: string;
  width: number;
  height: number;
  static: boolean;
}

export interface CreateAvatarPayload {
  name: string;
  imageUrl: string;
}

export interface CreateMapPayload {
  name: string;
  dimensions: string;
  thumbnail?: string;
  defaultElements: Array<{
    elementId: string;
    x: number;
    y: number;
  }>;
}

export const adminService = {
  async createElement(data: CreateElementPayload): Promise<{ id: string }> {
    return request<{ id: string }>('/api/v1/admin/element', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateElement(elementId: string, imageUrl: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/v1/admin/element/${elementId}`, {
      method: 'PUT',
      body: JSON.stringify({ imageUrl }),
    });
  },

  async createAvatar(data: CreateAvatarPayload): Promise<{ avatarId: string }> {
    return request<{ avatarId: string }>('/api/v1/admin/avatar', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async createMap(data: CreateMapPayload): Promise<{ id: string }> {
    return request<{ id: string }>('/api/v1/admin/map', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
