
'use server';

import Client from 'ssh2-sftp-client';
import { Buffer } from 'buffer';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Uploads a file to a Hostinger server using SFTP.
 * This is a server-side action and should not be exposed to the client.
 * @param formData The FormData object containing the file to upload.
 * @returns An object indicating the result of the upload.
 */
export async function uploadToHostinger(formData: FormData): Promise<UploadResult> {
  const file = formData.get('video') as File | null;

  if (!file) {
    return { success: false, error: 'No file provided.' };
  }
  
  const sftpConfig = {
    host: process.env.HOST_IP,
    port: 22,
    username: process.env.HOST_USER,
    password: process.env.HOST_PASS
  };

  if (!sftpConfig.host || !sftpConfig.username || !sftpConfig.password) {
      console.error("SFTP credentials are not configured in environment variables.");
      return { success: false, error: "Server SFTP configuration is incomplete." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const remoteFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  // The remote path on the Hostinger server where the file will be uploaded.
  const remotePath = `public_html/uploads/${remoteFileName}`;

  const sftp = new Client();

  try {
    await sftp.connect(sftpConfig);

    // Hostinger's public_html is usually the web root.
    // The public URL will be based on the domain, not the full SFTP path.
    await sftp.put(buffer, remotePath);
    
    await sftp.end();
    
    const publicUrl = `https://avirajinfotech.com/uploads/${remoteFileName}`;

    return { 
      success: true, 
      url: publicUrl,
    };
  } catch (err: any) {
    console.error('SFTP Upload Error:', err);
    await sftp.end(); // Ensure connection is closed on error
    return { success: false, error: err.message || 'Failed to upload file due to a server error.' };
  }
}
