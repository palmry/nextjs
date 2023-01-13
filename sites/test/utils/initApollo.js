import ApolloClient from 'apollo-boost'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import introspectionQueryResultData from '../statics/graphql/fragmentTypes.json'
import { CONTENTFUL_GRAPHQL_URL } from 'wsc/utils/contentful'
import { fetch } from 'whatwg-fetch'

// To prevent following error on IE11 : fetch is not found globally and no fetcher passed, to fix pass a fetch for\nyour environment like https://www.npmjs.com/package/" + library + ".\n\n
// For example:\nimport fetch from '" + library + "';\nimport { createHttpLink } from 'apollo-link-http';\n\nconst link = createHttpLink({ uri: '/graphql', fetch: fetch });");
if (!window.fetch) window.fetch = fetch

// create apollo client instance once
// because batch link cannot use with contentful graphql endpoint
// so, use Apollo-boost instead
const client = new ApolloClient({
  uri: CONTENTFUL_GRAPHQL_URL,
  credentials: 'same-origin',
  headers: { Authorization: `Bearer ${process.env.REACT_APP_CONTENTFUL_API_ACCESSTOKEN}` },
  cache: new InMemoryCache({
    // To custom object cache Id
    dataIdFromObject: obj =>
      obj.slug ? `${obj.__typename}:${obj.slug}:${localStorage.getItem('locale')}` : null,
    // To support result validation and accurate fragment matching on unions and interfaces,
    // a special fragment matcher called the IntrospectionFragmentMatcher
    // https://www.apollographql.com/docs/react/advanced/fragments#fragment-matcher
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    }),
  }),
})

export default client
