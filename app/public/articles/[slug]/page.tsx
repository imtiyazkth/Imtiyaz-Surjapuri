// Redirect to the correct route: /articles/[slug]
import { redirect } from "next/navigation";

interface Props { params: Promise<{ slug: string }>; }

export default async function RedirectPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/articles/${slug}`);
}
