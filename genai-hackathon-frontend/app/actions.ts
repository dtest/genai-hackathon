'use server'

import { extractVideoData } from "./extractVideoData";
import { groundWithGoogleSearch } from "./groundWithGoogleSearch";
import { Storage } from "@google-cloud/storage";

export type EstimatedValueItems = {
    "playerName": string,
    "manufacturer": string,
    "year": string,
    "sport": string,
    "estimatedValueInCents": number,
};

export async function UploadFile(form: FormData) {
    console.log('uploading file');
    const file = form.get('file') as File;
    if (!file) throw new Error('No file provided');
    if (file.size < 1) throw new Error('File is empty');
    // TODO: restrict to mp4
    console.log({ type: file.type });

    const buffer = await file.arrayBuffer();
    const storage = new Storage();
    const storageBucketName = 'cardmedia_ingest';
    await storage.bucket(storageBucketName).file(file.name).save(Buffer.from(buffer));
    return { fileUri: `gs://${storageBucketName}/${file.name}` }
}

export async function UploadFileFromFormData(form: FormData) {
    console.log('uploading file');
    const file = form.get('file') as File;
    if (!file) throw new Error('No file provided');
    if (file.size < 1) throw new Error('File is empty');
    // TODO: restrict to mp4
    console.log({ type: file.type });

    const buffer = await file.arrayBuffer();
    const storage = new Storage();
    const storageBucketName = 'cardmedia_ingest';
    await storage.bucket(storageBucketName).file(file.name).save(Buffer.from(buffer));
    return { fileUri: `gs://${storageBucketName}/${file.name}` }
}

export async function getItemValueEstimates({ fileUri }: { fileUri: string }) {
    const extractedVideoData = await extractVideoData({ fileUri });
    let estimatedValueItems: EstimatedValueItems[] = [];
    for (let i = 0; i < 5; i++) {
        const estimatedValueItemsString = await groundWithGoogleSearch({ extractedVideoData });
        estimatedValueItems = JSON.parse(estimatedValueItemsString) as EstimatedValueItems[];
        const responseContainsNaN = estimatedValueItems.some((item) => Number.isNaN(item.estimatedValueInCents));
        if (!responseContainsNaN) {
            break;
        }
    }
    const sortedValueItems = estimatedValueItems.toSorted((a, b) => b.estimatedValueInCents - a.estimatedValueInCents)
    // TODO: Save estimatedValueItems to database

    return sortedValueItems;
}
