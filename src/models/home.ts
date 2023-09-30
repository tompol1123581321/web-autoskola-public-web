import type { ImageModel } from "./shared";

type GalleryImage = {
  id: number;
} & ImageModel;

export type GalleryImageDetail = {
  description: string;
  position: "last" | "first" | "mid";
} & GalleryImage;

export type HeaderSectionData = {
  headerTitle: string;
  headerText: string;
  headerImage: ImageModel;
  lastNewsDate: Date;
};

export type TeamSectionData = {
  teamText: string;
  teamImages: Array<{
    name: string;
    title: string;
    avatar: {
      src: string;
      alt: string;
    };
  }>;
};

export type GallerySectionData = {
  galleyText: string;
  galleryImages: Array<GalleryImage>;
};

export type NewsSectionData = {
  newsSectionTitle: string;
  newsSectionText: string;
  newsListList: Array<{ title: string; description: string; icon?: string }>;
};

export type HomePageData = {
  header: HeaderSectionData;
  team: TeamSectionData;
  gallery: GallerySectionData;
  rules: {
    rulesTitle: string;
    rulesText: string;
    rulesList: Array<{ title: string; description: string; icon?: string }>;
  };
};
