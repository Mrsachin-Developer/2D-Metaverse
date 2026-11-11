export interface Position {
  x: number;
  y: number;
}

export interface Player {
  userId: string;
  x: number;
  y: number;
  username?: string;
  avatarUrl?: string;
}

export type WebSocketConnectionStatus = 
  | "connecting" 
  | "connected" 
  | "joined" 
  | "disconnected" 
  | "error";

// Incoming WS messages from server
export interface SpaceJoinedMessage {
  type: "space-joined";
  payload: {
    userId: string;
    spawn: Position;
    users: Array<{
      userId: string;
      x: number;
      y: number;
    }>;
  };
}

export interface UserJoinedMessage {
  type: "user-joined";
  payload: {
    userId: string;
    x: number;
    y: number;
  };
}

export interface MovementMessage {
  type: "movement";
  payload: {
    userId: string;
    x: number;
    y: number;
  };
}

export interface MovementRejectedMessage {
  type: "movement-rejected";
  payload: {
    x: number;
    y: number;
  };
}

export interface UserLeftMessage {
  type: "user-left";
  payload: {
    userId: string;
  };
}

export type ServerMessage =
  | SpaceJoinedMessage
  | UserJoinedMessage
  | MovementMessage
  | MovementRejectedMessage
  | UserLeftMessage;

// Outgoing WS messages to server
export interface ClientJoinMessage {
  type: "join";
  payload: {
    spaceId: string;
    token: string;
  };
}

export interface ClientMoveMessage {
  type: "move";
  payload: {
    x: number;
    y: number;
  };
}

export type ClientMessage = ClientJoinMessage | ClientMoveMessage;

