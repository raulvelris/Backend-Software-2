import { GeneradorEvento } from './GeneradorEvento';
import { ServicioEnvioInvitacion } from './ServicioEnvioInvitacion';
import { GestorInvitaciones } from './GestorInvitaciones';
import { ServicioEventoPublico } from './ServicioEventoPublico';
import { ServicioVisualizacion } from './ServicioVisualizacion';
import { Usuario } from './Usuario';
import { Cliente } from './Cliente';
import { EstadoEvento } from './EstadoEvento';
import { Privacidad } from './Privacidad';
import { Ubicacion } from './Ubicacion';

class Prueba {
  public static async main(): Promise<void> {  // por lo de invitacion q es ciclico
    // crear usuarios y sus perfiles
    const usuario1 = new Usuario('abc@ejemplo.com', 'miClave123');
    const usuario2 = new Usuario('def@ejemplo.com', 'miClave456');
    const cesar = new Usuario('ghi@ejemplo.com', 'miClave456');
    const raul = new Usuario('jkl@ejemplo.com', 'miClave456');
    const jaren = new Usuario('mnñ@ejemplo.com', 'miClave456');

    // Crear perfiles de cliente para los usuarios
    const cliente1 = new Cliente('Juan', 'Pérez', usuario1);
    const cliente2 = new Cliente('María', 'García', usuario2);
    const clienteCesar = new Cliente('César', 'López', cesar);
    const clienteRaul = new Cliente('Raúl', 'Martínez', raul);
    const clienteJaren = new Cliente('Jaren', 'Rodríguez', jaren);

    // Asignar perfiles a usuarios
    usuario1.setPerfil(cliente1);
    usuario2.setPerfil(cliente2);
    cesar.setPerfil(clienteCesar);
    raul.setPerfil(clienteRaul);
    jaren.setPerfil(clienteJaren);

    // servicio publico
    const servicioPub = new ServicioEventoPublico();

    // generador de eventos
    const generador = new GeneradorEvento();

    // crear eventos públicos (primero creamos los eventos sin ubicación)
    const evento1 = generador.crearEvento(
      usuario1, 
      'Fiesta de Programadores', 
      'Gran fiesta para desarrolladores',
      new Date('2024-12-25T18:00:00'),
      'fiesta-programadores.jpg',
      100,
      EstadoEvento.PROGRAMADO,
      Privacidad.PUBLICO,
      null as any, // temporal, se asignará después
      servicioPub
    );

    const evento8 = generador.crearEvento(
      usuario1, 
      'Fiesta de Programadores2', 
      'Segunda edición de la fiesta',
      new Date('2024-12-31T20:00:00'),
      'fiesta-programadores2.jpg',
      150,
      EstadoEvento.PROGRAMADO,
      Privacidad.PUBLICO,
      null as any, // temporal, se asignará después
      servicioPub
    );

    // crear ubicaciones para los eventos (después de crear los eventos)
    const ubicacion1 = new Ubicacion('Centro de Convenciones', 40.7128, -74.0060, evento1);
    const ubicacion2 = new Ubicacion('Hotel Plaza', 40.7589, -73.9851, evento8);

    // asignar ubicaciones a los eventos
    evento1.setUbicacion(ubicacion1);
    evento8.setUbicacion(ubicacion2);

    // confirmar asistencia
    servicioPub.confirmarAsistenciaPublica(evento1, usuario2);

    // crear servicio de visualización para filtrar eventos
    const servicioVis = new ServicioVisualizacion();

    // crear gestor de invitaciones
    const gestorInv = new GestorInvitaciones();

    // mostrar eventos creados por el usuario
    console.log(`Eventos organizados por ${usuario1.getCorreo()}:`);
    for (const e of servicioVis.verEventosCreados(usuario1)) {
      console.log(`- ${e.getTitulo()}`);
    }

    // mostrar participantes del evento
    console.log(`\nParticipantes del evento '${evento1.getTitulo()}':`);
    for (const p of evento1.verInvitados()) {
      console.log(`- ${p.getUsuario().getCorreo()} (${p.getRol()})`);
    }

    // crear eventos privados
    const evento2 = generador.crearEvento(
      cesar, 
      'Fiesta Privada César', 
      'Evento privado de César',
      new Date('2024-12-20T19:00:00'),
      'fiesta-cesar.jpg',
      50,
      EstadoEvento.PROGRAMADO,
      Privacidad.PRIVADO,
      null as any, // temporal, se asignará después
      servicioPub
    );

    const evento3 = generador.crearEvento(
      raul, 
      'Fiesta Privada Raúl', 
      'Evento privado de Raúl',
      new Date('2024-12-22T17:00:00'),
      'fiesta-raul.jpg',
      30,
      EstadoEvento.PROGRAMADO,
      Privacidad.PRIVADO,
      null as any, // temporal, se asignará después
      servicioPub
    );

    // crear ubicaciones para eventos privados
    const ubicacion4 = new Ubicacion('Auditorio Municipal', 40.7505, -73.9934, evento2);
    const ubicacion5 = new Ubicacion('Centro de Convenciones', 40.7128, -74.0060, evento3);

    // asignar ubicaciones a eventos privados
    evento2.setUbicacion(ubicacion4);
    evento3.setUbicacion(ubicacion5);

    // servicio de invitaciones privadas
    const servicioPri = new ServicioEnvioInvitacion();

    // invitar participantes a eventos privados
    await servicioPri.invitarParticipante(evento2, raul); // cesar organiza
    await servicioPri.invitarParticipante(evento2, jaren); // cesar organiza
    await servicioPri.invitarParticipante(evento3, cesar); // raul organiza
    await servicioPri.invitarParticipante(evento3, jaren); // raul organiza

    // ver invitaciones de Jaren
    console.log('\nInvitaciones de Jaren:');
    for (const inv of gestorInv.verInvitaciones(jaren)) {
      console.log(`- Evento: ${inv.getInvitacion().getEventoOrigen().getTitulo()}, Estado: ${inv.getEstado()}`);
    }

    // mostrar eventos organizados por Raúl
    console.log(`\nEventos organizados por ${raul.getCorreo()}:`);
    for (const e of servicioVis.verEventosCreados(raul)) {
      console.log(`- ${e.getTitulo()}`);
    }

    // mostrar eventos públicos
    console.log('\n--- Títulos de Eventos Públicos ---');
    for (const e of servicioPub.getEventos()) {
      if (e.getPrivacidad() === Privacidad.PUBLICO) {
        console.log(`- ${e.getTitulo()}`);
      }
    }

    // mostrar detalles de un evento
    console.log('\n--- Detalles del Evento 1 ---');
    evento1.verDetalle();

    // mostrar participantes de un evento
    console.log('\n--- Participantes del Evento 1 ---');
    evento1.verParticipantes();
  }
}
Prueba.main();