import { getCreatorDisplayName } from "../../utils/privilegedAdmin";

/** Table cell for Created By / creator.name columns. */
export default function CreatorNameCell({ value, row }) {
  const label = getCreatorDisplayName(row?.creator, value || "-");
  return <span className="text-sm text-black">{label}</span>;
}
