import type { User } from "./User";
import type { OutgoingMessage } from "./types";

export class RoomManager {
    rooms: Map<string, User[]> = new Map();
    static instance: RoomManager;

    private constructor() {
        this.rooms = new Map();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
    }

    public removeUser(user: User, spaceId: string) {
        const users = this.rooms.get(spaceId);
        if (!users) {
            return;
        }
        const remainingUsers = users.filter((roomUser) => roomUser.id !== user.id);
        if (remainingUsers.length === 0) {
            this.rooms.delete(spaceId);
            return;
        }
        this.rooms.set(spaceId, remainingUsers);
    }

    public addUser(spaceId: string, user: User) {
        const users = this.rooms.get(spaceId) ?? [];
        if (!users.some((roomUser) => roomUser.id === user.id)) {
            this.rooms.set(spaceId, [...users, user]);
        }
    }

    public broadcast(message: OutgoingMessage, user: User, roomId: string) {
        if (!this.rooms.has(roomId)) {
            return;
        }
        this.rooms.get(roomId)?.forEach((u) => {
            if (u.id !== user.id) {
                u.send(message);
            }
        });
    }
}