import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

/**
 * Body for POST /api/v1/leads.
 * Status is never accepted here — service always creates leads as New.
 */
export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  businessName?: string | null;

  @IsEmail()
  @MaxLength(320)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(40)
  phone!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  projectDescription?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  leadSource?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  businessCardAdvisor?: string | null;

  @IsIn(["en", "es"])
  language!: "en" | "es";
}
