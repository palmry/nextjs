import React from 'react'
import { useTranslator } from '../hooks/useTranslator'
import { Query } from 'react-apollo'
import PropTypes from 'prop-types'
import { contentfulApiCurrentDateTime } from 'wsc/utils/common'

/**
 * compute custom response from default graphql response
 * @param {*} response
 * @returns {Object}
 */
export function defaultResponseParser(response) {
  const { loading, error } = response

  return {
    state: {
      isLoading: loading,
      isError: !!error,
    },
  }
}

/**
 * format composed component props before send to caller
 * ___ used for composed component only ___
 * @param {*} gqlResponse
 * @returns {Object}
 */
export function formatComposedQueryComponentProps(gqlResponse) {
  const { ownProps, data: apolloResponse } = gqlResponse

  return {
    queryResponse: {
      ...apolloResponse,
      ...defaultResponseParser(apolloResponse),
    },
    ...ownProps,
  }
}

/**
 * query component factory
 * @param {*} gql
 * @param {Object} [options = {}]
 * @returns {*}
 */
export function createQueryComponent(gql, options = {}) {
  const CustomQueryComponent = props => {
    const { children, ...restProps } = props
    const { locale } = useTranslator()

    return (
      <Query
        query={gql}
        // set default variable to use in query
        variables={{
          ...restProps,
          isPreviewBranch: isPreviewBranch(),
          locale: locale,
          currentISODate: contentfulApiCurrentDateTime(),
        }}
        onError={error => console.error('Apollo', error)}
      >
        {response => {
          const { data = {}, ...restResponse } = response
          const defaultResponse = defaultResponseParser(response, options)

          return children({
            queryResponse: {
              ...defaultResponse,
              ...restResponse,
              ...data,
            },
            ...restProps,
          })
        }}
      </Query>
    )
  }

  CustomQueryComponent.propTypes = {
    children: PropTypes.func,
  }

  CustomQueryComponent.defaultProps = {
    children: () => {},
  }

  return CustomQueryComponent
}

/**
 * define wheater this is preview branch or not
 * @returns {boolean}
 */
export function isPreviewBranch() {
  return process.env.REACT_APP_CONTENTFUL_API_HOST === 'preview.contentful.com'
}
