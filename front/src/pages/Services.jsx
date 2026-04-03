import { useState } from 'react'
import { services, categoryLabels } from '../data/services.js'
import { useFilter } from '../hooks/useFilter.js'
import ServiceCard from '../components/ServiceCard.jsx'
import BookingModal from '../components/BookingModal.jsx'
import styles from './Services.module.css'

export default function Services() {
  const { search, setSearch, category, setCategory, sortBy, setSortBy, filtered, categories } = useFilter(services)
  const [modalService, setModalService] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 6

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    setCurrentPage(1)
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.categories}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.catBtn} ${category === cat ? styles.catActive : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        {paginated.length > 0 ? (
          <div className={styles.grid}>
            {paginated.map((s) => (
              <ServiceCard key={s.id} service={s} onBook={setModalService} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyText}>No services found matching your criteria.</p>
            <button className={styles.resetBtn} onClick={() => { setSearch(''); setCategory('all'); setSortBy('default') }}>
              Reset filters
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`${styles.pageNum} ${p === currentPage ? styles.pageNumActive : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              className={styles.pageBtn}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <BookingModal
        service={modalService}
        isOpen={!!modalService}
        onClose={() => setModalService(null)}
      />
    </div>
  )
}
