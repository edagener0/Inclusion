export interface Note{
    id: number;
    content: string;
    user: {
        id: number;
        username: string;
        avatar: string | null;
    }
    likes_count: number
    is_liked: boolean;
    created_at: string;
}