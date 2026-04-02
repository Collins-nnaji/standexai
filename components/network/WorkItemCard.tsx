import Link from "next/link";
import { FileText, Database, Code2, Beaker, ExternalLink, ArrowRight, Eye } from "lucide-react";

export interface WorkItemCardProps {
  id: string;
  type: string;
  title: string;
  abstract: string;
  tags: string[];
  views: number;
  externalUrl?: string | null;
  fileUrl?: string | null;
  authorName?: string | null;
  authorId?: string | null;
  authorHandle?: string | null;
  collaborationId?: string | null;
  coAuthors?: string[];
}

export function WorkItemCard({
  id,
  type,
  title,
  abstract,
  tags,
  views,
  externalUrl,
  fileUrl,
  authorName,
  authorId,
  authorHandle,
  collaborationId,
  coAuthors = [],
}: WorkItemCardProps) {
  
  // Choose Icon by Type
  const t = type.toLowerCase();
  let Icon = FileText;
  if (t === "model") Icon = Code2;
  if (t === "dataset") Icon = Database;
  if (t === "experiment") Icon = Beaker;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-black/10 bg-white shadow-sm p-6 transition-all hover:border-black/20 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-[#7C5CFC]">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {type === "collab_experiment" ? "Collab Experiment" : type}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                <Eye className="h-3 w-3" /> {views.toLocaleString()}
              </span>
              {collaborationId && (
                <span className="rounded-full bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 px-2 py-0.5 text-[10px] font-bold text-[#7C5CFC]">
                  Co-published · {coAuthors.length + 1} researchers
                </span>
              )}
            </div>
            {authorName && authorId && (
              <Link href={`/r/${authorHandle || authorId}`} className="text-sm font-bold text-zinc-900 hover:text-[#7C5CFC] transition-colors relative z-10">
                {authorName}
              </Link>
            )}
          </div>
        </div>
        <div className="flex gap-2 relative z-10">
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 px-3 py-1.5 text-xs font-bold hover:bg-emerald-100 transition-colors"
              title="Download Artifact"
            >
              Download
            </a>
          )}
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-full bg-zinc-100 text-zinc-600 px-3 py-1.5 text-xs font-bold hover:bg-zinc-200 transition-colors"
              title="External Resource"
            >
              <ExternalLink className="mr-1.5 h-3 w-3" /> Link
            </a>
          )}
        </div>
      </div>

      <Link href={`/work/${id}`} className="min-w-0 flex-1">
        <h3 className="font-syne mb-3 text-xl font-bold leading-tight text-zinc-900 group-hover:text-[#7C5CFC] transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-zinc-500">
          {abstract}
        </p>
      </Link>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4 border-t border-black/5">
        {tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-600"
          >
            {tag}
          </span>
        ))}
        {tags.length > 4 && (
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-500">
            +{tags.length - 4}
          </span>
        )}
        <div className="ml-auto">
          <Link href={`/work/${id}`} className="inline-flex h-8 items-center justify-center rounded-lg bg-zinc-100 px-4 text-[12px] font-bold text-zinc-900 transition-colors hover:bg-zinc-200 group-hover:bg-[#7C5CFC] group-hover:text-zinc-900">
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
