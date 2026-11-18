// Blog: the home section, the /blog list and the post page, on Parmar's blog layouts
// (BlogSection, BlogPage, BlogPostDetail and the shared BlogPreviewCard variants).
// All data comes from @/content/blog.
import { useState } from "react";
import { Link } from "react-router-dom";
import { Reveal, ScrubText } from "@/components/motion";
import { MarkdownBlock } from "@/components/Markdown";
import { ArrowIcon, PageShell, primaryButton } from "@/components/ui";
import { blogCopy } from "@/content/pages";
import { formatDate, getCategories, getMorePosts, getPost, getPosts, getPreviewPosts, type BlogPost } from "@/content/blog";

const readMore = "inline-flex items-center gap-3 w-fit rounded-full border border-black/15 bg-white/70 px-5 py-3 text-sm font-medium text-black transition-colors duration-300 hover:bg-black hover:text-white hover:border-black";

/** Parmar BlogPreviewCard "row": date and title on the left, a wide photo on the right. */
const RowCard = ({ post, delay }: { post: BlogPost; delay: number }) => (
  <Reveal delay={delay} className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)] gap-8 md:gap-20 py-10 md:py-14 items-center border-b border-black/[0.08] last:border-b-0">
    <div className="flex h-full flex-col justify-between py-1">
      <time dateTime={post.date} className="text-sm md:text-base font-medium text-black/90 tracking-tight">{formatDate(post.date)}</time>
      <div className="pt-6 md:pt-10 flex flex-col gap-4 max-w-[540px]">
        <h3 className="text-[32px] md:text-[46px] font-semibold leading-[1.05] tracking-[-0.04em] text-black">{post.title}</h3>
        <p className="text-sm md:text-[15px] text-black/70 leading-[1.4] tracking-tight max-w-[460px] mt-1">{post.excerpt}</p>
        <Link to={post.href} className={`mt-6 ${readMore}`}>
          Read more<span className="sr-only"> about {post.title}</span> <ArrowIcon size={14} />
        </Link>
      </div>
    </div>
    <div className="overflow-hidden w-full aspect-[2/1] md:aspect-auto md:h-[380px] lg:h-[420px]">
      <img src={post.image_url} alt={post.image_alt} loading="lazy" decoding="async" className="w-full h-full object-cover" />
    </div>
  </Reveal>
);

/** Parmar BlogPreviewCard "grid" and "article": photo, date, title (and excerpt in the grid). */
const GridCard = ({ post, delay, compact = false }: { post: BlogPost; delay: number; compact?: boolean }) => (
  <Reveal delay={delay} className="group relative flex flex-col gap-3">
    <div className="overflow-hidden aspect-[2.39/1]">
      <img src={post.image_url} alt={post.image_alt} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
    </div>
    <div className="flex flex-col gap-2 pt-1">
      <p className="flex flex-wrap gap-x-3 text-xs font-medium tracking-wide text-black/70">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">·</span>
        <span>{post.read_time} read</span>
      </p>
      <h3 className={compact ? "text-[22px] md:text-[26px] font-medium leading-[1.2] tracking-[-0.04em]" : "text-lg md:text-xl font-medium leading-snug tracking-tight"}>
        {/* The whole card is clickable through this link's ::after. */}
        <Link to={post.href} className="after:absolute after:inset-0 group-hover:text-black/70 transition-colors">{post.title}</Link>
      </h3>
      {!compact && <p className="text-sm text-black/70 leading-relaxed">{post.excerpt}</p>}
    </div>
  </Reveal>
);

/** Parmar BlogSection on the home page: heading and button on the left, three post rows. */
export const BlogSection = () => {
  const posts = getPreviewPosts();
  if (!posts.length) return null;
  return (
    <section aria-labelledby="blog-heading" className="bg-[#f3f1ed] text-black py-16 md:py-[100px] w-full overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,420px)_1fr] gap-10 md:gap-16 items-start pb-10 md:pb-12">
          <Reveal>
            <h2 id="blog-heading" className="text-[58px] md:text-[78px] font-semibold tracking-[-0.06em] leading-[0.92]">
              <ScrubText as="span" segments={[{ text: blogCopy.heading[0], color: "text-black" }, { text: blogCopy.heading[1], color: "text-black/50", base: "text-neutral-300/60" }]} />
            </h2>
          </Reveal>
          <Reveal delay={150} className="max-w-[640px] md:pt-1 md:pl-4">
            <p className="text-[20px] md:text-[25px] font-medium tracking-[-0.05em] leading-[1.18] max-w-[590px]">{blogCopy.subheading}</p>
            <Link to="/blog" className={`mt-8 ${primaryButton}`}>{blogCopy.cta} <ArrowIcon size={16} /></Link>
          </Reveal>
        </div>
        <div className="flex flex-col">
          {posts.map((post, i) => <RowCard key={post.slug} post={post} delay={i * 100} />)}
        </div>
      </div>
    </section>
  );
};

/** Parmar BlogPage: title, search, category pills, a featured post and a grid. */
export const BlogListPage = () => {
  const posts = getPosts();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const browsing = category === "All" && !q;
  const featured = browsing ? posts[0] : undefined;
  const shown = posts.filter(
    (p) => p !== featured && (category === "All" || p.category === category) && (!q || `${p.title} ${p.excerpt}`.toLowerCase().includes(q)),
  );

  return (
    <PageShell breadcrumbs={[{ name: "Blog" }]}>
      <div className="text-center max-w-[760px] mx-auto pb-8">
        <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-normal tracking-[-0.04em] leading-[1.1]">{blogCopy.h1}</h1>
        <p className="mt-4 text-[15px] md:text-[17px] text-black/70 leading-[1.6]">{blogCopy.intro}</p>
      </div>

      <label className="group relative flex items-center pb-2 border-b border-black/20 focus-within:border-black/70 transition-colors">
        <span className="sr-only">Search articles</span>
        <input
          type="search"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-[16px] md:text-[20px] bg-transparent placeholder-black/50 py-1 focus:outline-none"
        />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="text-black/50"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
      </label>

      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2 py-5">
        {["All", ...getCategories()].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border border-black transition-colors ${category === c ? "bg-black text-white" : "bg-white text-black hover:bg-black/5"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {featured && (
        <Reveal className="group relative grid grid-cols-1 md:grid-cols-2 mb-10 md:mb-16 overflow-hidden">
          <div className="aspect-[16/10] md:aspect-auto md:min-h-[360px] overflow-hidden">
            <img src={featured.image_url} alt={featured.image_alt} fetchPriority="high" className="w-full h-full object-cover" />
          </div>
          <div className="p-8 md:p-10 flex flex-col justify-center gap-4 bg-[#f8f7f4]">
            <p className="text-xs font-medium tracking-wide text-black/70"><time dateTime={featured.date}>{formatDate(featured.date)}</time> · {featured.category}</p>
            <h2 className="text-2xl md:text-[32px] font-normal leading-[1.15] tracking-[-0.03em] text-balance">{featured.title}</h2>
            <p className="text-[15px] text-black/70 leading-[1.7] max-w-[500px]">{featured.excerpt}</p>
            <Link to={featured.href} className={`mt-2 ${readMore} after:absolute after:inset-0`}>
              Read more<span className="sr-only"> about {featured.title}</span> <ArrowIcon size={14} />
            </Link>
          </div>
        </Reveal>
      )}

      {shown.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-12">
          {shown.map((post, i) => <GridCard key={post.slug} post={post} delay={(i % 3) * 100} />)}
        </div>
      ) : (
        <p role="status" className="text-center py-20 text-lg text-black/60">No articles match your search.</p>
      )}
    </PageShell>
  );
};

/** Parmar BlogPostDetail: sticky title column on the left, the article on the right. */
export const BlogPostPage = ({ slug }: { slug: string }) => {
  const post = getPost(slug)!;
  const more = getMorePosts(post);
  return (
    <PageShell breadcrumbs={[{ name: "Blog", path: "/blog" }, { name: post.category ?? post.title }]}>
      <article className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-24 items-start">
        <header className="lg:sticky lg:top-[170px] flex flex-col gap-6">
          <p className="text-xs md:text-sm font-semibold tracking-[0.15em] uppercase text-black/60">
            <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.read_time} read
          </p>
          <h1 className="text-[34px] md:text-[44px] lg:text-[52px] font-normal tracking-[-0.04em] leading-[1.08] text-balance">{post.title}</h1>
          <p className="text-[17px] leading-[1.6] text-black/70 max-w-[520px]">{post.excerpt}</p>
          {post.category && <p className="text-[12px] font-medium uppercase tracking-widest text-black/60">{post.category}</p>}
        </header>

        <div className="flex flex-col gap-10 text-[16px] md:text-[17px] leading-[1.75] text-black/80 min-w-0">
          <img src={post.image_url} alt={post.image_alt} fetchPriority="high" className="w-full aspect-[16/9] object-cover" />
          <div className="flex flex-col gap-6 pb-8 border-b border-black/20 font-medium text-black/90">
            {post.intro.map((block, i) => <MarkdownBlock key={i} block={block} />)}
          </div>
          {post.sections.map((section) => (
            <section key={section.id} className="flex flex-col gap-5 pb-8 border-b border-black/10 last:border-b-0">
              <h2 className="text-[24px] md:text-[28px] leading-[1.2] tracking-[-0.02em] text-black">{section.title}</h2>
              {section.paragraphs.map((block, i) => <MarkdownBlock key={i} block={block} />)}
            </section>
          ))}
        </div>
      </article>

      {more.length > 0 && (
        <section aria-labelledby="more-heading" className="mt-20 md:mt-28 pt-12 border-t border-black/20">
          <div className="flex items-end justify-between gap-6 mb-10">
            <h2 id="more-heading" className="text-[28px] md:text-[40px] font-medium tracking-[-0.04em]">More articles</h2>
            <Link to="/blog" className="text-sm font-medium underline underline-offset-4 shrink-0">All articles</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {more.map((p, i) => <GridCard key={p.slug} post={p} delay={i * 100} compact />)}
          </div>
        </section>
      )}
    </PageShell>
  );
};
