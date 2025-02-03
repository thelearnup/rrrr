import express from 'express';
import cors from 'cors';
import ytdl from 'ytdl-core';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'YouTube Downloader API is running' });
});

app.get('/download', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    
    res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
    ytdl(url, { format }).pipe(res);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download video' });
  }
});

app.get('/video-info', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await ytdl.getInfo(url);
    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
      duration: info.videoDetails.lengthSeconds,
      formats: info.formats.map(format => ({
        quality: format.qualityLabel,
        container: format.container,
        size: format.contentLength
      }))
    });
  } catch (error) {
    console.error('Info error:', error);
    res.status(500).json({ error: 'Failed to get video info' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});