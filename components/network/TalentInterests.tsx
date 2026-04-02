"use client";

import { Checkbox, CheckboxGroup, Description, Label, Surface } from "@heroui/react";

export function TalentInterests() {
  return (
    <Surface className="w-full rounded-2xl p-4 bg-white/50 backdrop-blur-md border border-zinc-200">
      <CheckboxGroup name="interests" variant="secondary" defaultValue={["alignment", "nlp"]}>
        <Label className="font-syne text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">Research Domains</Label>
        
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
          <Checkbox value="alignment">
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <Label className="text-[10px] font-bold text-zinc-700">Alignment</Label>
            </Checkbox.Content>
          </Checkbox>

          <Checkbox value="nlp">
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <Label className="text-[10px] font-bold text-zinc-700">NLP</Label>
            </Checkbox.Content>
          </Checkbox>

          <Checkbox value="rl">
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <Label className="text-[10px] font-bold text-zinc-700">RL & Decision</Label>
            </Checkbox.Content>
          </Checkbox>
          
          <Checkbox value="robotics">
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <Label className="text-[10px] font-bold text-zinc-700">Robotics</Label>
            </Checkbox.Content>
          </Checkbox>
        </div>
      </CheckboxGroup>
    </Surface>
  );
}
