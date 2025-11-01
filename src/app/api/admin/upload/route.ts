/**
 * Secure File Upload API for Admin
 * Handles file uploads with encryption and validation
 * Maximum file size: 1GB (1024MB)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { validateFileUpload, generateFileHash } from '@/lib/security'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const MAX_FILE_SIZE = 1024 * 1024 * 1024 // 1GB

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Strict admin authentication
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Check file size (1GB limit)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 1GB limit' },
        { status: 400 }
      )
    }

    // Validate file type and content
    const validation = validateFileUpload(file)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Additional security: Check file extension
    const allowedExtensions = ['.stl', '.obj', '.fbx', '.blend', '.zip']
    const fileExt = path.extname(file.name).toLowerCase()
    if (!allowedExtensions.includes(fileExt)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only STL, OBJ, FBX, BLEND, and ZIP files are allowed.' },
        { status: 400 }
      )
    }

    // Create upload directory if it doesn't exist
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Generate unique filename
    const uniqueId = uuidv4()
    const filename = `${uniqueId}${fileExt}`
    const filepath = path.join(UPLOAD_DIR, filename)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate file hash for integrity
    const fileHash = generateFileHash(buffer)

    // Write file to disk
    await writeFile(filepath, buffer)

    // Return file information
    return NextResponse.json({
      success: true,
      file: {
        name: filename,
        originalName: file.name,
        size: file.size,
        url: `/uploads/${filename}`,
        hash: fileHash,
      },
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'File upload failed' },
      { status: 500 }
    )
  }
}
