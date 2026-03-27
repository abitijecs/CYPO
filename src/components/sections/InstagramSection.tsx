import Link from 'next/link'
import { Instagram, ExternalLink } from 'lucide-react'

const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'mailess_m2s'

// Placeholder posts — replaced by real data when INSTAGRAM_ACCESS_TOKEN is set
const PLACEHOLDER_POSTS = [
  { id: '1', label: 'Soin Visage' },
  { id: '2', label: 'Maquillage Naturel' },
  { id: '3', label: 'Soirée Glamour' },
  { id: '4', label: 'Résultat Anti-Âge' },
  { id: '5', label: 'Maquillage Mariée' },
  { id: '6', label: 'Beauté du Regard' },
]

interface InstagramPost {
  id: string
  media_url?: string
  permalink?: string
  caption?: string
  label?: string
}

async function getInstagramPosts(): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const userId = process.env.INSTAGRAM_USER_ID

  if (!token || !userId) return PLACEHOLDER_POSTS

  try {
    const res = await fetch(
      `https://graph.instagram.com/${userId}/media?fields=id,caption,media_url,permalink,media_type&limit=6&access_token=${token}`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return PLACEHOLDER_POSTS
    const data = await res.json()
    return data.data || PLACEHOLDER_POSTS
  } catch {
    return PLACEHOLDER_POSTS
  }
}

export default async function InstagramSection() {
  const posts = await getInstagramPosts()
  const isReal = posts.some((p) => p.media_url)

  return (
    <section id="instagram" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <p className="section-label mb-3">Mon univers</p>
            <h2 className="section-title">
              Sur <em className="text-gold not-italic">Instagram</em>
            </h2>
          </div>
          <a
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline shrink-0 flex items-center gap-2"
          >
            <Instagram size={16} />@{instagramHandle}
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {posts.slice(0, 6).map((post) => (
            <a
              key={post.id}
              href={post.permalink || `https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-surface border border-border hover:border-gold/40 transition-all duration-300"
            >
              {isReal && post.media_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.media_url}
                  alt={post.caption?.slice(0, 60) || 'Post Instagram Mailess M2S'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                // Placeholder
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface to-surface-elevated">
                  <div className="text-center">
                    <Instagram
                      size={24}
                      className="text-gold/30 mx-auto mb-2 group-hover:text-gold/60 transition-colors"
                    />
                    <p className="text-text-muted text-xs font-sans">{post.label}</p>
                  </div>
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <p className="text-cream text-xs font-sans truncate">
                  {post.caption?.slice(0, 50) || 'Voir sur Instagram →'}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <p className="text-text-secondary text-sm mb-4">
            Découvrez mes dernières créations et résultats sur Instagram
          </p>
          <a
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Instagram size={16} />
            Suivre @{instagramHandle}
          </a>
        </div>
      </div>
    </section>
  )
}
