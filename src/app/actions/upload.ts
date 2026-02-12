
'use server';

import Client from 'ssh2-sftp-client';
import { Buffer } from 'buffer';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

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
  const courseId = formData.get('courseId') as string | null; 
  
  if (!instructorUsername) {
      return { success: false, error: 'Instructor username is required.' };
  }
  
  if (!category || !courseId) {
    return { success: false, error: 'Course category and a unique Course ID are required.' };
  }
  
  const sftpConfig = {
    host: process.env.HOST_IP,
    port: Number(process.env.HOST_PORT || 65002),
    username: process.env.HOST_USER,
    password: process.env.HOST_PASS
  };

  if (!sftpConfig.host || !sftpConfig.username || !sftpConfig.password) {
      console.error("SFTP credentials are not configured in environment variables.");
      return { success: false, error: "Server SFTP configuration is incomplete." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const remoteFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  const sanitizedUsername = instructorUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
  const sanitizedCategory = category.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const sanitizedCourseId = courseId.replace(/[^a-zA-Z0-9_-]/g, '_');

  const instructorFolder = `${sanitizedUsername}_ait_${sanitizedCourseId}`;
  
  const baseRemoteDir = `domains/avirajinfotech.com/public_html/asian/uploads`;
  let remoteUploadDir = `${baseRemoteDir}/${sanitizedCategory}/${instructorFolder}`;
  
  // Differentiate path for thumbnails
  if (uploadType === 'thumbnail') {
    remoteUploadDir = `${remoteUploadDir}/thumbnail`;
  }
  
  const publicUrlPath = `uploads/${sanitizedCategory}/${instructorFolder}${uploadType === 'thumbnail' ? '/thumbnail' : ''}/${remoteFileName}`;
  const publicUrl = `https://asian.avirajinfotech.com/${publicUrlPath}`;

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
    };
  } catch (err: any) {
    console.error('SFTP Upload Error:', err);
    await sftp.end();
    if (err.code === 2) {
      return { success: false, error: `SFTP connection failed. Check credentials and host details. Original error: ${err.message}` };
    }
    if (err.message.includes('No such file')) {
       return { success: false, error: `The path was not found on the server. Please check the remote root path configuration. Path tried: ${remoteUploadDir}` };
    }
    return { success: false, error: `An unexpected response was received from the server. This often means the path is incorrect. Please verify your Hostinger SFTP root directory. Full path tried: ${remoteUploadDir}` };
  }
}
