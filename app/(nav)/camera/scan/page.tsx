'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { useCameraStore } from '@/app/store/cameraStore'

type Point3 = {
  x: number
  y: number
  z: number
}

type MeasureStep = 'start' | 'end' | 'capture'

const formatDistance = (meters: number) => {
  if (meters < 1) {
    return `${(meters * 100).toFixed(1)} cm`
  }
  return `${meters.toFixed(2)} m`
}

const CameraPage = () => {
  const router = useRouter()
  const { setCapturedImage, setFishAnalysis, setIsLoading, setError } = useCameraStore()

  const [supportStatus, setSupportStatus] = useState<'checking' | 'supported' | 'unsupported'>('checking')
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [step, setStep] = useState<MeasureStep>('start')
  const [points, setPoints] = useState<Point3[]>([])
  const [distance, setDistance] = useState<number | null>(null)
  const [hasHit, setHasHit] = useState(false)
  const [arError, setArError] = useState('')

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  // WebXR API는 TypeScript 타입 정의가 없으므로 any 사용
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refSpaceRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hitTestSourceRef = useRef<any>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const reticleRef = useRef<THREE.Mesh | null>(null)
  const markersRef = useRef<THREE.Mesh[]>([])
  const lineRef = useRef<THREE.Line | null>(null)
  const currentHitRef = useRef<Point3 | null>(null)
  const hasHitRef = useRef(false)
  const hitSamplesRef = useRef<Point3[]>([])

  const cleanupScene = () => {
    const renderer = rendererRef.current
    if (renderer) {
      renderer.setAnimationLoop(null)
      renderer.dispose()
    }
    rendererRef.current = null

    const scene = sceneRef.current
    if (scene) {
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) {
          ;(obj as THREE.Mesh).geometry.dispose()
        }
        if ((obj as THREE.Mesh).material) {
          const material = (obj as THREE.Mesh).material
          if (Array.isArray(material)) {
            material.forEach((mat) => mat.dispose())
          } else {
            material.dispose()
          }
        }
      })
    }

    sceneRef.current = null
    cameraRef.current = null
    reticleRef.current = null
    markersRef.current = []
    lineRef.current = null
  }

  const startSession = useCallback(async () => {
    // WebXR API는 TypeScript 타입 정의가 없으므로 any 사용
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const xr = (navigator as any).xr
    if (!xr) {
      setSupportStatus('unsupported')
      return
    }

    try {
      const overlayRoot = overlayRef.current ?? document.body
      const session = await xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay', 'local-floor'],
        domOverlay: { root: overlayRoot },
      })

      sessionRef.current = session
      setIsSessionActive(true)
      setHasHit(false)
      setArError('')
      setPoints([])
      setStep('start')

      session.addEventListener('end', () => {
        setIsSessionActive(false)
        setHasHit(false)
        sessionRef.current = null
        refSpaceRef.current = null
        if (hitTestSourceRef.current) {
          hitTestSourceRef.current.cancel()
        }
        hitTestSourceRef.current = null
        currentHitRef.current = null
        hasHitRef.current = false
        cleanupScene()
      })

      const canvas = canvasRef.current
      if (!canvas) return

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      })
      renderer.xr.enabled = true
      renderer.setPixelRatio(window.devicePixelRatio || 1)
      renderer.setSize(window.innerWidth, window.innerHeight)
      rendererRef.current = renderer

      const scene = new THREE.Scene()
      sceneRef.current = scene

      const camera = new THREE.PerspectiveCamera()
      cameraRef.current = camera

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.1)
      hemiLight.position.set(0, 1, 0)
      scene.add(hemiLight)

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
      dirLight.position.set(1, 2, 1)
      scene.add(dirLight)

      const reticleGeo = new THREE.RingGeometry(0.05, 0.065, 32)
      const reticleMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.9,
        transparent: true,
      })
      const reticle = new THREE.Mesh(reticleGeo, reticleMat)
      reticle.rotation.x = -Math.PI / 2
      reticle.matrixAutoUpdate = false
      reticle.visible = false
      scene.add(reticle)
      reticleRef.current = reticle

      let refSpaceType: XRReferenceSpaceType = 'local'
      try {
        await session.requestReferenceSpace('local-floor')
        refSpaceType = 'local-floor'
      } catch {
        refSpaceType = 'local'
      }
      renderer.xr.setReferenceSpaceType(refSpaceType)
      await renderer.xr.setSession(session)

      const refSpace = await session.requestReferenceSpace(refSpaceType)
      const viewerSpace = await session.requestReferenceSpace('viewer')
      const hitTestSource = await session.requestHitTestSource({
        space: viewerSpace,
      })

      refSpaceRef.current = refSpace
      hitTestSourceRef.current = hitTestSource

        renderer.setAnimationLoop((_time, frame) => {
        if (!frame) return
        const hitTestResults = frame.getHitTestResults(hitTestSource)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let hitResult = null as any
        if (hitTestResults.length > 0) {
          hitResult = hitTestResults[0]
        }

        if (hitResult) {
          const hitPose = hitResult.getPose(refSpace)
          if (hitPose) {
            const { x, y, z } = hitPose.transform.position
            const sample = { x, y, z }
            hitSamplesRef.current.push(sample)
            if (hitSamplesRef.current.length > 8) {
              hitSamplesRef.current.shift()
            }
            const count = hitSamplesRef.current.length
            const averaged = hitSamplesRef.current.reduce(
              (acc, point) => {
                acc.x += point.x
                acc.y += point.y
                acc.z += point.z
                return acc
              },
              { x: 0, y: 0, z: 0 }
            )
            currentHitRef.current = {
              x: averaged.x / count,
              y: averaged.y / count,
              z: averaged.z / count,
            }
            reticle.matrix.fromArray(hitPose.transform.matrix)
            reticle.visible = true
            if (!hasHitRef.current) {
              hasHitRef.current = true
              setHasHit(true)
            }
          }
        } else {
          currentHitRef.current = null
          hitSamplesRef.current = []
          reticle.visible = false
          if (hasHitRef.current) {
            hasHitRef.current = false
            setHasHit(false)
          }
        }

        renderer.render(scene, camera)
      })
    } catch {
      setArError('AR 세션을 시작할 수 없습니다. 권한과 HTTPS를 확인하세요.')
      setIsSessionActive(false)
    }
  }, [])

  // WebXR 지원 확인
  useEffect(() => {
    // WebXR API는 TypeScript 타입 정의가 없으므로 any 사용
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const xr = (navigator as any).xr
    if (!xr || !xr.isSessionSupported) {
      setSupportStatus('unsupported')
      return
    }

    xr.isSessionSupported('immersive-ar')
      .then((supported: boolean) => {
        setSupportStatus(supported ? 'supported' : 'unsupported')
        if (supported) {
          // 지원되면 자동으로 세션 시작
          startSession()
        }
      })
      .catch(() => {
        setSupportStatus('unsupported')
      })
  }, [startSession])

  // 거리 계산
  useEffect(() => {
    if (points.length === 2) {
      const [a, b] = points
      const dx = a.x - b.x
      const dy = a.y - b.y
      const dz = a.z - b.z
      setDistance(Math.sqrt(dx * dx + dy * dy + dz * dz))
    } else {
      setDistance(null)
    }
  }, [points])

  // 마커 및 선 렌더링
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    // 기존 마커 제거
    markersRef.current.forEach((marker) => {
      scene.remove(marker)
      marker.geometry.dispose()
      if (Array.isArray(marker.material)) {
        marker.material.forEach((mat) => mat.dispose())
      } else {
        marker.material.dispose()
      }
    })
    markersRef.current = []

    // 새 마커 추가
    points.forEach((point, index) => {
      const geometry = new THREE.SphereGeometry(0.015, 20, 20)
      const material = new THREE.MeshStandardMaterial({
        color: index === 0 ? 0xFF6B6B : 0x4ECDC4,
      })
      const marker = new THREE.Mesh(geometry, material)
      marker.position.set(point.x, point.y, point.z)
      scene.add(marker)
      markersRef.current.push(marker)
    })

    // 기존 선 제거
    if (lineRef.current) {
      scene.remove(lineRef.current)
      lineRef.current.geometry.dispose()
      if (Array.isArray(lineRef.current.material)) {
        lineRef.current.material.forEach((mat) => mat.dispose())
      } else {
        lineRef.current.material.dispose()
      }
      lineRef.current = null
    }

    // 두 점이 있으면 선 추가
    if (points.length === 2) {
      const [a, b] = points
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(a.x, a.y, a.z),
        new THREE.Vector3(b.x, b.y, b.z),
      ])
      const material = new THREE.LineBasicMaterial({ color: 0xFFFFFF })
      const line = new THREE.Line(geometry, material)
      scene.add(line)
      lineRef.current = line
    }
  }, [points])

  const handleCapture = async (imageSrc: string, fishLength: number) => {
    try {
      // 실제 촬영한 이미지를 저장 (result 페이지 배경용)
      setCapturedImage(imageSrc)

      // 즉시 form 페이지로 이동
      router.push('/camera/form')

      // 목 데이터 사용 (API 토큰 절약)
      setIsLoading(true)
      console.log('Using mock data instead of API')
      console.log('Fish length:', fishLength ? `${fishLength.toFixed(1)} cm` : 'Not measured')

      // 목 데이터 설정 (약간의 지연으로 실제 API 호출처럼 보이게)
      setTimeout(() => {
        const mockData = {
          seafoodType: '고등어',
          marketPrice: 3850,
          estimatedWeight: 0.22,
          currentlyForbidden: false, // false: 정상, true: 금지체장
        }
        setFishAnalysis(mockData)
        setError(null)
        setIsLoading(false)
        console.log('Mock data loaded:', mockData)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다')
      console.error('Image loading failed:', err)
    }
  }

  // 동그라미 버튼 클릭 핸들러 (3단계 조작)
  const handleCircleButtonClick = () => {
    if (step === 'start') {
      // 시작점 추가
      const hit = currentHitRef.current
      if (!hit) {
        setArError('표면을 찾을 수 없습니다. 천천히 움직여주세요.')
        return
      }
      setArError('')
      setPoints([hit])
      setStep('end')
    } else if (step === 'end') {
      // 끝점 추가
      const hit = currentHitRef.current
      if (!hit) {
        setArError('표면을 찾을 수 없습니다. 천천히 움직여주세요.')
        return
      }
      setArError('')
      setPoints((prev) => [...prev, hit])
      setStep('capture')
    } else if (step === 'capture') {
      // 사진 촬영
      const canvas = canvasRef.current
      if (!canvas || !distance) return

      const imageSrc = canvas.toDataURL('image/jpeg', 1.0)
      const fishLengthCm = distance * 100
      handleCapture(imageSrc, fishLengthCm)
    }
  }

  const getStepInstruction = () => {
    if (step === 'start') {
      return '시작점을 선택하세요'
    } else if (step === 'end') {
      return '끝점을 선택하세요'
    } else {
      return '사진을 촬영하세요'
    }
  }

  if (supportStatus === 'unsupported') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        <div className="text-center p-6">
          <h2 className="text-24 font-bold mb-4">AR이 지원되지 않습니다</h2>
          <p className="text-16 text-gray-300">
            이 기기는 WebXR AR을 지원하지 않습니다.
            <br />
            최신 Android Chrome 브라우저를 사용해주세요.
          </p>
        </div>
      </div>
    )
  }

  if (!isSessionActive) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="text-center p-6">
          <h2 className="text-28 font-bold mb-6">AR 거리 측정</h2>
          <p className="text-16 mb-8 text-white/80">
            물고기의 시작점과 끝점을 찍어
            <br />
            길이를 측정하세요
          </p>
          <p className="text-14 text-white/60 mb-4">
            {supportStatus === 'checking' ? 'AR 지원 확인 중...' : 'AR 세션 시작 중...'}
          </p>
          {arError && (
            <div className="mt-4 text-red-300 text-14">{arError}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0" ref={overlayRef}>
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* AR HUD */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 상단 정보 */}
        <div className="absolute top-8 left-0 right-0 flex flex-col items-center gap-2">
          <div className="bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full">
            <p className="text-white font-bold text-16">
              {getStepInstruction()}
            </p>
          </div>
          {!hasHit && (
            <div className="bg-yellow-500/90 backdrop-blur-sm px-6 py-2 rounded-full">
              <p className="text-black font-medium text-14">
                표면을 찾는 중...
              </p>
            </div>
          )}
        </div>

        {/* 중앙 거리 표시 */}
        {distance !== null && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-blue-600/90 backdrop-blur-sm px-8 py-4 rounded-2xl">
              <p className="text-white font-bold text-32">{formatDistance(distance)}</p>
            </div>
          </div>
        )}

        {/* 하단 동그라미 버튼 */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4 pointer-events-auto">
          <button
            onClick={handleCircleButtonClick}
            disabled={step !== 'capture' && !hasHit}
            className="w-20 h-20 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed z-10"
            aria-label={step === 'capture' ? '사진 촬영' : '점 추가'}
          />
          {arError && (
            <div className="bg-red-500/90 backdrop-blur-sm px-6 py-2 rounded-full">
              <p className="text-white font-medium text-14">{arError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CameraPage
