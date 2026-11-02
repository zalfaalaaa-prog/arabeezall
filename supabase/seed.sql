-- Initial learning content: Materi 1 - At-Ta'aruf
-- Safe to run more than once because lesson and question rows have unique keys.

insert into public.lessons (id, slug, title, title_ar, description, color, level_no, sort_order, is_published)
values (
  '11111111-1111-4111-8111-111111111111',
  'at-taaruf',
  'At-Ta‘āruf (Perkenalan)',
  'التَّعَارُفُ',
  'Belajar salam, memperkenalkan diri, kosakata dasar, kata tanya, kata ganti, dan dialog perkenalan sederhana.',
  '#F39A32',
  1,
  1,
  true
)
on conflict (slug) do update set
  title = excluded.title,
  title_ar = excluded.title_ar,
  description = excluded.description,
  color = excluded.color,
  is_published = true;

insert into public.vocabulary (lesson_id, arabic, transliteration, meaning, example_arabic, example_meaning, sort_order)
select l.id, v.arabic, v.transliteration, v.meaning, v.example_arabic, v.example_meaning, v.sort_order
from public.lessons l
cross join (values
  ('اَلسَّلَامُ عَلَيْكُمْ','As-salāmu ‘alaikum','Semoga keselamatan tercurah kepadamu','اَلسَّلَامُ عَلَيْكُمْ يَا أَحْمَدُ','Salam sejahtera, Ahmad.',1),
  ('وَعَلَيْكُمُ السَّلَامُ','Wa‘alaikumussalām','Dan semoga keselamatan tercurah kepadamu juga','وَعَلَيْكُمُ السَّلَامُ يَا عَلِيُّ','Dan salam sejahtera juga, Ali.',2),
  ('أَهْلًا وَسَهْلًا','Ahlan wa sahlan','Selamat datang','أَهْلًا وَسَهْلًا بِكَ','Selamat datang untukmu.',3),
  ('مَا اسْمُكَ؟','Mā ismuka?','Siapa namamu? (laki-laki)','مَا اسْمُكَ يَا صَدِيقِي؟','Siapa namamu, temanku?',4),
  ('اِسْمِي','Ismī','Namaku','اِسْمِي مُحَمَّدٌ','Namaku Muhammad.',5),
  ('مِنْ أَيْنَ أَنْتَ؟','Min aina anta?','Dari mana asalmu?','مِنْ أَيْنَ أَنْتَ يَا عَلِيُّ؟','Dari mana asalmu, Ali?',6),
  ('أَنَا مِنْ إِنْدُونِيسِيَا','Anā min Indūnīsiyā','Saya dari Indonesia','أَنَا مِنْ إِنْدُونِيسِيَا','Saya dari Indonesia.',7),
  ('كَيْفَ حَالُكَ؟','Kaifa ḥāluka?','Bagaimana kabarmu?','كَيْفَ حَالُكَ الْيَوْمَ؟','Bagaimana kabarmu hari ini?',8),
  ('أَنَا بِخَيْرٍ','Anā bikhair','Saya baik','أَنَا بِخَيْرٍ، الْحَمْدُ لِلَّهِ','Saya baik, segala puji bagi Allah.',9),
  ('مَنْ','Man','Siapa','مَنْ هَذَا؟','Siapa ini?',10),
  ('أَيْنَ','Aina','Di mana','أَيْنَ مَدْرَسَتُكَ؟','Di mana sekolahmu?',11),
  ('كَمْ','Kam','Berapa','كَمْ عُمْرُكَ؟','Berapa umurmu?',12)
) as v(arabic, transliteration, meaning, example_arabic, example_meaning, sort_order)
where l.slug = 'at-taaruf'
and not exists (
  select 1 from public.vocabulary old
  where old.lesson_id = l.id and old.sort_order = v.sort_order
);

insert into public.dialogues (lesson_id, title, arabic_text, translation, sort_order)
select l.id, d.title, d.arabic_text, d.translation, d.sort_order
from public.lessons l
cross join (values
  ('Dialog 1 · Bertemu teman baru',
   'أَحْمَدُ: اَلسَّلَامُ عَلَيْكُمْ\nعَلِيٌّ: وَعَلَيْكُمُ السَّلَامُ\nأَحْمَدُ: مَا اسْمُكَ؟\nعَلِيٌّ: اِسْمِي عَلِيٌّ. وَمَا اسْمُكَ؟\nأَحْمَدُ: اِسْمِي أَحْمَدُ. أَهْلًا وَسَهْلًا.\nعَلِيٌّ: أَهْلًا بِكَ.',
   'Ahmad: Assalamu’alaikum.\nAli: Wa’alaikumussalam.\nAhmad: Siapa namamu?\nAli: Namaku Ali. Siapa namamu?\nAhmad: Namaku Ahmad. Selamat datang.\nAli: Selamat datang juga.',1),
  ('Dialog 2 · Asal dan kabar',
   'فَاطِمَةُ: صَبَاحُ الْخَيْرِ.\nعَائِشَةُ: صَبَاحُ النُّورِ.\nفَاطِمَةُ: مِنْ أَيْنَ أَنْتِ؟\nعَائِشَةُ: أَنَا مِنْ بَانْدُونْغَ. وَأَنْتِ؟\nفَاطِمَةُ: أَنَا مِنْ جَاكَرْتَا.\nعَائِشَةُ: كَيْفَ حَالُكِ؟\nفَاطِمَةُ: أَنَا بِخَيْرٍ، شُكْرًا.',
   'Fatimah: Selamat pagi.\nAisyah: Selamat pagi juga.\nFatimah: Dari mana asalmu?\nAisyah: Saya dari Bandung. Kamu?\nFatimah: Saya dari Jakarta.\nAisyah: Bagaimana kabarmu?\nFatimah: Saya baik, terima kasih.',2)
) as d(title, arabic_text, translation, sort_order)
where l.slug = 'at-taaruf'
and not exists (select 1 from public.dialogues old where old.lesson_id = l.id and old.sort_order = d.sort_order);

-- Fifteen questions for the mixed 4-maharah practice session.
insert into public.questions (lesson_id, mode, skill, question_type, prompt, prompt_arabic, options, correct_answer, explanation, audio_text, sort_order, is_published)
select l.id, 'mixed', q.skill, q.question_type, q.prompt, q.prompt_arabic, q.options::jsonb, q.correct_answer, q.explanation, q.audio_text, q.sort_order, true
from public.lessons l
cross join (values
  ('vocabulary','multiple_choice','Apa arti kata أَنَا؟','أَنَا','["Saya","Kamu","Dia laki-laki"]','Saya','أَنَا berarti saya.','أَنَا',1),
  ('vocabulary','multiple_choice','Apa arti kata مَنْ؟','مَنْ','["Di mana","Siapa","Berapa"]','Siapa','مَنْ digunakan untuk menanyakan orang atau siapa.','مَنْ',2),
  ('vocabulary','multiple_choice','Pilih ungkapan bahasa Arab untuk “Selamat datang”.','أَهْلًا وَسَهْلًا','["أَهْلًا وَسَهْلًا","مَا اسْمُكَ؟","أَنَا بِخَيْرٍ"]','أَهْلًا وَسَهْلًا','أَهْلًا وَسَهْلًا berarti selamat datang.','أَهْلًا وَسَهْلًا',3),
  ('grammar','multiple_choice','Kata tanya untuk menanyakan “di mana” adalah ...','أَيْنَ','["مَا","أَيْنَ","كَمْ"]','أَيْنَ','أَيْنَ berarti di mana.','أَيْنَ',4),
  ('grammar','multiple_choice','Kata ganti “dia perempuan” adalah ...','هِيَ','["هُوَ","أَنَا","هِيَ"]','هِيَ','هِيَ merupakan kata ganti orang ketiga perempuan.','هِيَ',5),
  ('grammar','multiple_choice','Lengkapi kalimat: أَنَا ___ مِنْ إِنْدُونِيسِيَا','أَنَا طَالِبٌ مِنْ إِنْدُونِيسِيَا','["طَالِبٌ","مَدْرَسَةٌ","كِتَابٌ"]','طَالِبٌ','طَالِبٌ berarti siswa laki-laki.','أَنَا طَالِبٌ مِنْ إِنْدُونِيسِيَا',6),
  ('listening','listen_choose','Dengarkan ungkapan berikut. Apa artinya?','كَيْفَ حَالُكَ؟','["Siapa namamu?","Bagaimana kabarmu?","Dari mana asalmu?"]','Bagaimana kabarmu?','كَيْفَ حَالُكَ؟ berarti bagaimana kabarmu?','كَيْفَ حَالُكَ؟',7),
  ('conversation','multiple_choice','Jawaban yang tepat untuk اَلسَّلَامُ عَلَيْكُمْ adalah ...','اَلسَّلَامُ عَلَيْكُمْ','["صَبَاحُ الْخَيْرِ","وَعَلَيْكُمُ السَّلَامُ","أَنَا مِنْ جَاكَرْتَا"]','وَعَلَيْكُمُ السَّلَامُ','Jawaban salam adalah وَعَلَيْكُمُ السَّلَامُ.','وَعَلَيْكُمُ السَّلَامُ',8),
  ('vocabulary','multiple_choice','Apa arti kalimat أَنَا مِنْ إِنْدُونِيسِيَا؟','أَنَا مِنْ إِنْدُونِيسِيَا','["Saya dari Indonesia","Saya siswa","Nama saya Indonesia"]','Saya dari Indonesia','أَنَا مِنْ إِنْدُونِيسِيَا berarti saya dari Indonesia.','أَنَا مِنْ إِنْدُونِيسِيَا',9),
  ('grammar','multiple_choice','Kata tanya yang berarti “berapa” adalah ...','كَمْ','["مَنْ","كَمْ","كَيْفَ"]','كَمْ','كَمْ digunakan untuk menanyakan jumlah atau bilangan.','كَمْ',10),
  ('conversation','multiple_choice','Jika ditanya مَا اسْمُكَ؟, jawaban yang sesuai adalah ...','مَا اسْمُكَ؟','["اِسْمِي فَاطِمَةُ","أَنَا بِخَيْرٍ","أَنَا مِنْ بَانْدُونْغَ"]','اِسْمِي فَاطِمَةُ','مَا اسْمُكَ؟ berarti siapa namamu? Jawab dengan اِسْمِي ...','مَا اسْمُكَ؟',11),
  ('conversation','multiple_choice','Apa arti مِنْ أَيْنَ أَنْتَ؟','مِنْ أَيْنَ أَنْتَ؟','["Siapa kamu?","Dari mana asalmu?","Berapa umurmu?"]','Dari mana asalmu؟','مِنْ أَيْنَ أَنْتَ؟ digunakan untuk menanyakan asal.','مِنْ أَيْنَ أَنْتَ؟',12),
  ('vocabulary','multiple_choice','Apa arti أَنَا بِخَيْرٍ؟','أَنَا بِخَيْرٍ','["Saya baik","Saya dari sekolah","Nama saya Ali"]','Saya baik','أَنَا بِخَيْرٍ berarti saya baik.','أَنَا بِخَيْرٍ',13),
  ('grammar','multiple_choice','Kata ganti untuk “kamu perempuan” adalah ...','أَنْتِ','["أَنْتَ","أَنْتِ","هِيَ"]','أَنْتِ','أَنْتِ adalah kata ganti orang kedua perempuan.','أَنْتِ',14),
  ('conversation','multiple_choice','Ungkapan yang tepat untuk memperkenalkan nama adalah ...','اِسْمِي مُحَمَّدٌ','["اِسْمِي مُحَمَّدٌ","أَيْنَ مَدْرَسَتُكَ؟","كَمْ عُمْرُكَ؟"]','اِسْمِي مُحَمَّدٌ','اِسْمِي ... berarti nama saya ...','اِسْمِي مُحَمَّدٌ',15)
) as q(skill, question_type, prompt, prompt_arabic, options, correct_answer, explanation, audio_text, sort_order)
where l.slug = 'at-taaruf'
on conflict (lesson_id, mode, sort_order) do nothing;

-- The focused modes reuse the same learning objectives and contain 15 questions each.
insert into public.questions (lesson_id, mode, skill, question_type, prompt, prompt_arabic, options, correct_answer, explanation, audio_text, sort_order, is_published)
select lesson_id, 'listening', 'listening', 'listen_choose', prompt, prompt_arabic, options, correct_answer, explanation, coalesce(audio_text, prompt_arabic), sort_order, true
from public.questions where lesson_id = '11111111-1111-4111-8111-111111111111' and mode = 'mixed'
on conflict (lesson_id, mode, sort_order) do nothing;

insert into public.questions (lesson_id, mode, skill, question_type, prompt, prompt_arabic, options, correct_answer, explanation, audio_text, sort_order, is_published)
select lesson_id, 'reading', 'reading', 'reading_aloud', 'Bacalah ungkapan berikut dengan suara jelas.', prompt_arabic, options, prompt_arabic, 'Latih pelafalan huruf dan harakat secara perlahan.', prompt_arabic, sort_order, true
from public.questions where lesson_id = '11111111-1111-4111-8111-111111111111' and mode = 'mixed'
on conflict (lesson_id, mode, sort_order) do nothing;

insert into public.questions (lesson_id, mode, skill, question_type, prompt, prompt_arabic, options, correct_answer, explanation, audio_text, sort_order, is_published)
select lesson_id, 'conversation', 'conversation', 'conversation_question', prompt, prompt_arabic, options, correct_answer, explanation, coalesce(audio_text, prompt_arabic), sort_order, true
from public.questions where lesson_id = '11111111-1111-4111-8111-111111111111' and mode = 'mixed'
on conflict (lesson_id, mode, sort_order) do nothing;
