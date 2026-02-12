
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
 * Uploads a file (video or thumbnail) to a Hostinger server using SFTP.
 * It creates a unique, instructor-specific subfolder to prevent conflicts.
 * This is a server-side action and should not be exposed to the client.
 * @param formData The FormData object containing the file, and context like category/username.
 * @returns An object indicating the result of the upload.
 */
export async function uploadToHostinger(formData: FormData): Promise<UploadResult> {
  const videoFile = formData.get('video') as File | null;
  const thumbnailFile = formData.get('thumbnail') as File | null;
  
  const file = videoFile || thumbnailFile;
  const uploadType = videoFile ? 'video' : 'thumbnail';

  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  const category = formData.get('category') as string | null;
  const instructorUsername = formData.get('instructorUsername') as string | null;
  
  if (!instructorUsername) {
      return { success: false, error: 'Instructor username is required.' };
  }
  
  if (uploadType === 'video' && !category) {
    return { success: false, error: 'Course category is required for video uploads.' };
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
  const remoteFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  const sanitizedUsername = instructorUsername.toLowerCase().replace(/\s+/g, '');
  const folderID = generateFolderID();
  const instructorFolder = `${sanitizedUsername}_ait_${folderID}`;

  const sanitizedCategory = category ? category.toLowerCase().replace(/[^a-z0-9_-]/g, '') : '';
  
  let remoteUploadDir = '';
  let publicUrl = '';

  if (uploadType === 'video') {
    // Corrected Path: Use a path relative to the SFTP user's home directory.
    remoteUploadDir = `domains/avirajinfotech.com/public_html/asian/uploads/${sanitizedCategory}/${instructorFolder}`;
    publicUrl = `https://asian.avirajinfotech.com/uploads/${sanitizedCategory}/${instructorFolder}/${remoteFileName}`;
  } else { // 'thumbnail'
    // Corrected Path: Relative path for thumbnails
    remoteUploadDir = `domains/avirajinfotech.com/public_html/asian/uploads/thumbnails/${instructorFolder}`;
    publicUrl = `https://asian.avirajinfotech.com/uploads/thumbnails/${instructorFolder}/${remoteFileName}`;
  }

  const remotePath = `${remoteUploadDir}/${remoteFileName}`;
  const sftp = new Client();

  try {
    await sftp.connect(sftpConfig);
    await sftp.mkdir(remoteUploadDir, true);
    await sftp.put(buffer, remotePath);
    await sftp.end();
    
    return { 
      success: true, 
      url: publicUrl,
      folderName: instructorFolder,
    };
  } catch (err: any) {
    console.error('SFTP Upload Error:', err);
    await sftp.end();
    return { success: false, error: err.message || 'Failed to upload file due to a server error.' };
  }
}
