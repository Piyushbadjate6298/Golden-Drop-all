import { useState } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";

const posts = [
  {
    title: "How to choose oil for high-heat Indian cooking",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
    summary: "A simple guide to smoke point, aroma, and dish-by-dish oil selection."
  },
  {
    title: "Safflower vs sunflower oil: everyday kitchen guide",
    image:
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=80",
    summary: "Compare light texture, flavor, and family cooking use cases."
  },
  {
    title: "Groundnut oil for traditional recipes",
    image:
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=900&q=80",
    summary: "Why rich aroma matters for frying, pickles, and regional meals."
  }
];

export function BlogPage() {
  const [selectedPost, setSelectedPost] = useState(posts[0]);

  return (
    <div className="space-y-8 pb-12">
      <Seo
        description="Golden Drop blog articles about edible oil choices, recipes, and cooking performance."
        path="/blog"
        title="Blog"
      />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">
          Blog pages
        </p>
        <h1 className="mt-2">Cooking Guides and Oil Notes</h1>
      </div>
      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-3">
          {posts.map((post) => (
            <button
              className="rounded-component border border-surface-border bg-surface-white p-4 text-left transition hover:border-gold-primary"
              key={post.title}
              onClick={() => setSelectedPost(post)}
              type="button"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-harvest-olive">
                <CalendarDays className="h-4 w-4" />
                Kitchen guide
              </div>
              <h2 className="mt-2 text-xl">{post.title}</h2>
              <p className="mt-1 text-sm">{post.summary}</p>
            </button>
          ))}
        </div>
        <article className="overflow-hidden rounded-component border border-surface-border bg-surface-white shadow-soft">
          <img
            alt={selectedPost.title}
            className="h-72 w-full object-cover"
            loading="lazy"
            src={selectedPost.image}
          />
          <div className="p-5">
            <h2>{selectedPost.title}</h2>
            <p className="mt-3">
              {selectedPost.summary} Golden Drop keeps product information clear, SEO-ready,
              and easy for customers to scan before they choose a pack size.
            </p>
            <Button className="mt-5 gap-2" variant="outline">
              Read More
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </article>
      </section>
    </div>
  );
}
