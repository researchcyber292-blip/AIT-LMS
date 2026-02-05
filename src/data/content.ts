
import type { TeamMember } from '@/lib/types';
import imageData from '@/lib/placeholder-images.json';

const { placeholderImages } = imageData;

const findImage = (id: string): { url: string; hint: string } => {
  const image = placeholderImages.find(img => img.id === id);
  if (!image) {
    console.warn(`Image with id ${id} not found. Using default.`);
    return {
      url: `https://picsum.photos/seed/${id}/600/400`,
      hint: 'placeholder',
    };
  }
  return { url: image.imageUrl, hint: image.imageHint };
};

const teamMemberData: Omit<TeamMember, 'image'| 'imageHint'>[] = [
  { id: 't1', name: 'Aviraj Singh', title: 'Founder & CEO' },
  { id: 't2', name: 'Priya Sharma', title: 'Head of Curriculum' },
  { id: 't3', name: 'Rajesh Kumar', title: 'Lead Instructor' },
  { id: 't4', name: 'Anjali Menon', title: 'Student Success Manager' },
];

export const TEAM_MEMBERS: TeamMember[] = teamMemberData.map(member => {
    const imgId = `person-${parseInt(member.id.split('')[1])}`;
    const img = findImage(imgId);
    return {
        ...member,
        image: img.url,
        imageHint: img.hint,
    }
});


// Note: COURSES and INSTRUCTORS are now fetched from Firestore.
// This static data is kept for reference or fallback, but is no longer the primary source.

export const COURSES: any[] = [];
export const INSTRUCTORS: any[] = [];

