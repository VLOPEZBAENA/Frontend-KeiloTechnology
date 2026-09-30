import { useState } from 'react'

const emptyForm = { nombre: '', email: '', cargo: '', salario: '' }

export function EmpleadoForm({ empleado, guardando, onSubmit, onCancel }) {
  const [formulario, setFormulario] = useState(() => empleado ? {
    nombre: empleado.nombre ?? '',
    email: empleado.email ?? '',
    cargo: empleado.cargo ?? '',
    salario: empleado.salario ?? '',
  } : emptyForm)

  function actualizarCampo(event) {
    const { name, value } = event.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
  }

  function enviarFormulario(event) {
    event.preventDefault()
    onSubmit({ ...formulario, salario: Number(formulario.salario) })
  }

  return (
    <form className="employee-form" onSubmit={enviarFormulario}>
      <label className="field-group">
        <span>Nombre completo</span>
        <input
          name="nombre"
          type="text"
          autoComplete="name"
          placeholder="Ej. Ana García"
          value={formulario.nombre}
          onChange={actualizarCampo}
          required
        />
      </label>
      <label className="field-group">
        <span>Correo electrónico</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ana@keilotechnology.com"
          value={formulario.email}
          onChange={actualizarCampo}
          required
        />
      </label>
      <label className="field-group">
        <span>Cargo</span>
        <input
          name="cargo"
          type="text"
          placeholder="Ej. Asesora de ventas"
          value={formulario.cargo}
          onChange={actualizarCampo}
          required
        />
      </label>
      <label className="field-group">
        <span>Salario mensual</span>
        <div className="salary-input">
          <span aria-hidden="true">$</span>
          <input
            name="salario"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={formulario.salario}
            onChange={actualizarCampo}
            required
          />
          <span className="currency-code">COP</span>
        </div>
      </label>
      <div className="form-actions">
        {empleado && (
          <button type="button" className="button button-secondary" onClick={onCancel} disabled={guardando}>
            Cancelar
          </button>
        )}
        <button type="submit" className="button button-primary" disabled={guardando}>
          {guardando ? 'Guardando…' : empleado ? 'Guardar cambios' : 'Agregar empleado'}
        </button>
      </div>
    </form>
  )
}