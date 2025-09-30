import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id }, include: { author: true, replies: { include: { author: true }, orderBy: { createdAt: "asc" } } } });
  if (!post) return <div className="py-6">Post not found</div>;
  return (
    <div className="py-6">
      <div className="text-sm text-gray-500">@{post.author?.username}</div>
      <div className="mt-1 whitespace-pre-wrap text-[15px] leading-6">{post.content}</div>
      <ReplyForm postId={post.id} />
      <h2 className="mt-6 font-semibold">Replies</h2>
      <ul className="mt-2 divide-y">
        {post.replies.map(r => (
          <li key={r.id} className="py-3">
            <div className="text-sm text-gray-500">@{r.author?.username}</div>
            <div className="mt-1 whitespace-pre-wrap">{r.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReplyForm({ postId }: { postId: string }) {
  async function action(formData: FormData) {
    "use server";
    const content = String(formData.get("content") || "");
    await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/posts/${postId}/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
    revalidatePath(`/post/${postId}`);
  }
  return (
    <form action={action} className="mt-6 flex gap-2">
      <input name="content" className="flex-1 rounded border px-3 py-2" placeholder="Write a reply" />
      <button className="rounded bg-gray-900 px-3 py-2 text-white">Reply</button>
    </form>
  );
}


