export const profile = {
  name: 'Lucas Figueiredo Kobayashi',
  shortName: 'Lucas Kobayashi',
  github: import.meta.env.VITE_GITHUB_USERNAME || 'kobaxzs',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'lucasfkobayashi19@gmail.com',
  linkedin: import.meta.env.VITE_LINKEDIN_URL || '',
};

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  key: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
};

export const hasBackend = Boolean(supabaseConfig.url && supabaseConfig.key);
