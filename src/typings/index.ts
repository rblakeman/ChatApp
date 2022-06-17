export type NewMessage = {
    uid?: string | null;
    timestamp: string;
    email: string;
    value: string;
};

export type Message = NewMessage & {
    uid: string | null;
};

export type User = {
    email: string;
}
