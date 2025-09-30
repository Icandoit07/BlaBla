import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("password", 12);
  const user = await prisma.user.upsert({
    where: { username: "bharat" },
    update: {},
    create: { username: "bharat", name: "Bharat", passwordHash },
  });
  const user2 = await prisma.user.upsert({
    where: { username: "ananya" },
    update: {},
    create: { username: "ananya", name: "Ananya", passwordHash },
  });
  await prisma.post.createMany({
    data: [
      { authorId: user.id, content: "Namaste India! 🇮🇳 #blabla" },
      { authorId: user2.id, content: "Good morning! Chai pe charcha ☕" },
    ],
  });
}

main().finally(() => prisma.$disconnect());


