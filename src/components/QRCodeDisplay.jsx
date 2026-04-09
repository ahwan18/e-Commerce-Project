import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import { Button } from './Button';

export const QRCodeDisplay = ({ value, label, fileName = 'qr-code.png' }) => {
  const qrValue = value;

  const downloadQR = () => {
    const svg = document.querySelector('.qr-code-canvas');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
        <QRCodeSVG
          className="qr-code-canvas"
          value={qrValue}
          size={256}
          level="H"
          includeMargin
        />
      </div>
      <p className="text-sm text-gray-600 text-center">
        {label}
      </p>
      <Button
        onClick={downloadQR}
        variant="secondary"
        size="sm"
        className="flex items-center gap-2"
      >
        <Download size={16} />
        Download QR
      </Button>
    </div>
  );
};
