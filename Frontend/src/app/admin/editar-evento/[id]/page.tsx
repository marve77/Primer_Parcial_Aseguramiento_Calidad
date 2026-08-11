'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_URL, fetchWithAuth } from '../../../../lib/api';
import { UploadCloud, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditarEventoPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Noticia');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/events/${eventId}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title || '');
          setDescription(data.description || '');
          setDate(data.date || '');
          setLocation(data.location || '');
          setCategory(data.category || 'Noticia');
          if (data.imageUrl) {
            setPreview(data.imageUrl);
          }
        } else {
          setError('No se pudo cargar el evento.');
        }
      } catch (err) {
        setError('Error al conectar con el servidor.');
      } finally {
        setFetching(false);
      }
    };
    
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date);
      formData.append('location', location);
      formData.append('category', category);
      
      if (file) {
        formData.append('image', file);
      }

      const res = await fetchWithAuth(`/events/${eventId}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        const errData = await res.json();
        setError(errData.message || 'Ocurrió un error al actualizar el evento.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-green-100 flex flex-col items-center">
          <CheckCircle className="text-green-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Evento Actualizado!</h2>
          <p className="text-gray-600">Redirigiendo al muro de noticias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-6 flex items-center">
          <Link href="/dashboard" className="text-gray-500 hover:text-[#003b5c] transition-colors flex items-center text-sm font-medium">
            <ArrowLeft size={16} className="mr-1" />
            Volver al Muro
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#003b5c] px-6 py-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-white font-inter">Editar Publicación</h1>
          </div>
          
          {fetching ? (
            <div className="p-8 text-center text-gray-500">Cargando datos del evento...</div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="title"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="shadow-sm focus:ring-[#003b5c] focus:border-[#003b5c] block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción Corta</label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="shadow-sm focus:ring-[#003b5c] focus:border-[#003b5c] block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
                  <div className="mt-1">
                    <input
                      type="datetime-local"
                      id="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="shadow-sm focus:ring-[#003b5c] focus:border-[#003b5c] block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                  <div className="mt-1">
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="shadow-sm focus:ring-[#003b5c] focus:border-[#003b5c] block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    >
                      <option value="Noticia">Noticia (Anuncio)</option>
                      <option value="Actividad">Actividad (Presencial/Virtual)</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ubicación</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="location"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="shadow-sm focus:ring-[#003b5c] focus:border-[#003b5c] block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    />
                  </div>
                </div>

                {/* Subida de Imagen */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Afiche Multimeda (Opcional)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="space-y-1 text-center">
                      {preview ? (
                        <div className="flex flex-col items-center">
                          <img src={preview} alt="Vista previa" className="h-40 object-contain mb-4 rounded-md shadow-sm" />
                          <button 
                            type="button" 
                            onClick={() => { setFile(null); setPreview(null); }}
                            className="text-xs text-red-600 hover:text-red-800 font-medium"
                          >
                            Quitar imagen / Reemplazar
                          </button>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600 justify-center">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-[#003b5c] hover:text-[#002f4a] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#003b5c] px-2 py-1"
                            >
                              <span>Subir nueva imagen</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF hasta 5MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-gray-100 mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#003b5c] hover:bg-[#002f4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003b5c] disabled:opacity-70 transition-colors"
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
