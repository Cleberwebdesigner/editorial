import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Tipos para auxiliar no desenvolvimento
export type PostStatus = 'Idea' | 'Script' | 'Production' | 'Scheduled' | 'Published';
export type PostCategory = 'Educational' | 'Promotional' | 'Engagement' | 'Institutional' | 'BTS';
export type PostFormat = 'Feed' | 'Reels' | 'Stories' | 'Carousel';

export interface Post {
    id: string;
    profile_id: string;
    ig_account_id?: string;
    title: string;
    caption?: string;
    thumbnail_url?: string;
    post_date: string;
    category: PostCategory;
    format: PostFormat;
    status: PostStatus;
    metrics_likes: number;
    metrics_comments: number;
    metrics_shares: number;
    metrics_saves: number;
    created_at: string;
}

export interface CommemorativeDate {
    id: string;
    title: string;
    date: string;
    relevance: 'Low' | 'Medium' | 'High';
    description?: string;
}
