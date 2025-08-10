"use client";

import React, { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('💥 Admin Segment Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-lg w-full rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-red-600">Se produjo un error en Admin</h1>
        <p className="mt-2 text-sm text-gray-600">{error.message}</p>
        {error?.digest && (
          <p className="mt-1 text-xs text-gray-500">Ref: {error.digest}</p>
        )}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => reset()}
            className="px-3 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Reintentar
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-2 rounded bg-gray-200 text-sm hover:bg-gray-300"
          >
            Recargar página
          </button>
        </div>
      </div>
    </div>
  );
}
