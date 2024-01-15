import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';

import APIData from './fixtures/APIData';

export const restHandlers = APIData.map((config) => http.get(config.url, () => {
  return HttpResponse.json(config.data)
}))

const server = setupServer(...restHandlers,)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterAll(() => server.close())

afterEach(() => server.resetHandlers())
