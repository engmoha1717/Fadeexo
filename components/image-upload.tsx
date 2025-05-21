"use client"

import React, { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, X, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string
  onChange: (url: string | undefined, storageId: string | undefined) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState<string | undefined>(value)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return 
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    // Create preview immediately
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)

    setUploading(true)
    try {
      // Step 1: Get upload URL from Convex
      const uploadUrl = await generateUploadUrl()
      
      // Step 2: Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!result.ok) {
        throw new Error('Upload failed')
      }

      const { storageId } = await result.json()
      
      // Step 3: Call onChange with ONLY the storageId, clear imageUrl
      onChange(undefined, storageId)
      
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl)
      
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
      // Reset preview on error
      setPreview(value)
      URL.revokeObjectURL(previewUrl)
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleRemove = () => {
    onChange(undefined, undefined)
    setPreview(undefined)
  }

  // Update preview when value changes (for editing existing articles)
  React.useEffect(() => {
    setPreview(value)
  }, [value])

  return (
    <div className={cn('space-y-4', className)}>
      <Label>Article Image</Label>
      
      {(preview || value) ? (
        <div className="relative">
          <img
            src={preview || value}
            alt="Upload preview"
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => {
              // Handle broken image
              console.log('Image failed to load:', preview || value)
              setPreview(undefined)
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            'border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors',
            dragOver && 'border-blue-500 bg-blue-50',
            'hover:border-gray-400'
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            disabled={uploading}
          />
          
          <div className="space-y-2">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}