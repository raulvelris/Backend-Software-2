# Backend - Sistema de Gestión de Eventos

Backend desarrollado con **Node.js + TypeScript + Express + Sequelize + PostgreSQL** usando **arquitectura en capas con POO simplificada**.

> 📚 **[Ver Índice de Documentación Completa](./DOCUMENTACION.md)**

## 🏗️ Arquitectura

Este proyecto implementa una **arquitectura en capas simplificada** con las siguientes capas:

- **Domain**: Value Objects, Interfaces (lógica de negocio)
- **Application**: Casos de Uso, DTOs (orquestación)
- **Infrastructure**: Repositorios, Base de Datos (Sequelize), Factories
- **Presentation**: Controllers (capa HTTP)
- **Shared**: Utilidades, DI Container

**Usa modelos de Sequelize directamente** (no entidades de dominio personalizadas) para simplificar el código manteniendo la separación en capas.

📖 Ver [ARQUITECTURA_SIMPLIFICADA.md](./ARQUITECTURA_SIMPLIFICADA.md) para documentación detallada.

## 📋 Requisitos Previos

- **Node.js**: v20.19.0 (recomendado usar `nvm`)
- **PostgreSQL**: v12 o superior
- **npm**: v10 o superior

## 🔧 Scripts de Base de Datos

```bash
npm run db:create        # Crear base de datos
npm run db:migrate       # Ejecutar migraciones
npm run db:seed          # Poblar con datos de prueba
npm run db:reset         # Reset completo (drop + create + migrate + seed)
npm run db:migrate:undo  # Deshacer última migración
npm run db:seed:undo     # Deshacer seeders
npm run db:drop          # Eliminar base de datos
```

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
cd Backend-Software-2
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
PORT=5000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=eventos_db
DB_NAME_TEST=eventos_db_test

NODE_ENV=development
```

### 4. Configurar Base de Datos

#### Crear base de datos
```bash
npm run db:create
```

#### Ejecutar migraciones
```bash
npm run db:migrate
```

#### Poblar con datos de prueba (opcional)
```bash
npm run db:seed
```

#### Resetear base de datos (drop + create + migrate + seed)
```bash
npm run db:reset
```

## 🎯 Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Inicia servidor con nodemon (hot reload)
```

### Producción
```bash
npm run build        # Compila TypeScript → JavaScript (genera carpeta dist/)
npm start            # Inicia servidor compilado desde dist/
```

> **Nota**: La carpeta `dist/` se genera automáticamente al compilar y **no se sube a Git** (está en `.gitignore`).

### Base de Datos
```bash
npm run db:create           # Crear base de datos
npm run db:drop             # Eliminar base de datos
npm run db:migrate          # Ejecutar migraciones
npm run db:migrate:undo     # Revertir última migración
npm run db:migrate:undo:all # Revertir todas las migraciones
npm run db:seed             # Ejecutar seeders
npm run db:seed:undo        # Revertir seeders
npm run db:reset            # Reset completo (drop + create + migrate + seed)
```

### Testing
```bash
npm test             # Ejecutar tests (pendiente implementar)
```

## 📡 Endpoints API

### Base URL
```
http://localhost:5000/api
```

### Invitaciones

#### 1. Buscar usuarios
```http
GET /api/invitations/search?query=juan
```

**Response:**
```json
{
  "success": true,
  "usuarios": [
    {
      "usuario_id": 1,
      "correo": "juan@example.com",
      "nombre": "Juan",
      "apellido": "Pérez"
    }
  ]
}
```

#### 2. Enviar invitaciones
```http
POST /api/invitations/send
Content-Type: application/json

{
  "evento_id": 1,
  "usuario_ids": [2, 3, 4],
  "fechaLimite": "2025-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "notificacion_id": 5,
  "resultados": [
    {
      "usuario_id": 2,
      "status": "Invitation sent",
      "invitacion_usuario_id": 10
    },
    {
      "usuario_id": 3,
      "status": "Already invited"
    }
  ]
}
```

#### 3. Obtener usuarios no elegibles
```http
GET /api/invitations/no-eligible/1
```

**Response:**
```json
{
  "success": true,
  "noElegibles": [
    {
      "usuario_id": 2,
      "correo": "maria@example.com",
      "nombre": "María",
      "apellido": "García",
      "tipo": "pendiente"
    },
    {
      "usuario_id": 3,
      "correo": "pedro@example.com",
      "nombre": "Pedro",
      "apellido": "López",
      "tipo": "participante"
    }
  ]
}
```

#### 4. Contar invitaciones pendientes
```http
GET /api/invitations/count/1
```

**Response:**
```json
{
  "success": true,
  "pendientes": 15,
  "limite": 50
}
```

## 🗂️ Estructura del Proyecto

```
Backend-Software-2/
├── src/
│   ├── modules/                 # Módulos por Historia de Usuario
│   │   └── invitaciones/        # Historia: "Invitar usuarios a eventos"
│   │       ├── dtos/            # SearchUsuariosDto, SendInvitacionDto
│   │       ├── use-cases/       # SearchUsuarios, SendInvitacion, GetNoElegibles, Count
│   │       └── controllers/     # InvitacionController
│   │
│   ├── domain/                  # Lógica de negocio compartida
│   │   ├── value-objects/       # Enums y constantes
│   │   └── interfaces/          # IUsuarioRepository, IEventoRepository
│   │
│   ├── infrastructure/          # Implementaciones técnicas compartidas
│   │   ├── database/            # Sequelize (models, config, migrations, seeders)
│   │   ├── repositories/        # UsuarioRepository, EventoRepository
│   │   └── factories/           # NotificacionFabrica, InvitacionFabrica (Factory Method)
│   │
│   ├── shared/                  # Código compartido
│   │   └── utils/               # DependencyContainer, helpers
│   │
│   └── index.ts                 # Punto de entrada
│
├── .env.example                 # Plantilla de variables de entorno
├── .sequelizerc                 # Configuración de Sequelize CLI
├── package.json
├── tsconfig.json
├── ARQUITECTURA_SIMPLIFICADA.md # Documentación de arquitectura
└── README.md                    # Este archivo
```

## 🎨 Patrones de Diseño

- **Repository Pattern**: Abstracción del acceso a datos
- **Use Case Pattern**: Encapsulación de lógica de negocio
- **Dependency Injection**: Inyección de dependencias
- **Factory Method Pattern**: Creación de notificaciones e invitaciones (ver [PATRON_FACTORY_METHOD.md](./PATRON_FACTORY_METHOD.md))
- **DTO Pattern**: Transferencia de datos entre capas
- **Singleton Pattern**: Instancias únicas de repositorios (DependencyContainer)

## 🔧 Tecnologías

- **Runtime**: Node.js v20.19.0
- **Lenguaje**: TypeScript
- **Framework Web**: Express 5
- **ORM**: Sequelize 6
- **Base de Datos**: PostgreSQL
- **Validación**: (pendiente: Zod o Joi)
- **Testing**: (pendiente: Jest)

## 📝 Convenciones de Código

### Nomenclatura
- **Clases**: PascalCase (`UsuarioRepository`, `SendInvitacionUseCase`)
- **Interfaces**: PascalCase con prefijo `I` (`IUsuarioRepository`)
- **Métodos**: camelCase (`findById`, `execute`)
- **Variables**: camelCase (`usuarioId`, `eventoActual`)
- **Constantes**: UPPER_SNAKE_CASE (`LIMITE_PENDIENTES`)

### Estructura de Archivos
- Un archivo por clase/interfaz
- Nombre del archivo = nombre de la clase
- Agrupar por feature/dominio

## 🐛 Troubleshooting

### Error: "Database connection error"
```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql status

# Verificar credenciales en .env
cat .env
```

### Error: "Sequelize CLI not found"
```bash
# Instalar globalmente (opcional)
npm install -g sequelize-cli

# O usar npx
npx sequelize-cli db:migrate
```

### Error: "Cannot find module '../DAO/models'"
```bash
# Asegúrate de que las rutas en .sequelizerc apunten a infrastructure/database
cat .sequelizerc
```

### Resetear completamente la base de datos
```bash
npm run db:reset
```

## 🚧 Próximos Pasos

- [ ] Implementar endpoint `POST /api/invitations/respond`
- [ ] Agregar validación de requests con Zod
- [ ] Implementar autenticación JWT
- [ ] Agregar tests unitarios con Jest
- [ ] Agregar tests de integración
- [ ] Documentar API con Swagger/OpenAPI
- [ ] Agregar logging con Winston
- [ ] Implementar rate limiting
- [ ] Agregar Docker y Docker Compose
- [ ] CI/CD con GitHub Actions

## 👥 Contribuir

1. Crear una rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Seguir la arquitectura en capas
3. Escribir tests para nuevos casos de uso
4. Hacer commit: `git commit -m "feat: agregar nueva funcionalidad"`
5. Push: `git push origin feature/nueva-funcionalidad`
6. Crear Pull Request

## 📄 Licencia

ISC
