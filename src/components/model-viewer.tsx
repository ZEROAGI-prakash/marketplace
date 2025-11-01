"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Stage, Grid, Environment } from "@react-three/drei"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"
import * as THREE from "three"

function STLModel({ url }: { url: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const geometry = useLoader(STLLoader, url)

  // Center the geometry
  geometry.center()
  geometry.computeVertexNormals()

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#3b82f6"
        metalness={0.5}
        roughness={0.3}
      />
    </mesh>
  )
}

function Loader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

interface ModelViewerProps {
  modelUrl: string
  className?: string
}

export function ModelViewer({ modelUrl, className = "" }: ModelViewerProps) {
  return (
    <div className={`h-[500px] w-full rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 100], fov: 50 }}
        shadows
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Stage
            intensity={0.5}
            environment="city"
            shadows={{
              type: "contact",
              opacity: 0.4,
              blur: 1.5,
            }}
            adjustCamera={1.5}
          >
            <STLModel url={modelUrl} />
          </Stage>
          <Environment preset="city" />
          <Grid
            args={[200, 200]}
            position={[0, -50, 0]}
            cellSize={10}
            cellThickness={0.5}
            cellColor="#6366f1"
            sectionSize={50}
            sectionThickness={1}
            sectionColor="#8b5cf6"
            fadeDistance={400}
            fadeStrength={1}
            infiniteGrid
          />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

interface SimpleModelViewerProps {
  imageUrl: string
  alt: string
  className?: string
}

export function SimpleModelViewer({ imageUrl, alt, className = "" }: SimpleModelViewerProps) {
  return (
    <div className={`relative h-[500px] w-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 ${className}`}>
      <img
        src={imageUrl}
        alt={alt}
        className="h-full w-full object-contain"
      />
      <div className="absolute bottom-4 right-4 rounded-md bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
        Click and drag to rotate • Scroll to zoom
      </div>
    </div>
  )
}
