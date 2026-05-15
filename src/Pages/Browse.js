import React, { useState, useEffect } from 'react';
import './Styles/Browse.css';
import ProfilePicker from '../Components/ProfilePicker';
import BrowserNav from '../Components/BrowserNav';
import VideoCard from '../Components/VideoCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Addtolist from '../Components/Addtolist';
import Removefromlist from '../Components/Removefromlist';
import MyList from '../Components/MyList';
import { useLocation } from 'react-router-dom';
import { mapVideoMetadataForBrowse } from '../utils/mapVideoMetadata';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

function authHeaders() {
  const token = localStorage.getItem('accessToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function fetchVideosByCategory(category) {
  const path = `${API_BASE}/videos/genre/${encodeURIComponent(category)}`;
  const response = await fetch(path, { headers: authHeaders() });
  if (!response.ok) throw new Error(`videos ${category}`);
  const rows = await response.json();
  return rows.map((row) => mapVideoMetadataForBrowse(row));
}

export default function Browse() {
  const [profilePick, setProfilePick] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedProfileName, setSelectedProfileName] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [profilesNavBar, setProfilesNavBar] = useState([]);
  const [myList, setMyList] = useState(false);
  const [isInList, setIsInList] = useState(false);

  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (profilePick) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    };
  }, [profilePick]);

  function showProfilePick() {
    setProfilePick(true);
  }

  function hideProfilePick() {
    setProfilePick(false);
  }

  function showMyList() {
    setMyList(true);
  }

  function hideMyList() {
    setMyList(false);
  }

  const [nowPlayingData, setNowPlayingData] = useState([]);
  const [topRatedData, setTopRatedData] = useState([]);
  const [newReleasesData, setNewReleasesData] = useState([]);
  const [originalsData, setOriginalsData] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [np, tr, nr, or] = await Promise.all([
          fetchVideosByCategory('Now Playing'),
          fetchVideosByCategory('Top Rated Movies'),
          fetchVideosByCategory('New Releases'),
          fetchVideosByCategory('Originals'),
        ]);
        if (cancelled) return;
        setNowPlayingData(np);
        setTopRatedData(tr);
        setNewReleasesData(nr);
        setOriginalsData(or);
      } catch {
        if (!cancelled) {
          setNowPlayingData([]);
          setTopRatedData([]);
          setNewReleasesData([]);
          setOriginalsData([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedProfileId) {
      setIsInList(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const path = `${API_BASE}/preferences/${selectedProfileId}/check/${encodeURIComponent('Saw X')}`;
        const response = await fetch(path, { headers: authHeaders() });
        if (!response.ok) throw new Error('check list');
        const data = await response.json();
        if (!cancelled) setIsInList(data.inList === true);
      } catch {
        if (!cancelled) setIsInList(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedProfileId]);

  return (
    <div className="browse">
      {profilePick && (
        <ProfilePicker
          hideProfilePick={hideProfilePick}
          setSelectedProfile={setSelectedProfile}
          email={email}
          setProfilesNavBar={setProfilesNavBar}
          setSelectedProfileName={setSelectedProfileName}
          setSelectedProfileId={setSelectedProfileId}
        />
      )}
      <div className="browse-container">
        <BrowserNav
          selectedProfile={selectedProfile}
          showProfilePick={showProfilePick}
          profilesNavBar={profilesNavBar}
          setSelectedProfile={setSelectedProfile}
          showMyList={showMyList}
          hideMyList={hideMyList}
          setSelectedProfileName={setSelectedProfileName}
          setSelectedProfileId={setSelectedProfileId}
        />
        {myList && <MyList email={email} selectedProfileName={selectedProfileName} />}
        <div className="main-hero-playback">
          <video
            src="./Assets/video-preview.mp4"
            autoPlay
            loop
            muted
            controls={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          ></video>
          <div className="info-area">
            <img className="playback-title" src="./Assets/sawX.png" alt="Saw X"></img>
            <p className="cancel-bottom playback-info">
              Hoping for a miraculous cure, John Kramer travels to Mexico for a risky and experimental medical procedure, only to discover the entire operation is a scam to defraud the most vulnerable. Armed with a newfound purpose, the infamous serial killer uses deranged and ingenious traps to turn the tables on the con artists.
            </p>
            <br></br>
            <div className="playback-info-btn">
              <div className="play-btn">
                <i className="bi bi-play-fill info-btn-icon info-btn-icon2"></i>Play
              </div>
              <div className="info-btn">
                <i className="bi bi-info-circle info-btn-icon"></i>More Info
              </div>

              {isInList ? (
                <Removefromlist email={email} selectedProfileName={selectedProfileName} videoTitle={"Saw X"} />
              ) : (
                <Addtolist
                  email={email}
                  selectedProfileName={selectedProfileName}
                  videoTitle={"Saw X"}
                  videoCategory={"Horror - Crime"}
                  releaseYear={"2023"}
                  thumbnail={"saw_x_thumbnail"}
                />
              )}

              <div className="circle-btn">
                <i className="bi bi-hand-thumbs-up"></i>
              </div>
            </div>
          </div>
          {!myList &&
            <div className="main-hero">
              <div className="carouse-net">
                <div className="carouse-bar">
                  <p className="cancel-bottom carouse-title">Now Playing</p></div>
                <Swiper
                  slidesPerView={8}
                  spaceBetween={18}
                  slidesPerGroup={1}
                  navigation
                  modules={[Navigation]}
                  className="carouse-netflix"
                >
                  {nowPlayingData.map((item, index) => (
                    <SwiperSlide key={index} className="video-card-slide">
                      <VideoCard
                        videoTitle={item.videoTitle}
                        videoCategory={item.videoCategory}
                        videoRating={item.videoRating}
                        releaseYear={item.releaseYear}
                        thumbnail={item.thumbnail}
                        email={email}
                        selectedProfileName={selectedProfileName}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="carouse-net">
                <div className="carouse-bar">
                  <p className="cancel-bottom carouse-title">Top Rated Movies</p></div>
                <Swiper
                  slidesPerView={8}
                  spaceBetween={18}
                  slidesPerGroup={1}
                  navigation
                  modules={[Navigation]}
                  className="carouse-netflix"
                >
                  {topRatedData.map((item, index) => (
                    <SwiperSlide key={index} className="video-card-slide">
                      <VideoCard
                        videoTitle={item.videoTitle}
                        videoCategory={item.videoCategory}
                        videoRating={item.videoRating}
                        releaseYear={item.releaseYear}
                        thumbnail={item.thumbnail}
                        email={email}
                        selectedProfileName={selectedProfileName}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="carouse-net">
                <div className="carouse-bar">
                  <p className="cancel-bottom carouse-title">New Releases</p></div>
                <Swiper
                  slidesPerView={8}
                  spaceBetween={18}
                  slidesPerGroup={1}
                  navigation
                  modules={[Navigation]}
                  className="carouse-netflix"
                >
                  {newReleasesData.map((item, index) => (
                    <SwiperSlide key={index} className="video-card-slide">
                      <VideoCard
                        videoTitle={item.videoTitle}
                        videoCategory={item.videoCategory}
                        videoRating={item.videoRating}
                        releaseYear={item.releaseYear}
                        thumbnail={item.thumbnail}
                        email={email}
                        selectedProfileName={selectedProfileName}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="carouse-net carouse-net2">
                <div className="carouse-bar">
                  <p className="cancel-bottom carouse-title">Originals</p></div>
                <Swiper
                  slidesPerView={8}
                  spaceBetween={18}
                  slidesPerGroup={1}
                  navigation
                  modules={[Navigation]}
                  className="carouse-netflix"
                >
                  {originalsData.map((item, index) => (
                    <SwiperSlide key={index} className="video-card-slide">
                      <VideoCard
                        videoTitle={item.videoTitle}
                        videoCategory={item.videoCategory}
                        videoRating={item.videoRating}
                        releaseYear={item.releaseYear}
                        thumbnail={item.thumbnail}
                        email={email}
                        selectedProfileName={selectedProfileName}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="home-footer2 text-light">
                <h6>© 2024 NetflixClone. All rights reserved.&nbsp;By Group 20 - COSC 31093</h6>
                <h7>This is a demo project and is not affiliated with or endorsed by Netflix. All content, logos, and trademarks are property of their respective owners.</h7>
              </div>
            </div>}
        </div>
      </div>
    </div>
  );
}
