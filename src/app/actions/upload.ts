
'use server';

import admin from '@/firebase/admin';
import { Buffer } from 'buffer';

interface UploadResult {
  success: boolean;
  url?: string;
  fileName?: string;
  error?: string;
}

/**
 * Uploads a file to Firebase Cloud Storage using the Firebase Admin SDK.
 * This is a server-side action and should not be exposed to the client.
 * @param formData The FormData object containing the file to upload.
 * @returns An object indicating the result of the upload.
 */
export async function uploadToFirebaseStorage(formData: FormData): Promise<UploadResult> {
  const file = formData.get('video') as File | null;

  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  // In a real-world app, you'd add user authentication/authorization checks here
  // to ensure only allowed users can upload files.

  const buffer = Buffer.from(await file.arrayBuffer());
  // Sanitize file name and make it unique to avoid overwrites
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueFileName = `videos/${Date.now()}-${sanitizedFileName}`;

  try {
    const bucket = admin.storage().bucket();
    const fileUpload = bucket.file(uniqueFileName);

    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // To make the file publicly accessible, we set its ACL.
    // For more granular control (e.g., only paid users can view), you would use Signed URLs.
    await fileUpload.makePublic();

    // The public URL has a predictable format.
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`;

    return { 
      success: true, 
      url: publicUrl,
      fileName: uniqueFileName
    };
  } catch (err: any) {
    console.error('Firebase Storage Upload Error:', err);
    return { success: false, error: err.message || 'Failed to upload file due to a server error.' };
  }
}
