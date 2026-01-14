import { useState } from 'react'
import { useNotifications } from '../context/NotificationsContext.jsx'

export default function PaymentOptions({ doctorId, doctorName, amount = 500 }) {
  const { push } = useNotifications()
  const [showQR, setShowQR] = useState(false)
  const payee = 'mediconnect@okbank'

  const upiLink = () => {
    const params = new URLSearchParams({
      pa: payee,
      pn: doctorName || doctorId || 'MediConnect',
      am: String(amount),
      cu: 'INR',
      tn: `Consultation with ${doctorName || doctorId || 'Doctor'}`,
    })
    return `upi://pay?${params.toString()}`
  }

  const payRazorpay = () => {
    if (window.Razorpay) {
      const rzp = new window.Razorpay({
        key: 'rzp_test_123456789', // replace in production
        amount: amount * 100,
        currency: 'INR',
        name: 'MediConnect',
        description: `Consultation with ${doctorName || doctorId}`,
        handler: () => push('Payment successful', 'success'),
      })
      rzp.open()
    } else {
      push('Razorpay SDK not loaded. This is a demo button.', 'error')
    }
  }

  const payUPI = () => {
    setShowQR(true)
  }

  return (
    <div>
      <div className="actions-row">
        <button className="btn" onClick={payRazorpay}>Pay via Razorpay</button>
        <button className="btn secondary" onClick={payUPI}>Pay via UPI</button>
      </div>
      {showQR && (
        <div className="modal-backdrop" onClick={() => setShowQR(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title" style={{ marginTop: 0 }}>Scan to Pay (UPI)</h3>
            <div className="modal-body">
              <p className="help">Amount: ₹{amount} • Payee: {payee}</p>
            </div>
            <div style={{ display: 'grid', placeItems: 'center', marginBottom: '0.75rem' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink())}`}
                alt="UPI QR"
                style={{ width: 220, height: 220, borderRadius: 12, border: '1px solid #334155', background: '#0f172a' }}
              />
            </div>
            <div className="actions-row">
              <a className="btn" href={upiLink()}>Open in UPI app</a>
              <button
                className="btn secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(upiLink())
                    push('Payment link copied', 'success')
                  } catch {
                    push('Copy failed', 'error')
                  }
                }}
              >Copy UPI link</button>
              <button className="btn secondary" onClick={() => setShowQR(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}