import * as repo from './repository';

export const addToWatchlist = (profileId: string, videoTitle: string) =>
  repo.addToWatchlist(profileId, videoTitle);

export const getWatchlist = (profileId: string) => repo.getWatchlist(profileId);

export const removeFromWatchlist = (profileId: string, videoTitle: string) =>
  repo.removeFromWatchlist(profileId, videoTitle);

export const removeAllByProfile = (profileId: string) =>
  repo.removeAllByProfile(profileId);

export const isInWatchlist = (profileId: string, videoTitle: string) =>
  repo.isInWatchlist(profileId, videoTitle);
