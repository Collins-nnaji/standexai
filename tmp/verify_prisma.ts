import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking Collaboration Model fields...");
  try {
    // Try to access the model to see if it exists in the client
    const dmmf = (prisma as any)._dmmf;
    const model = dmmf.modelMap.Collaboration;
    if (!model) {
       console.error("Collaboration model NOT found in generated client!");
       return;
    }
    console.log("Fields found:", model.fields.map((f: any) => f.name).join(", "));
  } catch (err) {
    console.error("Error during check:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
