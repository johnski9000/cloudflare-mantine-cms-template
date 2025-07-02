import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY || "",
    secretAccessKey: process.env.R2_SECRET_KEY || "",
  },
});

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Key parameter is required" },
        { status: 400 }
      );
    }

    console.log("Attempting to delete object with key:", key);

    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    await s3.send(deleteCommand);

    console.log("Successfully deleted object:", key);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully deleted ${key}`,
        deletedKey: key,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete Error:", {
      message: error.message,
      code: error.Code,
      bucket: process.env.R2_BUCKET_NAME,
      endpoint: process.env.R2_ENDPOINT,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: "Failed to delete R2 object",
        details: error.message,
        code: error.Code,
      },
      { status: 500 }
    );
  }
}
