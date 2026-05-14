import * as repo from './repository';

export const getAllVideos = (query?: string) => repo.getAllVideos(query);
export const getVideoByTitle = (title: string) => repo.getVideoByTitle(title);
export const getSuggestions = (limit?: number) => repo.getSuggestions(limit);
export const getVideosByGenre = (genre: string) => repo.getVideosByGenre(genre);
