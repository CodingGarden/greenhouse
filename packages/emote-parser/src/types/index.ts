import { z } from 'zod';

export const ChannelInfo = z.object({
  id: z.string(),
  name: z.string(),
});

export type ChannelInfo = z.infer<typeof ChannelInfo>;

export type APIConfig = {
  global: string;
  channel: string;
}

export type APIConfigs = {
  BTTV: APIConfig;
  FFZ: APIConfig;
  STV: APIConfig;
}

export type APITypes = keyof APIConfigs;

export enum EmoteSource {
  FFZ = 'FFZ',
  BTTV = 'BTTV',
  STV = 'STV',
}

export const Emote = z.object({
  code: z.string(),
  source: z.nativeEnum(EmoteSource),
  urls: z.object({
    small: z.string().url(),
    medium: z.string().url(),
    large: z.string().url(),
  }),
});

export type Emote = z.infer<typeof Emote>;

export type EmoteResult = Emote & {
  start: number;
  end: number;
};

export type EmoteParserConfig = {
  timeout: number;
}

