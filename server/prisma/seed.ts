import bcrypt from "bcrypt";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Priority, Role, TaskStatus } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const seed = async () => {
  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.note.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "Manager User",
      email: "manager@example.com",
      passwordHash,
      role: Role.MANAGER,
    },
  });

  const fieldUser = await prisma.user.create({
    data: {
      name: "Field User",
      email: "field@example.com",
      passwordHash,
      role: Role.FIELD_USER,
    },
  });

  const secondFieldUser = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "alex@example.com",
      passwordHash,
      role: Role.FIELD_USER,
    },
  });

  await prisma.task.create({
    data: {
      title: "Inspect backup generator",
      description:
        "Perform a visual inspection of the backup generator, verify operating status, and document any safety concerns.",
      location: "North Utility Building",
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      dueDate: new Date("2026-07-01T17:00:00.000Z"),
      createdById: manager.id,
      assignedToId: fieldUser.id,
      version: 4,
      checklistItems: {
        create: [
          {
            label: "Verify site access and safety conditions",
            completed: true,
            order: 1,
          },
          {
            label: "Inspect equipment for visible damage",
            completed: true,
            order: 2,
          },
          {
            label: "Record current operating status",
            completed: false,
            order: 3,
          },
          {
            label: "Submit completion notes",
            completed: false,
            order: 4,
          },
        ],
      },
      notes: {
        create: [
          {
            authorId: fieldUser.id,
            body: "Generator enclosure was accessible. No external damage found.",
          },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: "Verify pump station pressure",
      description:
        "Check current pressure readings at Pump Station 3 and confirm whether the readings are within the expected operating range.",
      location: "Pump Station 3",
      status: TaskStatus.BLOCKED,
      priority: Priority.CRITICAL,
      dueDate: new Date("2026-07-02T17:00:00.000Z"),
      createdById: manager.id,
      assignedToId: fieldUser.id,
      version: 2,
      checklistItems: {
        create: [
          {
            label: "Confirm access to pump control panel",
            completed: false,
            order: 1,
          },
          {
            label: "Record intake pressure",
            completed: false,
            order: 2,
          },
          {
            label: "Record discharge pressure",
            completed: false,
            order: 3,
          },
          {
            label: "Report blocked condition if access is unavailable",
            completed: false,
            order: 4,
          },
        ],
      },
      notes: {
        create: [
          {
            authorId: fieldUser.id,
            body: "Access gate was locked on arrival. Waiting for manager approval.",
          },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: "Replace damaged access panel",
      description:
        "Replace the cracked access panel in the west service corridor and verify the replacement panel is secure.",
      location: "West Service Corridor",
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      dueDate: new Date("2026-07-03T17:00:00.000Z"),
      createdById: manager.id,
      assignedToId: secondFieldUser.id,
      version: 1,
      checklistItems: {
        create: [
          {
            label: "Inspect existing panel damage",
            completed: false,
            order: 1,
          },
          {
            label: "Remove damaged panel",
            completed: false,
            order: 2,
          },
          {
            label: "Install replacement panel",
            completed: false,
            order: 3,
          },
          {
            label: "Confirm panel is secure",
            completed: false,
            order: 4,
          },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: "Document utility room water leak",
      description:
        "Inspect the basement utility room, document the active leak area, and mark the task blocked if maintenance access is required.",
      location: "Basement Utility Room",
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      dueDate: new Date("2026-07-01T20:00:00.000Z"),
      createdById: admin.id,
      assignedToId: fieldUser.id,
      version: 1,
      checklistItems: {
        create: [
          {
            label: "Identify visible leak source",
            completed: false,
            order: 1,
          },
          {
            label: "Check whether electrical equipment is nearby",
            completed: false,
            order: 2,
          },
          {
            label: "Add field notes with observed condition",
            completed: false,
            order: 3,
          },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: "Check perimeter gate sensor",
      description:
        "Test the west perimeter gate sensor and confirm whether the field reading matches the dashboard status.",
      location: "West Perimeter Gate",
      status: TaskStatus.COMPLETED,
      priority: Priority.LOW,
      dueDate: new Date("2026-06-29T17:00:00.000Z"),
      createdById: manager.id,
      assignedToId: secondFieldUser.id,
      version: 3,
      checklistItems: {
        create: [
          {
            label: "Trigger gate sensor",
            completed: true,
            order: 1,
          },
          {
            label: "Verify dashboard reading",
            completed: true,
            order: 2,
          },
          {
            label: "Submit completion notes",
            completed: true,
            order: 3,
          },
        ],
      },
      notes: {
        create: [
          {
            authorId: secondFieldUser.id,
            body: "Sensor reading matched dashboard status. No follow-up needed.",
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully.");
  console.log("");
  console.log("Demo users:");
  console.log("admin@example.com / password123");
  console.log("manager@example.com / password123");
  console.log("field@example.com / password123");
  console.log("alex@example.com / password123");
};

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
