import { useFileUpload } from "convex-file-upload";
import { createImageUpload } from "novel";
import { toast } from "sonner";
import { useRichText } from "../../providers/RichTextProvider";

export const useConvexImageUpload = () => {
  const { uploadFile } = useFileUpload({
    maxSizeInMB: 20,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    successMessage: "Image uploaded successfully!",
    errorMessage: "Failed to upload image",
  });

  const { getImageUrl } = useRichText();

  const onUpload = async (file: File): Promise<string> => {
    try {
      const storageId = await uploadFile(file);
      if (!storageId) {
        throw new Error("Failed to upload image");
      }
      const imageUrl = getImageUrl(storageId);
      if (!imageUrl) {
        throw new Error("Failed to get image URL");
      }
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  return { onUpload };
};

export const createConvexImageUpload = (
  uploadFn: (file: File) => Promise<string>
) => {
  return createImageUpload({
    onUpload: uploadFn,
    validateFn: (file) => {
      if (!file.type.includes("image/")) {
        toast.error("File type not supported.");
        return false;
      }
      if (file.size / 1024 / 1024 > 20) {
        toast.error("File size too big (max 20MB).");
        return false;
      }
      return true;
    },
  });
};
