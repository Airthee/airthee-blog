import Head from 'next/head'
import Layout from '../../components/layout'
import Date from '../../components/date'
import { getAllPostIds, getPostData } from '../../lib/posts'
import { PostType } from '../../lib/posts'
import utilStyles from '../../styles/utils.module.css'
import React, { FunctionComponent } from 'react'
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon
} from 'react-share'

type PostProps = {
  postData: PostType
}

const Post: FunctionComponent<PostProps> = ({ postData }) => {
  const postUrl = `https://blog.airthee.com/posts/${postData.id}`
  const shareIconProps = {
    size: 35,
    round: true,
  }
  const shareSection = (
    <div className={utilStyles.alignCenter}>
      <FacebookShareButton url={postUrl}><FacebookIcon {...shareIconProps}/></FacebookShareButton>
      <TwitterShareButton url={postUrl}><TwitterIcon {...shareIconProps}/></TwitterShareButton>
      <LinkedinShareButton url={postUrl}><LinkedinIcon {...shareIconProps}/></LinkedinShareButton>
      <EmailShareButton url={postUrl}><EmailIcon {...shareIconProps}/></EmailShareButton>
    </div>
  )

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <meta property="og:title" content={postData.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://blog.airthee.com/posts/${postData.id}`} />
        <meta property="og:locale" content={postData.lang ?? 'en_US'} />
      </Head>

      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        {shareSection}
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        {shareSection}
      </article>
    </Layout>
  )
}
export default Post

export async function getStaticPaths() {
  const paths = getAllPostIds().map(id => ({params: { id }}))
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}