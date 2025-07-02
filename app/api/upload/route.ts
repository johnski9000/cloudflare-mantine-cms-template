import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: `${process.env.R2_ENDPOINT}`, // Cloudflare R2 endpoint
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY || "",
    secretAccessKey: process.env.R2_SECRET_KEY || "",
  },
});

export async function POST(req: Request) {
  try {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Invalid file uploaded" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name}`; // Unique filename

    // Upload to Cloudflare R2
    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME + "",
      Key: `${process.env.R2_FOLDER_NAME}/${fileName}`,
      Body: buffer,
      ContentType: file.type,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    // ✅ Update the returned URL to your custom domain
    return NextResponse.json({
      success: true,
      url: `${process.env.R2_DOMAIN}/${process.env.R2_FOLDER_NAME}/${fileName}`, // Uses the custom domain
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error },
      { status: 500 }
    );
  }
}
