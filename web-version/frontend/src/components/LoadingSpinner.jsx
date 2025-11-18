import './LoadingSpinner.css'

function LoadingSpinner({ size = 'medium' }) {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-core"></div>
    </div>
  )
}

export default LoadingSpinner
