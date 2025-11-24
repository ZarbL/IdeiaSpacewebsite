const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || '';

export interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  slug: string;
  date: string;
  featured_media?: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

export interface WordPressPage {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  slug: string;
}

/**
 * Fetch posts from WordPress
 */
export async function getPosts(limit: number = 10): Promise<WordPressPost[]> {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/posts?_embed&per_page=${limit}`,
      {
        next: { revalidate: 60 } // Revalidate every 60 seconds
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/posts?slug=${slug}&_embed`,
      {
        next: { revalidate: 60 }
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch post');
    }

    const posts = await res.json();
    return posts[0] || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

/**
 * Fetch pages from WordPress
 */
export async function getPages(): Promise<WordPressPage[]> {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/pages`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!res.ok) {
      throw new Error('Failed to fetch pages');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

/**
 * Fetch a single page by slug
 */
export async function getPageBySlug(slug: string): Promise<WordPressPage | null> {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/pages?slug=${slug}`,
      {
        next: { revalidate: 3600 }
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch page');
    }

    const pages = await res.json();
    return pages[0] || null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}
