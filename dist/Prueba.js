"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GeneradorEvento_1 = require("./GeneradorEvento");
const ServicioEnvioInvitacion_1 = require("./ServicioEnvioInvitacion");
const GestorInvitaciones_1 = require("./GestorInvitaciones");
const ServicioEventoPublico_1 = require("./ServicioEventoPublico");
const ServicioVisualizacion_1 = require("./ServicioVisualizacion");
const TipoEvento_1 = require("./TipoEvento");
const Usuario_1 = require("./Usuario");
class Prueba {
    static main() {
        // usuario
        const usuario1 = new Usuario_1.Usuario('abc@ejemplo.com', 'miClave123');
        const usuario2 = new Usuario_1.Usuario('def@ejemplo.com', 'miClave456');
        const cesar = new Usuario_1.Usuario('ghi@ejemplo.com', 'miClave456');
        const raul = new Usuario_1.Usuario('jkl@ejemplo.com', 'miClave456');
        const jaren = new Usuario_1.Usuario('mnñ@ejemplo.com', 'miClave456');
        // servicio publico
        const servicioPub = new ServicioEventoPublico_1.ServicioEventoPublico();
        // generador de eventos
        const generador = new GeneradorEvento_1.GeneradorEvento();
        // crear eventos
        const evento1 = generador.crearEvento(usuario1, 'Fiesta de Programadores', TipoEvento_1.TipoEvento.PUBLICO, servicioPub);
        const evento8 = generador.crearEvento(usuario1, 'Fiesta de Programadores2', TipoEvento_1.TipoEvento.PUBLICO, servicioPub);
        // confirmar asistencia
        servicioPub.confirmarAsistenciaPublica(evento1, usuario2);
        // crear servicio de visualización para filtrar eventos
        const servicioVis = new ServicioVisualizacion_1.ServicioVisualizacion();
        // crear gestor de invitaciones
        const gestorInv = new GestorInvitaciones_1.GestorInvitaciones();
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
        const evento2 = generador.crearEvento(cesar, 'Fiesta 2', TipoEvento_1.TipoEvento.PRIVADO, servicioPub);
        const evento3 = generador.crearEvento(raul, 'Fiesta 2', TipoEvento_1.TipoEvento.PRIVADO, servicioPub);
        // servicio de invitaciones privadas
        const servicioPri = new ServicioEnvioInvitacion_1.ServicioEnvioInvitacion();
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
            if (e.getTipo() === TipoEvento_1.TipoEvento.PUBLICO) {
                console.log(`- ${e.getTitulo()}`);
            }
        }
    }
}
Prueba.main();
//# sourceMappingURL=Prueba.js.map