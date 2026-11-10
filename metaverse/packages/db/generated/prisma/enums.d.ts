export declare const Role: {
    readonly Admin: "Admin";
    readonly User: "User";
};
export type Role = (typeof Role)[keyof typeof Role];
