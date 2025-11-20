import { useState } from 'react'
import { X, Coffee, Copy, Check } from 'lucide-react'
import './DonationModal.css'

function DonationModal({ onClose }) {
  const [copiedAddress, setCopiedAddress] = useState(null)

  const wallets = [
    {
      name: 'EVM',
      address: '0x000000055f6693f0606c325c38bfed9b5e7588ec',
      color: '#3b82f6'
    },
    {
      name: 'Solana',
      address: 'E49xfLoVVuPvb4xFS3T2rutJMNPc2PeJAa8xPmWt4k6v',
      color: '#3b82f6'
    },
    {
      name: 'Band',
      address: 'band13tgq3tuxxz32gwyycan2r2da4h8d79wwv5exa0',
      color: '#3b82f6'
    }
  ]

  const copyToClipboard = (address, name) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(name)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  return (
    <>
      <div className="donation-modal-overlay" onClick={onClose}></div>
      <div className="donation-modal">
        <div className="donation-modal-header">
          <div className="donation-title">
            <Coffee size={24} className="donation-icon" />
            <h3>Support Me</h3>
          </div>
          <button className="donation-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="donation-modal-content">
          <p className="donation-description">
            If you find this bot useful, consider supporting the development! ☕
          </p>

          <div className="wallets-list">
            {wallets.map((wallet) => (
              <div key={wallet.name} className="wallet-item">
                <div className="wallet-header">
                  <div 
                    className="wallet-badge" 
                    style={{ background: wallet.color }}
                  >
                    {wallet.name}
                  </div>
                </div>
                <div className="wallet-address-container">
                  <code className="wallet-address">{wallet.address}</code>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(wallet.address, wallet.name)}
                    title="Copy address"
                  >
                    {copiedAddress === wallet.name ? (
                      <Check size={16} className="check-icon" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="donation-footer">
            <p>Thank you for your support! 🙏</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default DonationModal
