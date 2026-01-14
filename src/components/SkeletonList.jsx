export default function SkeletonList({ count = 3 }) {
  return (
    <div className="list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="item skeleton">
          <div className="skeleton-line" style={{ width: '40%' }} />
          <div className="skeleton-line" style={{ width: '80%' }} />
          <div className="skeleton-line" style={{ width: '60%' }} />
        </div>
      ))}
    </div>
  )
}