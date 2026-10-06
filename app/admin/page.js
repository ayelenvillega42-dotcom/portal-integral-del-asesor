"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

/* ================= CONSTANTES ================= */

const PALETTE = {
  navy: "#031926",
  teal: "#468189",
  mint: "#77ACA2",
  soft: "#9DBEBB",
  cream: "#F4E9CD",
};

const ASESORES = [
  "Tello, Marianela",
  "Contreras, Gilary",
  "Malqui, Xiomara",
  "Luna, Oriana",
  "Gomez, Carla",
  "Acosta, Pamela",
  "Bahamonde, Camila",
  "Vasquez, Agustin",
  "Bustos, Jesica",
  "Cabrera, Antonella",
  "Bustamante, Ailin",
  "Simonetta, Valentina",
  "Olmedo, Thomas",
  "Aguilera, Trinidad",
  "Viniegra, Agustín",
  "Ojeda, Luana",
  "Reartes, Maia",
  "Cordoba, Tania",
  "Peralta, Belen",
  "Mercado, Chiara",
  "Diaz, Milagros",
  "Rojek, Luna",
];

const AREAS = ["Calidad", "Productividad", "Tipificaciones", "No Ventas"];

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
  "Asume Responsabilidad del Sponsor",
  "Habilidades de comunicación",
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
  "ESCUCHA DE LLAMADAS",
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
  "NO ELEGIBLE / NO REÚNE REQUISTOS",
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

const NAV = [
  ["inicio", "Inicio"],
  ["asesores", "Asesores"],
  ["calidad", "Calidad"],
  ["productividad", "Productividad"],
  ["tipificaciones", "Tipificaciones"],
  ["noVentas", "No Ventas"],
  ["devoluciones", "Devoluciones"],
  ["felicitaciones", "Felicitaciones"],
  ["audios", "Audios"],
  ["pdas", "PDA"],
  ["reportes", "Reportes"],
];

/* ================= UTILIDADES ================= */

function norm(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function num(valor) {
  if (valor === "" || valor === null || valor === undefined) return null;
  const n = Number(valor);
  return Number.isNaN(n) ? null : n;
}

function unir(lista) {
  return lista && lista.length > 0 ? lista.join(", ") : null;
}

function porcentaje(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  return String(valor).includes("%") ? String(valor) : `${valor}%`;
}

function sinPorcentaje(valor) {
  if (valor === null || valor === undefined || valor === "") return "";
  return String(valor).replace("%", "").trim();
}

function formatearFecha(fecha) {
  if (!fecha) return "-";
  try {
    return new Date(fecha).toLocaleDateString("es-AR");
  } catch {
    return String(fecha);
  }
}

function esc(valor) {
  if (valor === null || valor === undefined || valor === "") return "-";
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ================= COMPONENTES ================= */

function MultiSelect({ label, options, value = [], onChange }) {
  const toggle = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

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
          value={sinPorcentaje(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          style={styles.percentInput}
        />
        <span style={styles.percentSymbol}>%</span>
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, placeholder = "", small = false }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input
        type="number"
        step="any"
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

function KV({ label, value }) {
  return (
    <div style={styles.kv}>
      <span style={styles.kvLabel}>{label}</span>
      <strong>{value === null || value === undefined || value === "" ? "-" : value}</strong>
    </div>
  );
}

function SaveButton({ loading, children }) {
  return (
    <div style={styles.formActions}>
      <button type="submit" disabled={loading} style={styles.primaryButton}>
        {loading ? "Guardando..." : children}
      </button>
    </div>
  );
}

/* ================= PÁGINA ================= */

const REPORTE_VACIO = {
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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [perfiles, setPerfiles] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [devoluciones, setDevoluciones] = useState([]);
  const [audios, setAudios] = useState([]);
  const [pdas, setPdas] = useState([]);

  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [searchAdvisor, setSearchAdvisor] = useState("");

  const [semana, setSemana] = useState("Semana 4 · Agosto");
  const [campania, setCampania] = useState("BM");

  const [reporte, setReporte] = useState(REPORTE_VACIO);
  const [reporteId, setReporteId] = useState(null);

  const [devolucion, setDevolucion] = useState({
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
  });

  const [felicitacion, setFelicitacion] = useState({
    asesor: "",
    motivo: "",
    fecha: "",
  });

  const [audio, setAudio] = useState({
    asesor: "",
    area: "Calidad",
    responsable: "",
    fecha: "",
    archivo: null,
    aspectosCalidad: [],
    aspectosProductividad: [],
    tipificacion: [],
    devolucion: "",
  });

  const [pda, setPda] = useState({
    asesor: "",
    aspecto: "",
    fechaDesde: "",
    fechaHasta: "",
    objetivo: "",
    observaciones: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);
    setError("");

    try {
      const pedir = (tabla, columnas = "*") =>
        supabase.from(tabla).select(columnas).order("created_at", { ascending: false });

      const [rPerfiles, rReportes, rDevoluciones, rAudios, rPdas] = await Promise.all([
        supabase.from("perfiles").select("id, nombre, rol"),
        pedir("reportes"),
        pedir("devoluciones"),
        pedir("audios"),
        pedir("pdas"),
      ]);

      if (rPerfiles.error) console.error(rPerfiles.error);
      else setPerfiles(rPerfiles.data || []);

      if (rReportes.error) console.error(rReportes.error);
      else setReportes(rReportes.data || []);

      if (rDevoluciones.error) console.error(rDevoluciones.error);
      else setDevoluciones(rDevoluciones.data || []);

      if (rAudios.error) console.error(rAudios.error);
      else setAudios(rAudios.data || []);

      if (rPdas.error) console.error(rPdas.error);
      else setPdas(rPdas.data || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- Vínculo asesor <-> perfiles ---------- */

  const idPorNombre = useMemo(() => {
    const mapa = {};
    perfiles.forEach((p) => {
      mapa[norm(p.nombre)] = p.id;
    });
    return mapa;
  }, [perfiles]);

  const nombrePorId = useMemo(() => {
    const mapa = {};
    perfiles.forEach((p) => {
      mapa[p.id] = p.nombre;
    });
    return mapa;
  }, [perfiles]);

  function nombreDe(item) {
    return item.asesor || nombrePorId[item.asesor_id] || "";
  }

  function buscarAsesorId(nombre) {
    const id = idPorNombre[norm(nombre)];
    if (!id) {
      setError(
        `❌ No se encontró a "${nombre}" en la tabla perfiles. Revisá que el nombre coincida.`
      );
      return null;
    }
    return id;
  }

  function limpiarMensajes() {
    setMessage("");
    setError("");
  }

  async function insertar(tabla, payload) {
    const { data, error: saveError } = await supabase
      .from(tabla)
      .insert(payload)
      .select()
      .single();

    if (saveError) throw saveError;
    return data;
  }

  function seleccionarAsesor(asesor) {
    setSelectedAdvisor(asesor);
    setReporte((prev) => ({ ...prev, asesor }));
    setDevolucion((prev) => ({ ...prev, asesor }));
    setAudio((prev) => ({ ...prev, asesor }));
    setPda((prev) => ({ ...prev, asesor }));
    setFelicitacion((prev) => ({ ...prev, asesor }));
    setReporteId(null);
  }

  /* ---------- Filtros ---------- */

  const asesoresFiltrados = useMemo(() => {
    const texto = norm(searchAdvisor);
    if (!texto) return ASESORES;
    return ASESORES.filter((a) => norm(a).includes(texto));
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

  const promedioNotas = useMemo(() => {
    const notas = reportes.map((r) => Number(r.nota)).filter((n) => !Number.isNaN(n) && n > 0);
    if (notas.length === 0) return "-";
    return (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1);
  }, [reportes]);

  /* ---------- Actualizadores ---------- */

  function actualizarReporte(campo, valor) {
    setReporte((prev) => ({ ...prev, [campo]: valor }));
    if (campo === "asesor" || campo === "semana" || campo === "campania") {
      setReporteId(null);
    }
  }

  function actualizarDevolucion(campo, valor) {
    setDevolucion((prev) => ({ ...prev, [campo]: valor }));
  }

  function actualizarAudio(campo, valor) {
    setAudio((prev) => ({ ...prev, [campo]: valor }));
  }

  function actualizarPda(campo, valor) {
    setPda((prev) => ({ ...prev, [campo]: valor }));
  }

  /* ---------- Guardados ---------- */

  async function guardarReporte(e) {
    e.preventDefault();
    limpiarMensajes();

    if (!reporte.asesor) {
      setError("Seleccioná un asesor.");
      return;
    }

    const asesorId = buscarAsesorId(reporte.asesor);
    if (!asesorId) return;

    setLoading(true);

    try {
      /* acciones_calidad NO se envía: la columna no existe en reportes. */
      const payload = {
        asesor_id: asesorId,
        asesor: reporte.asesor,
        semana: reporte.semana,
        campania: reporte.campania,
        producto: reporte.campania,

        nota: num(reporte.notaCalidad),
        objetivo: reporte.objetivoCalidad !== "" ? String(reporte.objetivoCalidad) : null,
        evolucion: reporte.evolucionCalidad !== "" ? String(reporte.evolucionCalidad) : null,
        desvio: reporte.desviosCalidad !== "" ? String(reporte.desviosCalidad) : null,
        recomendacion: unir(reporte.aspectosTrabajadosCalidad),
        observaciones: reporte.observacionesCalidad || null,

        sph: num(reporte.sph),
        objetivo_sph: num(reporte.objetivoSph),
        ventas: num(reporte.ventas),
        objetivo_ventas: num(reporte.objetivoVentas),
        objetivo_campania:
          reporte.objetivoCampania !== "" ? String(reporte.objetivoCampania) : null,

        tipificaciones_auditadas: unir(reporte.tipificacionesAuditadas),
        tipificaciones_desvio: porcentaje(reporte.tipificacionesDesvio),
        tipificaciones_objetivo: porcentaje(reporte.tipificacionesObjetivo),
        tipificaciones_resultado: porcentaje(reporte.tipificacionesResultado),
        tipificaciones_compromiso: reporte.tipificacionesCompromiso || null,
        tipificaciones_observaciones: reporte.tipificacionesObservaciones || null,

        no_ventas: reporte.noVentasCantidad !== "" ? String(reporte.noVentasCantidad) : null,
        no_ventas_coaching: unir(reporte.noVentasCoaching),
        no_ventas_registro: reporte.noVentasRegistro || null,
        no_ventas_compromiso: reporte.noVentasCompromiso || null,
        no_ventas_om: unir(reporte.noVentasOM),
        no_ventas_fortalezas: unir(reporte.noVentasFortalezas),
        no_ventas_observaciones: reporte.noVentasObservaciones || null,
      };

      let data;

      if (reporteId) {
        const respuesta = await supabase
          .from("reportes")
          .update(payload)
          .eq("id", reporteId)
          .select()
          .single();
        if (respuesta.error) throw respuesta.error;
        data = respuesta.data;
      } else {
        data = await insertar("reportes", payload);
      }

      setReporteId(data.id);
      setReportes((prev) => [data, ...prev.filter((item) => item.id !== data.id)]);
      setMessage("✅ REPORTE GUARDADO CORRECTAMENTE");
    } catch (err) {
      console.error(err);
      setError(`❌ No se pudo guardar el reporte: ${err?.message || "Error desconocido"}`);
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

    const asesorId = buscarAsesorId(devolucion.asesor);
    if (!asesorId) return;

    setLoading(true);

    try {
      const data = await insertar("devoluciones", {
        asesor_id: asesorId,
        asesor: devolucion.asesor,
        area: devolucion.area,
        responsable: devolucion.responsable || null,
        nota_calidad: num(devolucion.notaCalidad),
        aspectos_calidad: unir(devolucion.aspectosCalidad),
        acciones_calidad: unir(devolucion.accionesCalidad),
        aspectos_productividad: unir(devolucion.aspectosProductividad),
        acciones_productividad: unir(devolucion.accionesProductividad),
        tipificacion: unir(devolucion.tipificacion),
        om: unir(devolucion.om),
        registro_sistema: devolucion.registroSistema || null,
        fortalezas: unir(devolucion.fortalezas),
        observaciones: devolucion.observaciones || null,
      });

      setDevoluciones((prev) => [data, ...prev]);
      setMessage("✅ Devolución guardada correctamente.");
    } catch (err) {
      console.error(err);
      setError(`❌ No se pudo guardar la devolución: ${err?.message || "Error desconocido"}`);
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

    const asesorId = buscarAsesorId(felicitacion.asesor);
    if (!asesorId) return;

    setLoading(true);

    try {
      await insertar("felicitaciones", {
        asesor_id: asesorId,
        asesor: felicitacion.asesor,
        motivo: felicitacion.motivo,
        fecha: felicitacion.fecha || null,
      });

      setMessage("✅ Felicitación guardada correctamente.");
      setFelicitacion({ asesor: felicitacion.asesor, motivo: "", fecha: "" });
    } catch (err) {
      console.error(err);
      setError(`❌ No se pudo guardar la felicitación: ${err?.message || "Error desconocido"}`);
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

    const asesorId = buscarAsesorId(audio.asesor);
    if (!asesorId) return;

    setLoading(true);

    try {
      const extension = audio.archivo.name.split(".").pop() || "mp3";
      const nombreSeguro = norm(audio.asesor).replace(/[^a-z0-9]+/g, "-");
      const filePath = `${Date.now()}-${nombreSeguro}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("audios")
        .upload(filePath, audio.archivo);

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from("audios").getPublicUrl(filePath);

      const data = await insertar("audios", {
        asesor_id: asesorId,
        asesor: audio.asesor,
        area: audio.area,
        responsable: audio.responsable || null,
        fecha: audio.fecha || null,
        archivo: publicData?.publicUrl || null,
        aspectos_calidad: unir(audio.aspectosCalidad),
        aspectos_productividad: unir(audio.aspectosProductividad),
        tipificacion: unir(audio.tipificacion),
        devolucion: audio.devolucion || null,
      });

      setAudios((prev) => [data, ...prev]);
      setMessage("✅ Audio cargado correctamente.");
      setAudio({
        asesor: audio.asesor,
        area: "Calidad",
        responsable: "",
        fecha: "",
        archivo: null,
        aspectosCalidad: [],
        aspectosProductividad: [],
        tipificacion: [],
        devolucion: "",
      });
    } catch (err) {
      console.error(err);
      setError(`❌ No se pudo cargar el audio: ${err?.message || "Error desconocido"}`);
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

    const asesorId = buscarAsesorId(pda.asesor);
    if (!asesorId) return;

    setLoading(true);

    try {
      const data = await insertar("pdas", {
        asesor_id: asesorId,
        asesor: pda.asesor,
        aspecto: pda.aspecto || null,
        fecha_desde: pda.fechaDesde || null,
        fecha_hasta: pda.fechaHasta || null,
        objetivo: pda.objetivo || null,
        observaciones: pda.observaciones || null,
      });

      setPdas((prev) => [data, ...prev]);
      setMessage("✅ PDA guardado correctamente.");
      setPda({
        asesor: pda.asesor,
        aspecto: "",
        fechaDesde: "",
        fechaHasta: "",
        objetivo: "",
        observaciones: "",
      });
    } catch (err) {
      console.error(err);
      setError(`❌ No se pudo guardar el PDA: ${err?.message || "Error desconocido"}`);
    } finally {
      setLoading(false);
    }
  }

  /* ---------- Impresión ---------- */

  function imprimirReporte(r) {
    const ventana = window.open("", "_blank", "width=1000,height=800");

    if (!ventana) {
      setError("El navegador bloqueó la ventana de impresión.");
      return;
    }

    const fila = (label, valor) =>
      `<div class="dato"><span class="label">${label}:</span> ${esc(valor)}</div>`;

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
${fila("Asesor", nombreDe(r))}
${fila("Semana", r.semana)}
${fila("Campaña", r.campania)}

<h2>Calidad</h2>
<div class="box">
${fila("Nota", r.nota)}
${fila("Objetivo", r.objetivo)}
${fila("Evolución", r.evolucion)}
${fila("Desvío", r.desvio)}
${fila("Aspectos trabajados", r.recomendacion)}
${fila("Observaciones", r.observaciones)}
</div>

<h2>Productividad</h2>
<div class="box">
${fila("SPH", r.sph)}
${fila("Objetivo SPH", r.objetivo_sph)}
${fila("Ventas", r.ventas)}
${fila("Objetivo ventas", r.objetivo_ventas)}
${fila("Objetivo campaña", r.objetivo_campania)}
</div>

<h2>Tipificaciones</h2>
<div class="box">
${fila("Auditadas", r.tipificaciones_auditadas)}
${fila("Desvío", r.tipificaciones_desvio)}
${fila("Objetivo", r.tipificaciones_objetivo)}
${fila("Resultado", r.tipificaciones_resultado)}
${fila("Compromiso", r.tipificaciones_compromiso)}
${fila("Observaciones", r.tipificaciones_observaciones)}
</div>

<h2>No Ventas</h2>
<div class="box">
${fila("Cantidad", r.no_ventas)}
${fila("Coaching", r.no_ventas_coaching)}
${fila("Registro", r.no_ventas_registro)}
${fila("Compromiso", r.no_ventas_compromiso)}
${fila("OM", r.no_ventas_om)}
${fila("Fortalezas", r.no_ventas_fortalezas)}
${fila("Observaciones", r.no_ventas_observaciones)}
</div>

<script>window.onload = function () { window.print(); };</script>
</body>
</html>`);

    ventana.document.close();
  }

  /* ================= VISTAS ================= */

  function renderInicio() {
    const accesos = [
      ["asesores", "Asesores", "Buscar y consultar la información integral de cada asesor."],
      ["calidad", "Calidad", "Cargar notas, evolución y aspectos de calidad."],
      ["productividad", "Productividad", "Gestionar objetivos y resultados."],
      ["devoluciones", "Devoluciones", "Registrar devoluciones realizadas."],
      ["audios", "Audios", "Cargar y consultar escuchas."],
      ["pdas", "PDA", "Registrar planes de acción."],
    ];

    const stats = [
      [ASESORES.length, "Asesores"],
      [reportes.length, "Reportes"],
      [promedioNotas, "Promedio de notas"],
      [devoluciones.length, "Devoluciones"],
      [audios.length, "Audios"],
      [pdas.length, "PDA"],
    ];

    return (
      <div style={styles.page}>
        <div style={styles.hero}>
          <div>
            <div style={styles.eyebrow}>PORTAL INTEGRAL DEL ASESOR</div>
            <h1 style={styles.heroTitle}>Panel de Administración</h1>
            <p style={styles.heroText}>
              Gestión centralizada de calidad, productividad, devoluciones, audios, PDA y
              seguimiento de asesores.
            </p>
          </div>
          <div style={styles.heroBadge}>ADMINISTRADOR</div>
        </div>

        <div style={styles.statsGrid}>
          {stats.map(([valor, etiqueta]) => (
            <div key={etiqueta} style={styles.statCard}>
              <span style={styles.statNumber}>{valor}</span>
              <span style={styles.statLabel}>{etiqueta}</span>
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
    const delAsesor = (lista) => lista.filter((item) => nombreDe(item) === selectedAdvisor);

    const reportesAsesor = delAsesor(reportes);
    const devolucionesAsesor = delAsesor(devoluciones);
    const audiosAsesor = delAsesor(audios);
    const pdasAsesor = delAsesor(pdas);

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
                      ...(selectedAdvisor === asesor ? styles.advisorButtonActive : {}),
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
                    <KV label="Reportes" value={reportesAsesor.length} />
                    <KV label="Devoluciones" value={devolucionesAsesor.length} />
                    <KV label="Audios" value={audiosAsesor.length} />
                    <KV label="PDA" value={pdasAsesor.length} />
                  </div>

                  <div style={styles.sectionSpacing}>
                    <h3 style={styles.subTitle}>Últimos reportes</h3>
                    {reportesAsesor.length === 0 ? (
                      <div style={styles.emptyState}>No hay reportes cargados.</div>
                    ) : (
                      <div style={styles.resultList}>
                        {reportesAsesor.slice(0, 3).map((item) => (
                          <div key={item.id} style={styles.resultCard}>
                            <div style={styles.resultTop}>
                              <strong>{item.semana || "-"}</strong>
                              <span>{item.campania || "-"}</span>
                            </div>
                            <div style={styles.resultGrid}>
                              <KV label="Nota" value={item.nota} />
                              <KV label="Desvío" value={item.desvio} />
                              <KV label="Evolución" value={item.evolucion} />
                              <KV label="SPH" value={item.sph} />
                              <KV label="Ventas" value={item.ventas} />
                              <KV label="Tipificaciones" value={item.tipificaciones_resultado} />
                              <KV label="No ventas" value={item.no_ventas} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={styles.sectionSpacing}>
                    <h3 style={styles.subTitle}>Devoluciones</h3>
                    {devolucionesAsesor.length === 0 ? (
                      <div style={styles.emptyState}>No hay devoluciones cargadas.</div>
                    ) : (
                      <div style={styles.resultList}>
                        {devolucionesAsesor.slice(0, 5).map((item) => (
                          <div key={item.id} style={styles.resultCard}>
                            <div style={styles.resultTop}>
                              <strong>{formatearFecha(item.created_at)}</strong>
                              <span>{item.area || "-"}</span>
                            </div>
                            <p style={styles.resultText}>
                              {item.observaciones || "Sin observaciones."}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={styles.sectionSpacing}>
                    <h3 style={styles.subTitle}>PDA</h3>
                    {pdasAsesor.length === 0 ? (
                      <div style={styles.emptyState}>No hay PDA cargados.</div>
                    ) : (
                      <div style={styles.resultList}>
                        {pdasAsesor.slice(0, 5).map((item) => (
                          <div key={item.id} style={styles.resultCard}>
                            <div style={styles.resultTop}>
                              <strong>{item.aspecto || "-"}</strong>
                              <span>
                                {formatearFecha(item.fecha_desde)} →{" "}
                                {formatearFecha(item.fecha_hasta)}
                              </span>
                            </div>
                            <p style={styles.resultText}>
                              {item.objetivo || item.observaciones || "Sin información."}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={styles.sectionSpacing}>
                    <h3 style={styles.subTitle}>Audios</h3>
                    {audiosAsesor.length === 0 ? (
                      <div style={styles.emptyState}>No hay audios cargados.</div>
                    ) : (
                      <div style={styles.resultList}>
                        {audiosAsesor.slice(0, 5).map((item) => (
                          <div key={item.id} style={styles.resultCard}>
                            <div style={styles.resultTop}>
                              <strong>{formatearFecha(item.fecha || item.created_at)}</strong>
                              <span>{item.area || "-"}</span>
                            </div>
                            {item.archivo ? (
                              <audio controls src={item.archivo} style={styles.audioPlayer} />
                            ) : (
                              <p style={styles.resultText}>Sin archivo.</p>
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

  function selectorReporte() {
    return (
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
      </div>
    );
  }

  function renderCalidad() {
    return (
      <div style={styles.page}>
        <Card title="Carga de Calidad">
          <form onSubmit={guardarReporte}>
            {selectorReporte()}

            <div style={{ ...styles.formGrid, ...styles.sectionSpacing }}>
              <NumberInput
                label="Nota obtenida"
                value={reporte.notaCalidad}
                onChange={(v) => actualizarReporte("notaCalidad", v)}
                placeholder="Ej. 85"
              />
              <PercentageInput
                label="Objetivo semanal"
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
                onChange={(v) => actualizarReporte("aspectosTrabajadosCalidad", v)}
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

            <SaveButton loading={loading}>Guardar reporte</SaveButton>
          </form>
        </Card>
      </div>
    );
  }

  function renderProductividad() {
    return (
      <div style={styles.page}>
        <Card title="Productividad">
          <form onSubmit={guardarReporte}>
            {selectorReporte()}

            <div style={{ ...styles.formGrid, ...styles.sectionSpacing }}>
              <NumberInput label="SPH" value={reporte.sph} onChange={(v) => actualizarReporte("sph", v)} />
              <NumberInput
                label="Objetivo SPH"
                value={reporte.objetivoSph}
                onChange={(v) => actualizarReporte("objetivoSph", v)}
              />
              <NumberInput label="Ventas" value={reporte.ventas} onChange={(v) => actualizarReporte("ventas", v)} />
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
                onChange={(v) => actualizarReporte("aspectosTrabajadosProductividad", v)}
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
                onChange={(v) => actualizarReporte("observacionesProductividad", v)}
              />
            </div>

            <SaveButton loading={loading}>Guardar reporte</SaveButton>
          </form>
        </Card>
      </div>
    );
  }

  function renderTipificaciones() {
    return (
      <div style={styles.page}>
        <Card title="Tipificaciones">
          <form onSubmit={guardarReporte}>
            {selectorReporte()}

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
              <Select
                label="Compromiso"
                value={reporte.tipificacionesCompromiso}
                onChange={(v) => actualizarReporte("tipificacionesCompromiso", v)}
                options={["APLICA DEVOLUCION", "SEGUIMIENTO", "NO APLICA"]}
              />
            </div>

            <div style={styles.sectionSpacing}>
              <TextArea
                label="Observaciones"
                value={reporte.tipificacionesObservaciones}
                onChange={(v) => actualizarReporte("tipificacionesObservaciones", v)}
              />
            </div>

            <SaveButton loading={loading}>Guardar reporte</SaveButton>
          </form>
        </Card>
      </div>
    );
  }

  function renderNoVentas() {
    return (
      <div style={styles.page}>
        <Card title="No Ventas">
          <form onSubmit={guardarReporte}>
            {selectorReporte()}

            <div style={{ ...styles.formGrid, ...styles.sectionSpacing }}>
              <NumberInput
                label="Cantidad de no ventas"
                value={reporte.noVentasCantidad}
                onChange={(v) => actualizarReporte("noVentasCantidad", v)}
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
            </div>

            <div style={styles.sectionSpacing}>
              <MultiSelect
                label="Coaching"
                options={PRODUCTIVIDAD_ACCIONES}
                value={reporte.noVentasCoaching}
                onChange={(v) => actualizarReporte("noVentasCoaching", v)}
              />
              <MultiSelect
                label="Principales O.M."
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

            <SaveButton loading={loading}>Guardar reporte</SaveButton>
          </form>
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
                label="Nota calidad (0 a 100)"
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
                onChange={(v) => actualizarDevolucion("aspectosProductividad", v)}
              />
              <MultiSelect
                label="Acciones de productividad"
                options={PRODUCTIVIDAD_ACCIONES}
                value={devolucion.accionesProductividad}
                onChange={(v) => actualizarDevolucion("accionesProductividad", v)}
              />
              <MultiSelect
                label="Tipificación"
                options={TIPIFICACIONES}
                value={devolucion.tipificacion}
                onChange={(v) => actualizarDevolucion("tipificacion", v)}
              />
              <MultiSelect
                label="O.M. (No Ventas)"
                options={OM}
                value={devolucion.om}
                onChange={(v) => actualizarDevolucion("om", v)}
              />
              <Select
                label="Registro en sistema (No Ventas)"
                value={devolucion.registroSistema}
                onChange={(v) => actualizarDevolucion("registroSistema", v)}
                options={["Correcto", "Incorrecto"]}
              />
              <MultiSelect
                label="Fortalezas destacadas (No Ventas)"
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

            <SaveButton loading={loading}>Guardar devolución</SaveButton>
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
                onChange={(v) => setFelicitacion((prev) => ({ ...prev, asesor: v }))}
                options={ASESORES}
              />
              <TextInput
                label="Fecha"
                type="date"
                value={felicitacion.fecha}
                onChange={(v) => setFelicitacion((prev) => ({ ...prev, fecha: v }))}
              />
            </div>

            <div style={styles.sectionSpacing}>
              <TextArea
                label="Motivo de la felicitación"
                value={felicitacion.motivo}
                onChange={(v) => setFelicitacion((prev) => ({ ...prev, motivo: v }))}
                rows={5}
                placeholder="Escribí el motivo..."
              />
            </div>

            <SaveButton loading={loading}>Guardar felicitación</SaveButton>
          </form>
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
                label="¿A qué corresponde?"
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
                type="date"
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
                  onChange={(e) => actualizarAudio("archivo", e.target.files?.[0] || null)}
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

            <SaveButton loading={loading}>Cargar audio</SaveButton>
          </form>
        </Card>
      </div>
    );
  }

  function renderPdas() {
    return (
      <div style={styles.page}>
        <Card title="Plan de Acción (PDA)">
          <form onSubmit={guardarPda}>
            <div style={styles.formGrid}>
              <Select
                label="Asesor"
                value={pda.asesor}
                onChange={(v) => actualizarPda("asesor", v)}
                options={ASESORES}
              />
              <TextInput
                label="Aspecto a trabajar"
                value={pda.aspecto}
                onChange={(v) => actualizarPda("aspecto", v)}
              />
              <TextInput
                label="Fecha desde"
                type="date"
                value={pda.fechaDesde}
                onChange={(v) => actualizarPda("fechaDesde", v)}
              />
              <TextInput
                label="Fecha hasta"
                type="date"
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

            <SaveButton loading={loading}>Guardar PDA</SaveButton>
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
              <TextInput label="" value={semana} onChange={setSemana} placeholder="Semana" />
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
                      <div style={styles.reportKicker}>{item.semana || "-"}</div>
                      <h3 style={styles.reportName}>{nombreDe(item) || "-"}</h3>
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
                    <KV label="Campaña" value={item.campania} />
                    <KV label="Nota" value={item.nota} />
                    <KV label="Objetivo" value={item.objetivo} />
                    <KV label="Desvío" value={item.desvio} />
                    <KV label="SPH" value={item.sph} />
                    <KV label="Ventas" value={item.ventas} />
                    <KV label="Objetivo campaña" value={item.objetivo_campania} />
                    <KV label="Tipificaciones" value={item.tipificaciones_resultado} />
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
          {NAV.map(([tab, titulo]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.navButton,
                ...(activeTab === tab ? styles.navButtonActive : {}),
              }}
            >
              {titulo}
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

/* ================= ESTILOS ================= */

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

  navButtonActive: {
    background: PALETTE.teal,
    opacity: 1,
    fontWeight: 700,
  },

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
    color: PALETTE.navy,
    borderRadius: "12px",
    padding: "16px",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    fontSize: "12px",
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
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "8px",
  },

  sectionSpacing: { marginTop: "22px" },

  subTitle: { margin: "0 0 12px", fontSize: "14px", color: PALETTE.teal },

  resultList: { display: "flex", flexDirection: "column", gap: "10px" },

  resultCard: {
    border: `1px solid ${PALETTE.soft}`,
    borderRadius: "11px",
    padding: "14px",
  },

  resultTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
    fontSize: "12px",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "10px",
  },

  resultText: {
    margin: 0,
    fontSize: "12px",
    color: "#56676b",
    lineHeight: 1.5,
  },

  kv: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "13px",
    border: `1px solid ${PALETTE.soft}`,
    borderRadius: "10px",
    padding: "10px 12px",
    background: "#ffffff",
  },

  kvLabel: { fontSize: "10px", color: "#65757a" },

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

  smallNumberInput: { maxWidth: "140px" },

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
  },

  reportDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "12px",
    marginTop: "14px",
    paddingTop: "14px",
    borderTop: `1px solid ${PALETTE.soft}`,
    fontSize: "12px",
  },
};
