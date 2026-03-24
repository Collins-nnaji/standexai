-- CreateTable
CREATE TABLE "CommunicationAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'full',
    "overallScore" INTEGER,
    "toneScore" INTEGER,
    "riskScore" INTEGER,
    "clarityScore" INTEGER,
    "aiProbability" INTEGER,
    "riskLevel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunicationAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunicationAnalysis_userId_createdAt_idx" ON "CommunicationAnalysis"("userId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "CommunicationAnalysis" ADD CONSTRAINT "CommunicationAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
