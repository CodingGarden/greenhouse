import fs from 'fs';
import path from 'path';
import { getAPIConfig } from '../../../lib/API';
import { APITypes } from '../../../types';

const config = getAPIConfig({
  id: '413856795',
  name: 'codinggarden',
});

type APIData = {
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

export default Object.keys(config).reduce<APIData[]>((all, key) => {
  const rootPath = path.join('src', 'test', 'fixtures', 'APIData');

  return all.concat([{
    url: config[key as APITypes].channel,
    data: JSON.parse(fs.readFileSync(path.join(rootPath, `./${key}.channel.json`), 'utf-8')),
  }, {
    url: config[key as APITypes].global,
    data: JSON.parse(fs.readFileSync(path.join(rootPath, `./${key}.global.json`), 'utf-8')),
  }])
}, []);
