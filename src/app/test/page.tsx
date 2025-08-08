// Página de prueba simple para aislar el problema
export default function TestPage() {
  const testProducts = [
    { id: '1', name: 'Producto Test 1', price: 100 },
    { id: '2', name: 'Producto Test 2', price: 200 },
    { id: '3', name: 'Producto Test 3', price: 300 }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">🧪 PÁGINA DE PRUEBA</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Test 1: HTML básico */}
        <div className="bg-green-500 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">✅ Test 1: HTML básico funciona</h2>
          <p>Si puedes ver este texto, Next.js está renderizando correctamente.</p>
        </div>

        {/* Test 2: JavaScript básico */}
        <div className="bg-blue-500 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">🔧 Test 2: JavaScript básico</h2>
          <p>Productos en array: {testProducts.length}</p>
          <p>Primer producto: {testProducts[0].name}</p>
        </div>

        {/* Test 3: Map simple */}
        <div className="bg-purple-500 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">🔄 Test 3: Map simple</h2>
          <ul className="space-y-2">
            {testProducts.map(product => (
              <li key={product.id} className="bg-purple-600 p-2 rounded">
                {product.name} - ${product.price}
              </li>
            ))}
          </ul>
        </div>

        {/* Test 4: Componente ProductGrid con datos simples */}
        <div className="bg-red-500 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">🎯 Test 4: ProductGrid con datos simples</h2>
          <div className="bg-red-600 p-4 rounded">
            <p>Aquí debería aparecer el ProductGrid:</p>
            {/* Comentado temporalmente para evitar errores
            <ProductGrid products={testProducts} />
            */}
            <p className="mt-2 text-yellow-200">ProductGrid comentado para evitar errores</p>
          </div>
        </div>

        {/* Test 5: Estado del servidor */}
        <div className="bg-orange-500 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">🖥️ Test 5: Estado del servidor</h2>
          <p>Timestamp: {new Date().toISOString()}</p>
          <p>Entorno: {process.env.NODE_ENV}</p>
        </div>
      </div>
    </div>
  );
}
