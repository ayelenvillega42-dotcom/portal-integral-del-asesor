"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const ADMIN_EMAIL = "ayelenvillega42@gmail.com";

const CALIDAD = [
  "Información de otras compañías",
  "Presentación HS",
  "Validación de datos",
  "Cláusula de aceptación",
  "Información",
  "Preexistencia",
  "Negociación",
  "Precio",
  "Suscripción",
];

const ACCIONES_CALIDAD = [
  "Feedback individual",
  "Espacio de coaching",
  "Escucha en línea",
  "Devolución mediante Meet",
  "Escucha de llamada de un compañero",
  "Transcripción de venta mediante Word con desvíos marcados",
  "Calibración conjunta de audio",
  "Otros",
];

const PRODUCTIVIDAD = [
  "Técnicas manejo de objeciones",
  "Generación de interés",
  "Cambio apertura",
  "Escucha activa",
  "Venta consultiva",
  "Venta conversacional",
  "Ejemplos de P.S.",
  "Cierre con seguridad comercial",
  "Manejo de objeciones",
  "Ofrecimiento",
  "Rebate comercial",
  "Rebate conversacional",
  "Rebate asertivo",
  "Posicionamiento",
  "Manejo de la llamada",
];

const ACCIONES_PRODUCTIVIDAD = [
  "FEEDBACK INDIVIDUAL",
  "ESPACIO DE COACHING",
  "ESCUCHA EN LÍNEA",
  "ROLEPLAY COMERCIAL",
  "ROLEPLAY DE OBJECIONES",
  "REPASO DE SPEECH",
  "REFUERZO DE ESCUCHA ACTIVA",
  "REFUERZO DE REBATES",
  "CALIBRACIÓN",
  "SIMULACIÓN DE LLAMADA",
  "ACOMPAÑAMIENTO EN LÍNEA",
  "DEVOLUCIÓN PERSONALIZADA",
  "SEGUIMIENTO DIARIO",
  "REFUERZO DE TIPIFICACIÓN",
  "REFUERZO DE CIERRE",
  "REFUERZO DE SONDEO",
  "REFUERZO DE APERTURA",
  "REPASO DE PROCESOS",
  "CAPACITACIÓN",
  "ESCUCHA DE LLAMADA DE COMPAÑERO",
];

const TIPIFICACIONES = [
  "VENTA",
  "VOLVER A LLAMAR",
  "VOLVER A LLAMAR ARGUMENTANDO",
  "NO PERMITE ARGUMENTAR",
  "CLIENTE DISCONFORME CON CIA",
  "CLIENTE DISCONFORME CON EL BANCO",
  "TIENE PRODUCTO CON OTRA CÍA",
  "NO CONFORME CON SUMAS ASEGURADAS",
  "NO INTERESADO PRODUCTO",
  "NO INTERESADO NO INFORMA MOTIVO",
  "PROBLEMAS ECONÓMICOS",
  "LE PARECE CARO",
  "DARA DE BAJA MEDIO DE PAGO",
  "NO ELEGIBLE / NO REÚNE REQUISITOS",
  "NO CONTESTA",
];

const OM = [
  "MANEJO DE OBJECIONES",
  "GENERACION DE INTERES",
  "APERTURA",
  "ESCUCHA ACTIVA",
  "VENTA CONSULTIVA",
  "VENTA CONVERSACIONAL",
  "EJEMPLOS DE P.S",
  "CIERRE CON SEGURIDAD COMERCIAL",
  "OFRECIMIENTO",
  "REBATE COMERCIAL",
  "REBATE CONVERSACIONAL",
  "REBATE ASERTIVO",
  "PAUSAS",
  "POSICIONAMIENTO",
  "MANEJO DE LA LLAMADA",
  "PRODUCTO",
  "SONDEO",
];

const FORTALEZAS = [
  "ESCUCHA ACTIVA",
  "BUEN SONDEO",
  "SEGURIDAD COMERCIAL",
  "EMPATÍA",
  "BUEN TONO",
  "MANEJO DE OBJECIONES",
  "CORRECTA VALIDACIÓN",
  "BUEN CIERRE",
  "IMPULSO COMERCIAL",
  "FLUIDEZ CONVERSACIONAL",
  "ADAPTABILIDAD",
  "BUENA DETECCIÓN DE NECESIDAD",
  "CLARIDAD EN EXPLICACIÓN",
  "BUEN MANEJO DE SILENCIOS",
  "CORRECTA CONTENCIÓN",
  "VENTA CONSULTIVA",
  "BUENA APERTURA",
  "PERSISTENCIA COMERCIAL",
  "CORRECTA ARGUMENTACIÓN",
];

const AREAS = [
  "Calidad",
  "Productividad",
  "Tipificaciones",
  "No Ventas",
];

const SEMANAS = [
  "Semana 4 · Agosto",
  "Semana 3 · Agosto",
  "Semana 2 · Agosto",
  "Semana 1 · Agosto",
];

const COMPROMISOS = [
  "APLICA DEVOLUCIÓN",
  "SEGUIMIENTO",
  "NO APLICA",
];

const ESTADOS = [
  "POR DEBAJO DEL OBJETIVO",
  "ALCANZADO",
  "SUPERADO",
];

const ASESORES_FALLBACK = [
  ["Acosta, Pamela", "8134", "acosta.pamela@portalcalidad.com"],
  ["Aguilera, Trinidad", "8196", "aguilera.trinidad@portalcalidad.com"],
  ["Bahamonde, Camila", "8135", "bahamonde.camila@portalcalidad.com"],
  ["Bustamante, Ailin", "8188", "bustamante.ailin@portalcalidad.com"],
  ["Bustos, Jesica", "8141", "bustos.jesica@portalcalidad.com"],
  ["Cabrera, Antonella", "8187", "cabrera.antonella@portalcalidad.com"],
  ["Contreras, Gilary", "8046", "contreras.gilary@portalcalidad.com"],
  ["Cordoba, Tania", "8202", "cordoba.tania@portalcalidad.com"],
  ["Diaz, Milagros", "8212", "milagros.diaz@portalcalidad.com"],
  ["Gomez, Carla", "8126", "carla.gomez@portalcalidad.com"],
  ["Luna, Oriana", "8097", "oriana.luna@portalcalidad.com"],
  ["Malqui, Xiomara", "8092", "xiomara.malqui@portalcalidad.com"],
  ["Mercado, Chiara", "8209", "chiara.mercado@portalcalidad.com"],
  ["Ojeda, Luana", "8200", "luana.ojeda@portalcalidad.com"],
  ["Olmedo, Thomas", "8192", "olmedo.thomas@portalcalidad.com"],
  ["Peralta, Belen", "8207", "peralta.belen@portalcalidad.com"],
  ["Reartes, Maia", "8201", "reartes.maia@portalcalidad.com"],
  ["Rojek, Luna", "8213", "luna.rojek@portalcalidad.com"],
  ["Simonetta, Valentina", "8191", "simonetta.valentina@portalcalidad.com"],
  ["Tello, Marianela", "8042", "marianela.tello@portalcalidad.com"],
  ["Vasquez, Agustin", "8136", "agustin.vasquez@portalcalidad.com"],
  ["Viniegra, Agustín", "8199", "agustin.viniegra@portalcalidad.com"],
];

function crearAsesorFallback(item) {
  return {
    id: item[1],
    nombre: item[0],
    usuario: item[1],
    email: item[2],
    rol: "asesor",
    activo: true,
  };
}

function crearReporteInicial() {
  return {
    asesor: "",
    nombreAsesor: "",
    semana: "Semana 4 · Agosto",
    producto: "BM",

    nota: "",
    objetivo: "",
    evolucion: "",
    desvio: "",
    recomendacion: "",
    auditoria: "",
    observaciones: "",

    aspectosCalidad: [],
    accionesCalidad: [],

    sph: "",
    objetivoSph: "",
    ventas: "",
    objetivoVentas: "",
    objetivoCampania: "",
    descripcionCampania: "",

    aspectosProductividad: [],
    accionesProductividad: [],

    estadoSph: "",
    estadoVentas: "",
    estadoCampania: "",

    tipificacionesAuditadas: [],
    tipificacionesDesvio: "",
    tipificacionesObjetivo: "",
    tipificacionesResultado: "",
    tipificacionesCompromiso: "",
    tipificacionesObservaciones: "",

    noVentasCantidad: "",
    noVentasCoaching: [],
    noVentasRegistro: "",
    noVentasCompromiso: "",
    noVentasOM: [],
    noVentasFortalezas: [],
    noVentasObservaciones: "",
  };
}

function crearDevolucionInicial() {
  return {
    asesor: "",
    area: "Calidad",
    responsable: "",
    fecha: new Date().toISOString().slice(0, 10),

    notaCalidad: "",

    aspectosCalidad: [],
    accionesCalidad: [],

    aspectosProductividad: [],
    accionesProductividad: [],

    tipificaciones: [],
    om: [],
    registroSistema: "",
    fortalezas: [],
    compromiso: "",

    devolucion: "",
    observaciones: "",
  };
}

function crearAudioInicial() {
  return {
    asesor: "",
    area: "Calidad",
    responsable: "",
    fecha: new Date().toISOString().slice(0, 10),
    archivo: null,

    aspectosCalidad: [],
    aspectosProductividad: [],
    tipificaciones: [],

    devolucion: "",
  };
}

function crearPdaInicial() {
  return {
    asesor: "",
    aspecto: "",
    desde: "",
    hasta: "",
    objetivo: "",
    diagnostico: "",
    metodologia: "",
    seguimiento: "",
    estado: "Activo",
  };
}

function crearFelicitacionInicial() {
  return {
    asesor: "",
    fecha: new Date().toISOString().slice(0, 10),
    responsable: "",
    motivo: "",
    mensaje: "",
    observaciones: "",
  };
}

export default function AdminPage() {
  const [usuario, setUsuario] = useState(null);
  const [asesores, setAsesores] = useState([]);
  const [reportes, setReportes] = useState([]);

  const [devoluciones, setDevoluciones] = useState([]);
  const [audios, setAudios] = useState([]);
  const [pdas, setPdas] = useState([]);
  const [felicitaciones, setFelicitaciones] = useState([]);

  const [vista, setVista] = useState("inicio");
  const [asesorSeleccionado, setAsesorSeleccionado] = useState(null);
  const [subVistaAsesor, setSubVistaAsesor] = useState("resumen");

  const [busqueda, setBusqueda] = useState("");
  const [filtroCampania, setFiltroCampania] = useState("Todas");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const [reporte, setReporte] = useState(crearReporteInicial());
  const [devolucion, setDevolucion] = useState(crearDevolucionInicial());
  const [audio, setAudio] = useState(crearAudioInicial());
  const [pda, setPda] = useState(crearPdaInicial());
  const [felicitacion, setFelicitacion] = useState(
    crearFelicitacionInicial()
  );
  function renderAsesores() {
    return (
      <div style={styles.page}>
        <Card title="Asesores">
          <div style={styles.twoColumns}>
            <div>
              <h3 style={styles.subTitle}>
                Seleccionar asesor
              </h3>

              <div style={styles.advisorList}>
                {ASESORES.map((asesor) => (
                  <button
                    key={asesor}
                    type="button"
                    onClick={() =>
                      setSelectedAdvisor(asesor)
                    }
                    style={{
                      ...styles.advisorButton,
                      ...(selectedAdvisor === asesor
                        ? styles.advisorButtonActive
                        : {}),
                    }}
                  >
                    {asesor}
                  </button>
                ))}
              </div>
            </div>

            <div>
              {!selectedAdvisor ? (
                <div style={styles.emptyState}>
                  Seleccioná un asesor para ver su
                  información.
                </div>
              ) : (
                <>
                  <div style={styles.profileHeader}>
                    <div style={styles.profileKicker}>
                      PERFIL DEL ASESOR
                    </div>

                    <h2 style={styles.profileName}>
                      {selectedAdvisor}
                    </h2>
                  </div>

                  <div style={styles.miniStats}>
                    <div style={styles.miniStat}>
                      <strong>
                        {reporteAsesor.length}
                      </strong>
                      <span>Reportes</span>
                    </div>

                    <div style={styles.miniStat}>
                      <strong>
                        {devolucionesAsesor.length}
                      </strong>
                      <span>Devoluciones</span>
                    </div>

                    <div style={styles.miniStat}>
                      <strong>
                        {audiosAsesor.length}
                      </strong>
                      <span>Audios</span>
                    </div>

                    <div style={styles.miniStat}>
                      <strong>
                        {pdasAsesor.length}
                      </strong>
                      <span>PDA</span>
                    </div>
                  </div>

                  <div style={styles.sectionSpacing}>
                    <h3 style={styles.subTitle}>
                      Último reporte de calidad
                    </h3>

                    {reporteAsesor.length === 0 ? (
                      <div style={styles.emptyState}>
                        No hay reportes cargados.
                      </div>
                    ) : (
                      <div style={styles.resultList}>
                        {reporteAsesor
                          .slice(0, 3)
                          .map((item) => (
                            <div
                              key={item.id}
                              style={styles.resultCard}
                            >
                              <div style={styles.resultTop}>
                                <strong>
                                  {item.semana || "-"}
                                </strong>

                                <StatusBadge
                                  status={
                                    item.estado_calidad ||
                                    ""
                                  }
                                />
                              </div>

                              <div style={styles.resultGrid}>
                                <div>
                                  <span>Nota</span>
                                  <strong>
                                    {item.nota || "-"}
                                  </strong>
                                </div>

                                <div>
                                  <span>Desvío</span>
                                  <strong>
                                    {item.desvio || "-"}
                                  </strong>
                                </div>

                                <div>
                                  <span>Evolución</span>
                                  <strong>
                                    {item.evolucion || "-"}
                                  </strong>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div style={styles.sectionSpacing}>
                    <h3 style={styles.subTitle}>
                      Tipificaciones y No Ventas
                    </h3>

                    {reporteAsesor.length === 0 ? (
                      <div style={styles.emptyState}>
                        No hay información cargada.
                      </div>
                    ) : (
                      <div style={styles.resultList}>
                        {reporteAsesor
                          .slice(0, 3)
                          .map((item) => (
                            <div
                              key={`tip-${item.id}`}
                              style={styles.resultCard}
                            >
                              <div style={styles.resultTop}>
                                <strong>
                                  {item.semana || "-"}
                                </strong>
                              </div>

                              <div style={styles.resultGrid}>
                                <div>
                                  <span>
                                    Tipificaciones auditadas
                                  </span>
                                  <strong>
                                    {item.tipificaciones_auditadas ||
                                      "-"}
                                  </strong>
                                </div>

                                <div>
                                  <span>Desvío</span>
                                  <strong>
                                    {item.tipificaciones_desvio ||
                                      "-"}
                                  </strong>
                                </div>

                                <div>
                                  <span>Resultado</span>
                                  <strong>
                                    {item.tipificaciones_resultado ||
                                      "-"}
                                  </strong>
                                </div>

                                <div>
                                  <span>No Ventas</span>
                                  <strong>
                                    {item.no_ventas || "-"}
                                  </strong>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div style={styles.sectionSpacing}>
                    <h3 style={styles.subTitle}>
                      Devoluciones
                    </h3>

                    {devolucionesAsesor.length === 0 ? (
                      <div style={styles.emptyState}>
                        No hay devoluciones cargadas.
                      </div>
                    ) : (
                      <div style={styles.resultList}>
                        {devolucionesAsesor
                          .slice(0, 5)
                          .map((item) => (
                            <div
                              key={item.id}
                              style={styles.resultCard}
                            >
                              <div style={styles.resultTop}>
                                <strong>
                                  {formatearFecha(
                                    item.created_at
                                  )}
                                </strong>

                                <span>
                                  {item.area || "-"}
                                </span>
                              </div>

                              <p style={styles.resultText}>
                                {item.observaciones ||
                                  "Sin observaciones."}
                              </p>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div style={styles.sectionSpacing}>
                    <h3 style={styles.subTitle}>
                      PDA
                    </h3>

                    {pdasAsesor.length === 0 ? (
                      <div style={styles.emptyState}>
                        No hay PDA cargados.
                      </div>
                    ) : (
                      <div style={styles.resultList}>
                        {pdasAsesor
                          .slice(0, 5)
                          .map((item) => (
                            <div
                              key={item.id}
                              style={styles.resultCard}
                            >
                              <div style={styles.resultTop}>
                                <strong>
                                  {item.aspecto || "-"}
                                </strong>

                                <span>
                                  {formatearFecha(
                                    item.created_at
                                  )}
                                </span>
                              </div>

                              <p style={styles.resultText}>
                                {item.objetivo ||
                                  item.observaciones ||
                                  "Sin información."}
                              </p>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div style={styles.sectionSpacing}>
                    <h3 style={styles.subTitle}>
                      Audios
                    </h3>

                    {audiosAsesor.length === 0 ? (
                      <div style={styles.emptyState}>
                        No hay audios cargados.
                      </div>
                    ) : (
                      <div style={styles.resultList}>
                        {audiosAsesor
                          .slice(0, 5)
                          .map((item) => (
                            <div
                              key={item.id}
                              style={styles.resultCard}
                            >
                              <div style={styles.resultTop}>
                                <strong>
                                  {formatearFecha(
                                    item.created_at
                                  )}
                                </strong>

                                <span>
                                  {item.area || "-"}
                                </span>
                              </div>

                              {item.archivo ? (
                                <audio
                                  controls
                                  src={item.archivo}
                                  style={styles.audioPlayer}
                                />
                              ) : (
                                <p style={styles.resultText}>
                                  Sin archivo.
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  function renderCalidad() {
    return (
      <div style={styles.page}>
        <Card title="Carga de Calidad">
          <form onSubmit={guardarReporte}>
            <div style={styles.formGrid}>
              <Select
                label="Asesor"
                value={reporte.asesor}
                onChange={(value) =>
                  actualizarReporte("asesor", value)
                }
                options={ASESORES}
              />

              <TextInput
                label="Semana"
                value={reporte.semana}
                onChange={(value) =>
                  actualizarReporte("semana", value)
                }
              />

              <Select
                label="Campaña"
                value={reporte.campania}
                onChange={(value) =>
                  actualizarReporte("campania", value)
                }
                options={["AP", "BM"]}
              />

              <NumberInput
                label="Nota"
                value={reporte.notaCalidad}
                onChange={(value) =>
                  actualizarReporte("notaCalidad", value)
                }
                placeholder="Ej. 85"
              />

              <PercentageInput
                label="Objetivo"
                value={reporte.objetivoCalidad}
                onChange={(value) =>
                  actualizarReporte(
                    "objetivoCalidad",
                    value
                  )
                }
              />

              <PercentageInput
                label="Evolución"
                value={reporte.evolucionCalidad}
                onChange={(value) =>
                  actualizarReporte(
                    "evolucionCalidad",
                    value
                  )
                }
              />

              <PercentageInput
                label="Desvío"
                value={reporte.desviosCalidad}
                onChange={(value) =>
                  actualizarReporte(
                    "desviosCalidad",
                    value
                  )
                }
              />
            </div>

            <div style={styles.sectionSpacing}>
              <MultiSelect
                label="Aspectos trabajados"
                options={CALIDAD_ASPECTOS}
                value={
                  reporte.aspectosTrabajadosCalidad
                }
                onChange={(value) =>
                  actualizarReporte(
                    "aspectosTrabajadosCalidad",
                    value
                  )
                }
              />

              <MultiSelect
                label="Acciones realizadas"
                options={CALIDAD_ACCIONES}
                value={reporte.accionesCalidad}
                onChange={(value) =>
                  actualizarReporte(
                    "accionesCalidad",
                    value
                  )
                }
              />

              <TextArea
                label="Observaciones"
                value={reporte.observacionesCalidad}
                onChange={(value) =>
                  actualizarReporte(
                    "observacionesCalidad",
                    value
                  )
                }
              />
            </div>

            <div style={styles.formActions}>
              <button
                type="submit"
                disabled={loading}
                style={styles.primaryButton}
              >
                {loading
                  ? "Guardando..."
                  : "Guardar reporte"}
              </button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  function renderProductividad() {
    return (
      <div style={styles.page}>
        <Card title="Productividad">
          <div style={styles.formGrid}>
            <Select
              label="Asesor"
              value={reporte.asesor}
              onChange={(value) =>
                actualizarReporte("asesor", value)
              }
              options={ASESORES}
            />

            <TextInput
              label="Semana"
              value={reporte.semana}
              onChange={(value) =>
                actualizarReporte("semana", value)
              }
            />

            <NumberInput
              label="SPH"
              value={reporte.sph}
              onChange={(value) =>
                actualizarReporte("sph", value)
              }
            />

            <NumberInput
              label="Objetivo SPH"
              value={reporte.objetivoSph}
              onChange={(value) =>
                actualizarReporte(
                  "objetivoSph",
                  value
                )
              }
            />

            <NumberInput
              label="Ventas"
              value={reporte.ventas}
              onChange={(value) =>
                actualizarReporte("ventas", value)
              }
            />

            <NumberInput
              label="Objetivo ventas"
              value={reporte.objetivoVentas}
              onChange={(value) =>
                actualizarReporte(
                  "objetivoVentas",
                  value
                )
              }
            />

            <NumberInput
              label="Objetivo de campaña"
              value={reporte.objetivoCampania}
              onChange={(value) =>
                actualizarReporte(
                  "objetivoCampania",
                  value
                )
              }
              placeholder="0000"
              small
            />
          </div>

          <div style={styles.sectionSpacing}>
            <MultiSelect
              label="Aspectos trabajados"
              options={PRODUCTIVIDAD_ASPECTOS}
              value={
                reporte.aspectosTrabajadosProductividad
              }
              onChange={(value) =>
                actualizarReporte(
                  "aspectosTrabajadosProductividad",
                  value
                )
              }
            />

            <MultiSelect
              label="Acciones realizadas"
              options={PRODUCTIVIDAD_ACCIONES}
              value={reporte.accionesProductividad}
              onChange={(value) =>
                actualizarReporte(
                  "accionesProductividad",
                  value
                )
              }
            />

            <TextArea
              label="Observaciones"
              value={
                reporte.observacionesProductividad
              }
              onChange={(value) =>
                actualizarReporte(
                  "observacionesProductividad",
                  value
                )
              }
            />
          </div>
        </Card>
      </div>
    );
  }

  function renderTipificaciones() {
    return (
      <div style={styles.page}>
        <Card title="Tipificaciones">
          <div style={styles.formGrid}>
            <Select
              label="Asesor"
              value={reporte.asesor}
              onChange={(value) =>
                actualizarReporte("asesor", value)
              }
              options={ASESORES}
            />

            <TextInput
              label="Semana"
              value={reporte.semana}
              onChange={(value) =>
                actualizarReporte("semana", value)
              }
            />
          </div>

          <div style={styles.sectionSpacing}>
            <MultiSelect
              label="Tipificaciones auditadas"
              options={TIPIFICACIONES}
              value={reporte.tipificacionesAuditadas}
              onChange={(value) =>
                actualizarReporte(
                  "tipificacionesAuditadas",
                  value
                )
              }
            />
          </div>
