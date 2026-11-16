"use client";
import { useState } from "react";
import { updateAvatar } from "@/app/actions";
const skins=[{value:"sawo-matang",label:"Sawo matang",color:"#9b6040"},{value:"kuning-langsat",label:"Kuning langsat",color:"#e3b58c"},{value:"cokelat",label:"Cokelat",color:"#6f432f"},{value:"cerah",label:"Cerah",color:"#f1c9a7"}];
const outfits=[{value:"hijau",label:"Hijau",color:"#2e8b62"},{value:"biru",label:"Biru",color:"#4b8ecb"},{value:"oranye",label:"Oranye",color:"#f39a32"},{value:"ungu",label:"Ungu",color:"#9270c7"}];
function Picker({label,value,items,onChange}:{label:string;value:string;items:{value:string;label:string}[];onChange:(v:string)=>void}){return <div className="mt-4"><label className="mb-2 block text-sm font-black">{label}</label><div className="flex flex-wrap gap-2">{items.map(x=><button type="button" key={x.value} onClick={()=>onChange(x.value)} className={`rounded-xl border px-3 py-2 text-xs font-bold ${value===x.value?"border-[#2e8b62] bg-[#eaf7ef] text-[#236e4d]":"border-[#e7eee8] bg-white"}`}>{x.label}</button>)}</div></div>}
export default function AvatarEditor({skin,outfit,gender="perempuan",hair="panjang",hijab="tidak",expression="senyum"}:{skin:string;outfit:string;gender?:string;hair?:string;hijab?:string;expression?:string}){
 const [s,setS]=useState(skin),[o,setO]=useState(outfit),[g,setG]=useState(gender),[h,setH]=useState(hair),[v,setV]=useState(hijab),[e,setE]=useState(expression);
 const face=skins.find(x=>x.value===s)?.color||skins[0].color, shirt=outfits.find(x=>x.value===o)?.color||outfits[0].color;
 return <form action={updateAvatar} className="surface p-5">
  <div className="mx-auto mb-5 flex h-40 w-40 items-center justify-center rounded-[30px] bg-gradient-to-br from-[#fff1d8] to-[#eaf7ef]"><div className="relative flex flex-col items-center">
   <div className="relative z-10 flex h-[76px] w-[76px] items-center justify-center rounded-full border-[5px] border-white text-3xl shadow-sm" style={{background:face}}><span>{e==="ceria"?"😄":e==="serius"?"😐":"😊"}</span>{v==="ya"&&<span className="absolute -top-2 -left-2 text-3xl">🧕</span>}{v!=="ya"&&<span className="absolute -top-5 text-3xl">{h==="pendek"?"〰️":h==="keriting"?"🌀":"💇"}</span>}</div>
   <div className="-mt-1 h-16 w-24 rounded-t-[30px] rounded-b-2xl border-4 border-white" style={{background:shirt}}/><span className="absolute -bottom-1 text-[10px] font-black text-white">{g==="laki-laki"?"✦":"♥"}</span>
  </div></div>
  <Picker label="Karakter" value={g} onChange={setG} items={[{value:"laki-laki",label:"Laki-laki"},{value:"perempuan",label:"Perempuan"}]}/>
  <Picker label="Warna kulit" value={s} onChange={setS} items={skins}/>
  <Picker label="Model rambut" value={h} onChange={setH} items={[{value:"pendek",label:"Pendek"},{value:"panjang",label:"Panjang"},{value:"keriting",label:"Keriting"}]}/>
  <Picker label="Kerudung" value={v} onChange={setV} items={[{value:"tidak",label:"Tanpa kerudung"},{value:"ya",label:"Pakai kerudung"}]}/>
  <Picker label="Ekspresi wajah" value={e} onChange={setE} items={[{value:"senyum",label:"Senyum"},{value:"ceria",label:"Ceria"},{value:"serius",label:"Serius"}]}/>
  <Picker label="Warna pakaian" value={o} onChange={setO} items={outfits}/>
  <input type="hidden" name="avatar_skin" value={s}/><input type="hidden" name="avatar_outfit" value={o}/><input type="hidden" name="avatar_gender" value={g}/><input type="hidden" name="avatar_hair" value={h}/><input type="hidden" name="avatar_hijab" value={v}/><input type="hidden" name="avatar_expression" value={e}/>
  <button type="submit" className="btn-primary mt-6 w-full">Simpan karakter</button>
 </form>
}
