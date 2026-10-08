-- Allow newly indexed Urdu chunks. Existing Bangla chunks remain stored for compatibility
-- with already-published versions, but the application no longer serves or creates them.
ALTER TABLE brain_chunks
  DROP CONSTRAINT IF EXISTS brain_chunks_lang_check;

ALTER TABLE brain_chunks
  ADD CONSTRAINT brain_chunks_lang_check CHECK (lang IN ('en', 'ur', 'bn'));
