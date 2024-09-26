'use server'

import { extractVideoData } from "./extractVideoData";
import { groundWithGoogleSearch } from "./groundWithGoogleSearch";
import { Storage } from "@google-cloud/storage";
import Pool from 'pg-pool';

export type EstimatedValueItems = {
    "playerName": string,
    "manufacturer": string,
    "year": string,
    "sport": string,
    "estimatedValueInCents": number,
    "cardTitle": string,
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
    const estimatedValueAttempts = await Promise.all([
        await groundWithGoogleSearch({ extractedVideoData }),
        await groundWithGoogleSearch({ extractedVideoData }),
        await groundWithGoogleSearch({ extractedVideoData }),
        await groundWithGoogleSearch({ extractedVideoData }),
        await groundWithGoogleSearch({ extractedVideoData }),
    ]) as string[];
    const parsedEstimatedValueAttempts = estimatedValueAttempts.map((estimatedValueAttempt) => {
        return JSON.parse(estimatedValueAttempt) as EstimatedValueItems[];
    });
    console.log({ parsedEstimatedValueAttempts })
    const validResponses = parsedEstimatedValueAttempts.filter((estimatedValueAttempt) => {
        const responseContainsNaN = estimatedValueAttempt.some((item) => !item.estimatedValueInCents || Number.isNaN(item.estimatedValueInCents));
        console.log({ estimatedValueAttempt, responseContainsNaN });
        return !responseContainsNaN;
    });
    console.log(`There were ${validResponses.length} valid responses out of ${estimatedValueAttempts.length} attempts.`);
    const firstValidResponse = validResponses[0];
    if (!firstValidResponse) {
        throw new Error('None of the attempts to estimate were valid. All of them contained at least one NaN as an estimate.')
    }
    const sortedValueItems = firstValidResponse.toSorted((a, b) => b.estimatedValueInCents - a.estimatedValueInCents).map(item => ({
        ...item,
        cardTitle: `${item.year} ${item.playerName} ${item.manufacturer} ${item.sport} card`,
    }))

    // **TODO: Save sortedValueItems to alloy db database**
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '5432'),
        ssl: {
          rejectUnauthorized: false, // Important for AlloyDB
        },
      });

    try {
        await pool.query('BEGIN');
        for (const item of sortedValueItems) {
            await pool.query(
                `INSERT INTO trading_cards (playerName, manufacturer, year, sport, estimatedValueInCents, cardTitle) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [item.playerName, item.manufacturer, item.year, item.sport, item.estimatedValueInCents, item.cardTitle]
            );
        }
        await pool.query('COMMIT');
        console.log('Successfully saved estimated values to AlloyDB!');
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error saving estimated values to AlloyDB:', error);
        throw error; // Re-throw the error to be handled elsewhere
    } finally {
        await pool.end();
        return sortedValueItems;
    }
}
