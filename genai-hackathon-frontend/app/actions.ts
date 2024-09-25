'use server'

import { extractVideoData } from "./extractVideoData";
import { groundWithGoogleSearch } from "./groundWithGoogleSearch";

export type EstimatedValueItems = {
    "fullTitle": string,
    "playerName": string,
    "manufacturer": string,
    "year": string,
    "sport": string,
    "estimatedValueInCents": number,
};

export async function getItemValueEstimates({ fileUri }: { fileUri: string }) {
    const extractedVideoData = await extractVideoData({ fileUri });
    const estimatedValueItemsString = await groundWithGoogleSearch({ extractedVideoData });
    const estimatedValueItems = JSON.parse(estimatedValueItemsString) as EstimatedValueItems[];
    const sortedValueItems = estimatedValueItems.toSorted((a, b) => b.estimatedValueInCents - a.estimatedValueInCents)
    // TODO: Save estimatedValueItems to database
    return sortedValueItems;
}
