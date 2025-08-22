-- DropForeignKey
ALTER TABLE "public"."Contact" DROP CONSTRAINT "Contact_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
