// Renders one block of post Markdown as React elements: a paragraph, a bullet,
// numbered or checkbox list, or a table, with **bold** and [links](/path) inline.
// Nothing is injected as raw HTML, so post text from the future admin panel cannot
// add scripts or markup. Unsupported syntax shows as plain text.
import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowIcon, secondaryButton } from "@/components/ui";

const linkClass = "underline underline-offset-2 decoration-black/30 hover:decoration-black";

const safeHref = (href: string) => /^(\/(?!\/)|https?:\/\/|mailto:|tel:)/i.test(href);

const SmartLink = ({ href, className, children }: { href: string; className?: string; children: ReactNode }) =>
  !safeHref(href) ? (
    <>{children}</>
  ) : href.startsWith("/") ? (
    <Link to={href} className={className}>{children}</Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
  );

/** **bold** and [text](href); everything else is text. */
export const inline = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g).map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i} className="font-semibold text-black">{inline(bold[1])}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) return <SmartLink key={i} href={link[2]} className={linkClass}>{link[1]}</SmartLink>;
    return <Fragment key={i}>{part}</Fragment>;
  });

const cells = (row: string) => row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

export const MarkdownBlock = ({ block }: { block: string }) => {
  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

  // A block that is only one link becomes a button, like Parmar's "Read more" pills.
  const solo = block.trim().match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
  if (solo) return <p><SmartLink href={solo[2]} className={`${secondaryButton} w-fit !text-sm`}>{solo[1]} <ArrowIcon size={14} /></SmartLink></p>;

  if (lines.every((l) => l.startsWith("|"))) {
    const [head, , ...body] = lines; // second line is the |---| divider
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[15px]">
          <thead><tr>{cells(head).map((c, i) => <th key={i} scope="col" className="py-3 pr-6 border-b border-black/30 font-semibold">{inline(c)}</th>)}</tr></thead>
          <tbody>{body.map((r, i) => <tr key={i}>{cells(r).map((c, j) => <td key={j} className="py-3 pr-6 border-b border-black/10 align-top">{inline(c)}</td>)}</tr>)}</tbody>
        </table>
      </div>
    );
  }

  if (lines.every((l) => /^- /.test(l))) {
    return (
      <ul className="flex flex-col gap-2">
        {lines.map((l, i) => {
          const box = l.match(/^- \[[ xX]\] (.*)$/);
          return (
            <li key={i} className="flex gap-3">
              {box ? <span aria-hidden="true" className="mt-[5px] w-4 h-4 shrink-0 rounded-[3px] border border-black/50" /> : <span aria-hidden="true" className="mt-[11px] w-1.5 h-1.5 shrink-0 rounded-full bg-black" />}
              <span>{inline(box ? box[1] : l.slice(2))}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  if (lines.every((l) => /^\d+\. /.test(l))) {
    return (
      <ol className="flex flex-col gap-2">
        {lines.map((l, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden="true" className="w-6 shrink-0 font-semibold text-black">{l.match(/^(\d+)\./)![1]}.</span>
            <span>{inline(l.replace(/^\d+\. /, ""))}</span>
          </li>
        ))}
      </ol>
    );
  }

  return <p>{inline(lines.join(" "))}</p>;
};
