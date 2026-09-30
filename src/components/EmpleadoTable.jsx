const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

function formatSalary(salario) {
  const amount = Number(salario)
  return Number.isFinite(amount) ? currencyFormatter.format(amount) : '—'
}

export function EmpleadoTable({ empleados, cargando, onEdit, onDelete }) {
  if (cargando && empleados.length === 0) {
    return <div className="table-message">Cargando directorio…</div>
  }

  if (!cargando && empleados.length === 0) {
    return (
      <div className="table-message empty-message">
        <span className="empty-mark" aria-hidden="true">+</span>
        <strong>Aún no hay empleados</strong>
        <span>Agrega la primera persona desde el formulario.</span>
      </div>
    )
  }

  return (
    <div className="table-scroll">
      <table className="employee-table">
        <thead>
          <tr>
            <th scope="col">Empleado</th>
            <th scope="col">Cargo</th>
            <th scope="col">Salario mensual</th>
            <th scope="col"><span className="visually-hidden">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado, index) => (
            <tr key={empleado._id ?? empleado.id ?? `${empleado.email}-${index}`}>
              <td>
                <div className="employee-cell">
                  <span className="avatar" aria-hidden="true">
                    {(empleado.nombre || '?').trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="employee-identity">
                    <strong>{empleado.nombre || 'Sin nombre'}</strong>
                    <span>{empleado.email || 'Sin correo'}</span>
                  </span>
                </div>
              </td>
              <td><span className="role-label">{empleado.cargo || 'Sin cargo'}</span></td>
              <td className="salary-cell">{formatSalary(empleado.salario)}</td>
              <td>
                <div className="row-actions">
                  <button type="button" className="text-action" onClick={() => onEdit(empleado)}>
                    Editar
                  </button>
                  <button type="button" className="text-action delete-action" onClick={() => onDelete(empleado)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}