"use client";

import React, { useState } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/features/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from '@/components/icons/Icons';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactoPage() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Contacto' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form
    setForm({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const contactInfo = [
    {
      title: 'Teléfono',
      content: '+505 7000-0000',
      href: 'tel:+50570000000'
    },
    {
      title: 'WhatsApp',
      content: '+505 7000-0000',
      href: 'https://wa.me/50570000000'
    },
    {
      title: 'Email',
      content: 'info@gruporosso.com',
      href: 'mailto:info@gruporosso.com'
    },
    {
      title: 'Dirección',
      content: 'Managua, Nicaragua',
      href: '#'
    }
  ];
  
  const businessHours = [
    { day: 'Lunes - Viernes', hours: '8:00 AM - 6:00 PM' },
    { day: 'Sábados', hours: '8:00 AM - 4:00 PM' },
    { day: 'Domingos', hours: 'Cerrado' }
  ];

  return (
    <div className="min-h-screen bg-anthracite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white-soft mb-4">
            Contáctanos
          </h1>
          <p className="text-xl text-gray-neutral max-w-3xl mx-auto leading-relaxed">
            Estamos aquí para ayudarte a encontrar los mejores accesorios para tu vehículo. 
            Contáctanos y nuestros expertos te asesorarán.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Enviar Mensaje</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
                      <span className="text-white text-2xl">✓</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white-soft mb-2">
                      ¡Mensaje enviado con éxito!
                    </h3>
                    <p className="text-gray-neutral mb-4">
                      Gracias por contactarnos. Te responderemos en un plazo de 24 horas.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="secondary">
                      Enviar otro mensaje
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-neutral mb-2">
                          Nombre *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-neutral mb-2">
                          Teléfono
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleInputChange}
                          placeholder="Tu número de teléfono"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-neutral mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleInputChange}
                        required
                        placeholder="tu@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-neutral mb-2">
                        Asunto *
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white-soft focus:border-rosso focus:outline-none transition-colors duration-200"
                      >
                        <option value="">Selecciona un asunto</option>
                        <option value="consulta-producto">Consulta sobre producto</option>
                        <option value="cotizacion">Solicitar cotización</option>
                        <option value="instalacion">Servicios de instalación</option>
                        <option value="garantia">Garantía y soporte</option>
                        <option value="distribucion">Oportunidades de distribución</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-neutral mb-2">
                        Mensaje *
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        placeholder="Describe tu consulta o solicitud..."
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white-soft placeholder:text-gray-400 focus:border-rosso focus:outline-none transition-colors duration-200 resize-vertical"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        'Enviar Mensaje'
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-white-soft mb-1">{info.title}</h4>
                    {info.href !== '#' ? (
                      <a
                        href={info.href}
                        className="text-gray-neutral hover:text-rosso transition-colors duration-200"
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {info.content}
                      </a>
                    ) : (
                      <span className="text-gray-neutral">{info.content}</span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Horarios de Atención</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {businessHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-neutral">{schedule.day}</span>
                    <span className="text-white-soft font-medium">{schedule.hours}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Síguenos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com/gruporosso"
                    className="text-gray-neutral hover:text-rosso transition-colors duration-200"
                    aria-label="Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FacebookIcon size={24} />
                  </a>
                  <a
                    href="https://instagram.com/gruporosso"
                    className="text-gray-neutral hover:text-rosso transition-colors duration-200"
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramIcon size={24} />
                  </a>
                  <a
                    href="https://wa.me/50570000000"
                    className="text-gray-neutral hover:text-rosso transition-colors duration-200"
                    aria-label="WhatsApp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon size={24} />
                  </a>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Contact */}
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-white-soft mb-4">
                  ¿Necesitas ayuda inmediata?
                </h3>
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <a href="https://wa.me/50570000000" target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon size={20} className="mr-2" />
                      Escribir por WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="secondary" className="w-full">
                    <a href="tel:+50570000000">
                      Llamar Ahora
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}