import { APIConfigs, ChannelInfo } from '../types';

export function getAPIConfig(info: ChannelInfo): APIConfigs {
  return {
    BTTV: {
      global: 'https://api.betterttv.net/3/cached/emotes/global',
      channel: `https://api.betterttv.net/3/cached/users/twitch/${info.id}`,
    },
    FFZ: {
      global: 'https://api.frankerfacez.com/v1/set/global',
      channel: `https://api.frankerfacez.com/v1/room/${info.name}`,
    },
    STV: {
      global: 'https://7tv.io/v3/emote-sets/global',
      channel: `https://7tv.io/v3/users/twitch/${info.id}`,
    },
  };
}