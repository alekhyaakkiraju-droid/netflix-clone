import React, { useEffect, useState } from 'react';
import './Styles/VideoCardInfo.css';
import Addtolist from './Addtolist';
import Removefromlist from './Removefromlist';
import { gradientForTitle } from '../utils/videoPlaceholder';

export default function VideoCardInfo({ email, selectedProfileName, videoTitle, videoCategory, videoRating, releaseYear, thumbnail }) {
  const placement = "hoverTextUp";
  const [isInList, setIsInList] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      checkInList().then(result => setIsInList(result));
    }, 10);

    return () => clearInterval(interval);
  }, [selectedProfileName]);

  function checkInList() { // Check if video is currently available in user profile 'My List'
    return fetch(`http://localhost:8080/api/list/check/${email}/${selectedProfileName}/${videoTitle}`)
      .then(response => response.json())
      .then(data => data);
  }

  return (
    <div className='VideoCardInfo-Card'>
      <div className="preview-img-stack">
        <div
          className="preview-img-placeholder"
          style={{ background: gradientForTitle(videoTitle) }}
          aria-hidden
        />
        <div className={`preview-img ${thumbnail}`} />
      </div>
      <div className="btn-container-card">
        <div className="circle-btn circle-btn2 circle-btn2-play"><i className="bi bi-play-fill"></i></div>
        {isInList
          ? <Removefromlist email={email} selectedProfileName={selectedProfileName} videoTitle={videoTitle} placement={placement}/>
          : <Addtolist selectedProfileName={selectedProfileName} email={email} thumbnail={thumbnail} releaseYear={releaseYear} videoTitle={videoTitle} videoCategory={videoCategory} placement={placement} />
        }
        <div className="circle-btn circle-btn2"><i className="bi bi-hand-thumbs-up"></i></div>
        <div className="space-div"></div>
        <div className="circle-btn circle-btn2"><i className="bi bi-chevron-down"></i></div>
      </div>
      <p className='cancel-bottom VideoCardInfo-Card-title mb-2'>{videoTitle}</p>
      <div className="rating-year mb-2">
        <p className='cancel-bottom VideoCardInfo-Card-sub1'>{videoRating} Rating</p> 
        <p className='cancel-bottom movie-year'>{releaseYear}</p>
      </div>
      <div className="category">
        <p className='cancel-bottom movie-category'>{videoCategory}</p>
      </div>
    </div>
  );
}
