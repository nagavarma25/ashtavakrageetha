export interface Episode {
  number: number
  title: string
  duration: string
  slug: string
  audioUrl: string
}

const knownDurations: Record<number, string> = {
  1: '1h 39m', 2: '1h 46m', 3: '1h 34m', 4: '1h 33m', 5: '1h 25m',
  6: '1h 43m', 7: '1h 39m', 8: '1h 29m', 9: '1h 23m', 10: '1h 27m',
}

export const episodes: Episode[] = Array.from({ length: 91 }, (_, i) => {
  const n = i + 1
  const pad = String(n).padStart(2, '0')
  return {
    number: n,
    title: `Discourse ${pad} · Ashtavakra Maha Geeta`,
    duration: knownDurations[n] ?? '',
    slug: `ashtavakra-maha-geeta-${pad}`,
    audioUrl: `https://oshoworld.com/wp-content/uploads/2020/11/Hindi%20Audio/OSHO-Maha_Geeta_${pad}.mp3`,
  }
})
