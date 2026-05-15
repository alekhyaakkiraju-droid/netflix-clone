import React from 'react'
import './Styles/DropDownProfile.css'

export default function DropDownProfile({
  profileId,
  profilePicture,
  profileName,
  setSelectedProfile,
  closeDropdown,
  setSelectedProfileName,
  setSelectedProfileId,
}) {
  return (
    <div
      className='dropDownContainer'
      onClick={() => {
        closeDropdown();
        setSelectedProfile(profilePicture);
        setSelectedProfileName(profileName);
        if (setSelectedProfileId && profileId) setSelectedProfileId(profileId);
      }}
    >
        <div className={`profile-icon-dropdown ${profilePicture}`}></div>
        <p className='cancel-bottom profile-name-dropdown'>{profileName}</p>
    </div>
  )
}
