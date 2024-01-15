import EmoteParser, { getBttvEmotes, getFfzEmotes, get7tvEmotes } from './emote-parser';
import { getAPIConfig } from '../lib/API';
import { Emote } from '../types';

const info = {
  id: '413856795',
  name: 'codinggarden',
};

const APIConfig = getAPIConfig(info);

describe('emoteParser', () => {
  it('an instance of emoteParser should throw an error if missing id or name', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(() => new EmoteParser({})).toThrow();
  });

  it('an instance of emoteParser should have an id and name', async () => {
    const emoteParser = new EmoteParser(info);
    expect(emoteParser.id).toEqual(info.id);
    expect(emoteParser.name).toEqual(info.name);
  });

  it('ffz emotes should return an emote object', async () => {
    const emoteParser = new EmoteParser(info);
    const emotes = await emoteParser.parse('PressF');
    expect(emotes).toEqual([
      {
        code: 'PressF',
        end: 5,
        source: 'FFZ',
        start: 0,
        urls: {
          large: 'https://cdn.frankerfacez.com/emote/28798/4',
          medium: 'https://cdn.frankerfacez.com/emote/28798/2',
          small: 'https://cdn.frankerfacez.com/emote/28798/1',
        },
      },
    ]);
  });

  it('bttv emotes should return an emote object', async () => {
    const emoteParser = new EmoteParser(info);
    const emotes = await emoteParser.parse('pressF');    
    expect(emotes).toEqual([
      {
        code: 'pressF',
        source: 'BTTV',
        urls: {
          small: 'https://cdn.betterttv.net/emote/5c857788f779543bcdf37124/1x',
          medium: 'https://cdn.betterttv.net/emote/5c857788f779543bcdf37124/2x',
          large: 'https://cdn.betterttv.net/emote/5c857788f779543bcdf37124/3x'
        },
        start: 0,
        end: 5
      },
    ]);
  });

  it('7tv emotes should return an emote object', async () => {
    const emoteParser = new EmoteParser(info);
    const emotes = await emoteParser.parse('Sadge');    
    expect(emotes).toEqual([
      {
        code: 'Sadge',
        source: 'STV',
        urls: {
          small: 'https://cdn.7tv.app/emote/603cac391cd55c0014d989be/1x.webp',
          medium: 'https://cdn.7tv.app/emote/603cac391cd55c0014d989be/2x.webp',
          large: 'https://cdn.7tv.app/emote/603cac391cd55c0014d989be/3x.webp'
        },
        start: 0,
        end: 4
      },
    ]);
  });

  it('should return multiple emotes in a message', async () => {
    const emoteParser = new EmoteParser(info);
    const emotes = await emoteParser.parse('PressF pressF Sadge');
    expect(emotes).toEqual([
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
    ]);
  });

  it('should return emotes at the start of a message', async () => {
    const emoteParser = new EmoteParser(info);
    const emotes = await emoteParser.parse('PressF is the best emote');
    expect(emotes).toEqual([
      {
        code: 'PressF',
        end: 5,
        source: 'FFZ',
        start: 0,
        urls: {
          large: 'https://cdn.frankerfacez.com/emote/28798/4',
          medium: 'https://cdn.frankerfacez.com/emote/28798/2',
          small: 'https://cdn.frankerfacez.com/emote/28798/1',
        },
      },
    ]);
  });

  it('should return emotes at the end of a message', async () => {
    const emoteParser = new EmoteParser(info);
    const emotes = await emoteParser.parse('The best emote is Sadge');
    expect(emotes).toEqual([
      {
        code: 'Sadge',
        source: 'STV',
        urls: {
          small: 'https://cdn.7tv.app/emote/603cac391cd55c0014d989be/1x.webp',
          medium: 'https://cdn.7tv.app/emote/603cac391cd55c0014d989be/2x.webp',
          large: 'https://cdn.7tv.app/emote/603cac391cd55c0014d989be/3x.webp'
        },
        start: 18,
        end: 22
      },
    ]);
  });

  it('should return no emotes for a message without emotes', async () => {
    const emoteParser = new EmoteParser(info);
    const emotes = await emoteParser.parse('This is a message without emotes');
    expect(emotes).toEqual([]);
  });
});

describe('Emote getters', () => {
  function testEmoteArray(emotes: Emote[]) {
    expect(Array.isArray(emotes)).toBe(true);
    expect(emotes.length).toBeGreaterThan(0);

    expect(() => Emote.parse(emotes[0])).not.toThrow();
  }

  it('getBttvEmotes should return an array of emotes', async () => {
    const emotes = await getBttvEmotes(APIConfig.BTTV);
    testEmoteArray(emotes);
  });

  it('getFfzEmotes should return an array of emotes', async () => {
    const emotes = await getFfzEmotes(APIConfig.FFZ);
    testEmoteArray(emotes);
    
    const pressF = emotes.find((emote) => emote.code === 'PressF');
    expect(pressF).toBeDefined();
  });

  it('get7tvEmotes should return an array of emotes', async () => {
    const emotes = await get7tvEmotes(APIConfig.STV);
    testEmoteArray(emotes);
  });
});
