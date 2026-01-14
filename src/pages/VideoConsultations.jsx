import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useNotifications } from '../context/NotificationsContext.jsx'

export default function VideoConsultations() {
  const { id: roomId } = useParams()
  const navigate = useNavigate()
  const { push } = useNotifications()
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const pcRef = useRef(null)
  const channelRef = useRef(null)
  const localStreamRef = useRef(null)
  const remoteStreamRef = useRef(null)
  const selfIdRef = useRef(Math.random().toString(36).slice(2))
  const [inCall, setInCall] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [status, setStatus] = useState('Ready')

  useEffect(() => {
    // Get local media on mount
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        localStreamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      } catch (err) {
        push('Unable to access camera/microphone', 'error')
        setStatus('Media devices unavailable')
      }
    }
    startMedia()
    return () => {
      endCall()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setupPeer = () => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })
    pcRef.current = pc
    remoteStreamRef.current = new MediaStream()
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStreamRef.current
    // Add local tracks
    localStreamRef.current?.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current))
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        channelRef.current?.postMessage({ type: 'ice', candidate: e.candidate, from: selfIdRef.current })
      }
    }
    pc.onconnectionstatechange = () => {
      setStatus(pc.connectionState)
      if (pc.connectionState === 'connected') push('Connected', 'success')
    }
    pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach((t) => remoteStreamRef.current.addTrack(t))
    }
  }

  const joinRoom = async () => {
    if (!roomId) return
    if (!localStreamRef.current) {
      push('Enable camera/microphone first', 'error')
      return
    }
    setupPeer()
    const channel = new BroadcastChannel(`mediconnect-consult-${roomId}`)
    channelRef.current = channel
    setInCall(true)
    setStatus('Connecting...')
    channel.onmessage = async (ev) => {
      const msg = ev.data
      if (!msg || msg.from === selfIdRef.current) return
      const pc = pcRef.current
      try {
        if (msg.type === 'join') {
          // New peer joined; ask them to initiate offer
          channel.postMessage({ type: 'init', to: msg.from, from: selfIdRef.current })
        } else if (msg.type === 'init' && msg.to === selfIdRef.current) {
          const offer = await pc.createOffer()
          await pc.setLocalDescription(offer)
          channel.postMessage({ type: 'offer', sdp: offer, from: selfIdRef.current })
        } else if (msg.type === 'offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          channel.postMessage({ type: 'answer', sdp: answer, from: selfIdRef.current })
        } else if (msg.type === 'answer') {
          await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
        } else if (msg.type === 'ice' && msg.candidate) {
          try { await pc.addIceCandidate(new RTCIceCandidate(msg.candidate)) } catch {}
        }
      } catch (err) {
        console.error(err)
        push('Connection error', 'error')
        setStatus('Error')
      }
    }
    // announce presence
    channel.postMessage({ type: 'join', from: selfIdRef.current })
  }

  const endCall = () => {
    setInCall(false)
    setStatus('Ended')
    try { channelRef.current?.close() } catch {}
    channelRef.current = null
    try { pcRef.current?.close() } catch {}
    pcRef.current = null
    // Stop remote stream
    remoteStreamRef.current?.getTracks().forEach((t) => t.stop())
    remoteStreamRef.current = null
    // Stop local media and clear video elements
    try {
      const ls = localStreamRef.current
      ls?.getTracks().forEach((t) => t.stop())
    } catch {}
    localStreamRef.current = null
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
  }

  const toggleMic = () => {
    const tracks = localStreamRef.current?.getAudioTracks() || []
    const next = !micOn
    tracks.forEach((t) => (t.enabled = next))
    setMicOn(next)
  }

  const toggleCam = () => {
    const tracks = localStreamRef.current?.getVideoTracks() || []
    const next = !camOn
    tracks.forEach((t) => (t.enabled = next))
    setCamOn(next)
  }

  const shareLink = () => {
    const url = `${window.location.origin}/consult/${roomId}`
    navigator.clipboard.writeText(url).then(() => push('Link copied', 'success'))
  }

  return (
    <section className="page">
      <h2>Video Consultation</h2>
      <p className="help">Room: {roomId} • Status: {status}</p>
      <div className="actions-row">
        {!inCall ? (
          <>
            <button className="btn" onClick={joinRoom}>Join Room</button>
            <button className="btn secondary" onClick={shareLink}>Copy Invite Link</button>
            <button className="btn secondary" onClick={() => navigate('/consultations')}>Back</button>
          </>
        ) : (
          <>
            <button className="btn" onClick={toggleMic}>{micOn ? 'Mute' : 'Unmute'}</button>
            <button className="btn secondary" onClick={toggleCam}>{camOn ? 'Stop Camera' : 'Start Camera'}</button>
            <button className="btn" onClick={endCall}>End Call</button>
          </>
        )}
      </div>
      <div className="video-grid">
        <div className="video-tile">
          <video ref={localVideoRef} autoPlay playsInline muted />
          <div className="meta">You</div>
        </div>
        <div className="video-tile">
          <video ref={remoteVideoRef} autoPlay playsInline />
          <div className="meta">Remote</div>
        </div>
      </div>
    </section>
  )
}