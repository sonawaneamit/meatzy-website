import { shopifyClient } from './client';
import { GET_BLOG_ARTICLES, GET_ARTICLE_BY_HANDLE } from './queries';
import type { BlogResponse, ArticleByHandleResponse, Article } from './types';

export async function getBlogArticles(): Promise<Article[]> {
  try {
    const data = await shopifyClient.request<BlogResponse>(GET_BLOG_ARTICLES, { first: 20 });
    return data.blog?.articles.edges.map(edge => edge.node) || [];
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    return [];
  }
}

export async function getArticleByHandle(articleHandle: string): Promise<Article | null> {
  try {
    const data = await shopifyClient.request<ArticleByHandleResponse>(
      GET_ARTICLE_BY_HANDLE,
      {
        blogHandle: 'recipes',
        articleHandle
      }
    );
    return data.blog?.articleByHandle || null;
  } catch (error) {
    console.error(`Error fetching article ${articleHandle}:`, error);
    return null;
  }
}
