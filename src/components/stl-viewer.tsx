/**
 * STL 3D Model Viewer Component
 * Uses Three.js to render STL files with orbit controls
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { Button } from '@/components/ui/button'
import { RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

interface STLViewerProps {
  modelUrl: string
  width?: number
  height?: number
  className?: string
}

export function STLViewer({ modelUrl, width = 600, height = 400, className = '' }: STLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    controls: OrbitControls
    mesh: THREE.Mesh | null
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a1a)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    camera.position.set(0, 0, 100)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = true
    controls.autoRotate = true
    controls.autoRotateSpeed = 2

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight1.position.set(1, 1, 1)
    scene.add(directionalLight1)

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight2.position.set(-1, -1, -1)
    scene.add(directionalLight2)

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      mesh: null,
    }

    // Load STL model
    const loader = new STLLoader()
    loader.load(
      modelUrl,
      (geometry) => {
        // Center geometry
        geometry.center()

        // Calculate bounding box to auto-scale
        geometry.computeBoundingBox()
        const boundingBox = geometry.boundingBox!
        const size = new THREE.Vector3()
        boundingBox.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 50 / maxDim // Scale to fit in view
        
        // Create material
        const material = new THREE.MeshPhongMaterial({
          color: 0x00aaff,
          specular: 0x111111,
          shininess: 200,
          flatShading: false,
        })

        // Create mesh
        const mesh = new THREE.Mesh(geometry, material)
        mesh.scale.set(scale, scale, scale)
        mesh.rotation.x = -Math.PI / 2 // Rotate to upright
        
        scene.add(mesh)
        
        if (sceneRef.current) {
          sceneRef.current.mesh = mesh
        }

        setLoading(false)
      },
      (progress) => {
        // Loading progress
        console.log('Loading:', (progress.loaded / progress.total) * 100 + '%')
      },
      (error) => {
        console.error('Error loading STL:', error)
        setError('Failed to load 3D model')
        setLoading(false)
      }
    )

    // Animation loop
    function animate() {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      renderer.dispose()
      controls.dispose()
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [modelUrl, width, height])

  const handleReset = () => {
    if (sceneRef.current) {
      sceneRef.current.camera.position.set(0, 0, 100)
      sceneRef.current.controls.reset()
    }
  }

  const handleZoomIn = () => {
    if (sceneRef.current) {
      sceneRef.current.camera.position.multiplyScalar(0.8)
    }
  }

  const handleZoomOut = () => {
    if (sceneRef.current) {
      sceneRef.current.camera.position.multiplyScalar(1.2)
    }
  }

  const handleToggleAutoRotate = () => {
    if (sceneRef.current) {
      sceneRef.current.controls.autoRotate = !sceneRef.current.controls.autoRotate
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="rounded-lg overflow-hidden" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading 3D model...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="text-white text-center p-4">
            <p className="text-red-400">{error}</p>
            <p className="text-sm mt-2">Preview not available</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={handleReset}
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={handleToggleAutoRotate}
            title="Toggle Auto Rotate"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
