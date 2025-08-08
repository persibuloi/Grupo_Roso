"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { SearchIcon, ShoppingCartIcon, MenuIcon, XIcon, ChevronDownIcon } from '@/components/icons/Icons';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Catálogo',
    href: '/catalogo',
    children: [
      { label: 'Accesorios de Interior', href: '/categoria/accesorios-interior' },
      { label: 'Accesorios de Exterior', href: '/categoria/accesorios-exterior' },
      { label: 'Electrónicos', href: '/categoria/electronicos' },
      { label: 'Performance', href: '/categoria/performance' },
    ]
  },
  {
    label: 'Marcas',
    href: '/marcas',
    children: [
      { label: 'K&N', href: '/marca/kn' },
      { label: 'Borla', href: '/marca/borla' },
      { label: 'WeatherTech', href: '/marca/weathertech' },
      { label: 'Pioneer', href: '/marca/pioneer' },
    ]
  },
  { label: 'Sobre Nosotros', href: '/sobre' },
  { label: 'Contacto', href: '/contacto' }
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { cart } = useCartStore();

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav className="sticky top-0 z-50 bg-anthracite border-b border-gray-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-2xl font-bold text-white-soft hover:text-rosso transition-colors duration-200"
            >
              Grupo Rosso
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  <Link
                    href={item.href}
                    className={cn(
                      'px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-rosso',
                      pathname === item.href 
                        ? 'text-rosso' 
                        : 'text-white-soft'
                    )}
                    onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  >
                    <span className="flex items-center">
                      {item.label}
                      {item.children && (
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                      )}
                    </span>
                  </Link>
                  
                  {/* Mega Menu */}
                  {item.children && activeDropdown === item.label && (
                    <div 
                      className="absolute top-full left-0 mt-1 w-64 bg-anthracite border border-gray-dark rounded-md shadow-lg py-2 z-50"
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-white-soft hover:text-rosso hover:bg-gray-dark/50 transition-colors duration-200"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/busqueda"
              className="p-2 text-white-soft hover:text-rosso transition-colors duration-200"
              aria-label="Buscar"
            >
              <SearchIcon size={20} />
            </Link>
            
            <Link
              href="/carrito"
              className="relative p-2 text-white-soft hover:text-rosso transition-colors duration-200"
              aria-label="Carrito de compras"
            >
              <ShoppingCartIcon size={20} />
              {cart.itemCount > 0 && (
                <Badge 
                  variant="rosso" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cart.itemCount}
                </Badge>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              href="/busqueda"
              className="p-2 text-white-soft hover:text-rosso transition-colors duration-200"
              aria-label="Buscar"
            >
              <SearchIcon size={20} />
            </Link>
            
            <Link
              href="/carrito"
              className="relative p-2 text-white-soft hover:text-rosso transition-colors duration-200"
              aria-label="Carrito de compras"
            >
              <ShoppingCartIcon size={20} />
              {cart.itemCount > 0 && (
                <Badge 
                  variant="rosso" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cart.itemCount}
                </Badge>
              )}
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white-soft hover:text-rosso"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-anthracite border-t border-gray-dark">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    className={cn(
                      'block px-3 py-2 text-base font-medium transition-colors duration-200',
                      pathname === item.href 
                        ? 'text-rosso' 
                        : 'text-white-soft hover:text-rosso'
                    )}
                    onClick={!item.children ? closeMobileMenu : undefined}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDropdownToggle(item.label)}
                      className="text-white-soft hover:text-rosso"
                    >
                      <ChevronDownIcon 
                        size={16} 
                        className={cn(
                          'transition-transform duration-200',
                          activeDropdown === item.label && 'rotate-180'
                        )}
                      />
                    </Button>
                  )}
                </div>
                
                {item.children && activeDropdown === item.label && (
                  <div className="ml-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-3 py-2 text-sm text-gray-neutral hover:text-rosso transition-colors duration-200"
                        onClick={closeMobileMenu}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}