/**
 * PostgreSQL schema for the AfriTouch Caterers app.
 *
 * Uses Drizzle ORM (drizzle-orm/pg-core). `drizzle-kit` is already a dev
 * dependency, so this schema can drive migrations via `drizzle-kit`.
 *
 * Tables:
 *   - packages  : Catering menu packages (Bronze, Silver, Gold, etc.)
 *   - users     : Admin / superadmin accounts for the dashboard
 *   - quotes    : Customer quote / inquiry submissions from the public site
 *   - sessions  : Optional persistent login sessions for local auth
 */

import { sql } from "drizzle-orm";
import {
    boolean,
    index,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/*  Enums                                                                     */
/* -------------------------------------------------------------------------- */

export const userRole = pgEnum("user_role", ["admin", "superadmin"]);

export const quoteStatus = pgEnum("quote_status", [
    "new",
    "contacted",
    "quoted",
    "booked",
    "cancelled",
    "archived",
]);

/* -------------------------------------------------------------------------- */
/*  Packages                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * A catering package shown on the marketing site and managed from the admin
 * dashboard. The shape of `Package` lives in `app/types/package.ts`; the
 * structured fields (starch, protein, ...) are persisted as text arrays so
 * they can be queried directly, while `images` is a separate text[].
 */
export const packages = pgTable(
    "packages",
    {
        id: text("id").primaryKey(),
        name: text("name").notNull(),
        price: text("price").notNull(),
        description: text("description").notNull().default(""),

        starch: text("starch").array().notNull().default(sql`'{}'::text[]`),
        protein: text("protein").array().notNull().default(sql`'{}'::text[]`),
        vegetables: text("vegetables")
            .array()
            .notNull()
            .default(sql`'{}'::text[]`),
        dessert: text("dessert").array().notNull().default(sql`'{}'::text[]`),
        drinks: text("drinks").array().notNull().default(sql`'{}'::text[]`),

        color: text("color").notNull().default("border-slate-400"),
        popular: boolean("popular").notNull().default(false),
        images: text("images").array().notNull().default(sql`'{}'::text[]`),

        position: integer("position").notNull().default(0),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        positionIdx: index("packages_position_idx").on(t.position),
    }),
);

/* -------------------------------------------------------------------------- */
/*  Users                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Admin / superadmin accounts used by the local auth driver. Clerk-managed
 * users are stored externally and are not represented here.
 */
export const users = pgTable(
    "users",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        username: text("username").notNull(),
        salt: text("salt").notNull(),
        passwordHash: text("password_hash").notNull(),
        role: userRole("role").notNull().default("admin"),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        usernameIdx: uniqueIndex("users_username_idx").on(t.username),
        roleIdx: index("users_role_idx").on(t.role),
    }),
);

/* -------------------------------------------------------------------------- */
/*  Quotes / Inquiries                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Customer inquiries submitted through the "Request a Quote" dialog on the
 * public site. `packageId` references the package the customer was viewing,
 * if any. We keep `packageName` as a denormalised snapshot so historical
 * quotes remain readable even if the package is later renamed or removed.
 */
export const quotes = pgTable(
    "quotes",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        packageId: text("package_id").references(() => packages.id, {
            onDelete: "set null",
        }),
        packageName: text("package_name"),

        name: text("name").notNull(),
        email: text("email").notNull(),
        phone: text("phone").notNull(),
        whatsapp: text("whatsapp"),

        guestCount: integer("guest_count").notNull(),
        eventDate: timestamp("event_date", { withTimezone: false, mode: "date" }).notNull(),
        location: text("location").notNull(),
        notes: text("notes"),

        status: quoteStatus("status").notNull().default("new"),
        handledBy: uuid("handled_by").references(() => users.id, {
            onDelete: "set null",
        }),

        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        statusIdx: index("quotes_status_idx").on(t.status),
        eventDateIdx: index("quotes_event_date_idx").on(t.eventDate),
        packageIdx: index("quotes_package_id_idx").on(t.packageId),
        createdAtIdx: index("quotes_created_at_idx").on(t.createdAt),
    }),
);

/* -------------------------------------------------------------------------- */
/*  Sessions (optional persistent auth sessions)                              */
/* -------------------------------------------------------------------------- */

/**
 * Persistent login sessions for the local auth driver. The current
 * implementation may keep sessions in-memory or in cookies; this table is
 * provided so sessions can survive restarts and be revoked centrally.
 */
export const sessions = pgTable(
    "sessions",
    {
        id: text("id").primaryKey(), // opaque session token
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => ({
        userIdx: index("sessions_user_id_idx").on(t.userId),
        expiresIdx: index("sessions_expires_at_idx").on(t.expiresAt),
    }),
);

/* -------------------------------------------------------------------------- */
/*  Inferred row types                                                        */
/* -------------------------------------------------------------------------- */

export type PackageRow = typeof packages.$inferSelect;
export type NewPackageRow = typeof packages.$inferInsert;

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;

export type QuoteRow = typeof quotes.$inferSelect;
export type NewQuoteRow = typeof quotes.$inferInsert;

export type SessionRow = typeof sessions.$inferSelect;
export type NewSessionRow = typeof sessions.$inferInsert;
