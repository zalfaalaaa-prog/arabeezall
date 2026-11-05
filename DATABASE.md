\
# Database overview

- `profiles`: role, XP, diamonds, hearts, streak, avatar.
- `lessons`: learning units (initially At-Ta‘āruf).
- `vocabulary`: Arabic vocabulary with harakat and Indonesian meanings.
- `dialogues`: short Arabic conversations and translations.
- `questions`: 15-question sets for mixed/listening/reading/conversation modes.
- `lesson_progress`: session count and best score per lesson.
- `quiz_attempts`: score and reward history.
- `teacher_notes`: teacher feedback attached to a student and lesson.

The SQL migration enables RLS and adds `record_quiz_result` and `buy_hearts` RPC functions.
