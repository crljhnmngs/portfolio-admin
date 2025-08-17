-- AlterTable
ALTER TABLE "public"."translated_roles" ALTER COLUMN "created_at" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."experiences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "logo" TEXT,
    "title" TEXT NOT NULL,
    "role" TEXT,
    "description" TEXT,
    "link" TEXT,
    "date" TEXT,
    "language_code" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sub_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "experience_id" UUID NOT NULL,
    "position" TEXT,
    "setup" TEXT,
    "date" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sub_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sub_item_id" UUID NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tech" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."experience_tech" (
    "experience_id" UUID NOT NULL,
    "tech_id" UUID NOT NULL,

    CONSTRAINT "experience_tech_pkey" PRIMARY KEY ("experience_id","tech_id")
);

-- CreateTable
CREATE TABLE "public"."project_tech" (
    "project_id" UUID NOT NULL,
    "tech_id" UUID NOT NULL,

    CONSTRAINT "project_tech_pkey" PRIMARY KEY ("project_id","tech_id")
);

-- CreateIndex
CREATE INDEX "experiences_language_code_idx" ON "public"."experiences"("language_code");

-- CreateIndex
CREATE INDEX "sub_items_experience_id_idx" ON "public"."sub_items"("experience_id");

-- CreateIndex
CREATE INDEX "projects_sub_item_id_idx" ON "public"."projects"("sub_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "tech_name_key" ON "public"."tech"("name");

-- CreateIndex
CREATE INDEX "experience_tech_experience_id_idx" ON "public"."experience_tech"("experience_id");

-- CreateIndex
CREATE INDEX "experience_tech_tech_id_idx" ON "public"."experience_tech"("tech_id");

-- CreateIndex
CREATE INDEX "project_tech_project_id_idx" ON "public"."project_tech"("project_id");

-- CreateIndex
CREATE INDEX "project_tech_tech_id_idx" ON "public"."project_tech"("tech_id");

-- AddForeignKey
ALTER TABLE "public"."experiences" ADD CONSTRAINT "experiences_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "public"."supported_languages"("code") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."sub_items" ADD CONSTRAINT "sub_items_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "public"."experiences"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_sub_item_id_fkey" FOREIGN KEY ("sub_item_id") REFERENCES "public"."sub_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."experience_tech" ADD CONSTRAINT "experience_tech_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "public"."experiences"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."experience_tech" ADD CONSTRAINT "experience_tech_tech_id_fkey" FOREIGN KEY ("tech_id") REFERENCES "public"."tech"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."project_tech" ADD CONSTRAINT "project_tech_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."project_tech" ADD CONSTRAINT "project_tech_tech_id_fkey" FOREIGN KEY ("tech_id") REFERENCES "public"."tech"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
