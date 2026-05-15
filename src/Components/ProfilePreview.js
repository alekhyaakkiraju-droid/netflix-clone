import React from 'react'
import './Styles/ProfilePreview.css'

export default function ProfilePreview({
  profileId,
  profileName,
  profilePicture,
  hideProfilePick,
  setSelectedProfile,
  setSelectedProfileName,
  setSelectedProfileId,
}) {
  return (
    <div>
        <a
          className={`profile-preview ${profilePicture}`}
          onClick={() => {
            hideProfilePick();
            setSelectedProfile(profilePicture);
            setSelectedProfileName(profileName);
            if (setSelectedProfileId && profileId) setSelectedProfileId(profileId);
          }}
        >
            <p className='profile-preview-name'>{profileName}</p>
        </a>
    </div>
  )
}
