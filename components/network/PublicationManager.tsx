"use client";

import { Pencil, SquarePlus, TrashBin } from "@gravity-ui/icons";
import { Description, Header, Kbd, Label, ListBox, Separator, Surface } from "@heroui/react";

export function PublicationActions({ postId }: { postId?: string }) {
  return (
    <Surface className="w-full rounded-3xl shadow-surface bg-white/70 backdrop-blur-xl border border-zinc-200">
      <ListBox
        aria-label="Publication actions"
        className="w-full p-1"
        selectionMode="none"
        onAction={(key) => console.log(`Post ${postId} Action: ${key}`)}
      >
        <ListBox.Section>
          <Header className="px-2 pb-1 text-[9px] font-black uppercase tracking-widest text-[#7C5CFC]">Signals</Header>
          <ListBox.Item id="new-post" textValue="New Publication" className="group rounded-xl transition-all hover:bg-zinc-50 py-1.5 px-2">
            <div className="flex items-center">
              <SquarePlus className="size-3.5 shrink-0 text-zinc-400 group-hover:text-[#7C5CFC]" />
              <Label className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest ml-2">New Signal</Label>
              <Kbd className="ms-auto" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content className="text-[9px]">N</Kbd.Content>
              </Kbd>
            </div>
          </ListBox.Item>
          
          <ListBox.Item id="edit-post" textValue="Edit Publication" className="group rounded-xl transition-all hover:bg-zinc-50 py-1.5 px-2 mt-0.5">
            <div className="flex items-center">
              <Pencil className="size-3.5 shrink-0 text-zinc-400 group-hover:text-zinc-600" />
              <Label className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest ml-2">Refine</Label>
              <Kbd className="ms-auto" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content className="text-[9px]">E</Kbd.Content>
              </Kbd>
            </div>
          </ListBox.Item>
        </ListBox.Section>
        
        <Separator className="my-1.5 bg-zinc-100" />
        
        <ListBox.Section>
          <Header className="px-2 pb-1 text-[9px] font-black uppercase tracking-widest text-zinc-400">Governance</Header>
          <ListBox.Item id="delete-post" textValue="Retract Signal" variant="danger" className="group rounded-xl transition-all hover:bg-red-50 py-1.5 px-2">
            <div className="flex items-center">
              <TrashBin className="size-3.5 shrink-0 text-red-400 group-hover:text-red-500" />
              <Label className="text-[10px] font-bold text-red-900 uppercase tracking-widest ml-2">Retract</Label>
              <Kbd className="ms-auto bg-white/50 border-red-50" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Abbr keyValue="shift" />
                <Kbd.Content className="text-[9px]">D</Kbd.Content>
              </Kbd>
            </div>
          </ListBox.Item>
        </ListBox.Section>
      </ListBox>
    </Surface>
  );
}
