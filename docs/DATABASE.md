# Database overview — ARABEEZA

- `profiles`: role, XP, diamonds, hearts, streak, avatar.
- `lessons`: learning units (initially At-Ta‘āruf).
- `vocabulary`: Arabic vocabulary with harakat and Indonesian meanings.
- `dialogues`: short Arabic conversations and translations.
- `questions`: 15-question sets for mixed/listening/reading/conversation modes.
- `lesson_progress`: session count and best score per lesson.
- `quiz_attempts`: score and reward history.
- `teacher_notes`: teacher feedback attached to a student and lesson.

The SQL migrations enable Row Level Security (RLS) and add `record_quiz_result`, `buy_hearts`, `update_my_avatar`, and `update_my_avatar_v2` RPC functions. Run migration `002_arabeeza_revision.sql` after `001_init.sql` on existing projects. It adds avatar customization fields and changes the heart refill price to 25 diamonds.
