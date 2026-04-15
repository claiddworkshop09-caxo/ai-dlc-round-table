"use client"

import QRCode from "react-qr-code"

interface QRCodeDisplayProps {
  value: string
}

export function QRCodeDisplay({ value }: QRCodeDisplayProps) {
  return (
    <div className="inline-block rounded-lg bg-white p-4 border">
      <QRCode value={value} size={180} />
    </div>
  )
}
