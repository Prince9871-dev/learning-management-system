import { useState, useRef, useEffect } from 'react'
import './VideoPlayer.css'

const VideoPlayer = ({ videoUrl, title, onProgress }) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => {
      setCurrentTime(video.currentTime)
      if (onProgress) {
        onProgress(video.currentTime, video.duration)
      }
    }

    const updateDuration = () => {
      setDuration(video.duration)
    }

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [onProgress])

  const togglePlay = () => {
    const video = videoRef.current
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const handleSeek = (e) => {
    const video = videoRef.current
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * video.duration
  }

  const handleVolumeChange = (e) => {
    const video = videoRef.current
    const newVolume = parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="video-player">
      <div className="video-player-container">
        {videoUrl && videoUrl.includes('youtube.com/embed') ? (
          <iframe
            src={videoUrl}
            className="video-player-video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', minHeight: '400px' }}
          />
        ) : (
          <video
            ref={videoRef}
            src={videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
            className="video-player-video"
            onClick={togglePlay}
          />
        )}
        <div className="video-player-controls">
          <button onClick={togglePlay} className="video-player-button">
            {isPlaying ? '⏸' : '▶'}
          </button>
          <div className="video-player-progress-container" onClick={handleSeek}>
            <div
              className="video-player-progress-bar"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="video-player-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <div className="video-player-volume">
            <span>🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
      {title && <h3 className="video-player-title">{title}</h3>}
    </div>
  )
}

export default VideoPlayer

