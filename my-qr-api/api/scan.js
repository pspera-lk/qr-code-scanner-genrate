import multer from 'multer';
import Jimp from 'jimp';
import jsQR from 'jsqr';

// Disable Vercel’s default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
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
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  await runMiddleware(req, res, upload.single('image'));

  try {
    const image = await Jimp.read(req.file.buffer);
    const { data, width, height } = image.bitmap;
    const code = jsQR(new Uint8ClampedArray(data), width, height);
    if (code) res.send({ decoded: code.data });
    else res.status(404).send({ error: 'No QR code found.' });
  } catch (err) {
    res.status(500).send({ error: 'Scan failed.' });
  }
}
