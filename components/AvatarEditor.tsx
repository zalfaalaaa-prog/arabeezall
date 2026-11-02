"use client";

import { useState } from "react";
import { updateAvatar } from "@/app/actions";

const skins = [
  { value: "sawo-matang", label: "Sawo matang", color: "#9b6040" },
  { value: "kuning-langsat", label: "Kuning langsat", color: "#e3b58c" },
  { value: "cokelat", label: "Cokelat", color: "#6f432f" },
  { value: "cerah", label: "Cerah", color: "#f1c9a7" }
];
const outfits = [
  { value: "hijau", label: "Jubah hijau", color: "#2e8b62" },
  { value: "biru", label: "Jubah biru", color: "#4b8ecb" },
  { value: "oranye", label: "Jubah oranye", color: "#f39a32" },
  { value: "ungu", label: "Jubah ungu", color: "#9270c7" }
];

export default function AvatarEditor({ skin, outfit }: { skin: string; outfit: string }) {
  const [selectedSkin, setSelectedSkin] = useState(skin);
  const [selectedOutfit, setSelectedOutfit] = useState(outfit);
  const skinColor = skins.find((item) => item.value === selectedSkin)?.color || skins[0].color;
  const outfitColor = outfits.find((item) => item.value === selectedOutfit)?.color || outfits[0].color;

  return (
    <form action={updateAvatar} className="surface p-5">
      <div className="mx-auto mb-5 flex h-36 w-36 flex-col items-center justify-center rounded-full bg-[#eaf7ef]">
        <div className="mb-1 h-12 w-12 rounded-full border-4 border-white" style={{ background: skinColor }}/>
        <div className="h-16 w-20 rounded-t-[28px] rounded-b-2xl border-4 border-white" style={{ background: outfitColor }}/>
      </div>
      <label className="mb-2 block text-sm font-black">Warna karakter</label>
      <div className="grid grid-cols-2 gap-2">
        {skins.map((item) => <button type="button" key={item.value} onClick={() => setSelectedSkin(item.value)} className={`flex items-center gap-2 rounded-xl border p-2 text-xs font-bold ${selectedSkin === item.value ? "border-[#2e8b62] bg-[#eaf7ef]" : "border-[#e7eee8]"}`}><span className="h-5 w-5 rounded-full" style={{ background: item.color }}/>{item.label}</button>)}
      </div>
      <label className="mb-2 mt-5 block text-sm font-black">Pakaian karakter</label>
      <div className="grid grid-cols-2 gap-2">
        {outfits.map((item) => <button type="button" key={item.value} onClick={() => setSelectedOutfit(item.value)} className={`flex items-center gap-2 rounded-xl border p-2 text-xs font-bold ${selectedOutfit === item.value ? "border-[#2e8b62] bg-[#eaf7ef]" : "border-[#e7eee8]"}`}><span className="h-5 w-5 rounded-md" style={{ background: item.color }}/>{item.label}</button>)}
      </div>
      <input type="hidden" name="avatar_skin" value={selectedSkin}/>
      <input type="hidden" name="avatar_outfit" value={selectedOutfit}/>
      <button type="submit" className="btn-primary mt-5 w-full">Simpan avatar</button>
    </form>
  );
}
