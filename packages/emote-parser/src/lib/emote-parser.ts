import axios from 'axios';
import { APIConfig, APIConfigs, ChannelInfo, Emote, EmoteParserConfig, EmoteSource } from '../types';

import { FFZ, BTTV, STV } from '@greenhouse/types';
import { getAPIConfig } from '../lib/API';

export async function getBttvEmotes({ channel, global }: APIConfig) {
  let { data: allEmotes } = await axios.get<BTTV.Response>(global);
  const {
    data: { channelEmotes, sharedEmotes },
  } = await axios.get<BTTV.ChannelResponse>(channel);
  allEmotes = allEmotes.concat(channelEmotes).concat(sharedEmotes);
  return allEmotes.map(({ code, id }): Emote => ({
    code,
    source: EmoteSource.BTTV,
    urls: {
      small: `https://cdn.betterttv.net/emote/${id}/1x`,
      medium: `https://cdn.betterttv.net/emote/${id}/2x`,
      large: `https://cdn.betterttv.net/emote/${id}/3x`
    },
  }));
}

export async function getFfzEmotes({ channel, global }: APIConfig) {
  const {
    data: { sets },
  } = await axios.get<FFZ.GlobalResponse>(global);
  const {
    data: { room, sets: channelSets },
  } = await axios.get<FFZ.ChannelResponse>(channel);
  const all = sets[3].emoticons.concat(channelSets[room.set].emoticons);
  return all.map(({ name: code, urls }): Emote => ({
    code,
    source: EmoteSource.FFZ,
    urls: {
      small: urls[1],
      medium: urls[2],
      large: urls[4]
    },
  }));
}

export async function get7tvEmotes({ channel, global }: APIConfig) {
  const { data: globalEmotes } = await axios.get<STV.GlobalResponse>(global);
  const { data: channelEmotes } = await axios.get<STV.ChannelResponse>(channel);
  const all = globalEmotes.emotes.concat(channelEmotes.emote_set.emotes);
  return all.map(({ name: code, id }): Emote => ({
    code,
    source: EmoteSource.STV,
    urls: {
      small: `https://cdn.7tv.app/emote/${id}/1x.webp`,
      medium: `https://cdn.7tv.app/emote/${id}/2x.webp`,
      large: `https://cdn.7tv.app/emote/${id}/3x.webp`
    },
  }));
}

class EmoteParser {
  id: string;
  name: string;
  apiConfig: APIConfigs;
  config: EmoteParserConfig;
  emotes = new Map<string, Emote>();
  sources = new Map<string, string>();
  regexStr = '';
  emoteRegex: RegExp | undefined;
  lastRequest: number | undefined;

  constructor(info: ChannelInfo, config: EmoteParserConfig = {
    timeout: 24 * 60 * 60 * 1000,
  }) {
    const validated = ChannelInfo.parse(info);
    this.apiConfig = getAPIConfig(validated);
    this.config = config;
    this.id = validated.id;
    this.name = validated.name;
  }

  async getEmoteRegex() {
    if (!this.emoteRegex || (this.lastRequest && Date.now() - this.lastRequest > this.config.timeout)) {
      console.log('Refreshing BTTV, 7TV and FFZ cache...');
      const emotes = await Promise.all([
        getBttvEmotes(this.apiConfig.BTTV).catch((error) => {
          console.log('Error loading BTTV emotes:', error);
          return [];
        }),
        getFfzEmotes(this.apiConfig.FFZ).catch((error) => {
          console.log('Error loading FFZ emotes:', error);
          return [];
        }),
        get7tvEmotes(this.apiConfig.STV).catch((error) => {
          console.log('Error loading 7TV emotes:', error);
          return [];
        }),
      ]);      
      emotes.forEach((emoteSet) => {
        emoteSet.forEach((emote) => {
          const { code, source } = emote;
          this.emotes.set(code, emote);
          this.sources.set(code, source);
          this.regexStr += `${code.replace(/\(/, '\\(').replace(/\)/, '\\)')}|`;
        });
      });
      this.lastRequest = Date.now();
      this.regexStr = this.regexStr.slice(0, -1);
      this.emoteRegex = new RegExp(`(?<=^|\\s)(${this.regexStr})(?=$|\\s)`, 'gi');
    }
    return this.emoteRegex;
  }

  async parse(message: string) {
    const regex = await this.getEmoteRegex();
    const result = message.matchAll(regex);
    return [...result].map((match) => {
      const emote = this.emotes.get(match[0])!;
      const index = match.index as number;
      return {
        ...emote,
        start: index,
        end: index + emote.code.length - 1,
      };
    });
  }

  // TODO: replacer functions - Markdown, HTML etc.
}

export default EmoteParser;
