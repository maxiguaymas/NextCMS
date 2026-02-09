export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <article className="prose dark:prose-invert max-w-3xl mx-auto">
      <h1>{params.slug.replace("-", " ")}</h1>
      <p>Public content rendered from CMS.</p>
    </article>
  );
}
