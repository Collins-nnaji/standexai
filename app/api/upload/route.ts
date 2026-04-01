import { NextRequest, NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";
import { neonAuth } from "@/lib/neon/auth-server";

// To make this work, the user must add AZURE_STORAGE_CONNECTION_STRING in .env
// And AZURE_STORAGE_CONTAINER_NAME (or default to "standexai-assets")
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || "standexai-assets";

export async function POST(req: NextRequest) {
  try {
    const { data: session } = await neonAuth.getSession();
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!AZURE_STORAGE_CONNECTION_STRING) {
      return NextResponse.json({ 
        error: "Azure Storage is not configured. Please add AZURE_STORAGE_CONNECTION_STRING to your .env file." 
      }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert Web File stream to Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create safe blob name combining timestamp, user prefix, and original name
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || '';
    const safeName = file.name.replace(/[^a-zA-Z0-9-]/g, '-').slice(0, 30);
    const blobName = `papers/${timestamp}-${safeName}.${extension}`;

    // Connect to Azure Storage
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    
    // Ensure container exists and is publicly readable (Blob / Container)
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    // Be very careful about await containerClient.createIfNotExists() in production, usually it's set manually.
    await containerClient.createIfNotExists({ access: 'blob' });

    // Stream blob upload
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: file.type || "application/octet-stream" }
    });

    const fileUrl = blockBlobClient.url;

    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error: any) {
    console.error("Azure Storage Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload file to Azure." }, { status: 500 });
  }
}
