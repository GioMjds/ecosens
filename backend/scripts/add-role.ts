import "dotenv/config";
import { PrismaClient, Role } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { generateUserId } from "../utils/custom-id-generator";
import { hash } from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL as string }),
})

type UserSeedInput = {
  fullname: string
  email?: string
  password?: string
  roles: Role[]
}

async function createUserWithRoles(input: UserSeedInput) {
  const { fullname, email, password, roles } = input

  const userId = generateUserId()
  const hashedPassword = password ? await hash(password, 10) : null;
  let user;
  
  if (email) {
    user = await prisma.user.upsert({
      where: { email },
      update: {
        fullname,
        password: hashedPassword,
        isActive: true,
      },
      create: {
        id: userId,
        fullname,
        email,
        password: hashedPassword,
        isActive: true,
      },
    })
  } else {
    user = await prisma.user.create({
      data: {
        id: userId,
        fullname,
        email,
        password: hashedPassword,
        isActive: true,
      },
    })
  }

  if (roles.length > 0) {
    for (const role of roles) {
      await prisma.userRole.upsert({
        where: { userId_role: { userId: user.id, role } },
        update: {},
        create: {
          id: generateUserId(),
          userId: user.id,
          role,
        },
      })
    }
  }

  console.log(
    `Created user ${fullname} with roles [${roles.join(', ')}]`
  )
}

async function main() {
  await createUserWithRoles({
    fullname: 'Juan Dela Cruz',
    email: 'juan@gmail.com',
    password: 'Password12!',
    roles: [Role.Resident]
  })

  await createUserWithRoles({
    fullname: 'Maria Santos',
    email: 'maria.staff@gmail.com',
    password: 'Password12!',
    roles: [Role.Staff]
  })

  await createUserWithRoles({
    fullname: 'Pedro Reyes',
    email: 'pedro.admin@gmail.com',
    password: 'Password12!',
    roles: [Role.Admin]
  })
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
