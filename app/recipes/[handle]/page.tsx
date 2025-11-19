import React from 'react';
import Link from 'next/link';
import { getArticleByHandle, getBlogArticles } from '../../../lib/shopify/blog';
import { ArrowLeft, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // Revalidate every hour

// Generate static params for all articles
export async function generateStaticParams() {
  const articles = await getBlogArticles();
  return articles.map((article) => ({
    handle: article.handle,
  }));
}

export default async function RecipeDetail({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const article = await getArticleByHandle(handle);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col w-full overflow-x-hidden bg-meatzy-tallow font-sans -mt-[140px]">

      {/* Hero Section with Image */}
      <section className="relative bg-meatzy-olive text-white pt-56 pb-20 overflow-hidden">
        {article.image && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${article.image.url}")`,
            }}
          >
            <div className="absolute inset-0 bg-black/70"></div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 font-display font-bold uppercase tracking-widest text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Recipes
          </Link>

          <h1 className="text-4xl md:text-6xl font-black font-slab uppercase leading-tight">
            {article.title}
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200">
              <Tag className="w-5 h-5 text-meatzy-rare" />
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm font-bold uppercase px-4 py-2 bg-meatzy-tallow text-meatzy-olive rounded-full border border-meatzy-mint/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-slab prose-headings:font-black prose-headings:text-meatzy-olive prose-headings:leading-tight
              prose-p:text-meatzy-olive/80 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-meatzy-rare prose-a:no-underline hover:prose-a:underline
              prose-strong:text-meatzy-olive prose-strong:font-bold
              prose-ul:text-meatzy-olive/80 prose-ul:my-6 prose-ul:space-y-2
              prose-ol:text-meatzy-olive/80 prose-ol:my-6 prose-ol:space-y-2
              prose-li:text-meatzy-olive/80 prose-li:leading-relaxed
              prose-li:marker:text-meatzy-rare prose-li:marker:font-bold
              prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
              prose-blockquote:border-l-4 prose-blockquote:border-meatzy-rare prose-blockquote:bg-meatzy-tallow prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:my-6
              prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6
              prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
              prose-hr:border-meatzy-mint prose-hr:my-8
              prose-pre:bg-meatzy-tallow prose-pre:border prose-pre:border-meatzy-mint/30 prose-pre:rounded-lg
              prose-code:text-meatzy-welldone prose-code:bg-meatzy-tallow prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-table:border-collapse prose-table:my-8
              prose-th:bg-meatzy-olive prose-th:text-white prose-th:font-bold prose-th:p-3
              prose-td:border prose-td:border-gray-200 prose-td:p-3"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-meatzy-olive">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black font-slab text-white uppercase mb-6 leading-tight">
            Ready to Cook This Recipe?
          </h2>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Get the premium cuts you need delivered fresh to your door
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#shop"
              className="bg-meatzy-rare text-white px-10 py-4 font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors shadow-lg"
            >
              Shop Our Boxes
            </Link>
            <Link
              href="/recipes"
              className="bg-white text-meatzy-olive px-10 py-4 font-display font-bold uppercase tracking-widest hover:bg-meatzy-tallow transition-colors shadow-lg"
            >
              More Recipes
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
