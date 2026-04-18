// src/utils/imageUtils.js
import { getOptimalSportImage } from './sportImageGenerator';

export function getSportImage(imageUrl, sport, id, name) {
    // Use the enhanced sport image generator
    return getOptimalSportImage(imageUrl, sport, id, name);
}
