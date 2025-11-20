import { UserCircle2 } from 'lucide-react'
import './ProfileButton.css'

function ProfileButton({ onClick }) {
  return (
    <button className="profile-button" onClick={onClick} title="Profile">
      <UserCircle2 size={24} />
    </button>
  )
}

export default ProfileButton
