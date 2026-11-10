/**
 * CoreVia team registry — easy to extend without rewriting About layout.
 * Bios stay modest until the team provides approved copy.
 */

export type TeamMemberId = "daniel" | "sofia" | "johana";

export type TeamMember = {
  id: TeamMemberId;
  /** Translation key under About.team.members.{id} */
  nameKey: TeamMemberId;
  /**
   * Optional portrait under /public.
   * When omitted, the UI renders an initials monogram placeholder.
   */
  imageSrc?: string;
  /** CSS object-position for crop fine-tuning. */
  imageObjectPosition?: string;
  initials: string;
};

export const teamMembers: readonly TeamMember[] = [
  {
    id: "daniel",
    nameKey: "daniel",
    imageSrc: "/images/about-founder.jpg",
    imageObjectPosition: "center 20%",
    initials: "DS",
  },
  {
    id: "sofia",
    nameKey: "sofia",
    imageSrc: "/images/team/sofia-villa.jpg",
    imageObjectPosition: "center 18%",
    initials: "SV",
  },
  {
    id: "johana",
    nameKey: "johana",
    imageSrc: "/images/team/johana-arcila.png",
    imageObjectPosition: "center 18%",
    initials: "JA",
  },
] as const;
