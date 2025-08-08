"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { XIcon } from '@/components/icons/Icons';
import { Button } from '@/components/ui/Button';

interface ProductGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ProductGallery({ images, alt, className }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = () => setIsLightboxOpen(true);
  const closeLightbox = () => setIsLightboxOpen(false);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Si no hay imágenes, usar placeholder
  const displayImages = images.length > 0 ? images : ['/images/placeholder-product.jpg'];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group cursor-zoom-in">
        <Image
          src={displayImages[selectedImage]}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onClick={openLightbox}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        
        {/* Zoom indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
            Click para ampliar
          </div>
        </div>
      </div>
      
      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                'relative aspect-square bg-gray-800 rounded overflow-hidden transition-all duration-200',
                selectedImage === index
                  ? 'ring-2 ring-rosso'
                  : 'hover:ring-2 hover:ring-gray-400'
              )}
            >
              <Image
                src={image}
                alt={`${alt} - imagen ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12.5vw"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white hover:text-rosso bg-black/50 hover:bg-black/70"
              aria-label="Cerrar"
            >
              <XIcon size={24} />
            </Button>
            
            {/* Navigation buttons */}
            {displayImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-rosso bg-black/50 hover:bg-black/70"
                  aria-label="Imagen anterior"
                >
                  ←
                </Button>
                <Button
                  variant="ghost"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-rosso bg-black/50 hover:bg-black/70"
                  aria-label="Siguiente imagen"
                >
                  →
                </Button>
              </>
            )}
            
            {/* Image */}
            <div className="relative w-full h-full max-w-3xl max-h-[80vh]">
              <Image
                src={displayImages[selectedImage]}
                alt={alt}
                width={800}
                height={800}
                className="object-contain w-full h-full"
                sizes="80vw"
              />
            </div>
            
            {/* Image counter */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded text-sm">
                {selectedImage + 1} de {displayImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}