DO $$
BEGIN
  IF to_regclass('"ReadinessScan"') IS NULL THEN
    CREATE TABLE "ReadinessScan" (
      id TEXT PRIMARY KEY,
      dataset TEXT NOT NULL,
      "readinessScore" INTEGER NOT NULL,
      tier TEXT NOT NULL,
      breakdown JSONB NOT NULL,
      models JSONB NOT NULL,
      "flagCount" INTEGER NOT NULL,
      email TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS "ReadinessScan_dataset_idx" ON "ReadinessScan"(dataset);
    CREATE INDEX IF NOT EXISTS "ReadinessScan_createdAt_idx" ON "ReadinessScan"("createdAt" DESC);
    CREATE INDEX IF NOT EXISTS "ReadinessScan_tier_idx" ON "ReadinessScan"(tier);
  END IF;

  IF to_regclass('"StandexScoreScan"') IS NOT NULL THEN
    INSERT INTO "ReadinessScan" (id, dataset, "readinessScore", tier, breakdown, models, "flagCount", email, "createdAt")
    SELECT id, brand, "standexScore", tier, breakdown, models, "flagCount", email, "createdAt"
    FROM "StandexScoreScan"
    ON CONFLICT (id) DO NOTHING;

    DROP TABLE "StandexScoreScan";
  END IF;
END $$;
