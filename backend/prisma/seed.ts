import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: '$2b$10$examplehashedpassword', // replace with real hash
      role: 'ADMIN'
    }
  })

  const skills = ['React', 'Node.js', 'SQL', 'Communication']
  for (const name of skills) {
    await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name }
    })
  }

  // Add sample jobs
  await prisma.jobDescription.createMany({
    data: [
      { title: 'Frontend Engineer', level: 'Mid', location: 'Remote', description: 'Build UIs with React' },
      { title: 'Backend Engineer', level: 'Senior', location: 'Hanoi', description: 'APIs with Node.js' }
    ]
  })

  // Add sample candidates
  await prisma.candidate.createMany({
    data: [
      { fullName: 'Nguyen Van A', email: 'a@example.com', yearsExp: 3, position: 'Frontend' },
      { fullName: 'Tran Thi B', email: 'b@example.com', yearsExp: 5, position: 'Backend' }
    ]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
