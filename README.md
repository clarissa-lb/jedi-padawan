# Organigrama Jedi Padawan

Un organigrama interactivo y responsivo construido con Next.js que se conecta a bases de datos de Bubble para visualizar estructuras organizacionales.

## 🚀 Características

- **Organigrama Interactivo**: Nodos expandibles y colapsables
- **Conexión con Bubble**: API completa para conectar con bases de datos de Bubble
- **Colores por Departamento**: Visualización por grupos organizacionales
- **Búsqueda y Navegación**: Funcionalidades de búsqueda, zoom y pan
- **Responsivo**: Funciona perfectamente en dispositivos móviles y desktop
- **Estadísticas**: Vista general de empleados por departamento y nivel
- **Modo Demostración**: Datos de ejemplo para probar sin conexión

## 🛠️ Tecnologías Utilizadas

- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos y diseño responsivo
- **OrgChart.js** - Librería para organigramas
- **Axios** - Cliente HTTP para APIs
- **Bubble API** - Conexión con base de datos

## 📦 Instalación

1. **Clonar el repositorio**:
```bash
git clone <repository-url>
cd jedi-padawan
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Ejecutar en modo desarrollo**:
```bash
npm run dev
```

4. **Abrir en el navegador**:
```
http://localhost:3000
```

## 🔧 Configuración de Bubble

### 1. Preparar la Base de Datos en Bubble

Tu base de datos de Bubble debe tener una tabla llamada `employee` con los siguientes campos:

- `name` (text) - Nombre del empleado
- `role` (text) - Rol o posición
- `department` (text) - Departamento
- `level` (number) - Nivel jerárquico
- `leader` (text) - ID del empleado líder (opcional)
- `color` (text) - Color personalizado (opcional)
- `email` (text) - Email del empleado (opcional)
- `phone` (text) - Teléfono (opcional)
- `position` (text) - Posición específica (opcional)

### 2. Obtener Credenciales de Bubble

1. Ve a tu aplicación Bubble
2. Navega a **Settings** → **API**
3. Genera una nueva **API Key**
4. Anota tu **App ID** (está en la URL de tu app)

### 3. Configurar la Aplicación

1. Ejecuta la aplicación
2. Selecciona "Conectar con Bubble"
3. Ingresa tu App ID y API Key
4. La aplicación validará la conexión automáticamente

## 📊 Estructura de Datos

### Relaciones Jerárquicas

Los empleados se relacionan a través del campo `leader`:

```json
{
  "_id": "emp_001",
  "name": "Lean",
  "role": "Director General",
  "department": "Dirección",
  "level": 1,
  "leader": null
}

{
  "_id": "emp_002", 
  "name": "Marula",
  "role": "Gerente",
  "department": "Operaciones",
  "level": 2,
  "leader": "emp_001"
}
```

### Colores por Departamento

La aplicación asigna automáticamente colores basados en:
- Departamento del empleado
- Nivel jerárquico
- Color personalizado (si se especifica)

## 🎨 Personalización

### Modificar Colores

Edita el archivo `src/app/utils/orgChartDataTransformer.ts`:

```typescript
private initializeColorMap(): void {
  const colors = [
    '#FF6B6B', // CEO/Directores
    '#4ECDC4', // Gerentes
    '#45B7D1', // Supervisores
    // ... más colores
  ];
}
```

### Personalizar Nodos

Modifica el template en `src/app/components/OrgChart.tsx`:

```typescript
nodeTemplate: (data: any) => {
  return `
    <div class="orgchart-node" style="background-color: ${data.color};">
      <div class="node-name">${data.name}</div>
      <div class="node-role">${data.role}</div>
    </div>
  `;
}
```

## 🔍 Funcionalidades

### Modo Demostración

- Accede a datos de ejemplo sin necesidad de conexión
- Perfecto para pruebas y presentaciones
- Incluye una estructura organizacional completa

### Conexión con Bubble

- **Lectura**: Obtiene empleados y estructura jerárquica
- **Escritura**: Crear, actualizar y eliminar empleados
- **Validación**: Verifica credenciales antes de conectar
- **Manejo de Errores**: Interfaz amigable para errores de conexión

### Interactividad

- **Expandir/Colapsar**: Click en nodos para expandir
- **Búsqueda**: Buscar empleados por nombre
- **Zoom**: Acercar y alejar el organigrama
- **Navegación**: Arrastrar para mover la vista
- **Menús Contextuales**: Click derecho para opciones

## 📱 Responsividad

El organigrama se adapta automáticamente a:
- **Desktop**: Vista completa con todas las funcionalidades
- **Tablet**: Navegación táctil optimizada
- **Mobile**: Interfaz simplificada para pantallas pequeñas

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno si es necesario
3. Despliega automáticamente

### Otros Proveedores

La aplicación es compatible con cualquier proveedor que soporte Next.js:
- Netlify
- Railway
- Heroku
- AWS Amplify

## 🔧 Variables de Entorno (Opcional)

Crea un archivo `.env.local` para configuraciones por defecto:

```env
NEXT_PUBLIC_DEFAULT_BUBBLE_APP_ID=tu_app_id
NEXT_PUBLIC_DEFAULT_BUBBLE_API_KEY=tu_api_key
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Verificar código
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de [Bubble API](https://bubble.io/reference)
2. Verifica que tu estructura de datos sea correcta
3. Asegúrate de que las credenciales sean válidas
4. Abre un issue en el repositorio

## 🎯 Roadmap

- [ ] Exportar organigrama a PDF/PNG
- [ ] Filtros avanzados por departamento
- [ ] Modo de edición inline
- [ ] Integración con calendarios
- [ ] Notificaciones de cambios
- [ ] Múltiples vistas (árbol, matriz, etc.)
