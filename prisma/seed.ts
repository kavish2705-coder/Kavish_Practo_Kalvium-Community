import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "@prisma/client";
import { MOCK_DOCTORS } from "../src/lib/mockData";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not configured in .env");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log("🌱 Seeding database...");

  const defaultPasswordHash = await bcrypt.hash("password", 10);

  // 1. Seed Demo Patient
  const patient = await prisma.user.upsert({
    where: { email: "patient@example.com" },
    update: {},
    create: {
      email: "patient@example.com",
      name: "Demo Patient",
      role: Role.PATIENT,
      passwordHash: defaultPasswordHash,
    },
  });
  console.log(`✓ Seeded patient: ${patient.email}`);

  // 2. Seed Mock Doctors
  for (const doc of MOCK_DOCTORS) {
    const doctorUser = await prisma.user.upsert({
      where: { email: doc.email },
      update: {
        name: doc.name,
      },
      create: {
        email: doc.email,
        name: doc.name,
        role: Role.DOCTOR,
        passwordHash: defaultPasswordHash,
      },
    });

    const doctorProfile = await prisma.doctorProfile.upsert({
      where: { userId: doctorUser.id },
      update: {
        specialization: doc.specialization,
        qualification: doc.qualification,
        experience: doc.experience,
        fee: doc.fee,
        clinicInfo: doc.clinicInfo,
      },
      create: {
        userId: doctorUser.id,
        specialization: doc.specialization,
        qualification: doc.qualification,
        experience: doc.experience,
        fee: doc.fee,
        clinicInfo: doc.clinicInfo,
      },
    });

    // Seed default schedules for Monday through Friday (1 to 5)
    for (let day = 1; day <= 5; day++) {
      await prisma.schedule.upsert({
        where: {
          doctorId_dayOfWeek: {
            doctorId: doctorProfile.id,
            dayOfWeek: day,
          },
        },
        update: {},
        create: {
          doctorId: doctorProfile.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "17:00",
          slotDurationMins: 30,
        },
      });
    }

    console.log(`✓ Seeded doctor & schedule: ${doc.name} (${doc.specialization})`);
  }

  console.log("✅ Database seeded successfully! Default password for all accounts: password");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
