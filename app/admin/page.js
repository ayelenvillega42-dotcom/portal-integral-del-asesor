"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const ADMIN_EMAIL = "ayelenvillega42@gmail.com";

const CALIDAD_ASPECTOS = [
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

const CALIDAD_ACCIONES = [
  "Feedback individual",
  "Espacio de coaching",
  "Escucha en línea",
  "Devolución mediante Meet",
  "Escucha de llamada de un compañero",
  "Transcripción de venta mediante Word con desvíos marcados",
  "Calibración conjunta de audio",
  "Otros",
];

const PRODUCTIVIDAD_ASPECTOS = [
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

const PRODUCTIVIDAD_ACCIONES = [
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

const ASESORES = [
  "Acosta, Pamela",
  "Aguilera, Trinidad",
  "Bahamonde, Camila",
  "Bustamante, Ailin",
  "Bustos, Jesica",
  "Cabrera, Antonella",
  "Contreras, Gilary",
  "Cordoba, Tania",
  "Diaz, Milagros",
  "Gomez, Carla",
  "Luna, Oriana",
  "Malqui, Xiomara",
  "Mercado, Chiara",
  "Ojeda, Luana",
  "Olmedo, Thomas",
  "Peralta, Belen",
  "Reartes, Maia",
  "Rojek, Luna",
  "Simonetta, Valentina",
  "Tello, Marianela",
  "Vasquez, Agustin",
  "Viniegra, Agustín",
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

function Card({ title, action, children }) {
  return (
    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  options = [],
  placeholder = "",
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>

      {type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={styles.textarea}
          rows={5}
        />
      ) : type === "select" ? (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          style={styles.select}
        >
          <option value="">Seleccionar...</option>

          {options.map((option) => {
            const item =
              typeof option === "string"
                ? {
                    value: option,
                    label: option,
                  }
                : option;

            return (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={styles.input}
        />
      )}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder = "",
}) {
  return (
    <Field
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 5,
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>

      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={styles.textarea}
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  placeholder = "",
  small = false,
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>

      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...styles.input,
          ...(small
            ? styles.smallNumberInput
            : {}),
        }}
      />
    </div>
  );
}

function PercentageInput({
  label,
  value,
  onChange,
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>

      <div style={styles.percentWrap}>
        <input
          type="number"
          step="0.01"
          value={value ?? ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          style={styles.percentInput}
        />

        <span style={styles.percentSymbol}>
          %
        </span>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options = [],
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>

      <select
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={styles.select}
      >
        <option value="">
          Seleccionar...
        </option>

        {options.map((option) => {
          const item =
            typeof option === "string"
              ? {
                  value: option,
                  label: option,
                }
              : option;

          return (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function MultiSelect({
  label,
  options = [],
  value = [],
  onChange,
}) {
  const selected = Array.isArray(value)
    ? value
    : [];

  function toggleOption(option) {
    if (selected.includes(option)) {
      onChange(
        selected.filter(
          (item) => item !== option
        )
      );
    } else {
      onChange([...selected, option]);
    }
  }

  return (
    <div style={styles.field}>
      {label && (
        <label style={styles.label}>
          {label}
        </label>
      )}

      <div style={styles.multiSelect}>
        {options.map((option) => (
          <label
            key={option}
            style={styles.checkRow}
          >
            <input
              type="checkbox"
              checked={selected.includes(
                option
              )}
              onChange={() =>
                toggleOption(option)
              }
            />

            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function FormSection({
  title,
  children,
}) {
  return (
    <div style={styles.sectionSpacing}>
      <h3 style={styles.subTitle}>
        {title}
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = String(
    status || ""
  ).toUpperCase();

  let background = "#edf1f3";

  if (
    normalized.includes("SUPERADO")
  ) {
    background = "#b8e0c2";
  } else if (
    normalized.includes("ALCANZADO")
  ) {
    background = "#d9efdf";
  } else if (
    normalized.includes("DEBAJO")
  ) {
    background = "#f2c5c5";
  } else if (
    normalized.includes("SEGUIMIENTO")
  ) {
    background = "#f5e6b5";
  }

  return (
    <span
      style={{
        ...styles.badge,
        background,
      }}
    >
      {status || "Sin estado"}
    </span>
  );
}

function formatearFecha(fecha) {
  if (!fecha) return "-";

  try {
    return new Date(
      fecha
    ).toLocaleDateString(
      "es-AR"
    );
  } catch {
    return fecha;
  }
}

function normalizarArray(valor) {
  if (Array.isArray(valor)) {
    return valor;
  }

  if (!valor) {
    return [];
  }

  if (typeof valor === "string") {
    try {
      const parsed =
        JSON.parse(valor);

      return Array.isArray(parsed)
        ? parsed
        : [valor];
    } catch {
      return valor
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function calcularEstado(
  calidad,
  productividad,
  objetivoCalidad = 80,
  objetivoProductividad = 0
) {
  const calidadNumero =
    Number(calidad);

  const productividadNumero =
    Number(productividad);

  const calidadOk =
    Number.isFinite(
      calidadNumero
    ) &&
    calidadNumero >=
      Number(objetivoCalidad);

  const productividadOk =
    Number.isFinite(
      productividadNumero
    ) &&
    productividadNumero >=
      Number(objetivoProductividad);

  if (
    calidadOk &&
    productividadOk &&
    calidadNumero >
      Number(objetivoCalidad) &&
    productividadNumero >
      Number(objetivoProductividad)
  ) {
    return "SUPERADO";
  }

  if (
    calidadOk &&
    productividadOk
  ) {
    return "ALCANZADO";
  }

  return "POR DEBAJO DEL OBJETIVO";
}

export default function AdminPage() {
  const [activeTab, setActiveTab] =
    useState("inicio");

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [asesores, setAsesores] =
    useState(
      ASESORES.map((nombre) => ({
        nombre,
        cuenta:
          "Hipotecario Seguros",
        campania: "BM",
      }))
    );

  const [reportes, setReportes] =
    useState([]);

  const [devoluciones, setDevoluciones] =
    useState([]);

  const [audios, setAudios] =
    useState([]);

  const [pdas, setPdas] =
    useState([]);

  const [felicitaciones, setFelicitaciones] =
    useState([]);

  const [selectedAdvisor, setSelectedAdvisor] =
    useState("");

  const [semana, setSemana] =
    useState("");

  const [campania, setCampania] =
    useState("");

  const [buscarAsesor, setBuscarAsesor] =
    useState("");

  const [reporte, setReporte] =
    useState(
      crearReporteInicial()
    );

  const [devolucion, setDevolucion] =
    useState(
      crearDevolucionInicial()
    );

  const [audio, setAudio] =
    useState(
      crearAudioInicial()
    );

  const [pda, setPda] =
    useState(
      crearPdaInicial()
    );

  const [
    felicitacion,
    setFelicitacion,
  ] = useState(
    crearFelicitacionInicial()
  );

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    if (!supabase) {
      setError(
        "No se pudo conectar con Supabase. Verificá las variables de entorno."
      );
      return;
    }

    try {
      setLoading(true);

      const [
        reportesResponse,
        devolucionesResponse,
        audiosResponse,
        pdasResponse,
        felicitacionesResponse,
      ] = await Promise.all([
        supabase
          .from("reportes")
          .select("*")
          .order(
            "id",
            { ascending: false }
          ),

        supabase
          .from("devoluciones")
          .select("*")
          .order(
            "id",
            { ascending: false }
          ),

        supabase
          .from("audios")
          .select("*")
          .order(
            "id",
            { ascending: false }
          ),

        supabase
          .from("pdas")
          .select("*")
          .order(
            "id",
            { ascending: false }
          ),

        supabase
          .from("felicitaciones")
          .select("*")
          .order(
            "id",
            { ascending: false }
          ),
      ]);

      if (reportesResponse.error) {
        console.error(
          reportesResponse.error
        );
      }

      if (
        devolucionesResponse.error
      ) {
        console.error(
          devolucionesResponse.error
        );
      }

      if (audiosResponse.error) {
        console.error(
          audiosResponse.error
        );
      }

      if (pdasResponse.error) {
        console.error(
          pdasResponse.error
        );
      }

      if (
        felicitacionesResponse.error
      ) {
        console.error(
          felicitacionesResponse.error
        );
      }

      setReportes(
        reportesResponse.data || []
      );

      setDevoluciones(
        devolucionesResponse.data ||
          []
      );

      setAudios(
        audiosResponse.data || []
      );

      setPdas(
        pdasResponse.data || []
      );

      setFelicitaciones(
        felicitacionesResponse.data ||
          []
      );
    } catch (err) {
      console.error(err);

      setError(
        "No se pudieron cargar los datos."
      );
    } finally {
      setLoading(false);
    }
  }

  function actualizarReporte(
    campo,
    valor
  ) {
    setReporte((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function actualizarDevolucion(
    campo,
    valor
  ) {
    setDevolucion((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function actualizarAudio(
    campo,
    valor
  ) {
    setAudio((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function actualizarPda(
    campo,
    valor
  ) {
    setPda((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function actualizarFelicitacion(
    campo,
    valor
  ) {
    setFelicitacion((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function limpiarMensajes() {
    setMessage("");
    setError("");
  }

  async function guardarReporte(e) {
    e?.preventDefault();

    limpiarMensajes();

    if (!supabase) {
      setError(
        "Supabase no está configurado."
      );
      return;
    }

    if (!reporte.asesor) {
      setError(
        "Seleccioná un asesor."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        asesor: reporte.asesor,
        semana: reporte.semana,
        producto:
          reporte.producto ||
          reporte.campania ||
          null,

        nota:
          reporte.nota !== ""
            ? Number(reporte.nota)
            : reporte.notaCalidad !== ""
            ? Number(
                reporte.notaCalidad
              )
            : null,

        objetivo:
          reporte.objetivo !== ""
            ? reporte.objetivo
            : reporte.objetivoCalidad,

        evolucion:
          reporte.evolucion ||
          reporte.evolucionCalidad ||
          null,

        desvio:
          reporte.desvio ||
          reporte.desviosCalidad ||
          null,

        recomendacion:
          reporte.recomendacion ||
          normalizarArray(
            reporte
              .aspectosTrabajadosCalidad
          ).join(", "),

        auditoria:
          reporte.auditoria ||
          normalizarArray(
            reporte
              .accionesCalidad
          ).join(", "),

        observaciones:
          reporte.observaciones ||
          reporte.observacionesCalidad ||
          null,

        sph:
          reporte.sph !== ""
            ? Number(reporte.sph)
            : null,

        objetivo_sph:
          reporte.objetivoSph !== ""
            ? Number(
                reporte.objetivoSph
              )
            : null,

        ventas:
          reporte.ventas !== ""
            ? Number(reporte.ventas)
            : null,

        objetivo_ventas:
          reporte.objetivoVentas !== ""
            ? Number(
                reporte.objetivoVentas
              )
            : null,

        objetivo_campania:
          reporte.objetivoCampania ||
          null,

        tipificaciones_auditadas:
          normalizarArray(
            reporte
              .tipificacionesAuditadas
          ).join(", "),

        tipificaciones_desvio:
          reporte.tipificacionesDesvio ||
          null,

        tipificaciones_objetivo:
          reporte.tipificacionesObjetivo ||
          null,

        tipificaciones_resultado:
          reporte.tipificacionesResultado ||
          null,

        no_ventas:
          reporte.noVentasCantidad !== ""
            ? Number(
                reporte.noVentasCantidad
              )
            : null,

        gestion:
          reporte.tipificacionesCompromiso ||
          reporte.noVentasCompromiso ||
          null,
      };

      const { data, error } =
        await supabase
          .from("reportes")
          .insert([payload])
          .select()
          .single();

      if (error) {
        throw error;
      }

      setReportes((prev) => [
        data,
        ...prev,
      ]);

      setMessage(
        "Reporte guardado correctamente."
      );

      setReporte(
        crearReporteInicial()
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "No se pudo guardar el reporte."
      );
    } finally {
      setLoading(false);
    }
  }

function renderSeguimiento() {
    const pendientesPda = pdas.filter(
      (item) =>
        String(item.estado || "")
          .toLowerCase() === "activo"
    );

    const pendientesDev = devoluciones.filter(
      (item) =>
        String(item.estado || "")
          .toLowerCase()
          .includes("pendiente")
    );

    const pendientesAudio = audios.filter(
      (item) =>
        String(item.estado || "")
          .toLowerCase()
          .includes("pendiente")
    );

    return (
      <div style={styles.page}>
        <Card title="Seguimiento">
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>
                {pendientesPda.length}
              </span>
              <span style={styles.statLabel}>
                PDA activos
              </span>
            </div>

            <div style={styles.statCard}>
              <span style={styles.statNumber}>
                {pendientesDev.length}
              </span>
              <span style={styles.statLabel}>
                Devoluciones pendientes
              </span>
            </div>

            <div style={styles.statCard}>
              <span style={styles.statNumber}>
                {pendientesAudio.length}
              </span>
              <span style={styles.statLabel}>
                Audios pendientes
              </span>
            </div>
          </div>

          <div style={styles.sectionSpacing}>
            <h3 style={styles.subTitle}>
              PDA
            </h3>

            {pendientesPda.length === 0 ? (
              <div style={styles.emptyState}>
                No hay PDA activos.
              </div>
            ) : (
              <div style={styles.resultList}>
                {pendientesPda.map((item) => (
                  <div
                    key={item.id}
                    style={styles.resultCard}
                  >
                    <div style={styles.resultTop}>
                      <strong>
                        {item.asesor || "-"}
                      </strong>

                      <StatusBadge
                        status={
                          item.estado ||
                          "Activo"
                        }
                      />
                    </div>

                    <div
                      style={styles.resultGrid}
                    >
                      <div
                        style={
                          styles.resultGridItem
                        }
                      >
                        <span>
                          Aspecto
                        </span>
                        <strong>
                          {item.aspecto ||
                            "-"}
                        </strong>
                      </div>

                      <div
                        style={
                          styles.resultGridItem
                        }
                      >
                        <span>
                          Desde
                        </span>
                        <strong>
                          {formatearFecha(
                            item.fecha_desde
                          )}
                        </strong>
                      </div>

                      <div
                        style={
                          styles.resultGridItem
                        }
                      >
                        <span>
                          Hasta
                        </span>
                        <strong>
                          {formatearFecha(
                            item.fecha_hasta
                          )}
                        </strong>
                      </div>

                      <div
                        style={
                          styles.resultGridItem
                        }
                      >
                        <span>
                          Objetivo
                        </span>
                        <strong>
                          {item.objetivo ||
                            "-"}
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
              DEVOLUCIONES
            </h3>

            {pendientesDev.length === 0 ? (
              <div style={styles.emptyState}>
                No hay devoluciones pendientes.
              </div>
            ) : (
              <div style={styles.resultList}>
                {pendientesDev.map((item) => (
                  <div
                    key={item.id}
                    style={styles.resultCard}
                  >
                    <div style={styles.resultTop}>
                      <strong>
                        {item.asesor || "-"}
                      </strong>

                      <StatusBadge
                        status={
                          item.estado ||
                          "Pendiente"
                        }
                      />
                    </div>

                    <p style={styles.resultText}>
                      Área:{" "}
                      {item.area || "-"}
                    </p>

                    <p style={styles.resultText}>
                      Responsable:{" "}
                      {item.responsable ||
                        "-"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.sectionSpacing}>
            <h3 style={styles.subTitle}>
              AUDIOS
            </h3>

            {pendientesAudio.length === 0 ? (
              <div style={styles.emptyState}>
                No hay audios pendientes.
              </div>
            ) : (
              <div style={styles.resultList}>
                {pendientesAudio.map((item) => (
                  <div
                    key={item.id}
                    style={styles.resultCard}
                  >
                    <div style={styles.resultTop}>
                      <strong>
                        {item.asesor || "-"}
                      </strong>

                      <StatusBadge
                        status={
                          item.estado ||
                          "Pendiente"
                        }
                      />
                    </div>

                    <p style={styles.resultText}>
                      Área:{" "}
                      {item.area || "-"}
                    </p>

                    <p style={styles.resultText}>
                      Fecha:{" "}
                      {formatearFecha(
                        item.fecha
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  function renderImpresionMasiva() {
    const [seleccionados, setSeleccionados] =
      useState([]);

    const reportesDisponibles =
      reportes.filter((item) => {
        const coincideSemana =
          !semana ||
          String(item.semana || "")
            .toLowerCase()
            .includes(
              semana.toLowerCase()
            );

        const coincideCampania =
          !campania ||
          String(
            item.campania ||
              item.producto ||
              ""
          ).toUpperCase() ===
            campania.toUpperCase();

        return (
          coincideSemana &&
          coincideCampania
        );
      });

    function toggleReporte(id) {
      setSeleccionados((prev) =>
        prev.includes(id)
          ? prev.filter(
              (item) => item !== id
            )
          : [...prev, id]
      );
    }

    function seleccionarTodos() {
      setSeleccionados(
        reportesDisponibles.map(
          (item) => item.id
        )
      );
    }

    function quitarTodos() {
      setSeleccionados([]);
    }

    function imprimirSeleccionados() {
      const items =
        reportesDisponibles.filter(
          (item) =>
            seleccionados.includes(
              item.id
            )
        );

      if (items.length === 0) {
        setError(
          "Seleccioná al menos un reporte."
        );
        return;
      }

      const ventana =
        window.open(
          "",
          "_blank",
          "width=1000,height=800"
        );

      if (!ventana) {
        setError(
          "El navegador bloqueó la ventana de impresión."
        );
        return;
      }

      const paginas = items
        .map(
          (item) => `
            <section class="page">
              <div class="header">
                <div class="kicker">
                  PORTAL INTEGRAL DEL ASESOR
                </div>

                <h1>
                  ${item.asesor || "-"}
                </h1>

                <div>
                  ${item.semana || "-"}
                </div>
              </div>

              <div class="grid">
                <div class="box">
                  <span>CAMPAÑA</span>
                  <strong>
                    ${
                      item.campania ||
                      item.producto ||
                      "-"
                    }
                  </strong>
                </div>

                <div class="box">
                  <span>NOTA</span>
                  <strong>
                    ${item.nota || "-"}
                  </strong>
                </div>

                <div class="box">
                  <span>OBJETIVO</span>
                  <strong>
                    ${
                      item.objetivo ||
                      "-"
                    }
                  </strong>
                </div>

                <div class="box">
                  <span>SPH</span>
                  <strong>
                    ${item.sph || "-"}
                  </strong>
                </div>

                <div class="box">
                  <span>VENTAS</span>
                  <strong>
                    ${item.ventas || "-"}
                  </strong>
                </div>

                <div class="box">
                  <span>DESVÍO</span>
                  <strong>
                    ${item.desvio || "-"}
                  </strong>
                </div>
              </div>

              <div class="section">
                <h2>
                  Aspectos trabajados
                </h2>

                <div class="text">
                  ${
                    item.recomendacion ||
                    "-"
                  }
                </div>
              </div>

              <div class="section">
                <h2>
                  Observaciones
                </h2>

                <div class="text">
                  ${
                    item.observaciones ||
                    "-"
                  }
                </div>
              </div>
            </section>
          `
        )
        .join("");

      ventana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="UTF-8" />

            <title>
              Reportes seleccionados
            </title>

            <style>
              body {
                font-family:
                  Arial,
                  Helvetica,
                  sans-serif;
                color: #17333b;
                margin: 0;
              }

              .page {
                min-height: 250mm;
                box-sizing: border-box;
                padding: 20mm;
                page-break-after: always;
              }

              .page:last-child {
                page-break-after: auto;
              }

              .header {
                border-bottom:
                  3px solid #1d7771;
                padding-bottom: 18px;
                margin-bottom: 25px;
              }

              .kicker {
                color: #1d7771;
                font-size: 11px;
                font-weight: bold;
                letter-spacing: 1px;
                margin-bottom: 7px;
              }

              h1 {
                margin: 0;
                font-size: 28px;
              }

              h2 {
                margin-top: 28px;
                font-size: 18px;
              }

              .grid {
                display: grid;
                grid-template-columns:
                  repeat(3, 1fr);
                gap: 12px;
              }

              .box {
                border:
                  1px solid #d9e0e2;
                border-radius: 9px;
                padding: 14px;
              }

              .box span {
                display: block;
                font-size: 10px;
                color: #68787d;
                margin-bottom: 5px;
              }

              .box strong {
                font-size: 16px;
              }

              .section {
                border-top:
                  1px solid #d9e0e2;
                margin-top: 25px;
                padding-top: 18px;
              }

              .text {
                line-height: 1.6;
                font-size: 13px;
                white-space: pre-wrap;
              }
            </style>
          </head>

          <body>
            ${paginas}

            <script>
              window.onload = function () {
                window.print();
              };
            </script>
          </body>
        </html>
      `);

      ventana.document.close();
    }

    return (
      <div style={styles.page}>
        <Card title="Impresión masiva">
          <div style={styles.formGrid}>
            <TextInput
              label="Semana"
              value={semana}
              onChange={setSemana}
              placeholder="Semana 4 • Agosto"
            />

            <Select
              label="Cuenta"
              value={campania}
              onChange={setCampania}
              options={[
                "BM",
                "AP",
              ]}
            />
          </div>

          <div style={styles.formActions}>
            <button
              type="button"
              onClick={
                seleccionarTodos
              }
              style={styles.secondaryButton}
            >
              Seleccionar todos
            </button>

            <button
              type="button"
              onClick={quitarTodos}
              style={{
                ...styles.secondaryButton,
                marginLeft: "8px",
              }}
            >
              Quitar selección
            </button>
          </div>

          <div style={styles.sectionSpacing}>
            {reportesDisponibles.length ===
            0 ? (
              <div style={styles.emptyState}>
                No hay reportes para los
                filtros seleccionados.
              </div>
            ) : (
              <div style={styles.resultList}>
                {reportesDisponibles.map(
                  (item) => (
                    <label
                      key={item.id}
                      style={{
                        ...styles.resultCard,
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={seleccionados.includes(
                          item.id
                        )}
                        onChange={() =>
                          toggleReporte(
                            item.id
                          )
                        }
                      />

                      <div>
                        <strong>
                          {item.asesor ||
                            "-"}
                        </strong>

                        <div
                          style={
                            styles.resultText
                          }
                        >
                          {item.semana ||
                            "-"}{" "}
                          •{" "}
                          {item.campania ||
                            item.producto ||
                            "-"}
                        </div>
                      </div>
                    </label>
                  )
                )}
              </div>
            )}
          </div>

          <div style={styles.formActions}>
            <button
              type="button"
              onClick={
                imprimirSeleccionados
              }
              disabled={
                seleccionados.length ===
                0
              }
              style={styles.primaryButton}
            >
              Imprimir seleccionados
            </button>
          </div>
        </Card>
      </div>
    );
  }

function renderReportes() {
    return (
      <div style={styles.page}>
        <Card title="Reportes de calidad">
          <div style={styles.formGrid}>
            <TextInput
              label="Buscar asesor"
              value={buscarAsesor}
              onChange={setBuscarAsesor}
              placeholder="Nombre del asesor"
            />

            <TextInput
              label="Semana"
              value={semana}
              onChange={setSemana}
              placeholder="Semana 4 • Agosto"
            />

            <Select
              label="Campaña"
              value={campania}
              onChange={setCampania}
              options={[
                "BM",
                "AP",
              ]}
            />
          </div>

          <div style={styles.sectionSpacing}>
            {reportesFiltrados.length === 0 ? (
              <div style={styles.emptyState}>
                No hay reportes para los filtros
                seleccionados.
              </div>
            ) : (
              <div style={styles.resultList}>
                {reportesFiltrados.map(
                  (item) => (
                    <div
                      key={item.id}
                      style={styles.resultCard}
                    >
                      <div
                        style={
                          styles.resultTop
                        }
                      >
                        <div>
                          <span
                            style={
                              styles.profileKicker
                            }
                          >
                            REPORTE DE CALIDAD
                          </span>

                          <strong
                            style={{
                              display:
                                "block",
                              fontSize:
                                "18px",
                              marginTop:
                                "4px",
                            }}
                          >
                            {item.asesor ||
                              "-"}
                          </strong>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            imprimirReporte(
                              item
                            )
                          }
                          style={
                            styles.secondaryButton
                          }
                        >
                          Imprimir
                        </button>
                      </div>

                      <div
                        style={
                          styles.resultGrid
                        }
                      >
                        <div
                          style={
                            styles.resultGridItem
                          }
                        >
                          <span>
                            Semana
                          </span>

                          <strong>
                            {item.semana ||
                              "-"}
                          </strong>
                        </div>

                        <div
                          style={
                            styles.resultGridItem
                          }
                        >
                          <span>
                            Campaña
                          </span>

                          <strong>
                            {item.campania ||
                              item.producto ||
                              "-"}
                          </strong>
                        </div>

                        <div
                          style={
                            styles.resultGridItem
                          }
                        >
                          <span>
                            Nota
                          </span>

                          <strong>
                            {item.nota ??
                              "-"}
                          </strong>
                        </div>

                        <div
                          style={
                            styles.resultGridItem
                          }
                        >
                          <span>
                            Objetivo
                          </span>

                          <strong>
                            {item.objetivo ||
                              "-"}
                          </strong>
                        </div>

                        <div
                          style={
                            styles.resultGridItem
                          }
                        >
                          <span>
                            SPH
                          </span>

                          <strong>
                            {item.sph ??
                              "-"}
                          </strong>
                        </div>

                        <div
                          style={
                            styles.resultGridItem
                          }
                        >
                          <span>
                            Ventas
                          </span>

                          <strong>
                            {item.ventas ??
                              "-"}
                          </strong>
                        </div>
                      </div>

                      {item.desvio && (
                        <div
                          style={
                            styles.infoBox
                          }
                        >
                          <strong>
                            Desvío
                          </strong>

                          <div
                            style={
                              styles.resultText
                            }
                          >
                            {item.desvio}
                          </div>
                        </div>
                      )}

                      {item.recomendacion && (
                        <div
                          style={
                            styles.infoBox
                          }
                        >
                          <strong>
                            Recomendación
                          </strong>

                          <div
                            style={
                              styles.resultText
                            }
                          >
                            {
                              item.recomendacion
                            }
                          </div>
                        </div>
                      )}

                      {item.observaciones && (
                        <div
                          style={
                            styles.infoBox
                          }
                        >
                          <strong>
                            Observaciones
                          </strong>

                          <div
                            style={
                              styles.resultText
                            }
                          >
                            {
                              item.observaciones
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  function renderDevoluciones() {
    return (
      <div style={styles.page}>
        <Card title="Nueva devolución">
          <form
            onSubmit={guardarDevolucion}
          >
            <div style={styles.formGrid}>
              <Select
                label="Asesor"
                value={
                  devolucion.asesor
                }
                onChange={(value) =>
                  actualizarDevolucion(
                    "asesor",
                    value
                  )
                }
                options={ASESORES}
              />

              <Select
                label="Área"
                value={
                  devolucion.area
                }
                onChange={(value) =>
                  actualizarDevolucion(
                    "area",
                    value
                  )
                }
                options={[
                  "Calidad",
                  "Productividad",
                  "Tipificaciones",
                  "No Ventas",
                  "Integral",
                ]}
              />

              <Select
                label="Estado"
                value={
                  devolucion.estado
                }
                onChange={(value) =>
                  actualizarDevolucion(
                    "estado",
                    value
                  )
                }
                options={[
                  "Pendiente",
                  "Realizada",
                  "En seguimiento",
                ]}
              />

              <NumberInput
                label="Nota de calidad"
                value={
                  devolucion.notaCalidad
                }
                onChange={(value) =>
                  actualizarDevolucion(
                    "notaCalidad",
                    value
                  )
                }
              />
            </div>

            <div
              style={
                styles.sectionSpacing
              }
            >
              <MultiSelect
                label="Aspectos de calidad"
                options={
                  CALIDAD_ASPECTOS
                }
                value={
                  devolucion.aspectosCalidad
                }
                onChange={(value) =>
                  actualizarDevolucion(
                    "aspectosCalidad",
                    value
                  )
                }
              />

              <MultiSelect
                label="Acciones de calidad"
                options={
                  CALIDAD_ACCIONES
                }
                value={
                  devolucion.accionesCalidad
                }
                onChange={(value) =>
                  actualizarDevolucion(
                    "accionesCalidad",
                    value
                  )
                }
              />

              <MultiSelect
                label="Aspectos de productividad"
                options={
                  PRODUCTIVIDAD_ASPECTOS
                }
                value={
                  devolucion.aspectosProductividad
                }
                onChange={(value) =>
                  actualizarDevolucion(
                    "aspectosProductividad",
                    value
                  )
                }
              />

              <MultiSelect
                label="Acciones de productividad"
                options={
                  PRODUCTIVIDAD_ACCIONES
                }
                value={
                  devolucion.accionesProductividad
                }
                onChange={(value) =>
                  actualizarDevolucion(
                    "accionesProductividad",
                    value
                  )
                }
              />

              <MultiSelect
                label="Tipificación"
                options={
                  TIPIFICACIONES
                }
                value={
                  devolucion.tipificacion
                }
                onChange={(value) =>
                  actualizarDevolucion(
                    "tipificacion",
                    value
                  )
                }
              />

              <MultiSelect
                label="OM"
                options={OM}
                value={
                  devolucion.om
                }
                onChange={(value) =>
                  actualizarDevolucion(
                    "om",
                    value
                  )
                }
              />

              <Select
                label="Registro en sistema"
                value={
                  devolucion.registroSistema
                }
                onChange={(value) =>
                  actualizarDevolucion(
                    "registroSistema",
                    value
                  )
                }
                options={[
                  "Correcto",
                  "Incorrecto",
                  "No corresponde",
                ]}
              />

              <MultiSelect
                label="Fortalezas"
                options={FORTALEZAS}
                value={
                  devolucion.fortalezas
                }
                onChange={(value) =>
                  actualizarDevolucion(
                    "fortalezas",
                    value
                  )
                }
              />

              <TextArea
                label="Observaciones"
                value={
                  devolucion.observaciones
                }
                onChange={(value) =>
                  actualizarDevolucion(
                    "observaciones",
                    value
                  )
                }
              />
            </div>

            <div
              style={styles.formActions}
            >
              <button
                type="submit"
                disabled={loading}
                style={styles.primaryButton}
              >
                {loading
                  ? "Guardando..."
                  : "Guardar devolución"}
              </button>
            </div>
          </form>
        </Card>

        <Card title="Historial de devoluciones">
          {devoluciones.length === 0 ? (
            <div style={styles.emptyState}>
              Todavía no hay devoluciones
              cargadas.
            </div>
          ) : (
            <div style={styles.resultList}>
              {devoluciones.map(
                (item) => (
                  <div
                    key={item.id}
                    style={
                      styles.resultCard
                    }
                  >
                    <div
                      style={
                        styles.resultTop
                      }
                    >
                      <strong>
                        {item.asesor ||
                          "-"}
                      </strong>

                      <StatusBadge
                        status={
                          item.estado ||
                          "Pendiente"
                        }
                      />
                    </div>

                    <div
                      style={
                        styles.resultText
                      }
                    >
                      {item.area ||
                        "Integral"}
                    </div>

                    {item.observaciones && (
                      <div
                        style={{
                          ...styles.infoBox,
                          marginTop:
                            "12px",
                        }}
                      >
                        {
                          item.observaciones
                        }
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </Card>
      </div>
    );
  }

            function renderTipificaciones() {
    return (
      <div style={styles.page}>
        <Card title="Tipificaciones auditadas">
          <form
            onSubmit={guardarTipificacion}
          >
            <div style={styles.formGrid}>
              <Select
                label="Asesor"
                value={
                  tipificacion.asesor
                }
                onChange={(value) =>
                  actualizarTipificacion(
                    "asesor",
                    value
                  )
                }
                options={ASESORES}
              />

              <TextInput
                label="Semana"
                value={
                  tipificacion.semana
                }
                onChange={(value) =>
                  actualizarTipificacion(
                    "semana",
                    value
                  )
                }
                placeholder="Semana 4 • Agosto"
              />

              <Select
                label="Campaña"
                value={
                  tipificacion.campania
                }
                onChange={(value) =>
                  actualizarTipificacion(
                    "campania",
                    value
                  )
                }
                options={[
                  "BM",
                  "AP",
                ]}
              />
            </div>

            <div
              style={
                styles.sectionSpacing
              }
            >
              <MultiSelect
                label="Tipificaciones auditadas"
                options={
                  TIPIFICACIONES
                }
                value={
                  tipificacion.tipificacionesAuditadas
                }
                onChange={(value) =>
                  actualizarTipificacion(
                    "tipificacionesAuditadas",
                    value
                  )
                }
              />

              <MultiSelect
                label="Desvíos encontrados"
                options={
                  TIPIFICACIONES_DESVIOS
                }
                value={
                  tipificacion.desvios
                }
                onChange={(value) =>
                  actualizarTipificacion(
                    "desvios",
                    value
                  )
                }
              />

              <TextArea
                label="Observaciones"
                value={
                  tipificacion.observaciones
                }
                onChange={(value) =>
                  actualizarTipificacion(
                    "observaciones",
                    value
                  )
                }
              />
            </div>

            <div
              style={styles.formActions}
            >
              <button
                type="submit"
                disabled={loading}
                style={styles.primaryButton}
              >
                {loading
                  ? "Guardando..."
                  : "Guardar tipificación"}
              </button>
            </div>
          </form>
        </Card>

        <Card title="Tipificaciones cargadas">
          {tipificaciones.length ===
          0 ? (
            <div style={styles.emptyState}>
              Todavía no hay tipificaciones
              cargadas.
            </div>
          ) : (
            <div style={styles.resultList}>
              {tipificaciones.map(
                (item) => (
                  <div
                    key={item.id}
                    style={
                      styles.resultCard
                    }
                  >
                    <div
                      style={
                        styles.resultTop
                      }
                    >
                      <div>
                        <strong>
                          {item.asesor ||
                            "-"}
                        </strong>

                        <div
                          style={
                            styles.resultText
                          }
                        >
                          {item.semana ||
                            "-"}{" "}
                          •{" "}
                          {item.campania ||
                            "-"}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        ...styles.infoBox,
                        marginTop:
                          "12px",
                      }}
                    >
                      <strong>
                        Auditadas
                      </strong>

                      <div
                        style={
                          styles.resultText
                        }
                      >
                        {
                          item.tipificaciones_auditadas
                        }
                      </div>
                    </div>

                    {item.desvios && (
                      <div
                        style={{
                          ...styles.infoBox,
                          marginTop:
                            "12px",
                        }}
                      >
                        <strong>
                          Desvíos
                        </strong>

                        <div
                          style={
                            styles.resultText
                          }
                        >
                          {item.desvios}
                        </div>
                      </div>
                    )}

                    {item.observaciones && (
                      <div
                        style={{
                          ...styles.infoBox,
                          marginTop:
                            "12px",
                        }}
                      >
                        <strong>
                          Observaciones
                        </strong>

                        <div
                          style={
                            styles.resultText
                          }
                        >
                          {
                            item.observaciones
                          }
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </Card>
      </div>
    );
  }

  function renderNoVentas() {
    return (
      <div style={styles.page}>
        <Card title="No Ventas">
          <form
            onSubmit={guardarNoVenta}
          >
            <div style={styles.formGrid}>
              <Select
                label="Asesor"
                value={noVenta.asesor}
                onChange={(value) =>
                  actualizarNoVenta(
                    "asesor",
                    value
                  )
                }
                options={ASESORES}
              />

              <TextInput
                label="Semana"
                value={noVenta.semana}
                onChange={(value) =>
                  actualizarNoVenta(
                    "semana",
                    value
                  )
                }
              />

              <Select
                label="Campaña"
                value={noVenta.campania}
                onChange={(value) =>
                  actualizarNoVenta(
                    "campania",
                    value
                  )
                }
                options={[
                  "BM",
                  "AP",
                ]}
              />

              <Select
                label="Motivo"
                value={noVenta.motivo}
                onChange={(value) =>
                  actualizarNoVenta(
                    "motivo",
                    value
                  )
                }
                options={
                  MOTIVOS_NO_VENTA
                }
              />
            </div>

            <div
              style={
                styles.sectionSpacing
              }
            >
              <MultiSelect
                label="Motivos adicionales"
                options={
                  MOTIVOS_NO_VENTA
                }
                value={
                  noVenta.motivosAdicionales
                }
                onChange={(value) =>
                  actualizarNoVenta(
                    "motivosAdicionales",
                    value
                  )
                }
              />

              <TextArea
                label="Observaciones"
                value={
                  noVenta.observaciones
                }
                onChange={(value) =>
                  actualizarNoVenta(
                    "observaciones",
                    value
                  )
                }
              />
            </div>

            <div
              style={styles.formActions}
            >
              <button
                type="submit"
                disabled={loading}
                style={styles.primaryButton}
              >
                {loading
                  ? "Guardando..."
                  : "Guardar No Venta"}
              </button>
            </div>
          </form>
        </Card>

        <Card title="No Ventas cargadas">
          {noVentas.length === 0 ? (
            <div style={styles.emptyState}>
              Todavía no hay registros.
            </div>
          ) : (
            <div style={styles.resultList}>
              {noVentas.map((item) => (
                <div
                  key={item.id}
                  style={
                    styles.resultCard
                  }
                >
                  <div
                    style={
                      styles.resultTop
                    }
                  >
                    <strong>
                      {item.asesor ||
                        "-"}
                    </strong>

                    <span
                      style={
                        styles.smallMuted
                      }
                    >
                      {item.semana ||
                        "-"}
                    </span>
                  </div>

                  <div
                    style={
                      styles.resultGrid
                    }
                  >
                    <div
                      style={
                        styles.resultGridItem
                      }
                    >
                      <span>
                        Campaña
                      </span>

                      <strong>
                        {item.campania ||
                          "-"}
                      </strong>
                    </div>

                    <div
                      style={
                        styles.resultGridItem
                      }
                    >
                      <span>
                        Motivo
                      </span>

                      <strong>
                        {item.motivo ||
                          "-"}
                      </strong>
                    </div>
                  </div>

                  {item.observaciones && (
                    <div
                      style={{
                        ...styles.infoBox,
                        marginTop:
                          "12px",
                      }}
                    >
                      {
                        item.observaciones
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  }

  function renderFelicitaciones() {
    return (
      <div style={styles.page}>
        <Card title="Felicitaciones">
          <form
            onSubmit={
              guardarFelicitacion
            }
          >
            <div style={styles.formGrid}>
              <Select
                label="Asesor"
                value={
                  felicitacion.asesor
                }
                onChange={(value) =>
                  actualizarFelicitacion(
                    "asesor",
                    value
                  )
                }
                options={ASESORES}
              />

              <TextInput
                label="Fecha"
                type="date"
                value={
                  felicitacion.fecha
                }
                onChange={(value) =>
                  actualizarFelicitacion(
                    "fecha",
                    value
                  )
                }
              />
            </div>

            <div
              style={
                styles.sectionSpacing
              }
            >
              <TextArea
                label="Motivo"
                value={
                  felicitacion.motivo
                }
                onChange={(value) =>
                  actualizarFelicitacion(
                    "motivo",
                    value
                  )
                }
                placeholder="¿Por qué destacamos al asesor?"
              />
            </div>

            <div
              style={styles.formActions}
            >
              <button
                type="submit"
                disabled={loading}
                style={styles.primaryButton}
              >
                {loading
                  ? "Guardando..."
                  : "Guardar felicitación"}
              </button>
            </div>
          </form>
        </Card>

        <Card title="Felicitaciones cargadas">
          {felicitaciones.length ===
          0 ? (
            <div style={styles.emptyState}>
              Todavía no hay felicitaciones.
            </div>
          ) : (
            <div style={styles.resultList}>
              {felicitaciones.map(
                (item) => (
                  <div
                    key={item.id}
                    style={
                      styles.resultCard
                    }
                  >
                    <div
                      style={
                        styles.resultTop
                      }
                    >
                      <strong>
                        {item.asesor ||
                          "-"}
                      </strong>

                      <span
                        style={
                          styles.smallMuted
                        }
                      >
                        {formatearFecha(
                          item.fecha
                        )}
                      </span>
                    </div>

                    <div
                      style={{
                        ...styles.infoBox,
                        marginTop:
                          "12px",
                      }}
                    >
                      {item.motivo ||
                        "-"}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </Card>
      </div>
    );
  }

function renderDashboard() {
    const totalReportes =
      reportes.length;

    const totalAudios =
      audios.length;

    const totalPdas =
      pdas.length;

    const totalFelicitaciones =
      felicitaciones.length;

    const promedioNotas =
      reportes.length > 0
        ? (
            reportes.reduce(
              (total, item) =>
                total +
                Number(
                  item.nota || 0
                ),
              0
            ) / reportes.length
          ).toFixed(2)
        : "0.00";

    return (
      <div style={styles.page}>
        <div style={styles.dashboardHeader}>
          <div>
            <span
              style={
                styles.profileKicker
              }
            >
              PORTAL INTEGRAL DEL ASESOR
            </span>

            <h1
              style={
                styles.dashboardTitle
              }
            >
              Panel de administración
            </h1>

            <p
              style={
                styles.dashboardSubtitle
              }
            >
              Gestión integral de calidad,
              productividad y seguimiento
              de asesores.
            </p>
          </div>

          <div
            style={
              styles.dashboardDate
            }
          >
            {new Date().toLocaleDateString(
              "es-AR",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }
            )}
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span
              style={
                styles.statNumber
              }
            >
              {totalReportes}
            </span>

            <span
              style={
                styles.statLabel
              }
            >
              Reportes
            </span>
          </div>

          <div style={styles.statCard}>
            <span
              style={
                styles.statNumber
              }
            >
              {promedioNotas}
            </span>

            <span
              style={
                styles.statLabel
              }
            >
              Promedio de nota
            </span>
          </div>

          <div style={styles.statCard}>
            <span
              style={
                styles.statNumber
              }
            >
              {totalAudios}
            </span>

            <span
              style={
                styles.statLabel
              }
            >
              Audios
            </span>
          </div>

          <div style={styles.statCard}>
            <span
              style={
                styles.statNumber
              }
            >
              {totalPdas}
            </span>

            <span
              style={
                styles.statLabel
              }
            >
              Planes de acción
            </span>
          </div>

          <div style={styles.statCard}>
            <span
              style={
                styles.statNumber
              }
            >
              {totalFelicitaciones}
            </span>

            <span
              style={
                styles.statLabel
              }
            >
              Felicitaciones
            </span>
          </div>
        </div>

        <Card title="Accesos rápidos">
          <div style={styles.quickGrid}>
            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "reportes"
                )
              }
              style={styles.quickCard}
            >
              <strong>
                Reportes
              </strong>

              <span>
                Consultar y gestionar
                reportes de calidad.
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "devoluciones"
                )
              }
              style={styles.quickCard}
            >
              <strong>
                Devoluciones
              </strong>

              <span>
                Registrar y consultar
                devoluciones.
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "audios"
                )
              }
              style={styles.quickCard}
            >
              <strong>
                Audios
              </strong>

              <span>
                Cargar audios y asociar
                devoluciones.
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "pdas"
                )
              }
              style={styles.quickCard}
            >
              <strong>
                Plan de Acción
              </strong>

              <span>
                Crear y realizar seguimiento
                de PDA.
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "tipificaciones"
                )
              }
              style={styles.quickCard}
            >
              <strong>
                Tipificaciones
              </strong>

              <span>
                Auditar tipificaciones y
                registrar desvíos.
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "no-ventas"
                )
              }
              style={styles.quickCard}
            >
              <strong>
                No Ventas
              </strong>

              <span>
                Registrar motivos y
                observaciones.
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "felicitaciones"
                )
              }
              style={styles.quickCard}
            >
              <strong>
                Felicitaciones
              </strong>

              <span>
                Reconocer buenas prácticas
                de los asesores.
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "seguimiento"
                )
              }
              style={styles.quickCard}
            >
              <strong>
                Seguimiento
              </strong>

              <span>
                Ver pendientes y acciones
                activas.
              </span>
            </button>
          </div>
        </Card>

        <Card title="Últimos reportes">
          {reportes.length === 0 ? (
            <div style={styles.emptyState}>
              Todavía no hay reportes
              cargados.
            </div>
          ) : (
            <div style={styles.resultList}>
              {reportes
                .slice(0, 5)
                .map((item) => (
                  <div
                    key={item.id}
                    style={
                      styles.resultCard
                    }
                  >
                    <div
                      style={
                        styles.resultTop
                      }
                    >
                      <div>
                        <strong>
                          {item.asesor ||
                            "-"}
                        </strong>

                        <div
                          style={
                            styles.resultText
                          }
                        >
                          {item.semana ||
                            "-"}{" "}
                          •{" "}
                          {item.campania ||
                            item.producto ||
                            "-"}
                        </div>
                      </div>

                      <strong>
                        {item.nota ??
                          "-"}
                      </strong>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card>
      </div>
    );
  }

function renderContenido() {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();

      case "reportes":
        return renderReportes();

      case "devoluciones":
        return renderDevoluciones();

      case "audios":
        return renderAudios();

      case "pdas":
        return renderPdas();

      case "tipificaciones":
        return renderTipificaciones();

      case "no-ventas":
        return renderNoVentas();

      case "felicitaciones":
        return renderFelicitaciones();

      case "seguimiento":
        return renderSeguimiento();

      case "impresion":
        return renderImpresionMasiva();

      default:
        return renderDashboard();
    }
  }

  if (!usuarioActual) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <div style={styles.loginLogo}>
            PC
          </div>

          <span
            style={styles.profileKicker}
          >
            PORTAL INTEGRAL DEL ASESOR
          </span>

          <h1 style={styles.loginTitle}>
            Administración
          </h1>

          <p
            style={
              styles.loginSubtitle
            }
          >
            Ingresá para gestionar la
            información del portal.
          </p>

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            style={styles.loginForm}
          >
            <TextInput
              label="Usuario"
              value={loginData.usuario}
              onChange={(value) =>
                setLoginData((prev) => ({
                  ...prev,
                  usuario: value,
                }))
              }
              placeholder="Ingresá tu usuario"
            />

            <TextInput
              label="Contraseña"
              type="password"
              value={loginData.password}
              onChange={(value) =>
                setLoginData((prev) => ({
                  ...prev,
                  password: value,
                }))
              }
              placeholder="Ingresá tu contraseña"
            />

            <button
              type="submit"
              disabled={loading}
              style={styles.primaryButton}
            >
              {loading
                ? "Ingresando..."
                : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandLogo}>
            PC
          </div>

          <div>
            <strong>
              Portal Integral
            </strong>

            <span>
              Administración
            </span>
          </div>
        </div>

        <nav style={styles.nav}>
          <button
            type="button"
            onClick={() =>
              setActiveSection(
                "dashboard"
              )
            }
            style={{
              ...styles.navButton,
              ...(activeSection ===
              "dashboard"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                "reportes"
              )
            }
            style={{
              ...styles.navButton,
              ...(activeSection ===
              "reportes"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Reportes
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                "devoluciones"
              )
            }
            style={{
              ...styles.navButton,
              ...(activeSection ===
              "devoluciones"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Devoluciones
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                "audios"
              )
            }
            style={{
              ...styles.navButton,
              ...(activeSection ===
              "audios"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Audios
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                "pdas"
              )
            }
            style={{
              ...styles.navButton,
              ...(activeSection ===
              "pdas"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Plan de Acción
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                "tipificaciones"
              )
            }
            style={{
              ...styles.navButton,
              ...(activeSection ===
              "tipificaciones"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Tipificaciones
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                "no-ventas"
              )
            }
            style={{
              ...styles.navButton,
              ...(activeSection ===
              "no-ventas"
                ? styles.navButtonActive
                : {}),
            }}
          >
            No Ventas
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                "felicitaciones"
              )
            }
            style={{
              ...styles.navButton,
              ...(activeSection ===
              "felicitaciones"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Felicitaciones
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                "seguimiento"
              )
            }
            style={{
              ...styles.navButton,
              ...(activeSection ===
              "seguimiento"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Seguimiento
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                "impresion"
              )
            }
            style={{
              ...styles.navButton,
              ...(activeSection ===
              "impresion"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Impresión masiva
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <div
            style={
              styles.userMiniCard
            }
          >
            <div
              style={
                styles.userAvatar
              }
            >
              {String(
                usuarioActual.nombre ||
                  "A"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {
                  usuarioActual.nombre
                }
              </strong>

              <span>
                Administrador
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={cerrarSesion}
            style={styles.logoutButton}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        {message && (
          <div style={styles.successBox}>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        {renderContenido()}
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    background: "#f5f7f8",
    color: "#17333b",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  sidebar: {
    width: "250px",
    minHeight: "100vh",
    background: "#ffffff",
    borderRight:
      "1px solid #e0e6e8",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "24px 20px",
    borderBottom:
      "1px solid #edf0f1",
  },

  brandLogo: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#1d7771",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "15px",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "24px 20px",
    borderBottom:
      "1px solid #edf0f1",
  },

  nav: {
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    overflowY: "auto",
    flex: 1,
  },

  navButton: {
    width: "100%",
    border: "none",
    background: "transparent",
    textAlign: "left",
    padding: "11px 14px",
    borderRadius: "9px",
    color: "#52656b",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  navButtonActive: {
    background: "#e8f4f2",
    color: "#1d7771",
  },

  sidebarFooter: {
    padding: "14px",
    borderTop:
      "1px solid #edf0f1",
  },

  userMiniCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    marginBottom: "10px",
  },

  userAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#dceceb",
    color: "#1d7771",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  logoutButton: {
    width: "100%",
    padding: "10px",
    border:
      "1px solid #d9e0e2",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#52656b",
    cursor: "pointer",
  },

  main: {
    marginLeft: "250px",
    width: "calc(100% - 250px)",
    minHeight: "100vh",
    padding: "30px",
    boxSizing: "border-box",
  },

  page: {
    maxWidth: "1250px",
    margin: "0 auto",
  },

  dashboardHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "25px",
  },

  dashboardTitle: {
    margin: "7px 0 5px",
    fontSize: "30px",
    lineHeight: 1.15,
  },

  dashboardSubtitle: {
    margin: 0,
    color: "#68787d",
    fontSize: "14px",
  },

  dashboardDate: {
    color: "#68787d",
    fontSize: "13px",
    paddingTop: "8px",
  },

  profileKicker: {
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1px",
    color: "#1d7771",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "14px",
    marginBottom: "22px",
  },

  statCard: {
    background: "#ffffff",
    border:
      "1px solid #e0e6e8",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  statNumber: {
    fontSize: "27px",
    fontWeight: "800",
    color: "#17333b",
  },

  statLabel: {
    fontSize: "12px",
    color: "#68787d",
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "12px",
  },

  quickCard: {
    border:
      "1px solid #e0e6e8",
    background: "#ffffff",
    borderRadius: "10px",
    padding: "16px",
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    color: "#17333b",
  },

  sectionSpacing: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  subTitle: {
    fontSize: "15px",
    margin: 0,
    color: "#17333b",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#52656b",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border:
      "1px solid #d5dfe1",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#17333b",
    fontSize: "14px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "110px",
    boxSizing: "border-box",
    padding: "11px 12px",
    border:
      "1px solid #d5dfe1",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#17333b",
    fontSize: "14px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    outline: "none",
  },

  fileInput: {
    padding: "10px",
    border:
      "1px dashed #c8d4d7",
    borderRadius: "8px",
    background: "#fafcfc",
  },

  formActions: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "20px",
  },

  primaryButton: {
    border: "none",
    background: "#1d7771",
    color: "#ffffff",
    padding: "11px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },

  secondaryButton: {
    border:
      "1px solid #cfdadd",
    background: "#ffffff",
    color: "#365057",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },

  resultList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  resultCard: {
    background: "#ffffff",
    border:
      "1px solid #e0e6e8",
    borderRadius: "11px",
    padding: "16px",
  },

  resultTop: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: "15px",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
    marginTop: "15px",
  },

  resultGridItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  resultGridItemSpan: {
    fontSize: "10px",
    color: "#76878b",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },

  resultText: {
    marginTop: "4px",
    color: "#52656b",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  infoBox: {
    marginTop: "12px",
    padding: "12px",
    background: "#f7fafa",
    borderRadius: "8px",
    border:
      "1px solid #e6eded",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  smallMuted: {
    color: "#76878b",
    fontSize: "12px",
  },

  emptyState: {
    padding: "25px",
    textAlign: "center",
    border:
      "1px dashed #ccd7da",
    borderRadius: "10px",
    color: "#76878b",
    background: "#fafcfc",
    fontSize: "13px",
  },

  successBox: {
    background: "#eaf7f0",
    color: "#17653d",
    border:
      "1px solid #bfe4cf",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: "13px",
    fontWeight: "600",
  },

  errorBox: {
    background: "#fff1f1",
    color: "#a52b2b",
    border:
      "1px solid #efc7c7",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: "13px",
    fontWeight: "600",
  },

  loginPage: {
    minHeight: "100vh",
    background: "#f5f7f8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "25px",
    boxSizing: "border-box",
  },

  loginCard: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    border:
      "1px solid #e0e6e8",
    borderRadius: "16px",
    padding: "35px",
    boxSizing: "border-box",
    boxShadow:
      "0 15px 40px rgba(23, 51, 59, 0.08)",
  },

  loginLogo: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background: "#1d7771",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    marginBottom: "20px",
  },

  loginTitle: {
    margin: "8px 0",
    fontSize: "28px",
  },

  loginSubtitle: {
    color: "#68787d",
    fontSize: "14px",
    lineHeight: 1.5,
    marginBottom: "25px",
  },

  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
};

function Card({ title, children }) {
  return (
    <section
      style={{
        background: "#ffffff",
        border:
          "1px solid #e0e6e8",
        borderRadius: "13px",
        padding: "22px",
        marginBottom: "20px",
      }}
    >
      {title && (
        <h2
          style={{
            margin:
              "0 0 18px",
            fontSize: "18px",
            color: "#17333b",
          }}
        >
          {title}
        </h2>
      )}

      {children}
    </section>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding:
          "5px 9px",
        borderRadius: "999px",
        background: "#e8f4f2",
        color: "#1d7771",
        fontSize: "11px",
        fontWeight: "700",
        whiteSpace: "nowrap",
      }}
    >
      {status || "Pendiente"}
    </span>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) {
  return (
    <div style={styles.field}>
      {label && (
        <label style={styles.label}>
          {label}
        </label>
      )}

      <input
        type={type}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        style={styles.input}
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}) {
  return (
    <TextInput
      label={label}
      type="number"
      value={value}
      onChange={onChange}
    />
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder = "",
}) {
  return (
    <div style={styles.field}>
      {label && (
        <label style={styles.label}>
          {label}
        </label>
      )}

      <textarea
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        style={styles.textarea}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options = [],
}) {
  return (
    <div style={styles.field}>
      {label && (
        <label style={styles.label}>
          {label}
        </label>
      )}

      <select
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={styles.input}
      >
        <option value="">
          Seleccionar...
        </option>

        {options.map((option) => (
          <option
            key={String(option)}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function MultiSelect({
  label,
  options = [],
  value = [],
  onChange,
}) {
  const selected =
    Array.isArray(value)
      ? value
      : [];

  function toggleOption(option) {
    if (selected.includes(option)) {
      onChange(
        selected.filter(
          (item) =>
            item !== option
        )
      );
    } else {
      onChange([
        ...selected,
        option,
      ]);
    }
  }

  return (
    <div style={styles.field}>
      {label && (
        <label style={styles.label}>
          {label}
        </label>
      )}

      <div
        style={{
          border:
            "1px solid #d5dfe1",
          borderRadius: "8px",
          padding: "10px",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          gap: "7px",
          maxHeight: "220px",
          overflowY: "auto",
        }}
      >
        {options.length === 0 ? (
          <span
            style={
              styles.smallMuted
            }
          >
            No hay opciones cargadas.
          </span>
        ) : (
          options.map((option) => (
            <label
              key={String(option)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={selected.includes(
                  option
                )}
                onChange={() =>
                  toggleOption(
                    option
                  )
                }
              />

              <span>
                {option}
              </span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
