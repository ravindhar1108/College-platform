import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const maxUgFee = await prisma.college.aggregate({
    _max: {
      ugFee: true,
    },
  });
  console.log('Max UG Fee in DB:', maxUgFee._max.ugFee);

  const highFeeColleges = await prisma.college.count({
    where: {
      ugFee: {
        gt: 2000000
      }
    }
  });
  console.log('Count of colleges with fees > 20,000,000 (20L):', highFeeColleges);
  
  const minUgFee = await prisma.college.aggregate({
    _min: {
      ugFee: true,
    },
  });
  console.log('Min UG Fee in DB:', minUgFee._min.ugFee);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
