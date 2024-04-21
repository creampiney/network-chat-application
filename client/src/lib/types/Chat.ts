export type Chat = {
  id: string;
  participantA: {
    id: string;
    displayName: string;
    avatar: string;
  };
  participantB: {
    id: string;
    displayName: string;
    avatar: string;
  };
  participantAUnread: number;
  participantBUnread: number;
  lastUpdated: Date;
  latestMessage?: Message;
};

export type Message = {
  id: string;
  senderId: string;
  type: "Text" | "Images" | "Location";
  text?: string;
  pictures?: string[];
  latitude?: number;
  longitude?: number;
  sentAt: Date;
};
