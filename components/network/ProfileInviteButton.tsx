"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { InviteToCollabModal } from "./InviteToCollabModal";

interface ProfileInviteButtonProps {
  targetUserId: string;
  targetUserName: string;
}

export function ProfileInviteButton({ targetUserId, targetUserName }: ProfileInviteButtonProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsInviteOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-bold text-zinc-700 shadow-sm hover:border-[#7C5CFC]/30 hover:text-[#7C5CFC] transition-all"
      >
        <Users className="h-4 w-4" /> Invite to Collab
      </button>

      <InviteToCollabModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        targetUserId={targetUserId}
        targetUserName={targetUserName}
      />
    </>
  );
}
