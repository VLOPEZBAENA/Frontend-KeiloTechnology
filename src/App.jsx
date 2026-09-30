import { useCallback, useEffect, useState } from 'react'
import { EmpleadoForm } from './components/EmpleadoForm.jsx'
import { EmpleadoTable } from './components/EmpleadoTable.jsx'
import {
  actualizarEmpleado,
  crearEmpleado,
  eliminarEmpleado,
  obtenerEmpleados,
} from './services/empleadoService.js'
import './App.css'

function getEmployees(response) {
  if (Array.isArray(response)) return response
  return response?.empleados ?? response?.data ?? []
}

function App() {
  const [empleados, setEmpleados] = useState([])
  const [empleadoEditando, setEmpleadoEditando] = useState(null)
  const [versionFormulario, setVersionFormulario] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const cargarEmpleados = useCallback(async () => {
    try {
      const response = await obtenerEmpleados()
      setEmpleados(getEmployees(response))
    } catch (requestError) {
      setError(requestError.message || 'No fue posible cargar los empleados.')
    } finally {
      setCargando(false)
    }
  }, [])

  function actualizarEmpleados() {
    setCargando(true)
    setError('')
    cargarEmpleados()
  }

  useEffect(() => {
    let activa = true
    obtenerEmpleados()
      .then((response) => {
        if (activa) setEmpleados(getEmployees(response))
      })
      .catch((requestError) => {
        if (activa) setError(requestError.message || 'No fue posible cargar los empleados.')
      })
      .finally(() => {
        if (activa) setCargando(false)
      })

    return () => {
      activa = false
    }
  }, [])

  async function guardarEmpleado(datos) {
    setGuardando(true)
    setError('')
    setMensaje('')
    try {
      if (empleadoEditando) {
        await actualizarEmpleado(empleadoEditando._id ?? empleadoEditando.id, datos)
        setMensaje('Los datos del empleado se actualizaron.')
      } else {
        await crearEmpleado(datos)
        setVersionFormulario((version) => version + 1)
        setMensaje('El empleado se agregó correctamente.')
      }
      setEmpleadoEditando(null)
      await cargarEmpleados()
    } catch (requestError) {
      setError(requestError.message || 'No fue posible guardar el empleado.')
    } finally {
      setGuardando(false)
    }
  }

  async function borrarEmpleado(empleado) {
    const id = empleado._id ?? empleado.id
    const nombre = empleado.nombre || 'este empleado'
    if (!window.confirm(`¿Quieres eliminar a ${nombre}?`)) return

    setError('')
    setMensaje('')
    try {
      await eliminarEmpleado(id)
      setEmpleados((current) => current.filter((item) => (item._id ?? item.id) !== id))
      if ((empleadoEditando?._id ?? empleadoEditando?.id) === id) {
        setEmpleadoEditando(null)
      }
      setMensaje('El empleado se eliminó correctamente.')
    } catch (requestError) {
      setError(requestError.message || 'No fue posible eliminar el empleado.')
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="KeiloTechnology, inicio">
          <span className="brand-mark" aria-hidden="true">K</span>
          <span>Keilo<span className="brand-light">Technology</span></span>
        </a>
        <div className="topbar-meta">
          <span className="status-dot" aria-hidden="true" />
          <span>Panel de administración</span>
        </div>
      </header>

      <main className="main-content">
        <section className="page-heading" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">PERSONAS / EQUIPO</p>
            <h1 id="page-title">Gestión de empleados</h1>
            <p className="page-description">Administra el equipo que hace crecer tu tienda.</p>
          </div>
          <div className="team-count" aria-live="polite">
            <span className="count-number">{empleados.length.toString().padStart(2, '0')}</span>
            <span className="count-label">personas<br />en el equipo</span>
          </div>
        </section>

        {(error || mensaje) && (
          <div className={`notice ${error ? 'notice-error' : 'notice-success'}`} role="status">
            <span>{error || mensaje}</span>
            {error && <button type="button" className="notice-retry" onClick={actualizarEmpleados}>Reintentar</button>}
          </div>
        )}

        <div className="workspace-grid">
          <section className="form-panel" aria-labelledby="form-title">
            <div className="panel-heading">
              <div className="section-index">01</div>
              <div>
                <p className="eyebrow">FICHA DEL EQUIPO</p>
                <h2 id="form-title">{empleadoEditando ? 'Editar empleado' : 'Nuevo empleado'}</h2>
              </div>
            </div>
            <EmpleadoForm
              key={empleadoEditando?._id ?? empleadoEditando?.id ?? `nuevo-${versionFormulario}`}
              empleado={empleadoEditando}
              guardando={guardando}
              onSubmit={guardarEmpleado}
              onCancel={() => setEmpleadoEditando(null)}
            />
          </section>

          <section className="list-panel" aria-labelledby="list-title">
            <div className="list-heading">
              <div>
                <p className="eyebrow">DIRECTORIO</p>
                <h2 id="list-title">Equipo actual <span className="heading-count">{empleados.length}</span></h2>
              </div>
              <button type="button" className="refresh-button" onClick={actualizarEmpleados} disabled={cargando}>
                <span aria-hidden="true">↻</span> Actualizar
              </button>
            </div>
            <EmpleadoTable
              empleados={empleados}
              cargando={cargando}
              onEdit={setEmpleadoEditando}
              onDelete={borrarEmpleado}
            />
          </section>
        </div>
      </main>

      <footer className="page-footer">
        <span>KEILOTECHNOLOGY <span className="footer-separator">/</span> TALENTO</span>
        <span>Gestión interna</span>
      </footer>
    </div>
  )
}

export default App