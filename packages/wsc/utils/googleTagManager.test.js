import { setPostDimensions } from './googleTagManager'

describe('googleTagManager', () => {
  it('should set the correct custom dimension for authors', () => {
    const post = { authorsCollection: { items: [{ name: 'apple' }, { name: 'banana' }] } }
    const expectedResult = post.authorsCollection.items.map(author => author.name).join(',')
    setPostDimensions(post)
    expect(window.dataLayer[0].authorName).toBe(expectedResult)
  })
})
