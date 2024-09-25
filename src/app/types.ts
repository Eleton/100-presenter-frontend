import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { SanityDocument } from "@sanity/client";

export type Member = {
  number: number;
  name: string;
  nickname: string;
  nicknameDescription: string;
  joined: Date;
  images?: SanityImageSource[];
  description: string;
  roles: string;
} & SanityDocument;
