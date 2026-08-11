'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Tag, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchWithAuth } from '../../lib/api';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  category: string;
}

export default function EventCard({
  id,
  title,
  description,
  date,
  location,
  imageUrl,
  category,
}: EventCardProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAdmin(!!token);
  }, []);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) return;
    setIsDeleting(true);
    try {
      const res = await fetchWithAuth(`/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Error al eliminar el evento.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de red al eliminar el evento.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 w-full max-w-xl mx-auto">
      {/* Afiche Multimedia (RF09) */}
      {imageUrl && (
        <div className="relative w-full h-48 sm:h-64 bg-gray-100">
          <Image
            src={imageUrl}
            alt={`Afiche de ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {/* Etiqueta de Categoría y Botón Editar */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#e6f0ff] text-[#003b5c]">
              <Tag size={12} className="mr-1" />
              {category}
            </span>
            {isAdmin && (
              <>
                <Link href={`/admin/editar-evento/${id}`} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors">
                  <Edit size={12} className="mr-1" />
                  Editar
                </Link>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={12} className="mr-1" />
                  Eliminar
                </button>
              </>
            )}
          </div>
          <span className="text-xs text-gray-500 font-medium">{date}</span>
        </div>

        {/* Título y Descripción */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 font-inter leading-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
          {description}
        </p>

        {/* Detalles e Info (Ubicación) */}
        <div className="flex items-center text-sm text-gray-500 mt-auto pt-4 border-t border-gray-50">
          <MapPin size={16} className="mr-1.5 text-gray-400" />
          <span className="truncate">{location}</span>
        </div>
      </div>
    </article>
  );
}
