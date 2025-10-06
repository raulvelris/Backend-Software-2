"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var GeneradorEvento_1 = require("./GeneradorEvento");
var ServicioEnvioInvitacion_1 = require("./ServicioEnvioInvitacion");
var GestorInvitaciones_1 = require("./GestorInvitaciones");
var ServicioEventoPublico_1 = require("./ServicioEventoPublico");
var ServicioVisualizacion_1 = require("./ServicioVisualizacion");
var TipoEvento_1 = require("./TipoEvento");
var Usuario_1 = require("./Usuario");
var Prueba = /** @class */ (function () {
    function Prueba() {
    }
    Prueba.main = function () {
        return __awaiter(this, void 0, void 0, function () {
            var usuario1, usuario2, cesar, raul, jaren, servicioPub, generador, evento1, evento8, servicioVis, gestorInv, _i, _a, e, _b, _c, p, evento2, evento3, servicioPri, _d, _e, inv, _f, _g, e, _h, _j, e;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        usuario1 = new Usuario_1.Usuario('abc@ejemplo.com', 'miClave123');
                        usuario2 = new Usuario_1.Usuario('def@ejemplo.com', 'miClave456');
                        cesar = new Usuario_1.Usuario('ghi@ejemplo.com', 'miClave456');
                        raul = new Usuario_1.Usuario('jkl@ejemplo.com', 'miClave456');
                        jaren = new Usuario_1.Usuario('mnñ@ejemplo.com', 'miClave456');
                        servicioPub = new ServicioEventoPublico_1.ServicioEventoPublico();
                        generador = new GeneradorEvento_1.GeneradorEvento();
                        evento1 = generador.crearEvento(usuario1, 'Fiesta de Programadores', TipoEvento_1.TipoEvento.PUBLICO, servicioPub);
                        evento8 = generador.crearEvento(usuario1, 'Fiesta de Programadores2', TipoEvento_1.TipoEvento.PUBLICO, servicioPub);
                        // confirmar asistencia
                        servicioPub.confirmarAsistenciaPublica(evento1, usuario2);
                        servicioVis = new ServicioVisualizacion_1.ServicioVisualizacion();
                        gestorInv = new GestorInvitaciones_1.GestorInvitaciones();
                        // mostrar eventos creados por el usuario
                        console.log("Eventos organizados por ".concat(usuario1.getCorreo(), ":"));
                        for (_i = 0, _a = servicioVis.verEventosCreados(usuario1); _i < _a.length; _i++) {
                            e = _a[_i];
                            console.log("- ".concat(e.getTitulo()));
                        }
                        // mostrar participantes del evento
                        console.log("\nParticipantes del evento '".concat(evento1.getTitulo(), "':"));
                        for (_b = 0, _c = evento1.verInvitados(); _b < _c.length; _b++) {
                            p = _c[_b];
                            console.log("- ".concat(p.getUsuario().getCorreo(), " (").concat(p.getRol(), ")"));
                        }
                        evento2 = generador.crearEvento(cesar, 'Fiesta 2', TipoEvento_1.TipoEvento.PRIVADO, servicioPub);
                        evento3 = generador.crearEvento(raul, 'Fiesta 2', TipoEvento_1.TipoEvento.PRIVADO, servicioPub);
                        servicioPri = new ServicioEnvioInvitacion_1.ServicioEnvioInvitacion();
                        // invitar participantes a eventos privados
                        return [4 /*yield*/, servicioPri.invitarParticipante(evento2, raul)];
                    case 1:
                        // invitar participantes a eventos privados
                        _k.sent(); // cesar organiza
                        return [4 /*yield*/, servicioPri.invitarParticipante(evento2, jaren)];
                    case 2:
                        _k.sent(); // cesar organiza
                        return [4 /*yield*/, servicioPri.invitarParticipante(evento3, cesar)];
                    case 3:
                        _k.sent(); // raul organiza
                        return [4 /*yield*/, servicioPri.invitarParticipante(evento3, jaren)];
                    case 4:
                        _k.sent(); // raul organiza
                        // ver invitaciones de Jaren
                        console.log('\nInvitaciones de Jaren:');
                        for (_d = 0, _e = gestorInv.verInvitaciones(jaren); _d < _e.length; _d++) {
                            inv = _e[_d];
                            console.log("- Evento: ".concat(inv.getInvitacion().getEventoOrigen().getTitulo(), ", De: ").concat(inv.getInvitacion().getEmisor().getUsuario().getCorreo(), ", Estado: ").concat(inv.getEstado()));
                        }
                        // mostrar eventos organizados por Raúl
                        console.log("\nEventos organizados por ".concat(raul.getCorreo(), ":"));
                        for (_f = 0, _g = servicioVis.verEventosCreados(raul); _f < _g.length; _f++) {
                            e = _g[_f];
                            console.log("- ".concat(e.getTitulo()));
                        }
                        // mostrar eventos públicos
                        console.log('\n--- Títulos de Eventos Públicos ---');
                        for (_h = 0, _j = servicioPub.getEventos(); _h < _j.length; _h++) {
                            e = _j[_h];
                            if (e.getTipo() === TipoEvento_1.TipoEvento.PUBLICO) {
                                console.log("- ".concat(e.getTitulo()));
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Prueba;
}());
Prueba.main();
