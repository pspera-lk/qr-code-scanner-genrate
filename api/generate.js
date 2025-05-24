import QRCode from 'qrcode';

export default async function handler(req, res) {
  const { text, json } = req.query;

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

    // If ?json=true, return JSON with a base64 link
    if (json === 'true') {
      const base64 = buffer.toString('base64');
      const dataUrl = `data:image/png;base64,${base64}`;
      return res.status(200).json({
        success: true,
        message: 'QR Code generated successfully.',
        image: dataUrl,
        developer: 'pasindu',
        telegram: 'https://t.me/sl_bjs'
      });
    }

    // Otherwise return direct download
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="qrcode.png"');
    return res.send(buffer);
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate QR code.',
      developer: 'pasindu',
      telegram: 'https://t.me/sl_bjs'
    });
  }
}
