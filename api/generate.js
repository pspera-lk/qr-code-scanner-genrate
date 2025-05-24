import QRCode from 'qrcode';

export default async function handler(req, res) {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({
      success: false,
      message: 'Missing "text" query parameter.',
      developer: 'pasindu',
      telegram: 'https://t.me/sl_bjs'
    });
  }

  try {
    const buffer = await QRCode.toBuffer(text, { type: 'png' });
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="qrcode.png"');
    res.send(buffer);
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code.',
      developer: 'pasindu',
      telegram: 'https://t.me/sl_bjs'
    });
  }
}
