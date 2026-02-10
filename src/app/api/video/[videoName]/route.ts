
import { NextResponse } from 'next/server';

// In a real application, you would import your authentication logic here.
// For example, using Firebase Admin SDK or Next-Auth to get the current session.
// import { getAuth } from 'firebase-admin/auth';
// import { adminApp } from '@/firebase/admin'; // Assuming you have an admin initialization file

export async function GET(request: Request, { params }: { params: { videoName: string } }) {
  const videoName = params.videoName;

  // 1. CHECK SECURITY (CRUCIAL STEP)
  // This is a placeholder. In a real application, you MUST implement a robust
  // check to verify the user is authenticated and has purchased the course.
  // Example with Firebase Auth:
  // const sessionCookie = request.cookies.get('session')?.value || '';
  // try {
  //   const decodedIdToken = await getAuth(adminApp).verifySessionCookie(sessionCookie, true);
  //   // Now check if decodedIdToken.uid has access to the course.
  // } catch (error) {
  //   return new NextResponse("Unauthorized", { status: 401 });
  // }
  const isAuthorized = true; // <<-- As requested, this is a placeholder. REPLACE with real auth check.

  if (!isAuthorized) {
    return new NextResponse("Unauthorized! Please purchase the course.", { status: 401 });
  }

  // 2. CONSTRUCT THE HIDDEN URL TO YOUR HOSTINGER STORAGE
  // Ensure your Hostinger setup matches this path.
  const hostingerUrl = `https://avirajinfotech.com/course_vault/${videoName}`;

  try {
    // 3. FETCH THE VIDEO FROM HOSTINGER
    const videoResponse = await fetch(hostingerUrl);

    if (!videoResponse.ok || !videoResponse.body) {
      // This could happen if the video doesn't exist on Hostinger or there's a server error.
      throw new Error(`Video not found at storage location: ${videoResponse.statusText}`);
    }

    // 4. STREAM THE VIDEO BACK TO THE CLIENT
    // We stream the body directly to the client without downloading the whole file on our server.
    return new NextResponse(videoResponse.body, {
      status: 200,
      headers: {
        // Let the browser know it's a video file.
        'Content-Type': 'video/mp4',
        // Instruct the browser not to cache the video for security.
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error("Error fetching video from Hostinger:", error);
    return new NextResponse("Error fetching video stream.", { status: 500 });
  }
}
