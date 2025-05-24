import QRCode from 'qrcode';

export default async function handler(req, res) {
  const { text } = req.query;

  if (!text) {
    return res.status(400).send('Missing "text" query parameter.');
  }

  try {
    const buffer = await QRCode.toBuffer(text, { type: 'png' });
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="qrcode.png"');
    res.send(buffer);
  } catch {
    res.status(500).send('Failed to generate QR code.');
  }
}
