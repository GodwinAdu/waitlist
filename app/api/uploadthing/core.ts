import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata };
    }),
  
  videoUploader: f({ video: { maxFileSize: "32MB", maxFileCount: 5 } })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;