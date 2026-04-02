import Link from 'next/link'
import styles from './breadcrumbs.module.scss'

interface BreadcrumbItem {
  readonly label: string
  readonly href?: string
}

interface BreadcrumbsProps {
  readonly items: BreadcrumbItem[]
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <nav className={styles.nav} aria-label="Breadcrumb">
    <ol className={styles.list}>
      {items.map((item, index) => (
        <li key={item.label}>
          {index > 0 && <span className={styles.separator}>{`//`}</span>}
          {item.href ? (
            <Link href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ) : (
            <span className={styles.current} aria-current="page">
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
)

export default Breadcrumbs
