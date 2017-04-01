import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import sortBy from 'lodash/sortBy'
import get from 'lodash/get'
import { prefixLink } from 'gatsby-helpers'
import { rhythm } from 'utils/typography'
import Helmet from 'react-helmet'
import { config } from 'config'
import include from 'underscore.string/include'
import Bio from 'components/Bio'

class BlogIndex extends React.Component {
  render () {
    // Sort pages.
    const sortedPages = sortBy(this.props.route.pages, 'data.date')
    // Posts are those with md extension that are not 404 pages OR have a date (meaning they're a react component post).
    const visiblePages = sortedPages.filter(page => (
      get(page, 'file.ext') === 'md' && !include(page.path, '/404') || get(page, 'data.date')
    ))
    return (
      <div>
        <Helmet
          title={config.blogTitle}
          meta={[
            {"name": "description", "content": "KD2MZG"},
            {"name": "keywords", "content": "blog, articles"},
          ]}
        />
        <Bio />
        {visiblePages.map((page) => (
            <p
              key={page.path}
              style={{
                  marginBottom: rhythm(1/4)
              }}
            >
              <h2>
                <Link
                  style={{
                    boxShadow: 'none',
                    color: 'black',
                    textDecoration: 'none'
                  }}
                  to={prefixLink(page.path)}
                >
                  {get(page, 'data.title', page.path)}
                </Link>
              </h2>
              <em
                style={{
                  display: 'block',
                  marginBottom: rhythm(1),
                }}
              >
                Posted {moment(page.data.date).format('MMMM D, YYYY')}
              </em>
              <div dangerouslySetInnerHTML={{__html: page.data.body}}/>
            </p>
        ))}
      </div>
    )
  }
}

BlogIndex.propTypes = {
  route: React.PropTypes.object,
}

export default BlogIndex
