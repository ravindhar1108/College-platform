import prisma from '../src/prisma/client';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('Starting seeding from CSV...');

  const csvPath = path.join(__dirname, '../../dataset/Indian_Engineering_Colleges_Dataset.csv');
  const csvData = fs.readFileSync(csvPath, 'utf8');
  
  const lines = csvData.split('\n');
  
  console.log('Cleaning up existing data...');
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  console.log('Parsing and filtering data...');
  
  const dataToInsert = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Robust split for CSV (handles quotes)
    const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if (!row || row.length < 11) continue;

    const name = row[1].replace(/"/g, '').trim();
    const state = row[2].replace(/"/g, '').trim();
    
    const ugFeeStr = row[3].replace(/"/g, '').replace(/,/g, '').trim();
    const ugFee = parseInt(ugFeeStr) || 0;
    
    const pgFeeStr = row[4].replace(/"/g, '').replace(/,/g, '').trim();
    const pgFee = pgFeeStr === '--' ? null : (parseInt(pgFeeStr) || null);

    const rating = parseFloat(row[5]) || 0;
    const academicRating = parseFloat(row[6]) || null;
    const accommodationRating = parseFloat(row[7]) || null;
    const facultyRating = parseFloat(row[8]) || null;
    const infrastructureRating = parseFloat(row[9]) || null;
    const placementRating = parseFloat(row[10]) || null;
    const socialLifeRating = parseFloat(row[11]) || null;
    
    // STRICT FILTERING: Remove incomplete data
    if (!name || name === '--' || !state || state === '--' || ugFee === 0 || rating === 0) {
        continue;
    }

    const description = `Leading engineering institution in ${state} known for its specialized technical education. Focused on delivering high academic standards with ${academicRating ? academicRating + '/10 academic rating' : 'excellent faculty'}.`;

    dataToInsert.push({
      name,
      location: state,
      ugFee,
      pgFee,
      rating,
      academicRating,
      accommodationRating,
      facultyRating,
      infrastructureRating,
      placementRating,
      socialLifeRating,
      description,
      image: "",
    });
  }

  console.log(`Inserting ${dataToInsert.length} high-quality college records...`);
  
  // Add details for top 50
  for (const college of dataToInsert.slice(0, 50)) {
    await prisma.college.create({
      data: {
        ...college,
        courses: {
          create: [
            { name: "B.Tech Computer Science", duration: "4 years", fees: college.ugFee },
            { name: "B.Tech Electronics", duration: "4 years", fees: college.ugFee },
          ]
        },
        reviews: {
          create: [
            { userName: "Student", rating: (college.rating / 2), comment: "Strong academic focus and good peer interaction.", date: "Jan 2025" }
          ]
        }
      }
    });
  }

  // The rest can be bulk inserted
  if (dataToInsert.length > 50) {
    await prisma.college.createMany({
      data: dataToInsert.slice(50),
      skipDuplicates: true,
    });
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
