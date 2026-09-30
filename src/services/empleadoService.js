const API_URL = import.meta.env.VITE_API_URL || 'https://backend-tienda-online.vercel.app/api/empleados'

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  const responseText = await response.text()
  const data = responseText ? JSON.parse(responseText) : null

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Error ${response.status}: no se pudo completar la solicitud.`)
  }

  return data
}

export function obtenerEmpleados() {
  return request(API_URL)
}

export function crearEmpleado(empleado) {
  return request(API_URL, {
    method: 'POST',
    body: JSON.stringify(empleado),
  })
}

export function actualizarEmpleado(id, empleado) {
  return request(`${API_URL}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(empleado),
  })
}

export function eliminarEmpleado(id) {
  return request(`${API_URL}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}