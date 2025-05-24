import multer from 'multer';
import Jimp from 'jimp';
import jsQR from 'jsqr';
import axios from 'axios';

export const config = {
  api: { bodyParser: false },
};

const upload = multer({ storage: multer.memoryStorage() });

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) return reject(result);
      resolve(result);
    });
  });
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        message: 'Method not allowed.',
        developer: 'pasindu',
        telegram: 'https://t.me/sl_bjs'
      });
    }

    // Handle image upload
    await runMiddleware(req, res, upload.single('image'));

    let imageBuffer;

    if (req.file) {
      imageBuffer = req.file.buffer;
    } else if (req.query.url) {
      const response = await axios.get(req.query.url, { responseType: 'arraybuffer' });
      imageBuffer = Buffer.from(response.data);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Upload image using form-data "image" or provide ?url=...',
        developer: 'pasindu',
        telegram: 'https://t.me/sl_bjs'
      });
    }

    const image = await Jimp.read(imageBuffer);
    const { data, width, height } = image.bitmap;
    const code = jsQR(new Uint8ClampedArray(data), width, height);

    if (code) {
      return res.json({
        success: true,
        decoded: code.data,
        developer: 'pasindu',
        telegram: 'https://t.me/sl_bjs'
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'No QR code found in the image.',
        developer: 'pasindu',
        telegram: 'https://t.me/sl_bjs'
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Scan failed.',
      error: err.message,
      developer: 'pasindu',
      telegram: 'https://t.me/sl_bjs'
    });
  }
}
