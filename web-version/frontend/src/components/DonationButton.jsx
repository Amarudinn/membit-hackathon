import { Coffee } from 'lucide-react'
import './DonationButton.css'

function DonationButton({ onClick }) {
  return (
    <button className="donation-button" onClick={onClick} title="Support Me">
      <Coffee size={24} />
    </button>
  )
}

export default DonationButton
