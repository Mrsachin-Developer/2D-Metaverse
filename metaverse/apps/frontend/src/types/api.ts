export interface UserSession {
  userId: string;
  username: string;
  role: "Admin" | "User";
  token: string;
  avatarUrl?: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  type: "user" | "admin";
}

export interface SignupResponse {
  userId: string;
}

export interface SigninRequest {
  username: string;
  password: string;
}

export interface SigninResponse {
  token: string;
}

export interface AvatarItem {
  id: string;
  imageUrl: string | null;
  name: string | null;
}

export interface AvatarCatalogResponse {
  avatars: AvatarItem[];
}

export interface BulkAvatarMetadataItem {
  userId: string;
  avatarId?: string; // Note: In backend this holds imageUrl
}

export interface BulkAvatarResponse {
  avatars: BulkAvatarMetadataItem[];
}

export interface ElementItem {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  static: boolean;
}

export interface ElementsResponse {
  elements: ElementItem[];
}

export interface SpaceItem {
  id: string;
  name: string;
  thumbnail: string | null;
  dimensions: string; // "100x100"
}

export interface SpacesResponse {
  spaces: SpaceItem[];
}

export interface CreateSpaceRequest {
  name: string;
  dimensions: string;
  mapId?: string;
}

export interface CreateSpaceResponse {
  spaceId: string;
}

export interface SpaceElement {
  id: string;
  element: ElementItem;
  x: number;
  y: number;
}

export interface SpaceDetailResponse {
  dimensions: string;
  elements: SpaceElement[];
}

