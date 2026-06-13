-- CreateTable
CREATE TABLE IF NOT EXISTS "standex_enquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "enquiryType" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "standex_enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "standex_enquiry_email_idx" ON "standex_enquiry"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "standex_enquiry_createdAt_idx" ON "standex_enquiry"("createdAt" DESC);
