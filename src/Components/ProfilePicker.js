import React, { useState, useEffect } from 'react';
import './Styles/ProfilePicker.css';
import ProfilePreview from './ProfilePreview';
import AddProfile from './AddProfile';
import ManageProfile from './ManageProfile';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export default function ProfilePicker({
  hideProfilePick,
  setSelectedProfile,
  setSelectedProfileName,
  email,
  setProfilesNavBar,
  setSelectedProfileId,
}) {
    const[addProfile,setAddProfile]=useState(false);
    const[manageProfile,setManageProfile]=useState(false);
    const [profiles, setProfiles] = useState([]);

    function showAddProfile(){
        setAddProfile(true);
    }
    function hideAddProfile(){
        setAddProfile(false);
    }
    function showManageProfile(){
        setManageProfile(true);
    }
    function hideManageProfile(){
        setManageProfile(false);
    }

    const fetchProfiles = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setProfiles([]);
          setProfilesNavBar([]);
          return;
        }
        fetch(`${API_BASE}/profiles`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((response) => {
            if (!response.ok) throw new Error('profiles failed');
            return response.json();
          })
          .then((data) => {
            const mapped = data.map((p) => ({
              id: p.id,
              profileName: p.profileName,
              profilePicture: 'icon i1',
            }));
            setProfiles(mapped);
            setProfilesNavBar(mapped);
          })
          .catch(() => {
            setProfiles([]);
            setProfilesNavBar([]);
          });
    };

    useEffect(() => {
        fetchProfiles();
    }, [email]);

  return (
    <div className='expand-Container'>
        {addProfile && <AddProfile hideAddProfile={hideAddProfile} email={email}/>}
        {manageProfile && <ManageProfile hideManageProfile={hideManageProfile} email={email}/>}
        <p className='text-light profile-pick-header'>Who's watching?</p><br></br>
        <div className="profile-container">
            <div className="profile-preview-container">
                {profiles.map(profile => (
                    <ProfilePreview
                        key={profile.id}
                        profileId={profile.id}
                        profileName={profile.profileName}
                        profilePicture={profile.profilePicture}
                        hideProfilePick={hideProfilePick}
                        setSelectedProfile={setSelectedProfile}
                        setSelectedProfileName={setSelectedProfileName}
                        setSelectedProfileId={setSelectedProfileId}
                    />
                ))}
            </div>
            <a onClick={showAddProfile} className="add-profile-container">
                <img className='add-img' src='./Assets/add.png' alt=""></img>
                <p className='profile-preview-name'>Add Profile</p>
            </a>
        </div>
        <a onClick={showManageProfile}  className="manage-profile-btn">
            <p className='manage-profile-btn-text'>Manage Profiles</p>
        </a>
    </div>
  );
}
