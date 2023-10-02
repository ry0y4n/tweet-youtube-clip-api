import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { TwitterApi, EUploadMimeType } from 'twitter-api-v2';
import * as YTDlpWrap from 'yt-dlp-wrap';
import * as fs from 'fs';

const secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'));

const client = new TwitterApi({
  appKey: secrets["appKey"],
  appSecret: secrets["appSecret"],
  accessToken: secrets["accessToken"],
  accessSecret: secrets["accessSecret"]
});

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('HTTP trigger function processed a request.');
    
  const url = req.query.url || (req.body && req.body.url);

  if(!url) {
    context.res = {
      status: 400,
      body: "Please pass a url on the query string or in the request body"
    };
    return;
  }

  const convertedUrl = convertYouTubeUrl(url);

  context.log('Starting download');

  try {
    const ytDlpWrap = new YTDlpWrap.default('./yt-dlp');

    const { title } = await ytDlpWrap.getVideoInfo(convertedUrl);
    const readableStream = ytDlpWrap.execStream([
      convertedUrl,
      '-f',
      'best[ext=mp4]',
    ]);

    const chunks = [];

    await new Promise<void>((resolve, reject) => {
      readableStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      readableStream.on('end', async () => {
        try {
          context.log('Stream ended, concatenating chunks');
          const data = Buffer.concat(chunks);
          await tweetClip(context, data, title, convertedUrl);
          context.res = {
            body: "Tweeted successfully"
          };
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      readableStream.on('error', (err) => {
        context.log('Error occurred:', err.message);
        context.res = {
          status: 500,
          body: "An error occurred: " + err.message
        };
        reject(err);
      });
    });
  } catch(err) {
    context.log('Error in tweetClip:', err.message);
    context.res = {
      status: 500,
      body: "An error occurred: " + err.message
    };
  }
};

async function tweetClip(context: Context, data: Buffer, title: string, url: string) {
  context.log('Uploading media');
  const mediaId = await client.v1.uploadMedia(data, {
    mimeType: EUploadMimeType.Mp4,
    longVideo: true
  });
  context.log('Tweeting');
  await client.v2.tweet({
    text: `${title} ${url} @YouTubeより`,
    media: { media_ids: [mediaId] }
  });
  context.log('Tweeted');
}

function convertYouTubeUrl(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^&]+)/;
  const match = url.match(regex);
  if (match) {
    const videoId = match[1];
    return `youtu.be/${videoId}`;
  } else {
    throw new Error('Invalid YouTube URL');
  }
}

export default httpTrigger;
