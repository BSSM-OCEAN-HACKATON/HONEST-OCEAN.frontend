'use client'

import React, { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'

interface WebCamCameraProps {
  onCapture?: (imageSrc: string) => void
}

const WebCamCamera = ({ onCapture }: WebCamCameraProps) => {
  const webcamRef = useRef<Webcam>(null)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')

  const capture = useCallback(() => {
    const video = webcamRef.current?.video
    if (!video) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return

    // 비디오의 원본 해상도로 canvas 설정
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // 비디오를 canvas에 그리기
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // 고화질 JPEG로 변환 (품질 0.95)
    const imageSrc = canvas.toDataURL('image/jpeg', 0.95)
    setImgSrc(imageSrc)
    
    // 콜백 호출
    if (onCapture) {
      onCapture(imageSrc)
    }
  }, [webcamRef, onCapture])

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }

  const retake = () => {
    setImgSrc(null)
  }

  const videoConstraints = {
    facingMode: facingMode,
  }

  return (
    <div className="fixed inset-0 w-full h-full">
        <div className="relative w-full h-full">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="absolute inset-0 w-full h-full object-cover"
                />
          {/* 원형 촬영 버튼 오버레이 */}
          <button
            onClick={capture}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors z-10"
            aria-label="사진 촬영"
          />
          {/* 카메라 전환 버튼 */}
          <button
            onClick={switchCamera}
            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
            aria-label="카메라 전환"
          />
        </div>
    </div>
  )
}

export default WebCamCamera

