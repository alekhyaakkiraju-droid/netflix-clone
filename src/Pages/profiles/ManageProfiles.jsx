import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../../services/profileService';
import { ApiError } from '../../services/apiClient';

const AVATARS = ['😎', '🎬', '🦁', '🐼', '🚀', '🌙', '⚡', '🎭'];

function ProfileCard({ profile, onEdit, onDelete }) {
  return (
    <div className="d-flex flex-column align-items-center" style={{ width: 130 }}>
      <div
        className="rounded d-flex align-items-center justify-content-center mb-2"
        style={{ width: 100, height: 100, background: '#333', fontSize: 48 }}
      >
        {profile.avatarUrl ?? '😎'}
      </div>
      <p className="text-white mb-1 text-center">{profile.profileName}</p>
      <div className="d-flex gap-1">
        <button className="btn btn-sm btn-outline-light" onClick={() => onEdit(profile)}>✏️</button>
        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(profile.id)}>🗑</button>
      </div>
    </div>
  );
}

function ManageProfiles() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [profileName, setProfileName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    profileService.list()
      .then(setProfiles)
      .finally(() => setLoading(false));
  }, []);

  function startCreate() {
    setEditingProfile(null);
    setProfileName('');
    setAvatar(AVATARS[0]);
    setError('');
    setShowForm(true);
  }

  function startEdit(profile) {
    setEditingProfile(profile);
    setProfileName(profile.profileName);
    setAvatar(profile.avatarUrl ?? AVATARS[0]);
    setError('');
    setShowForm(true);
  }

  async function handleDelete(profileId) {
    if (!confirm('Delete this profile?')) return;
    await profileService.delete(profileId);
    setProfiles((prev) => prev.filter((p) => p.id !== profileId));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingProfile) {
        const updated = await profileService.update(editingProfile.id, {
          profileName,
          avatarUrl: avatar,
        });
        setProfiles((prev) => prev.map((p) => (p.id === editingProfile.id ? { ...p, ...updated } : p)));
      } else {
        const created = await profileService.create(profileName, avatar);
        setProfiles((prev) => [...prev, created]);
      }
      setShowForm(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError('That profile name is already taken.');
      } else {
        setError('Failed to save profile. Please try again.');
      }
    }
  }

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', background: '#141414' }}>
      <div className="spinner-border text-danger" />
    </div>
  );

  return (
    <div style={{ background: '#141414', minHeight: '100vh', color: 'white' }} className="p-5">
      <h1 className="text-white mb-5">Manage Profiles</h1>

      {showForm ? (
        <div style={{ maxWidth: 400 }}>
          <h4 className="mb-4">{editingProfile ? 'Edit Profile' : 'Create Profile'}</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="text-secondary small">Profile Name</label>
              <input
                className="form-control bg-secondary text-white border-0"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="text-secondary small">Avatar</label>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`btn btn-sm ${avatar === a ? 'btn-danger' : 'btn-outline-secondary'}`}
                    style={{ fontSize: 24, width: 48, height: 48 }}
                    onClick={() => setAvatar(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-danger">Save</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="d-flex flex-wrap gap-4 mb-5">
            {profiles.map((p) => (
              <ProfileCard key={p.id} profile={p} onEdit={startEdit} onDelete={handleDelete} />
            ))}
            {profiles.length < 5 && (
              <button
                className="btn btn-outline-light d-flex flex-column align-items-center justify-content-center"
                style={{ width: 100, height: 100, fontSize: 36 }}
                onClick={startCreate}
              >
                +
              </button>
            )}
          </div>
          <button className="btn btn-outline-light" onClick={() => navigate('/browse')}>
            Done
          </button>
        </>
      )}
    </div>
  );
}

export default ManageProfiles;
