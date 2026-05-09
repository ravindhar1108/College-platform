import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as process from 'process';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const realImages: Record<string, string> = {
  'Indian Institute of Technology Bombay': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/IIT_Bombay_Main_Building.jpg/1200px-IIT_Bombay_Main_Building.jpg',
  'Indian Institute of Technology Delhi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/IIT_Delhi_Main_Building.jpg/1200px-IIT_Delhi_Main_Building.jpg',
  'National Institute of Technology Trichy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/NIT_Trichy_Admin_Block.jpg/1200px-NIT_Trichy_Admin_Block.jpg',
  'Birla Institute of Technology and Science': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/BITS_Pilani_clock_tower.jpg/1200px-BITS_Pilani_clock_tower.jpg',
  'Vellore Institute of Technology': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/VIT_Vellore_Main_Building.jpg/1200px-VIT_Vellore_Main_Building.jpg',
  'All India Institute of Medical Sciences': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/AIIMS_New_Delhi.jpg/1200px-AIIMS_New_Delhi.jpg',
  'Christian Medical College': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Christian_Medical_College_Vellore.jpg/1200px-Christian_Medical_College_Vellore.jpg',
  'Indian Institute of Management Ahmedabad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/IIM_Ahmedabad_logo.png/1200px-IIM_Ahmedabad_logo.png', // Or standard campus pic
  'Indian Institute of Management Bangalore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/IIMB_Library.jpg/1200px-IIMB_Library.jpg',
  'National Law School of India University': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/NLSIU_Library.jpg/1200px-NLSIU_Library.jpg',
};

// Fallbacks if wikipedia images fail
const fallbackImages: Record<string, string> = {
  'Indian Institute of Technology Bombay': 'https://images.shiksha.com/mediadata/images/1697607738phpB6QYhP.jpeg',
  'Indian Institute of Technology Delhi': 'https://images.shiksha.com/mediadata/images/1709796061phpyb1t0o.jpg',
  'National Institute of Technology Trichy': 'https://images.shiksha.com/mediadata/images/1579241031php1LpI1g.jpg',
  'Birla Institute of Technology and Science': 'https://images.shiksha.com/mediadata/images/1585808796phpZ8eT8b.jpeg',
  'Vellore Institute of Technology': 'https://images.shiksha.com/mediadata/images/1614761002php0hQO1F.jpeg',
  'All India Institute of Medical Sciences': 'https://images.shiksha.com/mediadata/images/1684307374phpJ8gG7r.jpeg',
  'Christian Medical College': 'https://images.shiksha.com/mediadata/images/1586518174php5v5B2u.jpeg',
  'Indian Institute of Management Ahmedabad': 'https://images.shiksha.com/mediadata/images/1697523992php2e2O2u.jpeg',
  'Indian Institute of Management Bangalore': 'https://images.shiksha.com/mediadata/images/1586518196php6D9U8F.jpeg',
  'National Law School of India University': 'https://images.shiksha.com/mediadata/images/1586518218php3E3L7Z.jpeg',
};

async function main() {
  console.log('Fetching all colleges...');
  const colleges = await prisma.college.findMany({
    orderBy: { id: 'asc' },
  });

  const seen = new Set();
  const duplicateIds = [];

  // Identify duplicates
  for (const college of colleges) {
    if (seen.has(college.name)) {
      duplicateIds.push(college.id);
    } else {
      seen.add(college.name);
      
      // Update image
      let imgUrl = 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
      const cleanName = college.name.toLowerCase();
      
      if (cleanName.includes('iit') && cleanName.includes('delhi')) imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/IIT_Delhi_Main_Building.jpg/1200px-IIT_Delhi_Main_Building.jpg';
      else if (cleanName.includes('trichy')) imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/NIT_Trichy_Admin_Block.jpg/1200px-NIT_Trichy_Admin_Block.jpg';
      else if (cleanName.includes('bits')) imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/BITS_Pilani_clock_tower.jpg/1200px-BITS_Pilani_clock_tower.jpg';
      else if (cleanName.includes('vit') || cleanName.includes('vellore institute')) imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/VIT_Vellore_Main_Building.jpg/1200px-VIT_Vellore_Main_Building.jpg';
      else if (cleanName.includes('aiims')) imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/AIIMS_New_Delhi.jpg/1200px-AIIMS_New_Delhi.jpg';
      else if (cleanName.includes('srm')) imgUrl = 'https://images.shiksha.com/mediadata/images/1585808796phpZ8eT8b.jpeg';
      else if (cleanName.includes('dtu') || cleanName.includes('delhi tech')) imgUrl = 'https://images.shiksha.com/mediadata/images/1614761002php0hQO1F.jpeg';
      else if (cleanName.includes('iim') && cleanName.includes('ahmedabad')) imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/IIM_Ahmedabad_logo.png/1200px-IIM_Ahmedabad_logo.png';
      else if (cleanName.includes('manipal')) imgUrl = 'https://images.shiksha.com/mediadata/images/1697523992php2e2O2u.jpeg';
      else if (cleanName.includes('cmc') || cleanName.includes('christian medical')) imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Christian_Medical_College_Vellore.jpg/1200px-Christian_Medical_College_Vellore.jpg';

      await prisma.college.update({
        where: { id: college.id },
        data: { imageUrl: imgUrl },
      });
      console.log(`Updated image for ${college.name}`);
    }
  }

  if (duplicateIds.length > 0) {
    console.log(`Found ${duplicateIds.length} duplicates. Deleting...`);
    // Delete associated saved colleges first to avoid foreign key constraints
    await prisma.savedCollege.deleteMany({
      where: { collegeId: { in: duplicateIds } }
    });
    // Delete associated courses
    await prisma.course.deleteMany({
      where: { collegeId: { in: duplicateIds } }
    });
    // Delete associated reviews
    await prisma.review.deleteMany({
      where: { collegeId: { in: duplicateIds } }
    });
    // Delete the colleges
    await prisma.college.deleteMany({
      where: { id: { in: duplicateIds } }
    });
    console.log(`Deleted duplicates with IDs: ${duplicateIds.join(', ')}`);
  } else {
    console.log('No duplicates found.');
  }

  console.log('Cleanup and image update complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
