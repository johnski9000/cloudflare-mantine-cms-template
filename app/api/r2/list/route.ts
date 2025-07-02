import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY || "",
    secretAccessKey: process.env.R2_SECRET_KEY || "",
  },
});

export async function GET(req: Request) {
  try {
    const bucketContent = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
        Prefix: process.env.R2_FOLDER_NAME,
      })
    );
    console.log("Bucket Content:", bucketContent);
    let media = [];
    if (bucketContent.Contents) {
      media = bucketContent.Contents.map((item) => ({
        key: item.Key,
        lastModified: item.LastModified,
        size: item.Size,
        url: `${process.env.R2_DOMAIN}/${item.Key}`,
      }));
    }
    if (media.length === 0) {
      return NextResponse.json(
        { success: true, message: "No images found in the bucket." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        media: media,
        bucket: process.env.R2_BUCKET_NAME,
        endpoint: process.env.R2_ENDPOINT,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("List Error:", {
      message: error.message,
      code: error.Code,
      bucket: process.env.R2_BUCKET_NAME,
      endpoint: process.env.R2_ENDPOINT,
      stack: error.stack,
    });
    return NextResponse.json(
      {
        error: "Failed to list R2 images",
        details: error.message,
        code: error.Code,
      },
      { status: 500 }
    );
  }
}
