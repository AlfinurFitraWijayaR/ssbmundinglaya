import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  integer,
  boolean,
  numeric,
  unique,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// --- ENUMS ---
export const roleEnum = pgEnum("role", ["admin", "coach", "student", "parent"]);
export const attendanceStatusEnum = pgEnum("attendance_status", [
  "present",
  "permission",
  "sick",
  "absent",
]);
export const feeStatusEnum = pgEnum("fee_status", ["paid", "unpaid"]);
export const cashFlowTypeEnum = pgEnum("cash_flow_type", ["in", "out"]);

// --- TABLES ---
export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  loginCode: text("login_code").unique(),
  email: text("email").unique(),
  fullName: text("full_name").notNull(),
  role: roleEnum("role").default("student").notNull(),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coaches = pgTable("coaches", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  slug: text("slug").unique().notNull(),
  url: text("url"),
  birthDate: date("birth_date"),
  address: text("address"),
  license: text("license"),
  cv: text("cv"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const classes = pgTable("classes", {
  id: uuid("id").defaultRandom().primaryKey(),
  className: text("class_name").notNull(),
  description: text("description"),
});

export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id").references(() => profiles.id),
  classId: uuid("class_id")
    .references(() => classes.id, { onDelete: "restrict" })
    .notNull(),
  fullName: text("full_name").notNull(),
  nickname: text("nickname"),
  slug: text("slug").unique().notNull(),
  address: text("address"),
  position: text("position"),
  birthPlace: text("birth_place"),
  birthDate: date("birth_date"),
  avatarUrl: text("avatar_url"),
  kkUrl: text("kk_url"),
  akteUrl: text("akte_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  classId: uuid("class_id")
    .references(() => classes.id, { onDelete: "cascade" })
    .notNull(),
  coachId: uuid("coach_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  sessionDate: date("session_date").defaultNow().notNull(),
  notes: text("notes"),
});

export const attendance = pgTable(
  "attendance",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: uuid("session_id")
      .references(() => sessions.id, { onDelete: "cascade" })
      .notNull(),
    studentId: uuid("student_id")
      .references(() => students.id, { onDelete: "cascade" })
      .notNull(),
    status: attendanceStatusEnum("status").notNull(),
  },
  (t) => [unique("unique_attendance").on(t.sessionId, t.studentId)],
);

export const routineFees = pgTable(
  "routine_fees",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .references(() => students.id, { onDelete: "cascade" })
      .notNull(),
    sessionId: uuid("session_id").references(() => sessions.id, {
      onDelete: "cascade",
    }), // nullable, for monthly fees
    amount: numeric("amount").notNull(),
    periodMonth: integer("period_month"),
    periodYear: integer("period_year"),
    dueDate: date("due_date").notNull(),
    status: feeStatusEnum("status").default("unpaid").notNull(),
    paymentMethod: text("payment_method"),
    paidAt: timestamp("paid_at"),
    evidenceUrl: text("evidence_url"), // For manual transfer receipts
  },
  (t) => [
    // Unique index for monthly fees
    uniqueIndex("monthly_fee_idx")
      .on(t.studentId, t.periodMonth, t.periodYear)
      .where(sql`${t.sessionId} IS NULL`),
    // Unique index for per-session fees
    uniqueIndex("session_fee_idx")
      .on(t.studentId, t.sessionId)
      .where(sql`${t.periodMonth} IS NULL`),
  ],
);

export const cashFlow = pgTable("cash_flow", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: cashFlowTypeEnum("type").notNull(),
  title: text("title").notNull(),
  amount: numeric("amount").notNull(),
  transactionDate: date("transaction_date").defaultNow().notNull(),
  createdBy: uuid("created_by").references(() => profiles.id),
});

// --- RELATIONS ---

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  coach: one(coaches),
  students: many(students),
  sessions: many(sessions),
  cashFlows: many(cashFlow),
}));

export const coachesRelations = relations(coaches, ({ one }) => ({
  profile: one(profiles, {
    fields: [coaches.profileId],
    references: [profiles.id],
  }),
}));

export const classesRelations = relations(classes, ({ many }) => ({
  students: many(students),
  sessions: many(sessions),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [students.profileId],
    references: [profiles.id],
  }),
  class: one(classes, {
    fields: [students.classId],
    references: [classes.id],
  }),
  attendances: many(attendance),
  routineFees: many(routineFees),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  class: one(classes, {
    fields: [sessions.classId],
    references: [classes.id],
  }),
  coach: one(profiles, {
    fields: [sessions.coachId],
    references: [profiles.id],
  }),
  attendances: many(attendance),
  routineFees: many(routineFees), // Fees generated from this session
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  session: one(sessions, {
    fields: [attendance.sessionId],
    references: [sessions.id],
  }),
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
}));

export const routineFeesRelations = relations(routineFees, ({ one }) => ({
  student: one(students, {
    fields: [routineFees.studentId],
    references: [students.id],
  }),
  session: one(sessions, {
    fields: [routineFees.sessionId],
    references: [sessions.id],
  }),
}));

export const cashFlowRelations = relations(cashFlow, ({ one }) => ({
  createdBy: one(profiles, {
    fields: [cashFlow.createdBy],
    references: [profiles.id],
  }),
}));
