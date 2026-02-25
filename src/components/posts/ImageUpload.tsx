"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
    onImageSelect: (file: File) => void
    currentImage?: string
}

export function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (file) {
            onImageSelect(file)
            const reader = new FileReader()
            reader.onload = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }, [onImageSelect])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    })

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden",
                isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-white/20",
                preview ? "aspect-video" : "h-32"
            )}
        >
            <input {...getInputProps()} />

            {preview ? (
                <>
                    <img src={preview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-semibold">Alterar imagem</p>
                    </div>
                </>
            ) : (
                <div className="text-center px-4">
                    <Upload className="mx-auto text-neutral mb-2" size={24} />
                    <p className="text-xs text-neutral font-medium">
                        <span className="text-white">Arraste a imagem</span> ou clique para enviar
                    </p>
                    <p className="text-[10px] text-neutral/50 mt-1">PNG, JPG ou WEBP (Max. 5MB)</p>
                </div>
            )}
        </div>
    )
}
