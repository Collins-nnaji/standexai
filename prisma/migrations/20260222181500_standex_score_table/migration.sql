-- Create the new Standex Score table.
CREATE TABLE IF NOT EXISTS "StandexScoreScan" (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  "standexScore" INTEGER NOT NULL,
  tier TEXT NOT NULL,
  breakdown JSONB NOT NULL,
  models JSONB NOT NULL,
  "flagCount" INTEGER NOT NULL,
  email TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Move legacy ARM rows if the old table still exists.
DO $$
BEGIN
  IF to_regclass('"ARMScan"') IS NOT NULL THEN
    INSERT INTO "StandexScoreScan" (id, brand, "standexScore", tier, breakdown, models, "flagCount", email, "createdAt")
    SELECT id, brand, "armScore", tier, breakdown, models, "flagCount", email, "createdAt"
    FROM "ARMScan"
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "StandexScoreScan_brand_idx" ON "StandexScoreScan"(brand);
CREATE INDEX IF NOT EXISTS "StandexScoreScan_createdAt_idx" ON "StandexScoreScan"("createdAt" DESC);

-- Remove the legacy ARM table once data is copied.
DROP TABLE IF EXISTS "ARMScan";
