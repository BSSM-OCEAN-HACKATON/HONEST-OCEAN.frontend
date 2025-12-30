import type { Metadata } from 'next'
import WebCamCamera from '@/app/components/ui/camera/WebCamCamera'

export const metadata: Metadata = {
  title: 'Camera Scan',
  description: 'Scan items with camera',
}

const CameraPage = () => {
  return <WebCamCamera />
}

export default CameraPage
