CREATE TABLE IF NOT EXISTS "medical_leaves" ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `employee_id` INTEGER NOT NULL, `remarks` TEXT, `from_date` TEXT NOT NULL, `to_date` TEXT, `status` INTEGER NOT NULL, `mc` TEXT, `clinic_id` INTEGER, FOREIGN KEY(`employee_id`) REFERENCES `employees`(`id`), FOREIGN KEY(`clinic_id`) REFERENCES `clinics`(`id`) );

CREATE TABLE IF NOT EXISTS "clinics" ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `name` TEXT NOT NULL, `address` TEXT NOT NULL, `contact_no` TEXT NOT NULL, `status` INTEGER NOT NULL DEFAULT 1 );

CREATE TABLE IF NOT EXISTS "employees" ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `first_name` TEXT NOT NULL, `last_name` TEXT NOT NULL, `status` INTEGER NOT NULL DEFAULT 1, `supervisor` INTEGER NOT NULL, `picture` TEXT, `designation` TEXT NOT NULL, `password` TEXT, FOREIGN KEY(`supervisor`) REFERENCES `employees`(`id`) );

CREATE TABLE IF NOT EXISTS "tasks" ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `employee_id` INTEGER NOT NULL, `name` TEXT NOT NULL, `details` TEXT, `deadline` TEXT NOT NULL, FOREIGN KEY(`employee_id`) REFERENCES `employees`(`id`) );
