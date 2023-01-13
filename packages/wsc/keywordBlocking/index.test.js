import KeywordBlocking from './index'

test('Keyword Blocking exists', () => {
  expect(KeywordBlocking).toBeDefined()
})

test('getBlockedListsNoWorkers', () => {
  expect(KeywordBlocking.getBlockedLists('peter piper picked a peck of pickled peppers')).toEqual(
    []
  )
  expect(KeywordBlocking.getBlockedLists('Fear is the mind Killer').length).toBeGreaterThan(0)
})
