-- Arabeeza revision: top-up price and expanded student avatar options.
alter table public.profiles add column if not exists avatar_gender text not null default 'perempuan';
alter table public.profiles add column if not exists avatar_hair text not null default 'panjang';
alter table public.profiles add column if not exists avatar_hijab text not null default 'tidak';
alter table public.profiles add column if not exists avatar_expression text not null default 'senyum';

create or replace function public.buy_hearts(p_cost integer default 25)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid(); v_diamonds integer; v_hearts integer; v_cost integer := greatest(1, least(coalesce(p_cost, 25), 10000));
begin
  if v_user is null then raise exception 'Silakan login terlebih dahulu.'; end if;
  select diamonds, hearts into v_diamonds, v_hearts from public.profiles where id = v_user for update;
  if v_hearts >= 5 then raise exception 'Nyawa kamu sudah penuh.'; end if;
  if v_diamonds < v_cost then raise exception 'Berlian tidak cukup. Kamu membutuhkan 25 berlian.'; end if;
  update public.profiles set diamonds = diamonds - v_cost, hearts = 5 where id = v_user;
  return jsonb_build_object('ok', true, 'hearts', 5, 'diamonds', v_diamonds - v_cost);
end; $$;

create or replace function public.update_my_avatar_v2(
  p_avatar_skin text, p_avatar_outfit text, p_avatar_gender text, p_avatar_hair text, p_avatar_hijab text, p_avatar_expression text
) returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Silakan login kembali.'; end if;
  if p_avatar_skin not in ('sawo-matang','kuning-langsat','cokelat','cerah') then raise exception 'Warna kulit tidak valid.'; end if;
  if p_avatar_outfit not in ('hijau','biru','oranye','ungu') then raise exception 'Pakaian tidak valid.'; end if;
  if p_avatar_gender not in ('laki-laki','perempuan') then raise exception 'Pilihan karakter tidak valid.'; end if;
  if p_avatar_hair not in ('pendek','panjang','keriting') then raise exception 'Pilihan rambut tidak valid.'; end if;
  if p_avatar_hijab not in ('tidak','ya') then raise exception 'Pilihan kerudung tidak valid.'; end if;
  if p_avatar_expression not in ('senyum','ceria','serius') then raise exception 'Ekspresi tidak valid.'; end if;
  update public.profiles set avatar_skin=p_avatar_skin, avatar_outfit=p_avatar_outfit, avatar_gender=p_avatar_gender, avatar_hair=p_avatar_hair, avatar_hijab=p_avatar_hijab, avatar_expression=p_avatar_expression where id=auth.uid();
end; $$;
grant execute on function public.update_my_avatar_v2(text,text,text,text,text,text) to authenticated;
