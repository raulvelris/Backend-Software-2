# 🎉 Datos de Prueba para el Sistema de Eventos

## 📊 Datos Incluidos

### 👥 **Usuarios de Prueba**
- **admin@eventos.com** (clave: admin123) - Administrador
- **usuario@eventos.com** (clave: user123) - Usuario regular  
- **test@eventos.com** (clave: test123) - Usuario de prueba

### 👤 **Clientes**
- **Juan Pérez** (admin@eventos.com)
- **María González** (usuario@eventos.com)
- **Carlos López** (test@eventos.com)

### 🎭 **Roles Disponibles**
- **Organizador** - Puede crear y gestionar eventos
- **Participante** - Puede asistir a eventos
- **Moderador** - Puede moderar eventos
- **Invitado** - Acceso limitado

### 🎪 **Eventos de Prueba**
1. **Conferencia de Tecnología** (Público) - 15 Feb 2024
2. **Workshop de React** (Privado) - 20 Feb 2024  
3. **Meetup de Desarrolladores** (Solo Invitados) - 25 Feb 2024
4. **Hackathon 2024** (Público) - 1 Mar 2024

### 📍 **Ubicaciones**
- Centro de Convenciones Ciudad
- Universidad Tecnológica
- Café Tech Hub
- Parque Tecnológico

### 📧 **Invitaciones de Ejemplo**
- María invitada a Conferencia de Tecnología (pendiente)
- Carlos invitado a Workshop de React (aceptada)
- María invitada a Meetup (rechazada)

## 🚀 Cómo Usar

### 1. **Configurar Base de Datos**
```bash
# Crear base de datos
npm run db:create

# Ejecutar migraciones
npm run db:migrate

# Poblar con datos de prueba
npm run db:seed
```

### 2. **Reset Completo**
```bash
npm run db:reset
```

### 3. **Probar Funcionalidades**

#### **Búsqueda de Usuarios**
- Buscar por email: `admin@eventos.com`, `usuario@eventos.com`, `test@eventos.com`

#### **Envío de Invitaciones**
- Usar los IDs de eventos: 1, 2, 3, 4
- Usar los IDs de usuarios: 1, 2, 3

#### **Estados de Invitación**
- `pendiente` - Invitación enviada, sin respuesta
- `aceptada` - Usuario aceptó la invitación
- `rechazada` - Usuario rechazó la invitación
- `expirada` - Invitación expiró

## 🔧 Scripts Disponibles

```bash
npm run db:migrate        # Ejecutar migraciones
npm run db:seed          # Ejecutar seeders
npm run db:reset         # Reset completo
npm run db:migrate:undo  # Deshacer última migración
npm run db:seed:undo     # Deshacer seeders
```

## 📝 Notas Importantes

- Los datos están diseñados para probar todas las funcionalidades
- Las relaciones entre tablas están correctamente establecidas
- Los IDs están hardcodeados para facilitar las pruebas
- Las fechas están configuradas para eventos futuros

¡Disfruta probando tu sistema de eventos! 🎉
