// Generated by https://quicktype.io

export type Response = Emote[];

export interface Emote {
  id: string;
  code: string;
  imageType: ImageType;
  animated: boolean;
  userId?: string;
  user?: User;
  modifier?: boolean;
  width?: number;
  height?: number;
}

export enum ImageType {
  GIF = 'gif',
  PNG = 'png',
}
export interface ChannelResponse {
  id: string;
  bots: string[];
  avatar: string;
  channelEmotes: Emote[];
  sharedEmotes: Emote[];
}

export interface User {
  id: string;
  name: string;
  displayName: string;
  providerId: string;
}
