# ANEXOS

## Anexo: Raul Velazco

### 3.1 Introducción 
El Sistema de Gestión de Eventos es una plataforma backend robusta diseñada para facilitar la organización y administración de eventos tanto públicos como privados. El sistema permite a los organizadores crear eventos, gestionar invitaciones, controlar la asistencia y mantener un registro detallado de participantes. Esta solución busca optimizar la coordinación entre organizadores e invitados mediante una arquitectura escalable, mantenible y segura. El proyecto implementa principios SOLID, patrones de diseño reconocidos y una separación clara de responsabilidades que garantiza la calidad del software a largo plazo.

### 3.2 Salud y Seguridad en el Diseño de Software 
El proyecto prioriza la seguridad desde su concepción arquitectónica. Se implementa un sistema de autenticación basado en tokens de activación para verificar cuentas de usuario, protegiendo contra registros fraudulentos. El acceso a datos sensibles está controlado mediante el patrón Repository, que centraliza y valida todas las operaciones de base de datos, previniendo inyecciones SQL gracias al uso de Sequelize como ORM. Las contraseñas se almacenan cifradas y nunca se exponen en las respuestas de la API.

Desde la perspectiva de salud del equipo de desarrollo, la arquitectura en capas con separación de responsabilidades reduce significativamente la carga cognitiva. Los casos de uso encapsulados permiten que los desarrolladores trabajen en funcionalidades específicas sin necesidad de comprender todo el sistema. La implementación de TypeScript proporciona seguridad de tipos en tiempo de compilación, reduciendo errores en producción y el estrés asociado a debugging de última hora. El uso de migraciones de base de datos versionadas garantiza que los cambios en el esquema sean rastreables y reversibles, evitando situaciones de crisis.

### 3.3 Impacto Sociocultural 
El sistema democratiza la organización de eventos al ofrecer una plataforma accesible que no discrimina por escala del evento. Tanto una reunión académica pequeña como un evento corporativo masivo pueden gestionarse con las mismas herramientas. La funcionalidad de eventos públicos versus privados respeta diferentes necesidades culturales y sociales: eventos abiertos a la comunidad versus reuniones exclusivas por invitación.

El diseño modular permite futuras extensiones para soportar múltiples idiomas y adaptarse a diferentes contextos culturales. La arquitectura RESTful facilita la integración con aplicaciones frontend diversas, permitiendo que diferentes comunidades desarrollen interfaces adaptadas a sus necesidades específicas. El sistema de notificaciones por correo electrónico asegura que usuarios con diferentes niveles de familiaridad tecnológica puedan recibir información clara sobre sus invitaciones y eventos.

La trazabilidad de invitaciones y confirmaciones de asistencia reduce la incertidumbre social, permitiendo a los organizadores planificar mejor y a los invitados tener claridad sobre su participación. Esto es especialmente valioso en contextos donde la coordinación grupal es desafiante.

### 3.4 Impacto Ambiental 
El proyecto contribuye a la reducción del impacto ambiental mediante la digitalización completa del proceso de gestión de eventos. Al eliminar la necesidad de invitaciones físicas, confirmaciones impresas y listas de asistencia en papel, se reduce significativamente el consumo de recursos materiales y la generación de residuos.

La arquitectura backend optimizada minimiza el consumo de recursos computacionales. El uso de Sequelize con consultas optimizadas reduce la carga en la base de datos, disminuyendo el consumo energético del servidor. El patrón Repository permite implementar estrategias de caché en el futuro, reduciendo aún más las consultas redundantes a la base de datos.

La estructura modular del código facilita el mantenimiento y la evolución del sistema sin necesidad de reescrituras completas, extendiendo el ciclo de vida del software y evitando el desperdicio de recursos de desarrollo. El uso de TypeScript y patrones de diseño reduce bugs en producción, disminuyendo la necesidad de hotfixes urgentes que consumen recursos adicionales de infraestructura y equipo.

### 3.5 Bienestar y Responsabilidad Social 
El sistema mejora el bienestar de los usuarios al reducir la fricción en la organización de eventos. Los organizadores pueden concentrarse en el contenido y la experiencia del evento en lugar de la logística administrativa. El sistema de invitaciones automatizado con límites configurables (50 invitaciones pendientes por evento) previene el spam y el abuso, protegiendo a los usuarios de comunicaciones no deseadas.

La implementación del control de aforo permite a los organizadores gestionar responsablemente la capacidad de sus eventos, contribuyendo a la seguridad física de los participantes. El registro de participantes facilita la comunicación de información importante y, en caso de emergencia, permite contactar rápidamente a los asistentes.

El sistema respeta la privacidad de los usuarios mediante el control de visibilidad de eventos (públicos vs. privados) y la gestión de datos personales limitada a lo estrictamente necesario. Los usuarios tienen control sobre su participación mediante la capacidad de aceptar o rechazar invitaciones, respetando su autonomía y tiempo.

La arquitectura extensible permite futuras implementaciones de características de accesibilidad, como notificaciones adaptativas, integración con lectores de pantalla en el frontend, y formatos de datos compatibles con tecnologías asistivas.

### 3.6 Evidencias y Evaluación de Impacto 

**Arquitectura y Calidad del Código:**
- Implementación completa de arquitectura en capas con 68 clases organizadas en 5 capas distintas
- Cumplimiento de los 5 principios SOLID verificable en el diagrama de clases
- 15 casos de uso encapsulados que garantizan separación de responsabilidades
- 10 repositorios con interfaces que permiten testabilidad mediante mocking
- Implementación de 4 patrones de diseño reconocidos: Repository, Factory Method, Singleton y DTO

**Seguridad:**
- Sistema de activación de cuentas mediante tokens con expiración temporal
- Separación de credenciales mediante variables de entorno (.env)
- Uso de ORM (Sequelize) que previene inyecciones SQL
- Validación de datos en capa de aplicación mediante DTOs

**Mantenibilidad:**
- Documentación exhaustiva: README, diagrama de clases completo, documentación de arquitectura
- Sistema de migraciones versionadas para control de cambios en base de datos
- Scripts automatizados para gestión de base de datos (create, migrate, seed, reset)
- Estructura modular que facilita la incorporación de nuevos desarrolladores

**Escalabilidad:**
- Arquitectura preparada para crecimiento horizontal mediante inyección de dependencias
- Patrón Factory Method que permite agregar nuevos tipos de notificaciones sin modificar código existente
- Separación de interfaces y implementaciones que facilita el cambio de tecnologías subyacentes

**Impacto Funcional:**
- Sistema completo de gestión de eventos con 5 controladores principales
- Gestión de invitaciones con límites configurables y validación de elegibilidad
- Soporte para eventos públicos y privados con diferentes flujos de participación
- Sistema de notificaciones por correo electrónico para activación de cuentas y comunicación

**Sostenibilidad del Desarrollo:**
- TypeScript proporciona seguridad de tipos y reduce errores en tiempo de ejecución
- Estructura de proyecto clara con separación por features (módulos)
- Scripts npm documentados para todas las operaciones comunes
- Configuración de desarrollo con hot-reload (nodemon) que acelera el ciclo de desarrollo
