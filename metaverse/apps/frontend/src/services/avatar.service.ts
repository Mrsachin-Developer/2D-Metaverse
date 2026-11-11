import { request } from './api';
import type { AvatarCatalogResponse, BulkAvatarResponse } from '../types/api';

export const avatarService = {
  async getAvatars(): Promise<AvatarCatalogResponse> {
    return request<AvatarCatalogResponse>('/api/v1/avatars', {
      method: 'GET',
      requiresAuth: false,
    });
  },

  async updateMetadata(avatarId: string): Promise<{ message: string }> {
    return request<{ message: string }>('/api/v1/user/metadata', {
      method: 'POST',
      body: JSON.stringify({ avatarId }),
      requiresAuth: true,
    });
  },

  async getBulkMetadata(userIds: string[]): Promise<BulkAvatarResponse> {
    if (userIds.length === 0) return { avatars: [] };
    const cleanIds = userIds.filter(Boolean);
    const idsParam = `[${cleanIds.join(',')}]`;
    return request<BulkAvatarResponse>(`/api/v1/user/metadata/bulk?ids=${encodeURIComponent(idsParam)}`, {
      method: 'GET',
      requiresAuth: false,
    });
  },
};

