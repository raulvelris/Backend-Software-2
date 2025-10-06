import { GeneradorEvento } from './GeneradorEvento';
import { ServicioEnvioInvitacion } from './ServicioEnvioInvitacion';
import { GestorInvitaciones } from './GestorInvitaciones';
import { ServicioEventoPublico } from './ServicioEventoPublico';
import { ServicioVisualizacion } from './ServicioVisualizacion';
import { TipoEvento } from './TipoEvento';
import { Usuario } from './Usuario';

class Prueba {
  public static main(): void {
    // usuario
    const usuario1 = new Usuario('abc@ejemplo.com', 'miClave123');
    const usuario2 = new Usuario('def@ejemplo.com', 'miClave456');
    const cesar = new Usuario('ghi@ejemplo.com', 'miClave456');
    const raul = new Usuario('jkl@ejemplo.com', 'miClave456');
    const jaren = new Usuario('mnñ@ejemplo.com', 'miClave456');

    // servicio publico
    const servicioPub = new ServicioEventoPublico();

    // generador de eventos
    const generador = new GeneradorEvento();

    // crear eventos
    const evento1 = generador.crearEvento(usuario1, 'Fiesta de Programadores', TipoEvento.PUBLICO, servicioPub);
    const evento8 = generador.crearEvento(usuario1, 'Fiesta de Programadores2', TipoEvento.PUBLICO, servicioPub);

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
    const evento2 = generador.crearEvento(cesar, 'Fiesta 2', TipoEvento.PRIVADO, servicioPub);
    const evento3 = generador.crearEvento(raul, 'Fiesta 2', TipoEvento.PRIVADO, servicioPub);

    // servicio de invitaciones privadas
    const servicioPri = new ServicioEnvioInvitacion();

    // invitar participantes a eventos privados
    servicioPri.invitarParticipante(evento2, raul); // cesar organiza
    servicioPri.invitarParticipante(evento2, jaren); // cesar organiza
    servicioPri.invitarParticipante(evento3, cesar); // raul organiza
    servicioPri.invitarParticipante(evento3, jaren); // raul organiza

    // ver invitaciones de Raúl
    console.log('\nInvitaciones de Raúl:');
    for (const inv of gestorInv.verInvitaciones(raul)) {
      console.log(`- Evento: ${inv.getInvitacion().getEventoOrigen().getTitulo()}, De: ${inv.getInvitacion().getEmisor().getUsuario().getCorreo()}, Estado: ${inv.getEstado()}`);
    }

    // ver invitaciones de Cesar
    console.log('\nInvitaciones de Cesar:');
    for (const inv of gestorInv.verInvitaciones(cesar)) {
      console.log(`- Evento: ${inv.getInvitacion().getEventoOrigen().getTitulo()}, De: ${inv.getInvitacion().getEmisor().getUsuario().getCorreo()}, Estado: ${inv.getEstado()}`);
    }

    // ver invitaciones de Jaren
    console.log('\nInvitaciones de Jaren:');
    for (const inv of gestorInv.verInvitaciones(jaren)) {
      console.log(`- Evento: ${inv.getInvitacion().getEventoOrigen().getTitulo()}, De: ${inv.getInvitacion().getEmisor().getUsuario().getCorreo()}, Estado: ${inv.getEstado()}`);
    }

    // mostrar eventos organizados por Raúl
    console.log(`\nEventos organizados por ${raul.getCorreo()}:`);
    for (const e of servicioVis.verEventosCreados(raul)) {
      console.log(`- ${e.getTitulo()}`);
    }

    // mostrar eventos públicos
    console.log('\n--- Títulos de Eventos Públicos ---');
    for (const e of servicioPub.getEventos()) {
      if (e.getTipo() === TipoEvento.PUBLICO) {
        console.log(`- ${e.getTitulo()}`);
      }
    }
  }
}
Prueba.main();