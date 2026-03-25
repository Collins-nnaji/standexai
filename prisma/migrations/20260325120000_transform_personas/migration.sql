-- CreateTable
CREATE TABLE "TransformPersona" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransformPersona_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransformPersona_userId_updatedAt_idx" ON "TransformPersona"("userId", "updatedAt" DESC);

-- AddForeignKey
ALTER TABLE "TransformPersona" ADD CONSTRAINT "TransformPersona_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
