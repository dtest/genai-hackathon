'use server'

import { extractVideoData } from "./extractVideoData";
import { groundWithGoogleSearch } from "./groundWithGoogleSearch";

const favoriteThings = [
    'Chocolate',
    'Football',
    'JavaScript',
    'Volleyball',
];

export async function getFavoriteThings() {
    const extractedVideoData = await extractVideoData();
    const estimatedValueItems = await groundWithGoogleSearch({ extractedVideoData });
    // TODO: Save estimatedValueItems to database
    return estimatedValueItems;
}

export async function addFavoriteThing(newThing: string) {
    favoriteThings.push(newThing);
    return;
}
