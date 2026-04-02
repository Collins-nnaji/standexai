"use client";

import { Avatar } from "@heroui/react";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ src, name, size = "sm", className }: UserAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      {src && <Avatar.Image src={src} />}
      <Avatar.Fallback>{name?.slice(0, 2).toUpperCase() || "AI"}</Avatar.Fallback>
    </Avatar>
  );
}
