import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import jsQR from 'jsqr';

const QRCodeGenerator = ({ leaveData }) => {
    const qrRef = useRef(null);
    const [scannedData, setScannedData] = useState(null);

    const isNotPending = leaveData[0].status !== 'Pending';

    const downloadQRCode = () => {
        const canvas = qrRef.current.querySelector('canvas');
        if (!canvas) return;

        const borderSize = 20; // Adjust border size
        const newCanvas = document.createElement('canvas');
        const newCtx = newCanvas.getContext('2d');

        // New canvas dimensions (original canvas + border)
        const size = canvas.width + borderSize * 2;
        newCanvas.width = size;
        newCanvas.height = size;

        // Draw border (set border color & thickness)
        newCtx.fillStyle = 'yellow'; // Border color (same as Bootstrap 'border-warning')
        newCtx.fillRect(0, 0, size, size);

        // Draw QR code onto the new canvas (centered inside the border)
        newCtx.drawImage(canvas, borderSize, borderSize);

        // Convert to image and trigger download
        const pngUrl = newCanvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = 'qrcode.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const scanDisplayedQRCode = () => {
        const canvas = qrRef.current.querySelector("canvas");
        if (!canvas) return alert("QR code not found!");

        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        console.log(qrCode)
        if (qrCode) {
            try {
                const parsedData = JSON.parse(qrCode.data);
                console.log(parsedData[0])
                setScannedData(parsedData[0]);
                
                
            } catch (error) {
                alert("Invalid QR Code format.");
            }
        } else {
            alert("Failed to scan QR Code.");
        }
        
    };



    return (
        <div className="text-center">
            {isNotPending ? (
                <>
            <div ref={qrRef} style={{ display: 'inline-block', border: '5px solid yellow',}}>
                <QRCodeCanvas value={JSON.stringify(leaveData)} size={256}/>
            </div>
            <div className='d-grid gap-2'>
            <div className='row gap-2 offset-1'>
            <button className="btn btn-warning btn- mt-3 col-sm-5" onClick={downloadQRCode}>
                Download QR Code
            </button>
            <button className="btn btn-warning mt-3 col-sm-5" onClick={scanDisplayedQRCode}>
                Scan Displayed QR Code
            </button>
            </div>
           
            </div>
            </>
        ) : <div>Application under process</div>}


{scannedData && (
                <div
                    key={scannedData.id}
                    className={`card text-white mt-3 ${
                        scannedData.status === "approved" ? "bg-success" : "bg-danger"
                    }`}
                >
                    <div className="card-body">
                        <h5 className="card-title">Leave Type: {scannedData.leave_type.toUpperCase()}</h5>
                        <p className="card-text">
                            <strong>Visiting Place:</strong> {scannedData.visiting_place} <br />
                            <strong>From:</strong> {new Date(scannedData.from_date).toLocaleDateString()} at{" "}
                            {scannedData.from_time} <br />
                            <strong>To:</strong> {new Date(scannedData.to_date).toLocaleDateString()} at{" "}
                            {scannedData.to_time} <br />
                            <strong>Reason:</strong> {scannedData.reason} <br />
                            <strong>Status:</strong> {scannedData.status.toUpperCase()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRCodeGenerator;
