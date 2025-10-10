# Patrón Factory Method - Implementación

## 📐 Diagrama de Clases

```
┌──────────────────────────────────────────────────┐
│       NotificacionFabrica (Abstract)             │
├──────────────────────────────────────────────────┤
│ + MetodoFabrica()                                │ ← Método abstracto
│ + static crearNotificacion(tipo)                 │ ← Método estático (selector)
└──────────────────────────────────────────────────┘
              ▲
              │ extends
              │
    ┌─────────┴─────────┐
    │                   │                  
┌───────────────┐  ┌────────────────┐  
│ Invitacion    │  │ General        │  
│ Fabrica       │  │ Fabrica        │  
├───────────────┤  ├────────────────┤  
│ MetodoFabrica │  │ MetodoFabrica  │  
└───────────────┘  └────────────────┘  
   (Implementa)       (Futuro)           
```

## 🎯 Propósito

El patrón **Factory Method** define una interfaz para crear objetos, pero permite que las subclases decidan qué clase instanciar. Delega la creación de objetos a las subclases.

## 📁 Estructura de Archivos

```
src/
├── domain/value-objects/
│   └── TipoNotificacion.ts       # Enum con tipos de notificaciones
│
└── infrastructure/factories/
    ├── NotificacionFabrica.ts    # Fábrica Abstracta + Método Estático
    └── InvitacionFabrica.ts      # Fábrica Concreta (Invitaciones)
    # Futuro:
    # └── GeneralFabrica.ts  # Fábrica Concreta (Notificaciones Generales)
```

## 🔧 Implementación

### 1. Enum de Tipos de Notificación

```typescript
// src/domain/value-objects/TipoNotificacion.ts

export enum TipoNotificacion {
    INVITACION = "INVITACION",
    RECORDATORIO = "RECORDATORIO",
    ALERTA = "ALERTA"
}
```

### 2. Fábrica Abstracta (NotificacionFabrica)

```typescript
// src/infrastructure/factories/NotificacionFabrica.ts

export abstract class NotificacionFabrica {
  
  // ✅ Método Fábrica abstracto - debe ser implementado por subclases
  public abstract MetodoFabrica(
    fechaHora: Date,
    eventoId: number,
    fechaLimite?: Date
  ): Promise<any>;

  // ✅ Método estático - selecciona la fábrica según el tipo
  public static async crearNotificacion(
    fechaHora: Date,
    eventoId: number,
    tipo: string,
    fechaLimite?: Date
  ): Promise<any | null> {
    let notificacion: any | null = null;

    // Seleccionar fábrica según el tipo
    if (tipo === "INVITACION") {
      const { InvitacionFabrica } = await import('./InvitacionFabrica');
      notificacion = await new InvitacionFabrica().MetodoFabrica(
        fechaHora, eventoId, fechaLimite
      );
    }
    // Futuro: agregar más tipos aquí
    // else if (tipo === "GENERAL") { ... }
    
    return notificacion;
  }
}
```

**Responsabilidades**:
- Define la interfaz del método fábrica (`MetodoFabrica`)
- Proporciona método estático para seleccionar la fábrica correcta
- Permite agregar nuevos tipos sin modificar código existente (Open/Closed)
- No puede ser instanciada directamente (es abstracta)

### 3. Fábrica Concreta (InvitacionFabrica)

```typescript
// src/infrastructure/factories/InvitacionFabrica.ts

export class InvitacionFabrica extends NotificacionFabrica {
  
  // ✅ Implementación del método fábrica
  public async MetodoFabrica(
    fechaHora: Date,
    eventoId: number,
    fechaLimite?: Date
  ): Promise<any> {
    // 1. Crear notificación base
    const notificacion = await db.Notificacion.create({
      fechaHora: fechaHora,
      evento_id: eventoId
    });
    
    // 2. Calcular fecha límite
    const fechaLimiteCalculada = fechaLimite || 
      new Date(Date.now() + DIAS_VALIDEZ_INVITACION * 24 * 60 * 60 * 1000);
    
    // 3. Crear invitación asociada
    const invitacion = await db.Invitacion.create({
      notificacion_id: notificacion.notificacion_id,
      fechaLimite: fechaLimiteCalculada
    });
    
    return invitacion;
  }
}
```

**Responsabilidades**:
- Implementa el método fábrica abstracto (`MetodoFabrica`)
- Encapsula la lógica de creación de invitaciones (Notificación + Invitación)
- Usa la constante `DIAS_VALIDEZ_INVITACION` del dominio

### 4. Uso en SendInvitacionUseCase

```typescript
// src/application/use-cases/SendInvitacionUseCase.ts

import { NotificacionFabrica } from '../../infrastructure/factories/NotificacionFabrica';
import { TipoNotificacion } from '../../domain/value-objects/TipoNotificacion';

export class SendInvitacionUseCase {
  async execute(dto: SendInvitacionDto) {
    // ...validaciones...
    
    // ✅ Usar Factory Method con método estático
    const nuevaInvitacion = await NotificacionFabrica.crearNotificacion(
      new Date(),                      // fechaHora
      dto.evento_id,                   // eventoId
      TipoNotificacion.INVITACION,     // tipo
      dto.fechaLimite                  // fechaLimite (opcional)
    );
    
    // Usar la invitación creada
    // ...
  }
}
```

## 🎨 Ventajas del Patrón

### ✅ Encapsulación
La lógica de creación está encapsulada en la fábrica, no dispersa en el código.

**Antes** (sin Factory Method):
```typescript
// ❌ Lógica de creación dispersa
const notificacion = await db.Notificacion.create({ ... });
const invitacion = await db.Invitacion.create({ ... });
```

**Ahora** (con Factory Method):
```typescript
// ✅ Lógica encapsulada
const fabrica = new InvitacionFabrica();
const invitacion = await fabrica.crearNotificacion(eventoId, fechaLimite);
```

### ✅ Extensibilidad
Fácil agregar nuevos tipos de notificaciones sin modificar código existente.

**Ejemplo futuro - RecordatorioFabrica**:
```typescript
// src/infrastructure/factories/RecordatorioFabrica.ts

export class RecordatorioFabrica extends NotificacionFabrica {
  public async MetodoFabrica(
    fechaHora: Date,
    eventoId: number
  ): Promise<any> {
    // 1. Crear notificación
    const notificacion = await db.Notificacion.create({
      fechaHora: fechaHora,
      evento_id: eventoId
    });
    
    // 2. Crear recordatorio
    const recordatorio = await db.Recordatorio.create({
      notificacion_id: notificacion.notificacion_id,
      tiempoAntes: 24 // 24 horas antes del evento
    });
    
    return recordatorio;
  }
}

### ✅ Principio Open/Closed
Abierto para extensión (nuevas fábricas), cerrado para modificación.

### ✅ Single Responsibility
Cada fábrica tiene una sola responsabilidad: crear un tipo específico de notificación.

## 🔄 Flujo de Ejecución

```
1. SendInvitacionUseCase
   ↓
2. NotificacionFabrica.crearNotificacion(
     fechaHora, eventoId, "INVITACION", fechaLimite
   )
   ↓
3. Método estático selecciona la fábrica según tipo
   ↓
4. if (tipo === "INVITACION") → import InvitacionFabrica
   ↓
5. new InvitacionFabrica().MetodoFabrica(...)
   ↓
6. db.Notificacion.create(...)  ← Crea Notificacion
   ↓
7. Calcular fechaLimite (si no se proporciona)
   ↓
8. db.Invitacion.create(...)  ← Crea Invitacion
   ↓
9. return invitacion
   ↓
10. SendInvitacionUseCase usa la invitación creada
```


