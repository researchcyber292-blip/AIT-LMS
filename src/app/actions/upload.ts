'use server';

import Client from 'ssh2-sftp-client';

interface UploadResult {
  success: boolean;
  url?: string;
  fileName?: string;
  error?: string;
}

export async function uploadToHostinger(formData: FormData): Promise<UploadResult> {
  const file = formData.get('video') as File | null;

  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  // Sanitize file name and make it unique
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;

  const sftp = new Client();

  const config = {
    host: process.env.HOSTINGER_IP,
    port: 22,
    username: process.env.HOSTINGER_USERNAME,
    password: process.env.HOSTINGER_PASSWORD,
  };

  if (!config.host || !config.username || !config.password) {
    console.error('SFTP credentials are not configured in environment variables.');
    return { success: false, error: 'Server is not configured for file uploads. Please contact support.' };
  }

  try {
    await sftp.connect(config);

    // Dynamic path based on username and designated uploads folder in public_html
    const remoteDir = `/home/${config.username}/public_html/course_vault/videos`;
    const remotePath = `${remoteDir}/${uniqueFileName}`;
    
    // Ensure the directory exists
    await sftp.mkdir(remoteDir, true);

    await sftp.put(buffer, remotePath);
    
    await sftp.end();

    const fileUrl = `https://avirajinfotech.com/course_vault/videos/${uniqueFileName}`;

    return { 
      success: true, 
      url: fileUrl,
      fileName: uniqueFileName
    };
  } catch (err: any) {
    console.error('SFTP Upload Error:', err);
    // In case of error, always try to gracefully end the connection
    if (sftp.isBusy()) {
      await sftp.end();
    }
    return { success: false, error: err.message || 'Failed to upload file due to a server error.' };
  }
}
