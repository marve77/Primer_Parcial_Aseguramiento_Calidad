'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User, LogIn, LogOut, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const checkAuth = () => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkAuth();
    // Escuchar el evento personalizado lanzado desde el login
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <nav className="bg-[#003b5c] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y Titulo (Mobile-First y Responsive) */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-bold text-xl sm:text-2xl tracking-tight">
              <span className="italic text-white font-inter">UMG</span> Campus Huehue
            </Link>
          </div>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="hover:text-gray-200 transition-colors">
              Noticias
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link href="/admin/crear-evento" className="flex items-center space-x-1 hover:text-gray-200 transition-colors text-green-300">
                  <PlusCircle size={18} />
                  <span>Crear Evento</span>
                </Link>
                <div onClick={handleLogout} className="flex items-center space-x-2 bg-red-600/80 px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors cursor-pointer">
                  <LogOut size={20} />
                  <span className="text-sm font-medium">Salir</span>
                </div>
              </>
            ) : (
              <Link href="/login" className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer">
                <LogIn size={20} />
                <span className="text-sm font-medium">Iniciar Sesión</span>
              </Link>
            )}
          </div>

          {/* Botón Menú Mobile */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-white/10 focus:outline-none"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Mobile Desplegable */}
      {isOpen && (
        <div className="md:hidden bg-[#002f4a]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              Noticias
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link
                  href="/admin/crear-evento"
                  className="block px-3 py-2 rounded-md text-base font-medium text-green-300 hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  Crear Evento
                </Link>
                <div onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-white/10 mt-4 border-t border-white/10">
                  <LogOut size={20} />
                  <span>Cerrar Sesión</span>
                </div>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 mt-4 border-t border-white/10">
                <LogIn size={20} />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
