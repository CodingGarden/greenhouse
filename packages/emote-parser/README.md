# @greenhouse/emote-parser

Utilities for getting and parsing emotes from BTTV, FFZ, and 7TV.

## Usage

```ts
import EmoteParser from '@greenhouse/emote-parser';

const emoteParser = new EmoteParser({
  id: '413856795',
  name: 'codinggarden',
});
const emotes = emoteParser.parse('PressF pressF Sadge')
```

`emotes` will be an array of emote objects:

```ts
[
  {
    code: 'PressF',
    end: 5,
    source: 'FFZ',
    start: 0,
    urls: {
      large: 'https://cdn.frankerfacez.com/emote/28798/4',
      small: 'https://cdn.frankerfacez.com/emote/28798/1',
      medium: 'https://cdn.frankerfacez.com/emote/28798/2',
    },
  },
  {
    code: 'pressF',
    source: 'BTTV',
    urls: {
      small: 'https://cdn.betterttv.net/emote/5c857788f779543bcdf37124/1x',
      medium: 'https://cdn.betterttv.net/emote/5c857788f779543bcdf37124/2x',
      large: 'https://cdn.betterttv.net/emote/5c857788f779543bcdf37124/3x'
    },
    start: 7,
    end: 12
  },
  {
    code: 'Sadge',
    source: 'STV',
    urls: {
      small: 'https://cdn.7tv.app/emote/603cac391cd55c0014d989be/1x.webp',
      medium: 'https://cdn.7tv.app/emote/603cac391cd55c0014d989be/2x.webp',
      large: 'https://cdn.7tv.app/emote/603cac391cd55c0014d989be/3x.webp'
    },
    start: 14,
    end: 18
  },
]
```

You can also get the API responses in a standardized format for your own parsing as well:

```ts
import { getBttvEmotes, getFfzEmotes, get7tvEmotes } from '@greenhouse/emote-parser';

const apiConfig = getAPIConfig({
  id: '413856795',
  name: 'codinggarden',
});
const bttvEmotes = await getBttvEmotes(APIConfig.BTTV);
const stvEmotes = await get7tvEmotes(APIConfig.STV);
const ffzEmotes = await getFfzEmotes(APIConfig.FFZ);
```

Each emote will be in the format:

```ts
type Emote = {
  code: string;
  source: 'FFZ' | 'BTTV' | 'STV';
  urls: {
    small: string;
    medium: string;
    large: string;
  };
};
```
