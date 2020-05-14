import Head from 'next/head'
import Link from 'next/link'
import Layout, { siteTitle } from '../components/layout'
import Date from '../components/date'
import { getSortedPostsData } from '../lib/posts'
import utilStyles from '../styles/utils.module.css'
import { GetStaticProps } from 'next'
import React, { FunctionComponent } from 'react'

type PostPreviewProps = {
  post: {
    id: string,
    date: string,
    title: string
  }
}
const PostPreview: FunctionComponent<PostPreviewProps> = ({ post }) => {
  return (
    <>
      <Link href="/posts/[id]" as={`/posts/${post.id}`}>
        <a>{post.title}</a>
      </Link>
      <br />
      <small className={utilStyles.lightText}>
        <Date dateString={post.date} />
      </small>
    </>
  )
}

type HomeProps = {
  allPostsData: Array<any>
}
const Home: FunctionComponent<HomeProps> = ({ allPostsData }) => {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <h2 className={utilStyles.headingLg}>Author's note</h2>
        <p>
          Hi,
        </p>
        <p>
          My name is Raphaël TISON (@Airthee), I'm 23 years old and I live in France.<br/>
          Since very young, I'm passionate about computers, more specifically software development.
        </p>
        <p>
          Apart from computers, I have other passions, such as motorcycle rides with my friends.
          I also like to relax in front of series, among my favorites we can find <i>Breaking Bad</i>,
          <i> Mr Robot</i> or <i>La Casa de Papel</i>. Finally, I practice Thai boxing (Muay Thai) since a fiew years.
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map((p) => (
            <li className={utilStyles.listItem} key={p.id}>
              <PostPreview post={p} />
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}
export default Home

export const getStaticProps: GetStaticProps = async context => {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}