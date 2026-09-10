export interface MemoryItem {
  id: string;
  title: string;
  dateTag: string;
  caption: string;
  imageUrl: string;
  category: 'Sweet Moments' | 'Adventures' | 'Smiles' | 'Cherished';
}

export interface GuestWish {
  id: string;
  name: string;
  relation: string;
  message: string;
  emoji: string;
  timestamp: string;
  likes: number;
}

export interface RsvpData {
  name: string;
  attending: 'yes' | 'maybe' | 'remote';
  guestsCount: number;
  dietaryOrNote: string;
  submittedAt: string;
}

export interface BirthdayConfig {
  personName: string;
  nickName?: string;
  birthdayDate: string; // YYYY-MM-DD or readable
  mainHeadline: string;
  mainEmotionalMessage: string;
  secretLetterTitle: string;
  secretLetterBody: string[];
  secretLetterSignOff: string;
  finalSurpriseMessage: string;
  memories: MemoryItem[];
  eventDetails: {
    enabled: boolean;
    date: string;
    time: string;
    venue: string;
    locationName: string;
    dressCode: string;
  };
}
