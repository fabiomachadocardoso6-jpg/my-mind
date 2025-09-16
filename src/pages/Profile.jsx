import React from 'react'
import ProfileCard from '../components/ProfileCard'

const Profile = () => {
  // O Header foi removido, pois agora é gerenciado pelo Layout.
  return (
    <div className="py-6">
      <ProfileCard />
    </div>
  )
}

export default Profile
