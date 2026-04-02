import { useState, useMemo } from 'react'

export function useFilter(items, options = {}) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')

  const filtered = useMemo(() => {
    let result = [...items]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((item) =>
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q)
      )
    }

    if (category !== 'all') {
      result = result.filter((item) => item.category === category)
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title))
    }

    return result
  }, [items, search, category, sortBy])

  const categories = useMemo(() => {
    const cats = [...new Set(items.map((item) => item.category))]
    return ['all', ...cats]
  }, [items])

  return {
    search,
    setSearch,
    category,
    setCategory,
    sortBy,
    setSortBy,
    filtered,
    categories,
  }
}
