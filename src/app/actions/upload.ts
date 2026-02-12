
'use server';

import Client from 'ssh2-sftp-client';
import { Buffer } from 'buffer';

interface UploadResult {
  success: boolean;
  url?: string;
  folderName?: string;
  error?: string;
}

/**
 * Generates a short, random, alphanumeric string for unique folder names.
 * @returns A random string.
 */
const generateFolderID = () => {
  return Math.random().toString(36).substring(2, 10);
};


/**
 * Uploads a file to a Hostinger server using SFTP, creating a unique,
 * instructor-specific subfolder to prevent conflicts.
 * This is a server-side action and should not be exposed to the client.
 * @param formData The FormData object containing the file, category, and instructor's username.
 * @returns An object indicating the result of the upload.
 */
export async function uploadToHostinger(formData: FormData): Promise<UploadResult> {
  const file = formData.get('video') as File | null;
  const category = formData.get('category') as string | null;
  const instructorUsername = formData.get('instructorUsername') as string | null;

  if (!file) {
    return { success: false, error: 'No file provided.' };
  }
  if (!category) {
    return { success: false, error: 'No course category provided.' };
  }
  if (!instructorUsername) {
      return { success: false, error: 'Instructor username is required.' };
  }
  
  const sftpConfig = {
    host: process.env.HOST_IP,
    port: Number(process.env.HOST_PORT || 22),
    username: process.env.HOST_USER,
    password: process.env.HOST_PASS
  };

  if (!sftpConfig.host || !sftpConfig.username || !sftpConfig.password) {
      console.error("SFTP credentials are not configured in environment variables.");
      return { success: false, error: "Server SFTP configuration is incomplete." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sanitizedCategory = category.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const remoteFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  // --- New Logic for Unique Instructor Folder ---
  const sanitizedUsername = instructorUsername.toLowerCase().replace(/\s+/g, '');
  const folderID = generateFolderID();
  const instructorFolder = `${sanitizedUsername}_ait_${folderID}`;
  // ---

  // The absolute path on the Hostinger server, including the unique instructor folder.
  const remoteUploadDir = `/home/u630495566/domains/avirajinfotech.com/public_html/asian/uploads/${sanitizedCategory}/${instructorFolder}`;
  const remotePath = `${remoteUploadDir}/${remoteFileName}`;

  const sftp = new Client();

  try {
    await sftp.connect(sftpConfig);

    // Create the unique, category-specific directory if it doesn't exist.
    // The 'true' flag creates parent directories as needed.
    await sftp.mkdir(remoteUploadDir, true);

    // Upload the file.
    await sftp.put(buffer, remotePath);
    
    await sftp.end();
    
    const publicUrl = `https://asian.avirajinfotech.com/uploads/${sanitizedCategory}/${instructorFolder}/${remoteFileName}`;

    return { 
      success: true, 
      url: publicUrl,
      folderName: instructorFolder, // Return the unique folder name
    };
  } catch (err: any) {
    console.error('SFTP Upload Error:', err);
    await sftp.end(); // Ensure connection is closed on error
    return { success: false, error: err.message || 'Failed to upload file due to a server error.' };
  }
}
