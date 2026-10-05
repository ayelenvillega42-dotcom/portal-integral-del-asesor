"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const PALETTE = {
  navy: "#031926",
  teal: "#468189",
  mint: "#77ACA2",
  soft: "#9DBEBB",
  cream: "#F4E9CD",
};

const ASESORES = [
  "Tello, Marianela", "Contreras, Gilary", "Malqui, Xiomara", "Luna, Oriana",
  "Gomez, Carla", "Acosta, Pamela", "Bahamonde, Camila", "Vasquez, Agustin",
  "Bustos, Jesica", "Cabrera, Antonella", "Bustamante, Ailin",
  "Simonetta, Valentina", "Olmedo, Thomas", "Aguilera, Trinidad",
  "Viniegra, Agustín", "Ojeda, Luana", "Reartes, Maia", "Cordoba, Tania",
  "Peralta, Belen", "Mercado, Chiara", "Diaz, Milagros", "Rojek, Luna",
];

const CALIDAD_ASPECTOS = [
  "Información de otras compañías", "Presentación HS", "Validación de datos",
  "Cláusula de aceptación", "Información", "Preexistencia", "Negociación",
  "Precio", "Suscripción", "Asume Responsabilidad del Sponsor",
  "Habilidades de comunicación",
];

const CALIDAD_ACCIONES = [
  "Feedback individual", "Espacio de coaching", "Escucha en línea",
  "Devolución mediante Meet", "Escucha de llamada de un compañero",
  "Transcripción de venta mediante Word con desvíos marcados",
  "Calibración conjunta de audio", "Otros",
];

const PRODUCTIVIDAD_ASPECTOS = [
  "Técnicas manejo de objeciones", "Generación de interés", "Cambio apertura",
  "Escucha activa", "Venta consultiva", "Venta conversacional",
  "Ejemplos de P.S.", "Cierre con seguridad comercial", "Manejo de objeciones",
  "Ofrecimiento", "Rebate comercial", "Rebate conversacional",
  "Rebate asertivo", "Posicionamiento", "Manejo de la llamada",
];

const PRODUCTIVIDAD_ACCIONES = [
  "FEEDBACK INDIVIDUAL", "ESPACIO DE COACHING", "ESCUCHA EN LÍNEA",
  "ROLEPLAY COMERCIAL", "ROLEPLAY DE OBJECIONES", "REPASO DE SPEECH",
  "REFUERZO DE ESCUCHA ACTIVA", "REFUERZO DE REBATES", "CALIBRACIÓN",
  "SIMULACIÓN DE LLAMADA", "ACOMPAÑAMIENTO EN LÍNEA",
  "DEVOLUCIÓN PERSONALIZADA", "SEGUIMIENTO DIARIO",
  "REFUERZO DE TIPIFICACIÓN", "REFUERZO DE CIERRE", "REFUERZO DE SONDEO",
  "REFUERZO DE APERTURA", "REPASO DE PROCESOS", "CAPACITACIÓN",
  "ESCUCHA DE LLAMADAS",
];

const TIPIFICACIONES = [
  "VENTA", "VOLVER A LLAMAR", "VOLVER A LLAMAR ARGUMENTANDO",
  "NO PERMITE ARGUMENTAR", "CLIENTE DISCONFORME CON CIA",
  "CLIENTE DISCONFORME CON EL BANCO", "TIENE PRODUCTO CON OTRA CÍA",
  "NO CONFORME CON SUMAS ASEGURADAS", "NO INTERESADO PRODUCTO",
  "NO INTERESADO NO INFORMA MOTIVO", "PROBLEMAS ECONÓMICOS", "LE PARECE CARO",
  "DARA DE BAJA MEDIO DE PAGO", "NO ELEGIBLE / NO REÚNE REQUISTOS",
  "NO CONTESTA",
];

const OM = [
  "MANEJO DE OBJECIONES", "GENERACION DE INTERES", "APERTURA",
  "ESCUCHA ACTIVA", "VENTA CONSULTIVA", "VENTA CONVERSACIONAL",
  "EJEMPLOS DE P.S", "CIERRE CON SEGURIDAD COMERCIAL", "OFRECIMIENTO",
  "REBATE COMERCIAL", "REBATE CONVERSACIONAL", "REBATE ASERTIVO", "PAUSAS",
  "POSICIONAMIENTO", "MANEJO DE LA LLAMADA", "PRODUCTO", "SONDEO",
];

const FORTALEZAS = [
  "ESCUCHA ACTIVA", "BUEN SONDEO", "SEGURIDAD COMERCIAL", "EMPATÍA",
  "BUEN TONO", "MANEJO DE OBJECIONES", "CORRECTA VALIDACIÓN", "BUEN CIERRE",
  "IMPULSO COMERCIAL", "FLUIDEZ CONVERSACIONAL", "ADAPTABILIDAD",
  "BUENA DETECCIÓN DE NECESIDAD", "CLARIDAD EN EXPLICACIÓN",
  "BUEN MANEJO DE SILENCIOS", "CORRECTA CONTENCIÓN", "VENTA CONSULTIVA",
  "BUENA APERTURA", "PERSISTENCIA COMERCIAL", "CORRECTA ARGUMENTACIÓN",
];

const AREAS = ["Calidad", "Productividad", "Tipificaciones", "No Ventas"];
const TIPOS_SANCION = [
  "Llamado de atención",
  "Apercibimiento",
  "Suspensión",
  "Sanción",
  "Otro",
];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const ESTADOS = {
  alcanzado: "ALCANZADO",
  superado: "SUPERADO",
  debajo: "POR DEBAJO DEL OBJETIVO",
};

function porcentaje(value) {
  if (value === null || value === undefined || value === "") return "";
  return String(value).includes("%") ? String(value) : `${value}%`;
}

function normalizarPorcentaje(value) {
  if (value === null || value === undefined || value === "") return "";
  return String(value).replace("%", "").trim();
}

function formatearFecha(fecha) {
  if (!fecha) return "-";
  try {
    return new Date(fecha).toLocaleDateString("es-AR");
  } catch {
    return fecha;
  }
}

function semanaDe(fecha) {
  const d = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(String(fecha)) ? `${fecha}T12:00:00` : fecha
  );
  if (!fecha || isNaN(d.getTime())) return "Sin fecha";
  return `Semana ${Math.ceil(d.getDate() / 7)} · ${MESES[d.getMonth()]}`;
}

function esc(v) {
  return String(v ?? "-")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function MultiSelect({ label, options, value = [], onChange }) {
  const toggle = (option) =>
    onChange(
      value.includes(option)
        ? value.filter((item) => item !== option)
        : [...value, option]
    );

  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <div style={styles.multiSelect}>
        {options.map((option) => (
          <label key={option} style={styles.checkRow}>
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => toggle(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function PercentageInput({ label, value, onChange }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <div style={styles.percentWrap}>
        <input
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={normalizarPorcentaje(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          style={styles.percentInput}
        />
        <span style={styles.percentSymbol}>%</span>
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, placeholder = "", small }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...styles.input, ...(small ? styles.smallNumberInput : {}) }}
      />
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div style={styles.field}>
      {label ? <label style={styles.label}>{label}</label> : null}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.input}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={styles.textarea}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.select}
      >
        <option value="">Seleccionar...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Card({ title, children, action }) {
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

function StatusBadge({ status }) {
  let background = PALETTE.soft;
  if (status === ESTADOS.superado) background = PALETTE.teal;
  else if (status === ESTADOS.alcanzado) background = PALETTE.mint;
  else if (status === ESTADOS.debajo) background = "#d99a9a";
  return <span style={{ ...styles.badge, background }}>{status || "-"}</span>;
}

function Bloque({ titulo, items }) {
  return (
    <div style={styles.sectionSpacing}>
      <h4 style={styles.subTitle}>
        {titulo} ({items.length})
      </h4>
      {items.length === 0 ? (
        <div style={styles.emptyState}>Sin registros.</div>
      ) : (
        <div style={styles.resultList}>{items.map((i) => i)}</div>
      )}
    </div>
  );
}

function Dato({ k, v }) {
  return (
    <div>
      <span>{k}</span>
      <strong>{v || "-"}</strong>
    </div>
  );
}

function HistorialSemanal({
  asesor,
  reportes,
  devoluciones,
  audios,
  pdas,
  felicitaciones,
  sanciones = [],
}) {
  const [semSel, setSemSel] = useState("");

  const semanas = useMemo(() => {
    const mapa = {};
    const add = (tipo, item, sem) => {
      const key = sem || "Sin fecha";
      const ts = new Date(item.created_at || 0).getTime() || 0;
      if (!mapa[key]) {
        mapa[key] = {
          key, ts: 0, reportes: [], devoluciones: [], audios: [], pdas: [],
          felicitaciones: [], sanciones: [],
        };
      }
      mapa[key][tipo].push(item);
      mapa[key].ts = Math.max(mapa[key].ts, ts);
    };

    reportes.forEach((i) =>
      add("reportes", i, i.semana || semanaDe(i.created_at))
    );
    devoluciones.forEach((i) => add("devoluciones", i, semanaDe(i.created_at)));
    audios.forEach((i) => add("audios", i, semanaDe(i.created_at)));
    pdas.forEach((i) => add("pdas", i, semanaDe(i.created_at)));
    felicitaciones.forEach((i) =>
      add("felicitaciones", i, semanaDe(i.created_at || i.fecha))
    );
    sanciones.forEach((i) =>
      add("sanciones", i, semanaDe(i.fecha || i.created_at))
    );

    return Object.values(mapa).sort((a, b) => b.ts - a.ts);
  }, [reportes, devoluciones, audios, pdas, felicitaciones, sanciones]);

  const visibles = semSel ? semanas.filter((s) => s.key === semSel) : semanas;

  if (!asesor) return null;

  return (
    <div style={styles.sectionSpacing}>
      <div style={styles.resultTop}>
        <h3 style={styles.subTitle}>Historial por semana</h3>
        <select
          value={semSel}
          onChange={(e) => setSemSel(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">Todas las semanas</option>
          {semanas.map((s) => (
            <option key={s.key} value={s.key}>
              {s.key}
            </option>
          ))}
        </select>
      </div>

      {visibles.length === 0 && (
        <div style={styles.emptyState}>
          Todavía no hay actividad registrada para este asesor.
        </div>
      )}

      {visibles.map((s) => (
        <div key={s.key} style={styles.weekCard}>
          <div style={styles.weekTitle}>{s.key}</div>

          <Bloque
            titulo="Reportes"
            items={s.reportes.map((r) => (
              <div key={r.id} style={styles.resultCard}>
                <div style={styles.resultGrid}>
                  <Dato k="Campaña" v={r.campania} />
                  <Dato k="Nota" v={r.nota} />
                  <Dato k="Objetivo" v={r.objetivo} />
                  <Dato k="Desvío" v={r.desvio} />
                  <Dato k="Evolución" v={r.evolucion} />
                  <Dato k="SPH" v={r.sph} />
                  <Dato k="Ventas" v={r.ventas} />
                  <Dato k="Tipificaciones" v={r.tipificaciones_resultado} />
                  <Dato k="No ventas" v={r.no_ventas} />
                </div>
                <p style={styles.resultText}>
                  <b>Aspectos:</b> {r.recomendacion || "-"}
                </p>
                <p style={styles.resultText}>
                  <b>Obs.:</b> {r.observaciones || "-"}
                </p>
              </div>
            ))}
          />

          <Bloque
            titulo="Devoluciones"
            items={s.devoluciones.map((d) => (
              <div key={d.id} style={styles.resultCard}>
                <div style={styles.resultTop}>
                  <strong>{d.area || "-"}</strong>
                  <span>
                    {formatearFecha(d.created_at)}
                    {d.responsable ? ` · ${d.responsable}` : ""}
                  </span>
                </div>
                <p style={styles.resultText}>
                  {d.aspectos_calidad || d.aspectos_productividad || ""}
                </p>
                <p style={styles.resultText}>
                  {d.observaciones || "Sin observaciones."}
                </p>
              </div>
            ))}
          />

          <Bloque
            titulo="Audios"
            items={s.audios.map((a) => (
              <div key={a.id} style={styles.resultCard}>
                <div style={styles.resultTop}>
                  <strong>{a.area || "-"}</strong>
                  <span>{formatearFecha(a.created_at)}</span>
                </div>
                {a.archivo ? (
                  <audio controls src={a.archivo} style={styles.audioPlayer} />
                ) : null}
                <p style={styles.resultText}>{a.devolucion || ""}</p>
              </div>
            ))}
          />

          <Bloque
            titulo="Planes de acción"
            items={s.pdas.map((p) => (
              <div key={p.id} style={styles.resultCard}>
                <div style={styles.resultTop}>
                  <strong>{p.aspecto || "-"}</strong>
                  <span>
                    {p.fecha_desde || "-"} → {p.fecha_hasta || "-"}
                  </span>
                </div>
                <p style={styles.resultText}>
                  {p.objetivo || p.observaciones || "Sin información."}
                </p>
              </div>
            ))}
          />

          <Bloque
            titulo="Apercibimientos y sanciones"
            items={s.sanciones.map((x, idx) => (
              <div key={x.id || idx} style={styles.resultCard}>
                <div style={styles.resultTop}>
                  <strong>{x.tipo || "-"}</strong>
                  <span>{formatearFecha(x.fecha || x.created_at)}</span>
                </div>
                <p style={styles.resultText}>{x.motivo || "-"}</p>
                {x.observaciones ? (
                  <p style={styles.resultText}>{x.observaciones}</p>
                ) : null}
              </div>
            ))}
          />

          <Bloque
            titulo="Felicitaciones"
            items={s.felicitaciones.map((f, idx) => (
              <div key={f.id || idx} style={styles.resultCard}>
                <div style={styles.resultTop}>
                  <strong>{f.fecha || formatearFecha(f.created_at)}</strong>
                </div>
                <p style={styles.resultText}>{f.motivo}</p>
              </div>
            ))}
          />
        </div>
      ))}
    </div>
  );
}

const REPORTE_INICIAL = {
  asesor: "",
  semana: "Semana 4 · Agosto",
  campania: "BM",
  notaCalidad: "",
  objetivoCalidad: "",
  evolucionCalidad: "",
  desviosCalidad: "",
  aspectosTrabajadosCalidad: [],
  accionesCalidad: [],
  observacionesCalidad: "",
  sph: "",
  objetivoSph: "",
  ventas: "",
  objetivoVentas: "",
  objetivoCampania: "",
  aspectosTrabajadosProductividad: [],
  accionesProductividad: [],
  observacionesProductividad: "",
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

const DEVOLUCION_INICIAL = {
  asesor: "",
  area: "Calidad",
  responsable: "",
  notaCalidad: "",
  aspectosCalidad: [],
  accionesCalidad: [],
  aspectosProductividad: [],
  accionesProductividad: [],
  tipificacion: [],
  om: [],
  registroSistema: "",
  fortalezas: [],
  observaciones: "",
};

const AUDIO_INICIAL = {
  asesor: "",
  area: "Calidad",
  responsable: "",
  fecha: "",
  archivo: null,
  aspectosCalidad: [],
  aspectosProductividad: [],
  tipificacion: [],
  devolucion: "",
};

const PDA_INICIAL = {
  asesor: "",
  aspecto: "",
  fechaDesde: "",
  fechaHasta: "",
  objetivo: "",
  observaciones: "",
};

const SANCION_INICIAL = {
  asesor: "",
  tipo: "",
  fecha: "",
  motivo: "",
  observaciones: "",
};

const TABS = [
  ["inicio", "Inicio"],
  ["asesores", "Asesores"],
  ["calidad", "Calidad"],
  ["productividad", "Productividad"],
  ["tipificaciones", "Tipificaciones"],
  ["noVentas", "No Ventas"],
  ["devoluciones", "Devoluciones"],
  ["felicitaciones", "Felicitaciones"],
  ["sanciones", "Sanciones"],
  ["audios", "Audios"],
  ["pdas", "PDA"],
  ["reportes", "Reportes"],
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [reportes, setReportes] = useState([]);
  const [devoluciones, setDevoluciones] = useState([]);
  const [audios, setAudios] = useState([]);
  const [pdas, setPdas] = useState([]);
  const [felicitaciones, setFelicitaciones] = useState([]);

  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [searchAdvisor, setSearchAdvisor] = useState("");

  const [semana, setSemana] = useState("Semana 4 · Agosto");
  const [campania, setCampania] = useState("BM");

  const [reporte, setReporte] = useState(REPORTE_INICIAL);
  const [devolucion, setDevolucion] = useState(DEVOLUCION_INICIAL);
  const [felicitacion, setFelicitacion] = useState({
    asesor: "",
    motivo: "",
    fecha: "",
  });
  const [audio, setAudio] = useState(AUDIO_INICIAL);
  const [pda, setPda] = useState(PDA_INICIAL);
  const [sanciones, setSanciones] = useState([]);
  const [sancion, setSancion] = useState(SANCION_INICIAL);
  const [sancFiltroAsesor, setSancFiltroAsesor] = useState("");
  const [sancFiltroTipo, setSancFiltroTipo] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);
    setError("");

    try {
      const pedir = (tabla) =>
        supabase
          .from(tabla)
          .select("*")
          .order("created_at", { ascending: false });

      const [r, d, a, p, f, sa] = await Promise.all([
        pedir("reportes"),
        pedir("devoluciones"),
        pedir("audios"),
        pedir("pdas"),
        pedir("felicitaciones"),
        pedir("sanciones"),
      ]);

      if (r.error) console.error(r.error);
      else setReportes(r.data || []);

      if (d.error) console.error(d.error);
      else setDevoluciones(d.data || []);

      if (a.error) console.error(a.error);
      else setAudios(a.data || []);

      if (p.error) console.error(p.error);
      else setPdas(p.data || []);

      if (f.error) console.error(f.error);
      else setFelicitaciones(f.data || []);

      if (sa.error) console.error(sa.error);
      else setSanciones(sa.data || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  }

  function limpiarMensajes() {
    setMessage("");
    setError("");
  }

  function seleccionarAsesor(asesor) {
    setSelectedAdvisor(asesor);
    setReporte((prev) => ({ ...prev, asesor }));
    setDevolucion((prev) => ({ ...prev, asesor }));
    setAudio((prev) => ({ ...prev, asesor }));
    setPda((prev) => ({ ...prev, asesor }));
    setFelicitacion((prev) => ({ ...prev, asesor }));
    setSancion((prev) => ({ ...prev, asesor }));
  }

  const asesoresFiltrados = useMemo(() => {
    const texto = searchAdvisor.toLowerCase().trim();
    if (!texto) return ASESORES;
    return ASESORES.filter((a) => a.toLowerCase().includes(texto));
  }, [searchAdvisor]);

  const reportesFiltrados = useMemo(
    () =>
      reportes.filter(
        (item) =>
          (!semana || item.semana === semana) &&
          (!campania || item.campania === campania)
      ),
    [reportes, semana, campania]
  );

  const actualizarReporte = (campo, valor) =>
    setReporte((prev) => ({ ...prev, [campo]: valor }));
  const actualizarDevolucion = (campo, valor) =>
    setDevolucion((prev) => ({ ...prev, [campo]: valor }));
  const actualizarAudio = (campo, valor) =>
    setAudio((prev) => ({ ...prev, [campo]: valor }));
  const actualizarPda = (campo, valor) =>
    setPda((prev) => ({ ...prev, [campo]: valor }));

  async function guardarReporte(e) {
    if (e && e.preventDefault) e.preventDefault();
    limpiarMensajes();

    if (!reporte.asesor) {
      setError("Seleccioná un asesor.");
      return;
    }

    setLoading(true);

    try {
      // acciones_calidad NO se envía: la columna no existe en reportes.
      const payload = {
        asesor: reporte.asesor,
        semana: reporte.semana,
        campania: reporte.campania,

        nota: reporte.notaCalidad || null,
        objetivo: reporte.objetivoCalidad || null,
        evolucion: reporte.evolucionCalidad || null,
        desvio: reporte.desviosCalidad || null,
        recomendacion:
          reporte.aspectosTrabajadosCalidad?.join(", ") || null,
        observaciones: reporte.observacionesCalidad || null,

        producto: reporte.campania,

        sph: reporte.sph || null,
        objetivo_sph: reporte.objetivoSph || null,
        ventas: reporte.ventas || null,
        objetivo_ventas: reporte.objetivoVentas || null,
        objetivo_campania: reporte.objetivoCampania
          ? Number(reporte.objetivoCampania)
          : null,

        tipificaciones_auditadas:
          reporte.tipificacionesAuditadas?.join(", ") || null,
        tipificaciones_desvio:
          porcentaje(reporte.tipificacionesDesvio) || null,
        tipificaciones_objetivo:
          porcentaje(reporte.tipificacionesObjetivo) || null,
        tipificaciones_resultado:
          porcentaje(reporte.tipificacionesResultado) || null,
        tipificaciones_compromiso: reporte.tipificacionesCompromiso || null,
        tipificaciones_observaciones:
          reporte.tipificacionesObservaciones || null,

        no_ventas: reporte.noVentasCantidad || null,
        no_ventas_coaching: reporte.noVentasCoaching?.join(", ") || null,
        no_ventas_registro: reporte.noVentasRegistro || null,
        no_ventas_compromiso: reporte.noVentasCompromiso || null,
        no_ventas_om: reporte.noVentasOM?.join(", ") || null,
        no_ventas_fortalezas: reporte.noVentasFortalezas?.join(", ") || null,
        no_ventas_observaciones: reporte.noVentasObservaciones || null,
      };

      const { data, error: saveError } = await supabase
        .from("reportes")
        .upsert(payload)
        .select()
        .single();

      if (saveError) throw saveError;

      setReportes((prev) => [
        data,
        ...prev.filter((item) => item.id !== data.id),
      ]);
      setMessage("✔ Reporte guardado correctamente.");
    } catch (err) {
      console.error(err);
      setError(
        `✖ No se pudo guardar el reporte: ${err?.message || "Error desconocido"}`
      );
    } finally {
      setLoading(false);
    }
  }

  async function guardarDevolucion(e) {
    e.preventDefault();
    limpiarMensajes();

    if (!devolucion.asesor) {
      setError("Seleccioná un asesor.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        asesor: devolucion.asesor,
        area: devolucion.area,
        responsable: devolucion.responsable || null,
        nota_calidad: devolucion.notaCalidad || null,
        aspectos_calidad: devolucion.aspectosCalidad?.join(", ") || null,
        acciones_calidad: devolucion.accionesCalidad?.join(", ") || null,
        aspectos_productividad:
          devolucion.aspectosProductividad?.join(", ") || null,
        acciones_productividad:
          devolucion.accionesProductividad?.join(", ") || null,
        tipificacion: devolucion.tipificacion?.join(", ") || null,
        om: devolucion.om?.join(", ") || null,
        registro_sistema: devolucion.registroSistema || null,
        fortalezas: devolucion.fortalezas?.join(", ") || null,
        observaciones: devolucion.observaciones || null,
      };

      const { data, error: saveError } = await supabase
        .from("devoluciones")
        .insert(payload)
        .select()
        .single();

      if (saveError) throw saveError;

      setDevoluciones((prev) => [data, ...prev]);
      setMessage("✔ Devolución guardada correctamente.");
    } catch (err) {
      console.error(err);
      setError(
        `✖ No se pudo guardar la devolución: ${err?.message || "Error desconocido"}`
      );
    } finally {
      setLoading(false);
    }
  }

  async function guardarFelicitacion(e) {
    e.preventDefault();
    limpiarMensajes();

    if (!felicitacion.asesor) {
      setError("Seleccioná un asesor.");
      return;
    }
    if (!felicitacion.motivo) {
      setError("Ingresá el motivo de la felicitación.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: saveError } = await supabase
        .from("felicitaciones")
        .insert({
          asesor: felicitacion.asesor,
          motivo: felicitacion.motivo,
          fecha: felicitacion.fecha || null,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      if (data) setFelicitaciones((prev) => [data, ...prev]);
      setMessage("✔ Felicitación guardada correctamente.");
      setFelicitacion({ asesor: felicitacion.asesor, motivo: "", fecha: "" });
    } catch (err) {
      console.error(err);
      setError(
        `✖ No se pudo guardar la felicitación: ${err?.message || "Error desconocido"}`
      );
    } finally {
      setLoading(false);
    }
  }

  async function guardarSancion(e) {
    e.preventDefault();
    limpiarMensajes();

    if (!sancion.asesor) {
      setError("Seleccioná un asesor.");
      return;
    }
    if (!sancion.tipo) {
      setError("Seleccioná el tipo.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: saveError } = await supabase
        .from("sanciones")
        .insert({
          asesor: sancion.asesor,
          tipo: sancion.tipo,
          fecha: sancion.fecha || null,
          motivo: sancion.motivo || null,
          observaciones: sancion.observaciones || null,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setSanciones((prev) => [data, ...prev]);
      setMessage("✔ Registro guardado correctamente.");
      setSancion({ ...SANCION_INICIAL, asesor: sancion.asesor });
    } catch (err) {
      console.error(err);
      setError(
        `✖ No se pudo guardar el registro: ${err?.message || "Error desconocido"}`
      );
    } finally {
      setLoading(false);
    }
  }

  async function guardarAudio(e) {
    e.preventDefault();
    limpiarMensajes();

    if (!audio.asesor) {
      setError("Seleccioná un asesor.");
      return;
    }
    if (!audio.archivo) {
      setError("Seleccioná un archivo de audio.");
      return;
    }

    setLoading(true);

    try {
      const extension = audio.archivo.name.split(".").pop() || "mp3";
      const fileName = `${Date.now()}-${audio.asesor
        .replace(/\s+/g, "-")
        .replace(/,/g, "")}.${extension}`;
      const filePath = `audios/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("audios")
        .upload(filePath, audio.archivo);
      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("audios")
        .getPublicUrl(filePath);

      const payload = {
        asesor: audio.asesor,
        area: audio.area,
        responsable: audio.responsable || null,
        fecha: audio.fecha || null,
        archivo: publicData?.publicUrl || null,
        aspectos_calidad: audio.aspectosCalidad?.join(", ") || null,
        aspectos_productividad:
          audio.aspectosProductividad?.join(", ") || null,
        tipificacion: audio.tipificacion?.join(", ") || null,
        devolucion: audio.devolucion || null,
      };

      const { data, error: saveError } = await supabase
        .from("audios")
        .insert(payload)
        .select()
        .single();
      if (saveError) throw saveError;

      setAudios((prev) => [data, ...prev]);
      setMessage("✔ Audio cargado correctamente.");
      setAudio({ ...AUDIO_INICIAL, asesor: audio.asesor });
    } catch (err) {
      console.error(err);
      setError(
        `✖ No se pudo cargar el audio: ${err?.message || "Error desconocido"}`
      );
    } finally {
      setLoading(false);
    }
  }

  async function guardarPda(e) {
    e.preventDefault();
    limpiarMensajes();

    if (!pda.asesor) {
      setError("Seleccioná un asesor.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        asesor: pda.asesor,
        aspecto: pda.aspecto || null,
        fecha_desde: pda.fechaDesde || null,
        fecha_hasta: pda.fechaHasta || null,
        objetivo: pda.objetivo || null,
        observaciones: pda.observaciones || null,
      };

      const { data, error: saveError } = await supabase
        .from("pdas")
        .insert(payload)
        .select()
        .single();
      if (saveError) throw saveError;

      setPdas((prev) => [data, ...prev]);
      setMessage("✔ PDA guardado correctamente.");
      setPda({ ...PDA_INICIAL, asesor: pda.asesor });
    } catch (err) {
      console.error(err);
      setError(
        `✖ No se pudo guardar el PDA: ${err?.message || "Error desconocido"}`
      );
    } finally {
      setLoading(false);
    }
  }

  function imprimirReporte(r) {
    const ventana = window.open("", "_blank", "width=1000,height=800");
    if (!ventana) {
      setError("El navegador bloqueó la ventana de impresión.");
      return;
    }

    const seccion = (titulo, filas) => `
      <h2>${titulo}</h2>
      <div class="box">
        ${filas
          .map(
            ([k, v]) =>
              `<div class="dato"><span class="label">${k}:</span> ${esc(v || "-")}</div>`
          )
          .join("")}
      </div>`;

    ventana.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>Reporte de Calidad</title>
<style>
  body { font-family: Arial, sans-serif; padding: 40px; color: #031926; }
  h1 { margin-bottom: 5px; }
  h2 { color: #468189; margin-top: 30px; border-bottom: 2px solid #9DBEBB; padding-bottom: 6px; }
  .dato { margin: 8px 0; }
  .label { font-weight: bold; }
  .box { background: #F4E9CD; padding: 15px; border-radius: 10px; margin: 10px 0; }
</style>
</head>
<body>
  <h1>PORTAL DE CALIDAD</h1>
  <div class="dato"><span class="label">Asesor:</span> ${esc(r.asesor)}</div>
  <div class="dato"><span class="label">Semana:</span> ${esc(r.semana)}</div>
  <div class="dato"><span class="label">Campaña:</span> ${esc(r.campania)}</div>
  ${seccion("Calidad", [
    ["Nota", r.nota],
    ["Objetivo", r.objetivo],
    ["Evolución", r.evolucion],
    ["Desvío", r.desvio],
    ["Aspectos trabajados", r.recomendacion],
    ["Observaciones", r.observaciones],
  ])}
  ${seccion("Productividad", [
    ["SPH", r.sph],
    ["Objetivo SPH", r.objetivo_sph],
    ["Ventas", r.ventas],
    ["Objetivo ventas", r.objetivo_ventas],
    ["Objetivo campaña", r.objetivo_campania],
  ])}
  ${seccion("Tipificaciones", [
    ["Auditadas", r.tipificaciones_auditadas],
    ["Desvío", r.tipificaciones_desvio],
    ["Objetivo", r.tipificaciones_objetivo],
    ["Resultado", r.tipificaciones_resultado],
    ["Compromiso", r.tipificaciones_compromiso],
    ["Observaciones", r.tipificaciones_observaciones],
  ])}
  ${seccion("No Ventas", [
    ["Cantidad", r.no_ventas],
    ["Coaching", r.no_ventas_coaching],
    ["Registro", r.no_ventas_registro],
    ["Compromiso", r.no_ventas_compromiso],
    ["OM", r.no_ventas_om],
    ["Fortalezas", r.no_ventas_fortalezas],
    ["Observaciones", r.no_ventas_observaciones],
  ])}
  <script>window.onload = function () { window.print(); };</script>
</body>
</html>`);

    ventana.document.close();
  }

  function BotonGuardar({ texto, onClick, submit }) {
    return (
      <div style={styles.formActions}>
        <button
          type={submit ? "submit" : "button"}
          onClick={onClick}
          disabled={loading}
          style={styles.primaryButton}
        >
          {loading ? "Guardando..." : texto}
        </button>
      </div>
    );
  }

  function renderInicio() {
    const stats = [
      [ASESORES.length, "Asesores"],
      [reportes.length, "Reportes"],
      [devoluciones.length, "Devoluciones"],
      [audios.length, "Audios"],
      [pdas.length, "PDA"],
      [felicitaciones.length, "Felicitaciones"],
      [sanciones.length, "Sanciones"],
    ];

    const accesos = [
      ["asesores", "Asesores", "Historial semanal de cada asesor."],
      ["calidad", "Calidad", "Cargar notas, evolución y aspectos."],
      ["productividad", "Productividad", "Objetivos y resultados."],
      ["devoluciones", "Devoluciones", "Registrar devoluciones."],
      ["audios", "Audios", "Cargar y consultar escuchas."],
      ["pdas", "PDA", "Registrar planes de acción."],
    ];

    return (
      <div style={styles.page}>
        <div style={styles.hero}>
          <div>
            <div style={styles.eyebrow}>PORTAL INTEGRAL DEL ASESOR</div>
            <h1 style={styles.heroTitle}>Panel de Administración</h1>
            <p style={styles.heroText}>
              Gestión centralizada de calidad, productividad, devoluciones,
              audios, PDA y seguimiento de asesores.
            </p>
          </div>
          <div style={styles.heroBadge}>ADMINISTRADOR</div>
        </div>

        <div style={styles.statsGrid}>
          {stats.map(([n, l]) => (
            <div key={l} style={styles.statCard}>
              <span style={styles.statNumber}>{n}</span>
              <span style={styles.statLabel}>{l}</span>
            </div>
          ))}
        </div>

        <Card title="Accesos rápidos">
          <div style={styles.quickGrid}>
            {accesos.map(([tab, titulo, texto]) => (
              <button
                key={tab}
                type="button"
                style={styles.quickButton}
                onClick={() => setActiveTab(tab)}
              >
                <strong>{titulo}</strong>
                <span>{texto}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  function renderAsesores() {
    const delAsesor = (lista) =>
      lista.filter((item) => item.asesor === selectedAdvisor);

    return (
      <div style={styles.page}>
        <Card title="Asesores">
          <div style={styles.twoColumns}>
            <div>
              <TextInput
                label="Buscar asesor"
                value={searchAdvisor}
                onChange={setSearchAdvisor}
                placeholder="Escribí el nombre..."
              />
              <div style={styles.advisorList}>
                {asesoresFiltrados.map((asesor) => (
                  <button
                    type="button"
                    key={asesor}
                    onClick={() => seleccionarAsesor(asesor)}
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
                  Seleccioná un asesor para ver toda su información.
                </div>
              ) : (
                <>
                  <div style={styles.profileHeader}>
                    <div style={styles.profileKicker}>ASESOR</div>
                    <h2 style={styles.profileName}>{selectedAdvisor}</h2>
                  </div>

                  <div style={styles.miniStats}>
                    {[
                      [delAsesor(reportes).length, "Reportes"],
                      [delAsesor(devoluciones).length, "Devoluciones"],
                      [delAsesor(audios).length, "Audios"],
                      [delAsesor(pdas).length, "PDA"],
                      [delAsesor(sanciones).length, "Sanciones"],
                    ].map(([n, l]) => (
                      <div key={l} style={styles.miniStat}>
                        <strong>{n}</strong>
                        <span>{l}</span>
                      </div>
                    ))}
                  </div>

                  <HistorialSemanal
                    asesor={selectedAdvisor}
                    reportes={delAsesor(reportes)}
                    devoluciones={delAsesor(devoluciones)}
                    audios={delAsesor(audios)}
                    pdas={delAsesor(pdas)}
                    felicitaciones={delAsesor(felicitaciones)}
                    sanciones={delAsesor(sanciones)}
                  />
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
                onChange={(v) => actualizarReporte("asesor", v)}
                options={ASESORES}
              />
              <TextInput
                label="Semana"
                value={reporte.semana}
                onChange={(v) => actualizarReporte("semana", v)}
              />
              <Select
                label="Campaña"
                value={reporte.campania}
                onChange={(v) => actualizarReporte("campania", v)}
                options={["AP", "BM"]}
              />
              <NumberInput
                label="Nota"
                value={reporte.notaCalidad}
                onChange={(v) => actualizarReporte("notaCalidad", v)}
                placeholder="Ej. 85"
              />
              <PercentageInput
                label="Objetivo"
                value={reporte.objetivoCalidad}
                onChange={(v) => actualizarReporte("objetivoCalidad", v)}
              />
              <PercentageInput
                label="Evolución"
                value={reporte.evolucionCalidad}
                onChange={(v) => actualizarReporte("evolucionCalidad", v)}
              />
              <PercentageInput
                label="Desvío"
                value={reporte.desviosCalidad}
                onChange={(v) => actualizarReporte("desviosCalidad", v)}
              />
            </div>

            <div style={styles.sectionSpacing}>
              <MultiSelect
                label="Aspectos trabajados"
                options={CALIDAD_ASPECTOS}
                value={reporte.aspectosTrabajadosCalidad}
                onChange={(v) =>
                  actualizarReporte("aspectosTrabajadosCalidad", v)
                }
              />
              <MultiSelect
                label="Acciones realizadas"
                options={CALIDAD_ACCIONES}
                value={reporte.accionesCalidad}
                onChange={(v) => actualizarReporte("accionesCalidad", v)}
              />
              <TextArea
                label="Observaciones"
                value={reporte.observacionesCalidad}
                onChange={(v) => actualizarReporte("observacionesCalidad", v)}
              />
            </div>

            <BotonGuardar texto="Guardar reporte" submit />
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
              onChange={(v) => actualizarReporte("asesor", v)}
              options={ASESORES}
            />
            <TextInput
              label="Semana"
              value={reporte.semana}
              onChange={(v) => actualizarReporte("semana", v)}
            />
            <NumberInput
              label="SPH"
              value={reporte.sph}
              onChange={(v) => actualizarReporte("sph", v)}
            />
            <NumberInput
              label="Objetivo SPH"
              value={reporte.objetivoSph}
              onChange={(v) => actualizarReporte("objetivoSph", v)}
            />
            <NumberInput
              label="Ventas"
              value={reporte.ventas}
              onChange={(v) => actualizarReporte("ventas", v)}
            />
            <NumberInput
              label="Objetivo ventas"
              value={reporte.objetivoVentas}
              onChange={(v) => actualizarReporte("objetivoVentas", v)}
            />
            <NumberInput
              label="Objetivo de campaña"
              value={reporte.objetivoCampania}
              onChange={(v) => actualizarReporte("objetivoCampania", v)}
              placeholder="0000"
              small
            />
          </div>

          <div style={styles.sectionSpacing}>
            <MultiSelect
              label="Aspectos trabajados"
              options={PRODUCTIVIDAD_ASPECTOS}
              value={reporte.aspectosTrabajadosProductividad}
              onChange={(v) =>
                actualizarReporte("aspectosTrabajadosProductividad", v)
              }
            />
            <MultiSelect
              label="Acciones realizadas"
              options={PRODUCTIVIDAD_ACCIONES}
              value={reporte.accionesProductividad}
              onChange={(v) => actualizarReporte("accionesProductividad", v)}
            />
            <TextArea
              label="Observaciones"
              value={reporte.observacionesProductividad}
              onChange={(v) =>
                actualizarReporte("observacionesProductividad", v)
              }
            />
          </div>

          <BotonGuardar texto="Guardar reporte" onClick={guardarReporte} />
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
              onChange={(v) => actualizarReporte("asesor", v)}
              options={ASESORES}
            />
            <TextInput
              label="Semana"
              value={reporte.semana}
              onChange={(v) => actualizarReporte("semana", v)}
            />
          </div>

          <div style={styles.sectionSpacing}>
            <MultiSelect
              label="Tipificaciones auditadas"
              options={TIPIFICACIONES}
              value={reporte.tipificacionesAuditadas}
              onChange={(v) => actualizarReporte("tipificacionesAuditadas", v)}
            />
          </div>

          <div style={styles.formGrid}>
            <PercentageInput
              label="Desvío"
              value={reporte.tipificacionesDesvio}
              onChange={(v) => actualizarReporte("tipificacionesDesvio", v)}
            />
            <PercentageInput
              label="Objetivo"
              value={reporte.tipificacionesObjetivo}
              onChange={(v) => actualizarReporte("tipificacionesObjetivo", v)}
            />
            <PercentageInput
              label="Resultado"
              value={reporte.tipificacionesResultado}
              onChange={(v) => actualizarReporte("tipificacionesResultado", v)}
            />
          </div>

          <div style={styles.sectionSpacing}>
            <Select
              label="Compromiso"
              value={reporte.tipificacionesCompromiso}
              onChange={(v) => actualizarReporte("tipificacionesCompromiso", v)}
              options={["APLICA DEVOLUCION", "SEGUIMIENTO", "NO APLICA"]}
            />
            <TextArea
              label="Observaciones"
              value={reporte.tipificacionesObservaciones}
              onChange={(v) =>
                actualizarReporte("tipificacionesObservaciones", v)
              }
            />
          </div>

          <BotonGuardar texto="Guardar reporte" onClick={guardarReporte} />
        </Card>
      </div>
    );
  }

  function renderNoVentas() {
    return (
      <div style={styles.page}>
        <Card title="No Ventas">
          <div style={styles.formGrid}>
            <Select
              label="Asesor"
              value={reporte.asesor}
              onChange={(v) => actualizarReporte("asesor", v)}
              options={ASESORES}
            />
            <TextInput
              label="Semana"
              value={reporte.semana}
              onChange={(v) => actualizarReporte("semana", v)}
            />
            <NumberInput
              label="Cantidad de no ventas"
              value={reporte.noVentasCantidad}
              onChange={(v) => actualizarReporte("noVentasCantidad", v)}
            />
          </div>

          <div style={styles.sectionSpacing}>
            <MultiSelect
              label="Coaching"
              options={PRODUCTIVIDAD_ACCIONES}
              value={reporte.noVentasCoaching}
              onChange={(v) => actualizarReporte("noVentasCoaching", v)}
            />
            <Select
              label="Registro en sistema"
              value={reporte.noVentasRegistro}
              onChange={(v) => actualizarReporte("noVentasRegistro", v)}
              options={["Correcto", "Incorrecto"]}
            />
            <Select
              label="Compromiso"
              value={reporte.noVentasCompromiso}
              onChange={(v) => actualizarReporte("noVentasCompromiso", v)}
              options={["APLICA DEVOLUCION", "SEGUIMIENTO", "NO APLICA"]}
            />
            <MultiSelect
              label="OM"
              options={OM}
              value={reporte.noVentasOM}
              onChange={(v) => actualizarReporte("noVentasOM", v)}
            />
            <MultiSelect
              label="Fortalezas"
              options={FORTALEZAS}
              value={reporte.noVentasFortalezas}
              onChange={(v) => actualizarReporte("noVentasFortalezas", v)}
            />
            <TextArea
              label="Observaciones"
              value={reporte.noVentasObservaciones}
              onChange={(v) => actualizarReporte("noVentasObservaciones", v)}
            />
          </div>

          <BotonGuardar texto="Guardar reporte" onClick={guardarReporte} />
        </Card>
      </div>
    );
  }

  function renderDevoluciones() {
    return (
      <div style={styles.page}>
        <Card title="Devoluciones">
          <form onSubmit={guardarDevolucion}>
            <div style={styles.formGrid}>
              <Select
                label="Asesor"
                value={devolucion.asesor}
                onChange={(v) => actualizarDevolucion("asesor", v)}
                options={ASESORES}
              />
              <Select
                label="Área"
                value={devolucion.area}
                onChange={(v) => actualizarDevolucion("area", v)}
                options={AREAS}
              />
              <TextInput
                label="Responsable"
                value={devolucion.responsable}
                onChange={(v) => actualizarDevolucion("responsable", v)}
              />
              <NumberInput
                label="Nota calidad"
                value={devolucion.notaCalidad}
                onChange={(v) => actualizarDevolucion("notaCalidad", v)}
              />
            </div>

            <div style={styles.sectionSpacing}>
              <MultiSelect
                label="Aspectos de calidad"
                options={CALIDAD_ASPECTOS}
                value={devolucion.aspectosCalidad}
                onChange={(v) => actualizarDevolucion("aspectosCalidad", v)}
              />
              <MultiSelect
                label="Acciones de calidad"
                options={CALIDAD_ACCIONES}
                value={devolucion.accionesCalidad}
                onChange={(v) => actualizarDevolucion("accionesCalidad", v)}
              />
              <MultiSelect
                label="Aspectos de productividad"
                options={PRODUCTIVIDAD_ASPECTOS}
                value={devolucion.aspectosProductividad}
                onChange={(v) =>
                  actualizarDevolucion("aspectosProductividad", v)
                }
              />
              <MultiSelect
                label="Acciones de productividad"
                options={PRODUCTIVIDAD_ACCIONES}
                value={devolucion.accionesProductividad}
                onChange={(v) =>
                  actualizarDevolucion("accionesProductividad", v)
                }
              />
              <MultiSelect
                label="Tipificación"
                options={TIPIFICACIONES}
                value={devolucion.tipificacion}
                onChange={(v) => actualizarDevolucion("tipificacion", v)}
              />
              <MultiSelect
                label="OM"
                options={OM}
                value={devolucion.om}
                onChange={(v) => actualizarDevolucion("om", v)}
              />
              <Select
                label="Registro en sistema"
                value={devolucion.registroSistema}
                onChange={(v) => actualizarDevolucion("registroSistema", v)}
                options={["Correcto", "Incorrecto"]}
              />
              <MultiSelect
                label="Fortalezas"
                options={FORTALEZAS}
                value={devolucion.fortalezas}
                onChange={(v) => actualizarDevolucion("fortalezas", v)}
              />
              <TextArea
                label="Observaciones"
                value={devolucion.observaciones}
                onChange={(v) => actualizarDevolucion("observaciones", v)}
              />
            </div>

            <BotonGuardar texto="Guardar devolución" submit />
          </form>
        </Card>
      </div>
    );
  }

  function renderFelicitaciones() {
    return (
      <div style={styles.page}>
        <Card title="Felicitaciones">
          <form onSubmit={guardarFelicitacion}>
            <div style={styles.formGrid}>
              <Select
                label="Asesor"
                value={felicitacion.asesor}
                onChange={(v) =>
                  setFelicitacion((prev) => ({ ...prev, asesor: v }))
                }
                options={ASESORES}
              />
              <TextInput
                label="Fecha"
                value={felicitacion.fecha}
                onChange={(v) =>
                  setFelicitacion((prev) => ({ ...prev, fecha: v }))
                }
                placeholder="DD/MM/AAAA"
              />
            </div>

            <div style={styles.sectionSpacing}>
              <TextArea
                label="Motivo de la felicitación"
                value={felicitacion.motivo}
                onChange={(v) =>
                  setFelicitacion((prev) => ({ ...prev, motivo: v }))
                }
                rows={5}
                placeholder="Escribí el motivo..."
              />
            </div>

            <BotonGuardar texto="Guardar felicitación" submit />
          </form>
        </Card>
      </div>
    );
  }

  function renderSanciones() {
    const lista = sanciones.filter(
      (x) =>
        (!sancFiltroAsesor || x.asesor === sancFiltroAsesor) &&
        (!sancFiltroTipo || x.tipo === sancFiltroTipo)
    );

    return (
      <div style={styles.page}>
        <Card title="Apercibimientos y sanciones">
          <form onSubmit={guardarSancion}>
            <div style={styles.formGrid}>
              <Select
                label="Asesor"
                value={sancion.asesor}
                onChange={(v) => setSancion((p) => ({ ...p, asesor: v }))}
                options={ASESORES}
              />
              <Select
                label="Tipo"
                value={sancion.tipo}
                onChange={(v) => setSancion((p) => ({ ...p, tipo: v }))}
                options={TIPOS_SANCION}
              />
              <TextInput
                label="Fecha"
                type="date"
                value={sancion.fecha}
                onChange={(v) => setSancion((p) => ({ ...p, fecha: v }))}
              />
            </div>

            <div style={styles.sectionSpacing}>
              <TextArea
                label="Motivo"
                value={sancion.motivo}
                onChange={(v) => setSancion((p) => ({ ...p, motivo: v }))}
              />
              <TextArea
                label="Observaciones"
                value={sancion.observaciones}
                onChange={(v) =>
                  setSancion((p) => ({ ...p, observaciones: v }))
                }
              />
            </div>

            <BotonGuardar texto="Guardar registro" submit />
          </form>
        </Card>

        <Card
          title={`Historial (${lista.length})`}
          action={
            <div style={styles.filters}>
              <select
                value={sancFiltroAsesor}
                onChange={(e) => setSancFiltroAsesor(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">Todos los asesores</option>
                {ASESORES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <select
                value={sancFiltroTipo}
                onChange={(e) => setSancFiltroTipo(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">Todos los tipos</option>
                {TIPOS_SANCION.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          }
        >
          {lista.length === 0 ? (
            <div style={styles.emptyState}>No hay registros.</div>
          ) : (
            <div style={styles.resultList}>
              {lista.map((x) => (
                <div key={x.id} style={styles.resultCard}>
                  <div style={styles.resultTop}>
                    <strong>{x.asesor}</strong>
                    <span>
                      {x.tipo || "-"} ·{" "}
                      {formatearFecha(x.fecha || x.created_at)} ·{" "}
                      {semanaDe(x.fecha || x.created_at)}
                    </span>
                  </div>
                  <p style={styles.resultText}>{x.motivo || "-"}</p>
                  {x.observaciones ? (
                    <p style={styles.resultText}>{x.observaciones}</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  }

  function renderAudios() {
    return (
      <div style={styles.page}>
        <Card title="Audios">
          <form onSubmit={guardarAudio}>
            <div style={styles.formGrid}>
              <Select
                label="Asesor"
                value={audio.asesor}
                onChange={(v) => actualizarAudio("asesor", v)}
                options={ASESORES}
              />
              <Select
                label="Área"
                value={audio.area}
                onChange={(v) => actualizarAudio("area", v)}
                options={AREAS}
              />
              <TextInput
                label="Responsable"
                value={audio.responsable}
                onChange={(v) => actualizarAudio("responsable", v)}
              />
              <TextInput
                label="Fecha"
                value={audio.fecha}
                onChange={(v) => actualizarAudio("fecha", v)}
              />
            </div>

            <div style={styles.sectionSpacing}>
              <div style={styles.field}>
                <label style={styles.label}>Archivo de audio</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) =>
                    actualizarAudio("archivo", e.target.files?.[0] || null)
                  }
                  style={styles.input}
                />
              </div>

              <MultiSelect
                label="Aspectos de calidad"
                options={CALIDAD_ASPECTOS}
                value={audio.aspectosCalidad}
                onChange={(v) => actualizarAudio("aspectosCalidad", v)}
              />
              <MultiSelect
                label="Aspectos de productividad"
                options={PRODUCTIVIDAD_ASPECTOS}
                value={audio.aspectosProductividad}
                onChange={(v) => actualizarAudio("aspectosProductividad", v)}
              />
              <MultiSelect
                label="Tipificación"
                options={TIPIFICACIONES}
                value={audio.tipificacion}
                onChange={(v) => actualizarAudio("tipificacion", v)}
              />
              <TextArea
                label="Devolución"
                value={audio.devolucion}
                onChange={(v) => actualizarAudio("devolucion", v)}
              />
            </div>

            <BotonGuardar texto="Cargar audio" submit />
          </form>
        </Card>
      </div>
    );
  }

  function renderPdas() {
    return (
      <div style={styles.page}>
        <Card title="PDA">
          <form onSubmit={guardarPda}>
            <div style={styles.formGrid}>
              <Select
                label="Asesor"
                value={pda.asesor}
                onChange={(v) => actualizarPda("asesor", v)}
                options={ASESORES}
              />
              <TextInput
                label="Aspecto"
                value={pda.aspecto}
                onChange={(v) => actualizarPda("aspecto", v)}
              />
              <TextInput
                label="Fecha desde"
                value={pda.fechaDesde}
                onChange={(v) => actualizarPda("fechaDesde", v)}
              />
              <TextInput
                label="Fecha hasta"
                value={pda.fechaHasta}
                onChange={(v) => actualizarPda("fechaHasta", v)}
              />
            </div>

            <div style={styles.sectionSpacing}>
              <TextArea
                label="Objetivo"
                value={pda.objetivo}
                onChange={(v) => actualizarPda("objetivo", v)}
              />
              <TextArea
                label="Observaciones"
                value={pda.observaciones}
                onChange={(v) => actualizarPda("observaciones", v)}
              />
            </div>

            <BotonGuardar texto="Guardar PDA" submit />
          </form>
        </Card>
      </div>
    );
  }

  function renderReportes() {
    return (
      <div style={styles.page}>
        <Card
          title="Reportes"
          action={
            <div style={styles.filters}>
              <TextInput
                label=""
                value={semana}
                onChange={setSemana}
                placeholder="Semana"
              />
              <select
                value={campania}
                onChange={(e) => setCampania(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">Todas</option>
                <option value="AP">AP</option>
                <option value="BM">BM</option>
              </select>
            </div>
          }
        >
          {reportesFiltrados.length === 0 ? (
            <div style={styles.emptyState}>
              No hay reportes cargados para los filtros seleccionados.
            </div>
          ) : (
            <div style={styles.reportList}>
              {reportesFiltrados.map((item) => (
                <div key={item.id} style={styles.reportCard}>
                  <div style={styles.reportHeader}>
                    <div>
                      <div style={styles.reportKicker}>
                        {item.semana || "-"}
                      </div>
                      <h3 style={styles.reportName}>{item.asesor || "-"}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => imprimirReporte(item)}
                      style={styles.secondaryButton}
                    >
                      Imprimir
                    </button>
                  </div>

                  <div style={styles.reportGrid}>
                    <Dato k="Campaña" v={item.campania} />
                    <Dato k="Nota" v={item.nota} />
                    <Dato k="Objetivo" v={item.objetivo} />
                    <Dato k="Desvío" v={item.desvio} />
                    <Dato k="SPH" v={item.sph} />
                    <Dato k="Ventas" v={item.ventas} />
                    <Dato k="Objetivo campaña" v={item.objetivo_campania} />
                    <Dato k="Tipificaciones" v={item.tipificaciones_resultado} />
                  </div>

                  <div style={styles.reportDetails}>
                    <div>
                      <strong>Aspectos trabajados</strong>
                      <p>{item.recomendacion || "-"}</p>
                    </div>
                    <div>
                      <strong>Observaciones</strong>
                      <p>{item.observaciones || "-"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  }

  const vistas = {
    inicio: renderInicio,
    asesores: renderAsesores,
    calidad: renderCalidad,
    productividad: renderProductividad,
    tipificaciones: renderTipificaciones,
    noVentas: renderNoVentas,
    devoluciones: renderDevoluciones,
    felicitaciones: renderFelicitaciones,
    sanciones: renderSanciones,
    audios: renderAudios,
    pdas: renderPdas,
    reportes: renderReportes,
  };

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoMark}>PC</div>
          <div>
            <strong style={styles.logoTitle}>Portal de Calidad</strong>
            <span style={styles.logoSubtitle}>Administración</span>
          </div>
        </div>

        <nav style={styles.nav}>
          {TABS.map(([id, nombre]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              style={{
                ...styles.navButton,
                ...(activeTab === id ? styles.navButtonActive : {}),
              }}
            >
              {nombre}
            </button>
          ))}
        </nav>

        <div style={styles.sidebarBottom}>
          <div style={styles.statusDot} />
          <span>Sistema conectado</span>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <div>
            <span style={styles.topbarKicker}>ADMINISTRACIÓN</span>
            <h1 style={styles.topbarTitle}>Portal Integral del Asesor</h1>
          </div>

          {selectedAdvisor && (
            <div style={styles.selectedAdvisor}>
              <span>Asesor seleccionado</span>
              <strong>{selectedAdvisor}</strong>
            </div>
          )}
        </header>

        {message && <div style={styles.successMessage}>{message}</div>}
        {error && <div style={styles.errorMessage}>{error}</div>}

        {vistas[activeTab] ? vistas[activeTab]() : null}
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    background: "#f4f6f8",
    color: PALETTE.navy,
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  sidebar: {
    width: "250px",
    minHeight: "100vh",
    background: PALETTE.navy,
    color: "#ffffff",
    padding: "24px 16px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    alignSelf: "flex-start",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "4px 8px 28px",
  },
  logoMark: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: PALETTE.teal,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "13px",
  },
  logoTitle: { display: "block", fontSize: "14px", lineHeight: 1.2 },
  logoSubtitle: {
    display: "block",
    marginTop: "3px",
    fontSize: "11px",
    opacity: 0.65,
  },
  nav: { display: "flex", flexDirection: "column", gap: "6px" },
  navButton: {
    border: "none",
    background: "transparent",
    color: "#ffffff",
    padding: "11px 12px",
    borderRadius: "9px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "13px",
    opacity: 0.82,
  },
  navButtonActive: { background: PALETTE.teal, opacity: 1, fontWeight: 700 },
  sidebarBottom: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "11px",
    opacity: 0.7,
    padding: "14px 8px 4px",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: PALETTE.mint,
  },
  main: { flex: 1, minWidth: 0 },
  topbar: {
    minHeight: "88px",
    background: "#ffffff",
    borderBottom: `1px solid ${PALETTE.soft}`,
    padding: "20px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  topbarKicker: {
    display: "block",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.5px",
    color: PALETTE.teal,
  },
  topbarTitle: {
    margin: "5px 0 0",
    fontSize: "23px",
    lineHeight: 1.2,
    color: PALETTE.navy,
  },
  selectedAdvisor: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
    fontSize: "11px",
    color: "#66757a",
  },
  page: {
    padding: "28px 32px 40px",
    maxWidth: "1500px",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  hero: {
    background: PALETTE.navy,
    color: "#ffffff",
    borderRadius: "18px",
    padding: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    marginBottom: "22px",
  },
  eyebrow: {
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.5px",
    color: PALETTE.mint,
    marginBottom: "8px",
  },
  heroTitle: { margin: 0, fontSize: "30px" },
  heroText: {
    margin: "9px 0 0",
    maxWidth: "700px",
    fontSize: "13px",
    lineHeight: 1.6,
    opacity: 0.78,
  },
  heroBadge: {
    background: PALETTE.teal,
    borderRadius: "999px",
    padding: "9px 14px",
    fontSize: "10px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "14px",
    marginBottom: "22px",
  },
  statCard: {
    background: "#ffffff",
    border: `1px solid ${PALETTE.soft}`,
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statNumber: { fontSize: "27px", fontWeight: 800, color: PALETTE.navy },
  statLabel: { fontSize: "11px", color: "#65757a" },
  card: {
    background: "#ffffff",
    border: `1px solid ${PALETTE.soft}`,
    borderRadius: "16px",
    padding: "22px",
    marginBottom: "20px",
    boxSizing: "border-box",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "20px",
  },
  cardTitle: { margin: 0, fontSize: "19px", color: PALETTE.navy },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },
  quickButton: {
    border: `1px solid ${PALETTE.soft}`,
    background: "#ffffff",
    borderRadius: "12px",
    padding: "16px",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  twoColumns: {
    display: "grid",
    gridTemplateColumns: "minmax(240px, 300px) minmax(0, 1fr)",
    gap: "24px",
    alignItems: "start",
  },
  advisorList: {
    marginTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    maxHeight: "650px",
    overflowY: "auto",
  },
  advisorButton: {
    border: `1px solid ${PALETTE.soft}`,
    background: "#ffffff",
    color: PALETTE.navy,
    borderRadius: "8px",
    padding: "9px 10px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "12px",
  },
  advisorButtonActive: {
    background: PALETTE.cream,
    borderColor: PALETTE.teal,
    fontWeight: 700,
  },
  emptyState: {
    border: `1px dashed ${PALETTE.soft}`,
    borderRadius: "12px",
    padding: "24px",
    color: "#6d7c80",
    fontSize: "13px",
    textAlign: "center",
  },
  profileHeader: {
    background: PALETTE.cream,
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "14px",
  },
  profileKicker: {
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: "1.3px",
    color: PALETTE.teal,
  },
  profileName: { margin: "6px 0 0", fontSize: "24px" },
  miniStats: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: "8px",
  },
  miniStat: {
    border: `1px solid ${PALETTE.soft}`,
    borderRadius: "10px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  sectionSpacing: { marginTop: "22px" },
  subTitle: { margin: "0 0 12px", fontSize: "14px", color: PALETTE.teal },
  weekCard: {
    border: `2px solid ${PALETTE.soft}`,
    borderRadius: "14px",
    padding: "16px",
    marginTop: "14px",
    background: "#fcfdfd",
  },
  weekTitle: {
    display: "inline-block",
    background: PALETTE.navy,
    color: "#ffffff",
    borderRadius: "999px",
    padding: "6px 14px",
    fontSize: "12px",
    fontWeight: 800,
  },
  resultList: { display: "flex", flexDirection: "column", gap: "10px" },
  resultCard: {
    border: `1px solid ${PALETTE.soft}`,
    borderRadius: "11px",
    padding: "14px",
    background: "#ffffff",
  },
  resultTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
  },
  resultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "10px",
    fontSize: "12px",
  },
  resultText: {
    margin: "8px 0 0",
    fontSize: "12px",
    color: "#56676b",
    lineHeight: 1.5,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    padding: "5px 9px",
    fontSize: "9px",
    fontWeight: 800,
    color: PALETTE.navy,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    alignItems: "start",
  },
  field: { display: "flex", flexDirection: "column", gap: "7px" },
  label: { fontSize: "11px", fontWeight: 700, color: PALETTE.navy },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${PALETTE.soft}`,
    borderRadius: "9px",
    padding: "10px 11px",
    fontSize: "12px",
    outline: "none",
    background: "#ffffff",
    color: PALETTE.navy,
  },
  smallNumberInput: { maxWidth: "120px" },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${PALETTE.soft}`,
    borderRadius: "9px",
    padding: "10px 11px",
    fontSize: "12px",
    outline: "none",
    resize: "vertical",
    background: "#ffffff",
    color: PALETTE.navy,
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  select: {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${PALETTE.soft}`,
    borderRadius: "9px",
    padding: "10px 11px",
    fontSize: "12px",
    outline: "none",
    background: "#ffffff",
    color: PALETTE.navy,
  },
  percentWrap: {
    display: "flex",
    alignItems: "center",
    border: `1px solid ${PALETTE.soft}`,
    borderRadius: "9px",
    background: "#ffffff",
    overflow: "hidden",
  },
  percentInput: {
    flex: 1,
    minWidth: 0,
    border: "none",
    outline: "none",
    padding: "10px 11px",
    fontSize: "12px",
    color: PALETTE.navy,
  },
  percentSymbol: {
    padding: "0 11px",
    fontWeight: 800,
    color: PALETTE.teal,
    fontSize: "12px",
  },
  multiSelect: {
    border: `1px solid ${PALETTE.soft}`,
    borderRadius: "10px",
    padding: "10px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "7px",
    background: "#ffffff",
  },
  checkRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "7px",
    fontSize: "11px",
    color: PALETTE.navy,
    cursor: "pointer",
    lineHeight: 1.35,
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "22px",
  },
  primaryButton: {
    border: "none",
    background: PALETTE.teal,
    color: "#ffffff",
    borderRadius: "9px",
    padding: "11px 18px",
    fontSize: "12px",
    fontWeight: 800,
    cursor: "pointer",
  },
  secondaryButton: {
    border: `1px solid ${PALETTE.teal}`,
    background: "#ffffff",
    color: PALETTE.teal,
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "11px",
    fontWeight: 800,
    cursor: "pointer",
  },
  successMessage: {
    margin: "18px 32px 0",
    background: "#e7f3ef",
    border: `1px solid ${PALETTE.mint}`,
    color: PALETTE.navy,
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "12px",
    fontWeight: 700,
  },
  errorMessage: {
    margin: "18px 32px 0",
    background: "#f9e8e8",
    border: "1px solid #d99a9a",
    color: "#7b2525",
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "12px",
    fontWeight: 700,
  },
  audioPlayer: { width: "100%", marginTop: "5px" },
  filters: { display: "flex", alignItems: "center", gap: "8px" },
  filterSelect: {
    border: `1px solid ${PALETTE.soft}`,
    borderRadius: "8px",
    padding: "8px 10px",
    fontSize: "11px",
    background: "#ffffff",
    color: PALETTE.navy,
  },
  reportList: { display: "flex", flexDirection: "column", gap: "14px" },
  reportCard: {
    border: `1px solid ${PALETTE.soft}`,
    borderRadius: "13px",
    padding: "17px",
  },
  reportHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "16px",
  },
  reportKicker: {
    fontSize: "10px",
    fontWeight: 800,
    color: PALETTE.teal,
    marginBottom: "3px",
  },
  reportName: { margin: 0, fontSize: "17px" },
  reportGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "9px",
    fontSize: "12px",
  },
  reportDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "12px",
    marginTop: "14px",
    paddingTop: "14px",
    borderTop: `1px solid ${PALETTE.soft}`,
  },
};
