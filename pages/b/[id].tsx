import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { seededBlocks } from '../../lib/blocksData'
import type { Block } from '../../types'

export default function BlockPage({ block }: { block: Block | null }) {
  if (!block) return <div className="p-6">Block not found</div>
  return (
    <>
      <Head>
        <title>{block.title} • Brand Space</title>
        <meta name="description" content={block.text} />
        <meta property="og:title" content={block.title} />
        <meta property="og:description" content={block.text} />
        <meta property="og:image" content={block.img_url || undefined} />
      </Head>
      <div className="p-6">
        <h1 className="text-2xl font-bold">{block.title}</h1>
        <p className="mt-2">{block.text}</p>
        {block.img_url && <img src={block.img_url} alt={block.title} className="mt-4 max-w-xs" />}
        <div className="mt-4">
          <a href={block.href} target="_blank" rel="noreferrer" className="px-3 py-1 bg-yellow-400 text-black rounded">Visit</a>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.params!
  const b = seededBlocks.find(x=>x.id === String(id)) || null
  return { props: { block: b } }
}