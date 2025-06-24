import { Button, Input } from "@mui/material";

import { PlusOne, Search } from "@mui/icons-material";

export default function AssignProjectManagerModal({
  onCreateClick,
  onManagerClick,
}) {
  const members = Array(10)
    .fill(0)
    .map((_, i) => ({
      id: i,
      name: "Member name here",
      avatar: "/placeholder.svg?height=48&width=48",
    }));

  return (
    <div className="rounded-xl bg-[#f3f3f5] p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <button
          onClick={onCreateClick}
          className="flex items-center w-full gap-3 rounded-xl px-4 py-4 bg-white"
        >
          <div className="bg-[#fc8908] text-white px-2  rounded-sm text-center">
            +
          </div>
          Create a new Member
        </button>

        <div className="relative">
          <Input
            placeholder="Search Member"
            className="bg-white w-full rounded-xl px-4 py-3 h-auto text-base placeholder:text-[#8897ad] pr-12 "
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8897ad]" />
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {members.map((member, index) => (
            <div
              onClick={() => onManagerClick(member.id)}
              className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm transition-all border-2 border-transparent cursor-pointer hover:border-2 hover:border-[#fc8908]"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f7f7f8] flex-shrink-0">
                <img
                  src={member.avatar || "/placeholder.svg"}
                  alt="Member avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[#043b6a] font-medium text-base">
                {member.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
