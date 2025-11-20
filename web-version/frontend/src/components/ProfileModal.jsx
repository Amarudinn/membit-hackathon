import { X, UserCircle2, LogOut } from 'lucide-react'
import './ProfileModal.css'

function ProfileModal({ username, onClose, onLogout }) {
  return (
    <>
      <div className="profile-modal-overlay" onClick={onClose}></div>
      <div className="profile-modal">
        <div className="profile-modal-header">
          <h3>Profile</h3>
          <button className="profile-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="profile-modal-content">
          <div className="profile-user-info">
            <UserCircle2 size={48} className="profile-avatar" />
            <div className="profile-details">
              <span className="profile-label">Logged in as</span>
              <span className="profile-username">{username}</span>
            </div>
          </div>

          <button className="btn btn-danger btn-logout" onClick={onLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default ProfileModal
