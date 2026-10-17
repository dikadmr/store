import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helper";

const MAX_FILE_SIZE_BYTES = 10 * 1_048_576; // 10 MB
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
];
const FOLDER_PATTERN = /^[a-zA-Z0-9/_-]+$/;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folderInput = formData.get("folder");
    const folder =
      typeof folderInput === "string" && folderInput.trim()
        ? folderInput.trim()
        : "misc";

    if (!file) {
      return NextResponse.json(
        { status: false, message: "File is required" },
        { status: 400 },
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          status: false,
          message: `Tipe file tidak didukung. Gunakan: ${ALLOWED_MIME_TYPES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          status: false,
          message: `Ukuran file melebihi batas maksimum ${MAX_FILE_SIZE_BYTES / 1_048_576} MB`,
        },
        { status: 400 },
      );
    }

    if (!FOLDER_PATTERN.test(folder)) {
      return NextResponse.json(
        { status: false, message: "Folder tidak valid" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "image",
          },
          (error, uploadResult) => {
            if (error || !uploadResult) {
              reject(error || new Error("Upload failed"));
            } else {
              resolve(uploadResult);
            }
          },
        )
        .end(buffer);
    });

    return NextResponse.json(
      {
        status: true,
        url: result.secure_url,
        public_id: result.public_id,
        original_filename: file.name,
        bytes: result.bytes,
        format: result.format,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError("POST /api/upload", error);
  }
}
