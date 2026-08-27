import { getCreatorDisplayName } from "../../utils/privilegedAdmin";

/** Table cell for Created By / creator.name columns. */
export default function CreatorNameCell({ value, row }) {
  const creator =
    row?.creator ||
    row?.user?.creator ||
    row?.createdByUser ||
    null;
  const label = getCreatorDisplayName(creator, value || "-");
  return <span className="text-sm text-black">{label}</span>;
}
