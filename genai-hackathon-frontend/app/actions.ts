'use server'

import { VertexAI } from '@google-cloud/vertexai';

const favoriteThings = [
    'Chocolate',
    'Football',
    'JavaScript',
    'Volleyball',
];

export async function getFavoriteThings() {
    return favoriteThings;
}

export async function addFavoriteThing(newThing: string) {
    favoriteThings.push(newThing);
    return;
}
