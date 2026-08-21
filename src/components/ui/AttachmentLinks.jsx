import { normalizeAttachmentUrls } from "../../utils/fileUpload";

const AttachmentLinks = ({
  urls,
  className = "",
  linkClassName = "text-blue-600 hover:underline text-sm",
  emptyLabel = "—",
}) => {
  const list = normalizeAttachmentUrls(urls);
  if (list.length === 0) {
    return <span className={className}>{emptyLabel}</span>;
  }

  return (
    <span className={`inline-flex flex-wrap gap-x-2 gap-y-1 ${className}`}>
      {list.map((url, index) => (
        <a
          key={`${url}-${index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          View{list.length > 1 ? ` ${index + 1}` : ""}
        </a>
      ))}
    </span>
  );
};

export default AttachmentLinks;
