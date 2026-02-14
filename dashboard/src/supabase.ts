import { createClient } from '@supabase/supabase-js';
import type { Article } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Database operations
export const articleService = {
    // Fetch all articles from the last 24 hours
    async getRecentArticles(): Promise<Article[]> {
        if (!supabase) {
            console.warn('Supabase not configured');
            return [];
        }

        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .gte('published_date', twentyFourHoursAgo.toISOString())
            .order('published_date', { ascending: false });

        if (error) {
            console.error('Error fetching articles:', error);
            return [];
        }

        return data || [];
    },

    // Fetch saved articles
    async getSavedArticles(): Promise<Article[]> {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('is_saved', true)
            .order('saved_at', { ascending: false });

        if (error) {
            console.error('Error fetching saved articles:', error);
            return [];
        }

        return data || [];
    },

    // Toggle save status
    async toggleSave(articleId: string, currentlySaved: boolean): Promise<boolean> {
        if (!supabase) return false;

        const { error } = await supabase
            .from('articles')
            .update({
                is_saved: !currentlySaved,
                saved_at: !currentlySaved ? new Date().toISOString() : null,
            })
            .eq('id', articleId);

        if (error) {
            console.error('Error toggling save:', error);
            return false;
        }

        return true;
    },

    // Filter articles by source
    async getArticlesBySource(source: string): Promise<Article[]> {
        if (!supabase) return [];

        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('source', source)
            .gte('published_date', twentyFourHoursAgo.toISOString())
            .order('published_date', { ascending: false });

        if (error) {
            console.error('Error fetching articles by source:', error);
            return [];
        }

        return data || [];
    },
};
