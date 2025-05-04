export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
};

export type ProjectStatus = 'idea' | 'building' | 'preview' | 'published';

export interface Project {
  id?: string;
  user_id: string;
  name: string;
  business_details: string;
  app_idea: string;
  features: string[];
  status: 'idea' | 'building' | 'preview' | 'published';
  sketch_data?: string;
  whiteboard_image?: string;
  generated_code?: Record<string, string>;
  published_url?: string;
  preview_url?: string;
  created_at?: any;
  updated_at?: any;
}

export type Feature = {
  id: string;
  name: string;
  description?: string;
}; 