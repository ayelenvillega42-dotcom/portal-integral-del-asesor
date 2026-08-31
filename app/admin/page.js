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

const ESTADOS = {
  pendiente: "PENDIENTE",
  devuelto: "DEVUELTO",
  activo: "ACTIVO",
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

function MultiSelect({
  label,
  options,
  value = [],
  onChange,
}) {
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

function PercentageInput({
  label,
  value,
  onChange,
  placeholder = "0%",
}) {
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...styles.input,
          ...(small ? styles.smallNumberInput : {}),
        }}
      />
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
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.input}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
}) {
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

function Select({
  label,
  value,
  onChange,
  options,
}) {
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

  if (status === ESTADOS.superado) {
    background = PALETTE.teal;
  } else if (status === ESTADOS.alcanzado) {
    background = PALETTE.mint;
  } else if (status === ESTADOS.debajo) {
    background = "#d99a9a";
  }

  return (
    <span
      style={{
        ...styles.badge,
        background,
      }}
    >
      {status || "-"}
    </span>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [reportes, setReportes] = useState([]);
  const [devoluciones, setDevoluciones] = useState([]);
  const [audios, setAudios] = useState([]);
  const [pdas, setPdas] = useState([]);

  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [searchAdvisor, setSearchAdvisor] = useState("");

  const [semana, setSemana] = useState("Semana 4 · Agosto");
  const [campania, setCampania] = useState("BM");

  const [reporte, setReporte] = useState({
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
  });

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
      const [
        reportesResponse,
        devolucionesResponse,
        audiosResponse,
        pdasResponse,
      ] = await Promise.all([
        supabase
          .from("reportes")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("devoluciones")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("audios")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("pdas")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (reportesResponse.error) {
        console.error(reportesResponse.error);
      } else {
        setReportes(reportesResponse.data || []);
      }

      if (devolucionesResponse.error) {
        console.error(devolucionesResponse.error);
      } else {
        setDevoluciones(devolucionesResponse.data || []);
      }

      if (audiosResponse.error) {
        console.error(audiosResponse.error);
      } else {
        setAudios(audiosResponse.data || []);
      }

      if (pdasResponse.error) {
        console.error(pdasResponse.error);
      } else {
        setPdas(pdasResponse.data || []);
      }
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

    setReporte((prev) => ({
      ...prev,
      asesor,
    }));

    setDevolucion((prev) => ({
      ...prev,
      asesor,
    }));

    setAudio((prev) => ({
      ...prev,
      asesor,
    }));

    setPda((prev) => ({
      ...prev,
      asesor,
    }));
  }

  const asesoresFiltrados = useMemo(() => {
    const texto = searchAdvisor.toLowerCase().trim();

    if (!texto) return ASESORES;

    return ASESORES.filter((asesor) =>
      asesor.toLowerCase().includes(texto)
    );
  }, [searchAdvisor]);

  const reportesFiltrados = useMemo(() => {
    return reportes.filter((item) => {
      const coincideSemana =
        !semana || item.semana === semana;

      const coincideCampania =
        !campania || item.campania === campania;

      return coincideSemana && coincideCampania;
    });
  }, [reportes, semana, campania]);

  const devolucionesFiltradas = useMemo(() => {
    if (!selectedAdvisor) return devoluciones;

    return devoluciones.filter(
      (item) => item.asesor === selectedAdvisor
    );
  }, [devoluciones, selectedAdvisor]);

  const audiosFiltrados = useMemo(() => {
    if (!selectedAdvisor) return audios;

    return audios.filter(
      (item) => item.asesor === selectedAdvisor
    );
  }, [audios, selectedAdvisor]);

  const pdasFiltrados = useMemo(() => {
    if (!selectedAdvisor) return pdas;

    return pdas.filter(
      (item) => item.asesor === selectedAdvisor
    );
  }, [pdas, selectedAdvisor]);

  function actualizarReporte(campo, valor) {
    setReporte((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function actualizarDevolucion(campo, valor) {
    setDevolucion((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function actualizarAudio(campo, valor) {
    setAudio((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function actualizarPda(campo, valor) {
    setPda((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  async function guardarReporte(e) {
    e.preventDefault();

    limpiarMensajes();

    if (!reporte.asesor) {
      setError("Seleccioná un asesor.");
      return;
    }

    setLoading(true);

    try {
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
        observaciones:
          reporte.observacionesCalidad || null,

        producto: reporte.campania,

        sph: reporte.sph || null,
        objetivo_sph: reporte.objetivoSph || null,
        ventas: reporte.ventas || null,
        objetivo_ventas: reporte.objetivoVentas || null,
        objetivo_campania:
          reporte.objetivoCampania
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
        tipificaciones_compromiso:
          reporte.tipificacionesCompromiso || null,
        tipificaciones_observaciones:
          reporte.tipificacionesObservaciones || null,

        no_ventas: reporte.noVentasCantidad || null,
        no_ventas_coaching:
          reporte.noVentasCoaching?.join(", ") || null,
        no_ventas_registro:
          reporte.noVentasRegistro || null,
        no_ventas_compromiso:
          reporte.noVentasCompromiso || null,
        no_ventas_om:
          reporte.noVentasOM?.join(", ") || null,
        no_ventas_fortalezas:
          reporte.noVentasFortalezas?.join(", ") || null,
        no_ventas_observaciones:
          reporte.noVentasObservaciones || null,
      };

      /*
       * acciones_calidad NO se envía porque la columna
       * no existe en la tabla reportes de Supabase.
       */

      const { data, error: saveError } = await supabase
        .from("reportes")
        .upsert(payload)
        .select()
        .single();

      if (saveError) {
        throw saveError;
      }

      setReportes((prev) => [
        data,
        ...prev.filter((item) => item.id !== data.id),
      ]);

      setMessage("✓ Reporte guardado correctamente.");
    } catch (err) {
      console.error(err);
      setError(
        `❌ No se pudo guardar el reporte: ${
          err?.message || "Error desconocido"
        }`
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
        aspectos_calidad:
          devolucion.aspectosCalidad?.join(", ") || null,
        acciones_calidad:
          devolucion.accionesCalidad?.join(", ") || null,
        aspectos_productividad:
          devolucion.aspectosProductividad?.join(", ") || null,
        acciones_productividad:
          devolucion.accionesProductividad?.join(", ") || null,
        tipificacion:
          devolucion.tipificacion?.join(", ") || null,
        om: devolucion.om?.join(", ") || null,
        registro_sistema:
          devolucion.registroSistema || null,
        fortalezas:
          devolucion.fortalezas?.join(", ") || null,
        observaciones:
          devolucion.observaciones || null,
      };

      const { data, error: saveError } = await supabase
        .from("devoluciones")
        .insert(payload)
        .select()
        .single();

      if (saveError) {
        throw saveError;
      }

      setDevoluciones((prev) => [data, ...prev]);

      setMessage("✓ Devolución guardada correctamente.");
    } catch (err) {
      console.error(err);
      setError(
        `❌ No se pudo guardar la devolución: ${
          err?.message || "Error desconocido"
        }`
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
      const payload = {
        asesor: felicitacion.asesor,
        motivo: felicitacion.motivo,
        fecha: felicitacion.fecha || null,
      };

      const { error: saveError } = await supabase
        .from("felicitaciones")
        .insert(payload);

      if (saveError) {
        throw saveError;
      }

      setMessage("✓ Felicitación guardada correctamente.");

      setFelicitacion({
        asesor: felicitacion.asesor,
        motivo: "",
        fecha: "",
      });
    } catch (err) {
      console.error(err);
      setError(
        `❌ No se pudo guardar la felicitación: ${
          err?.message || "Error desconocido"
        }`
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
      const extension =
        audio.archivo.name.split(".").pop() || "mp3";

      const fileName = `${Date.now()}-${audio.asesor
        .replace(/\s+/g, "-")
        .replace(/,/g, "")}.${extension}`;

      const filePath = `audios/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("audios")
        .upload(filePath, audio.archivo);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicData } = supabase.storage
        .from("audios")
        .getPublicUrl(filePath);

      const payload = {
        asesor: audio.asesor,
        area: audio.area,
        responsable: audio.responsable || null,
        fecha: audio.fecha || null,
        archivo: publicData?.publicUrl || null,
        aspectos_calidad:
          audio.aspectosCalidad?.join(", ") || null,
        aspectos_productividad:
          audio.aspectosProductividad?.join(", ") || null,
        tipificacion:
          audio.tipificacion?.join(", ") || null,
        devolucion: audio.devolucion || null,
      };

      const { data, error: saveError } = await supabase
        .from("audios")
        .insert(payload)
        .select()
        .single();

      if (saveError) {
        throw saveError;
      }

      setAudios((prev) => [data, ...prev]);

      setMessage("✓ Audio cargado correctamente.");

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
      setError(
        `❌ No se pudo cargar el audio: ${
          err?.message || "Error desconocido"
        }`
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

      if (saveError) {
        throw saveError;
      }

      setPdas((prev) => [data, ...prev]);

      setMessage("✓ PDA guardado correctamente.");

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
      setError(
        `❌ No se pudo guardar el PDA: ${
          err?.message || "Error desconocido"
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  function imprimirReporte(reporteSeleccionado) {
    const ventana = window.open(
      "",
      "_blank",
      "width=1000,height=800"
    );

    if (!ventana) {
      setError("El navegador bloqueó la ventana de impresión.");
      return;
    }

    ventana.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <title>Reporte de Calidad</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #031926;
            }
            h1 {
              color: #031926;
              margin-bottom: 5px;
            }
            h2 {
              color: #468189;
              margin-top: 30px;
              border-bottom: 2px solid #9DBEBB;
              padding-bottom: 6px;
            }
            .dato {
              margin: 8px 0;
            }
            .label {
              font-weight: bold;
            }
            .box {
              background: #F4E9CD;
              padding: 15px;
              border-radius: 10px;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <h1>PORTAL DE CALIDAD</h1>

          <div class="dato">
            <span class="label">Asesor:</span>
            ${reporteSeleccionado.asesor || "-"}
          </div>

          <div class="dato">
            <span class="label">Semana:</span>
            ${reporteSeleccionado.semana || "-"}
          </div>

          <div class="dato">
            <span class="label">Campaña:</span>
            ${reporteSeleccionado.campania || "-"}
          </div>

          <h2>Calidad</h2>

          <div class="box">
            <div class="dato">
              <span class="label">Nota:</span>
              ${reporteSeleccionado.nota || "-"}
            </div>

            <div class="dato">
              <span class="label">Objetivo:</span>
              ${reporteSeleccionado.objetivo || "-"}
            </div>

            <div class="dato">
              <span class="label">Evolución:</span>
              ${reporteSeleccionado.evolucion || "-"}
            </div>

            <div class="dato">
              <span class="label">Desvío:</span>
              ${reporteSeleccionado.desvio || "-"}
            </div>

            <div class="dato">
              <span class="label">Aspectos trabajados:</span>
              ${reporteSeleccionado.recomendacion || "-"}
            </div>

            <div class="dato">
              <span class="label">Observaciones:</span>
              ${reporteSeleccionado.observaciones || "-"}
            </div>
          </div>

          <h2>Productividad</h2>

          <div class="box">
            <div class="dato">
              <span class="label">SPH:</span>
              ${reporteSeleccionado.sph || "-"}
            </div>

            <div class="dato">
              <span class="label">Objetivo SPH:</span>
              ${reporteSeleccionado.objetivo_sph || "-"}
            </div>

            <div class="dato">
              <span class="label">Ventas:</span>
              ${reporteSeleccionado.ventas || "-"}
            </div>

            <div class="dato">
              <span class="label">Objetivo ventas:</span>
              ${reporteSeleccionado.objetivo_ventas || "-"}
            </div>

            <div class="dato">
              <span class="label">Objetivo campaña:</span>
              ${reporteSeleccionado.objetivo_campania || "-"}
            </div>
          </div>

          <h2>Tipificaciones</h2>

          <div class="box">
            <div class="dato">
              <span class="label">Auditadas:</span>
              ${reporteSeleccionado.tipificaciones_auditadas || "-"}
            </div>

            <div class="dato">
              <span class="label">Desvío:</span>
              ${reporteSeleccionado.tipificaciones_desvio || "-"}
            </div>

            <div class="dato">
              <span class="label">Objetivo:</span>
              ${reporteSeleccionado.tipificaciones_objetivo || "-"}
            </div>

            <div class="dato">
              <span class="label">Resultado:</span>
              ${reporteSeleccionado.tipificaciones_resultado || "-"}
            </div>

            <div class="dato">
              <span class="label">Compromiso:</span>
              ${reporteSeleccionado.tipificaciones_compromiso || "-"}
            </div>

            <div class="dato">
              <span class="label">Observaciones:</span>
              ${reporteSeleccionado.tipificaciones_observaciones || "-"}
            </div>
          </div>

          <h2>No Ventas</h2>

          <div class="box">
            <div class="dato">
              <span class="label">Cantidad:</span>
              ${reporteSeleccionado.no_ventas || "-"}
            </div>

            <div class="dato">
              <span class="label">Coaching:</span>
              ${reporteSeleccionado.no_ventas_coaching || "-"}
            </div>

            <div class="dato">
              <span class="label">Registro:</span>
              ${reporteSeleccionado.no_ventas_registro || "-"}
            </div>

            <div class="dato">
              <span class="label">Compromiso:</span>
              ${reporteSeleccionado.no_ventas_compromiso || "-"}
            </div>

            <div class="dato">
              <span class="label">OM:</span>
              ${reporteSeleccionado.no_ventas_om || "-"}
            </div>

            <div class="dato">
              <span class="label">Fortalezas:</span>
              ${reporteSeleccionado.no_ventas_fortalezas || "-"}
            </div>

            <div class="dato">
              <span class="label">Observaciones:</span>
              ${reporteSeleccionado.no_ventas_observaciones || "-"}
            </div>
          </div>

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

  function renderInicio() {
    const totalReportes = reportes.length;
    const totalDevoluciones = devoluciones.length;
    const totalAudios = audios.length;
    const totalPdas = pdas.length;

    return (
      <div style={styles.page}>
        <div style={styles.hero}>
          <div>
            <div style={styles.eyebrow}>
              PORTAL INTEGRAL DEL ASESOR
            </div>

            <h1 style={styles.heroTitle}>
              Panel de Administración
            </h1>

            <p style={styles.heroText}>
              Gestión centralizada de calidad, productividad,
              devoluciones, audios, PDA y seguimiento de asesores.
            </p>
          </div>

          <div style={styles.heroBadge}>
            ADMINISTRADOR
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              {ASESORES.length}
            </span>
            <span style={styles.statLabel}>
              Asesores
            </span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              {totalReportes}
            </span>
            <span style={styles.statLabel}>
              Reportes
            </span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              {totalDevoluciones}
            </span>
            <span style={styles.statLabel}>
              Devoluciones
            </span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              {totalAudios}
            </span>
            <span style={styles.statLabel}>
              Audios
            </span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              {totalPdas}
            </span>
            <span style={styles.statLabel}>
              PDA
            </span>
          </div>
        </div>

        <Card title="Accesos rápidos">
          <div style={styles.quickGrid}>
            <button
              type="button"
              style={styles.quickButton}
              onClick={() => setActiveTab("asesores")}
            >
              <strong>Asesores</strong>
              <span>
                Buscar y consultar la información integral
                de cada asesor.
              </span>
            </button>

            <button
              type="button"
              style={styles.quickButton}
              onClick={() => setActiveTab("calidad")}
            >
              <strong>Calidad</strong>
              <span>
                Cargar notas, evolución y aspectos de calidad.
              </span>
            </button>

            <button
              type="button"
              style={styles.quickButton}
              onClick={() => setActiveTab("productividad")}
            >
              <strong>Productividad</strong>
              <span>
                Gestionar objetivos y resultados.
              </span>
            </button>

            <button
              type="button"
              style={styles.quickButton}
              onClick={() => setActiveTab("devoluciones")}
            >
              <strong>Devoluciones</strong>
              <span>
                Registrar devoluciones realizadas.
              </span>
            </button>

            <button
              type="button"
              style={styles.quickButton}
              onClick={() => setActiveTab("audios")}
            >
              <strong>Audios</strong>
              <span>
                Cargar y consultar escuchas.
              </span>
            </button>

            <button
              type="button"
              style={styles.quickButton}
              onClick={() => setActiveTab("pdas")}
            >
              <strong>PDA</strong>
              <span>
                Registrar planes de acción.
              </span>
            </button>
          </div>
        </Card>
      </div>
    );
  }

  function renderAsesores() {
    const reporteAsesor = reportes.filter(
      (item) => item.asesor === selectedAdvisor
    );

    const devolucionesAsesor = devoluciones.filter(
      (item) => item.asesor === selectedAdvisor
    );

    const audiosAsesor = audios.filter(
      (item) => item.asesor === selectedAdvisor
    );

    const pdasAsesor = pdas.filter(
      (item) => item.asesor === selectedAdvisor
    );

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
                  Seleccioná un asesor para ver toda su
                  información.
                </div>
              ) : (
                <>
                  <div style={styles.profileHeader}>
                    <div>
                      <div style={styles.profileKicker}>
                        ASESOR
                      </div>

                      <h2 style={styles.profileName}>
                        {selectedAdvisor}
                      </h2>
                    </div>
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
                                  <span>
                                    Desvío
                                  </span>
                                  <strong>
                                    {item.tipificaciones_desvio ||
                                      "-"}
                                  </strong>
                                </div>

                                <div>
                                  <span>
                                    Resultado
                                  </span>
                                  <strong>
                                    {item.tipificaciones_resultado ||
                                      "-"}
                                  </strong>
                                </div>

                                <div>
                                  <span>
                                    No Ventas
                                  </span>
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
                  actualizarReporte("objetivoCalidad", value)
                }
              />

              <PercentageInput
                label="Evolución"
                value={reporte.evolucionCalidad}
                onChange={(value) =>
                  actualizarReporte("evolucionCalidad", value)
                }
              />

              <PercentageInput
                label="Desvío"
                value={reporte.desviosCalidad}
                onChange={(value) =>
                  actualizarReporte("desviosCalidad", value)
                }
              />
            </div>

            <div style={styles.sectionSpacing}>
              <MultiSelect
                label="Aspectos trabajados"
                options={CALIDAD_ASPECTOS}
                value={reporte.aspectosTrabajadosCalidad}
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
                actualizarReporte("objetivoSph", value)
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
                actualizarReporte("objetivoVentas", value)
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
              value={reporte.observacionesProductividad}
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

          <div style={styles.formGrid}>
            <PercentageInput
              label="Desvío"
              value={reporte.tipificacionesDesvio}
              onChange={(value) =>
                actualizarReporte(
                  "tipificacionesDesvio",
                  value
                )
              }
            />

            <PercentageInput
              label="Objetivo"
              value={reporte.tipificacionesObjetivo}
              onChange={(value) =>
                actualizarReporte(
                  "tipificacionesObjetivo",
                  value
                )
              }
            />

            <PercentageInput
              label="Resultado"
              value={reporte.tipificacionesResultado}
              onChange={(value) =>
                actualizarReporte(
                  "tipificacionesResultado",
                  value
                )
              }
            />
          </div>

          <div style={styles.sectionSpacing}>
            <TextArea
              label="Compromiso"
              value={reporte.tipificacionesCompromiso}
              onChange={(value) =>
                actualizarReporte(
                  "tipificacionesCompromiso",
                  value
                )
              }
            />

            <TextArea
              label="Observaciones"
              value={reporte.tipificacionesObservaciones}
              onChange={(value) =>
                actualizarReporte(
                  "tipificacionesObservaciones",
                  value
                )
              }
            />
          </div>
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
              onChange={(value) =>
                actualizarReporte("asesor", value)
              }
              options={ASESORES}
            />

            <NumberInput
              label="Cantidad de no ventas"
              value={reporte.noVentasCantidad}
              onChange={(value) =>
                actualizarReporte(
                  "noVentasCantidad",
                  value
                )
              }
            />
          </div>

          <div style={styles.sectionSpacing}>
            <MultiSelect
              label="Coaching"
              options={PRODUCTIVIDAD_ACCIONES}
              value={reporte.noVentasCoaching}
              onChange={(value) =>
                actualizarReporte(
                  "noVentasCoaching",
                  value
                )
              }
            />

            <TextArea
              label="Registro"
              value={reporte.noVentasRegistro}
              onChange={(value) =>
                actualizarReporte(
                  "noVentasRegistro",
                  value
                )
              }
            />

            <TextArea
              label="Compromiso"
              value={reporte.noVentasCompromiso}
              onChange={(value) =>
                actualizarReporte(
                  "noVentasCompromiso",
                  value
                )
              }
            />

            <MultiSelect
              label="OM"
              options={OM}
              value={reporte.noVentasOM}
              onChange={(value) =>
                actualizarReporte(
                  "noVentasOM",
                  value
                )
              }
            />

            <MultiSelect
              label="Fortalezas"
              options={FORTALEZAS}
              value={reporte.noVentasFortalezas}
              onChange={(value) =>
                actualizarReporte(
                  "noVentasFortalezas",
                  value
                )
              }
            />

            <TextArea
              label="Observaciones"
              value={reporte.noVentasObservaciones}
              onChange={(value) =>
                actualizarReporte(
                  "noVentasObservaciones",
                  value
                )
              }
            />
          </div>
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
                value={devolucion.area}
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
                ]}
              />

              <TextInput
                label="Responsable"
                value={devolucion.responsable}
                onChange={(value) =>
                  actualizarDevolucion(
                    "responsable",
                    value
                  )
                }
              />

              <NumberInput
                label="Nota calidad"
                value={devolucion.notaCalidad}
                onChange={(value) =>
                  actualizarDevolucion(
                    "notaCalidad",
                    value
                  )
                }
              />
            </div>

            <div style={styles.sectionSpacing}>
              <MultiSelect
                label="Aspectos de calidad"
                options={CALIDAD_ASPECTOS}
                value={devolucion.aspectosCalidad}
                onChange={(value) =>
                  actualizarDevolucion(
                    "aspectosCalidad",
                    value
                  )
                }
              />

              <MultiSelect
                label="Acciones de calidad"
                options={CALIDAD_ACCIONES}
                value={devolucion.accionesCalidad}
                onChange={(value) =>
                  actualizarDevolucion(
                    "accionesCalidad",
                    value
                  )
                }
              />

              <MultiSelect
                label="Aspectos de productividad"
                options={PRODUCTIVIDAD_ASPECTOS}
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
                options={PRODUCTIVIDAD_ACCIONES}
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
                options={TIPIFICACIONES}
                value={devolucion.tipificacion}
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
                value={devolucion.om}
                onChange={(value) =>
                  actualizarDevolucion(
                    "om",
                    value
                  )
                }
              />

              <TextArea
                label="Registro en sistema"
                value={devolucion.registroSistema}
                onChange={(value) =>
                  actualizarDevolucion(
                    "registroSistema",
                    value
                  )
                }
              />

              <MultiSelect
                label="Fortalezas"
                options={FORTALEZAS}
                value={devolucion.fortalezas}
                onChange={(value) =>
                  actualizarDevolucion(
                    "fortalezas",
                    value
                  )
                }
              />

              <TextArea
                label="Observaciones"
                value={devolucion.observaciones}
                onChange={(value) =>
                  actualizarDevolucion(
                    "observaciones",
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
                  : "Guardar devolución"}
              </button>
            </div>
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
                onChange={(value) =>
                  setFelicitacion((prev) => ({
                    ...prev,
                    asesor: value,
                  }))
                }
                options={ASESORES}
              />

              <TextInput
                label="Fecha"
                value={felicitacion.fecha}
                onChange={(value) =>
                  setFelicitacion((prev) => ({
                    ...prev,
                    fecha: value,
                  }))
                }
                placeholder="DD/MM/AAAA"
              />
            </div>

            <div style={styles.sectionSpacing}>
              <TextArea
                label="Motivo de la felicitación"
                value={felicitacion.motivo}
                onChange={(value) =>
                  setFelicitacion((prev) => ({
                    ...prev,
                    motivo: value,
                  }))
                }
                rows={5}
                placeholder="Escribí el motivo..."
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
                  : "Guardar felicitación"}
              </button>
            </div>
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
                onChange={(value) =>
                  actualizarAudio("asesor", value)
                }
                options={ASESORES}
              />

              <Select
                label="Área"
                value={audio.area}
                onChange={(value) =>
                  actualizarAudio("area", value)
                }
                options={[
                  "Calidad",
                  "Productividad",
                  "Tipificaciones",
                  "No Ventas",
                ]}
              />

              <TextInput
                label="Responsable"
                value={audio.responsable}
                onChange={(value) =>
                  actualizarAudio(
                    "responsable",
                    value
                  )
                }
              />

              <TextInput
                label="Fecha"
                value={audio.fecha}
                onChange={(value) =>
                  actualizarAudio("fecha", value)
                }
              />
            </div>

            <div style={styles.sectionSpacing}>
              <div style={styles.field}>
                <label style={styles.label}>
                  Archivo de audio
                </label>

                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) =>
                    actualizarAudio(
                      "archivo",
                      e.target.files?.[0] || null
                    )
                  }
                  style={styles.input}
                />
              </div>

              <MultiSelect
                label="Aspectos de calidad"
                options={CALIDAD_ASPECTOS}
                value={audio.aspectosCalidad}
                onChange={(value) =>
                  actualizarAudio(
                    "aspectosCalidad",
                    value
                  )
                }
              />

              <MultiSelect
                label="Aspectos de productividad"
                options={PRODUCTIVIDAD_ASPECTOS}
                value={audio.aspectosProductividad}
                onChange={(value) =>
                  actualizarAudio(
                    "aspectosProductividad",
                    value
                  )
                }
              />

              <MultiSelect
                label="Tipificación"
                options={TIPIFICACIONES}
                value={audio.tipificacion}
                onChange={(value) =>
                  actualizarAudio(
                    "tipificacion",
                    value
                  )
                }
              />

              <TextArea
                label="Devolución"
                value={audio.devolucion}
                onChange={(value) =>
                  actualizarAudio(
                    "devolucion",
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
                  ? "Cargando..."
                  : "Cargar audio"}
              </button>
            </div>
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
                onChange={(value) =>
                  actualizarPda("asesor", value)
                }
                options={ASESORES}
              />

              <TextInput
                label="Aspecto"
                value={pda.aspecto}
                onChange={(value) =>
                  actualizarPda("aspecto", value)
                }
              />

              <TextInput
                label="Fecha desde"
                value={pda.fechaDesde}
                onChange={(value) =>
                  actualizarPda("fechaDesde", value)
                }
              />

              <TextInput
                label="Fecha hasta"
                value={pda.fechaHasta}
                onChange={(value) =>
                  actualizarPda("fechaHasta", value)
                }
              />
            </div>

            <div style={styles.sectionSpacing}>
              <TextArea
                label="Objetivo"
                value={pda.objetivo}
                onChange={(value) =>
                  actualizarPda("objetivo", value)
                }
              />

              <TextArea
                label="Observaciones"
                value={pda.observaciones}
                onChange={(value) =>
                  actualizarPda(
                    "observaciones",
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
                  : "Guardar PDA"}
              </button>
            </div>
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
                onChange={(e) =>
                  setCampania(e.target.value)
                }
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
              No hay reportes cargados para los filtros
              seleccionados.
            </div>
          ) : (
            <div style={styles.reportList}>
              {reportesFiltrados.map((item) => (
                <div
                  key={item.id}
                  style={styles.reportCard}
                >
                  <div style={styles.reportHeader}>
                    <div>
                      <div style={styles.reportKicker}>
                        {item.semana || "-"}
                      </div>

                      <h3 style={styles.reportName}>
                        {item.asesor || "-"}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        imprimirReporte(item)
                      }
                      style={styles.secondaryButton}
                    >
                      Imprimir
                    </button>
                  </div>

                  <div style={styles.reportGrid}>
                    <div>
                      <span>Campaña</span>
                      <strong>
                        {item.campania || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Nota</span>
                      <strong>
                        {item.nota || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Objetivo</span>
                      <strong>
                        {item.objetivo || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Desvío</span>
                      <strong>
                        {item.desvio || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>SPH</span>
                      <strong>
                        {item.sph || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Ventas</span>
                      <strong>
                        {item.ventas || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Objetivo campaña</span>
                      <strong>
                        {item.objetivo_campania ||
                          "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Tipificaciones</span>
                      <strong>
                        {item.tipificaciones_resultado ||
                          "-"}
                      </strong>
                    </div>
                  </div>

                  <div style={styles.reportDetails}>
                    <div>
                      <strong>
                        Aspectos trabajados
                      </strong>

                      <p>
                        {item.recomendacion || "-"}
                      </p>
                    </div>

                    <div>
                      <strong>
                        Observaciones
                      </strong>

                      <p>
                        {item.observaciones || "-"}
                      </p>
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

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoMark}>
            PC
          </div>

          <div>
            <strong style={styles.logoTitle}>
              Portal de Calidad
            </strong>

            <span style={styles.logoSubtitle}>
              Administración
            </span>
          </div>
        </div>

        <nav style={styles.nav}>
          <button
            type="button"
            onClick={() => setActiveTab("inicio")}
            style={{
              ...styles.navButton,
              ...(activeTab === "inicio"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Inicio
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("asesores")}
            style={{
              ...styles.navButton,
              ...(activeTab === "asesores"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Asesores
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("calidad")}
            style={{
              ...styles.navButton,
              ...(activeTab === "calidad"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Calidad
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("productividad")
            }
            style={{
              ...styles.navButton,
              ...(activeTab === "productividad"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Productividad
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("tipificaciones")
            }
            style={{
              ...styles.navButton,
              ...(activeTab === "tipificaciones"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Tipificaciones
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("noVentas")}
            style={{
              ...styles.navButton,
              ...(activeTab === "noVentas"
                ? styles.navButtonActive
                : {}),
            }}
          >
            No Ventas
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("devoluciones")
            }
            style={{
              ...styles.navButton,
              ...(activeTab === "devoluciones"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Devoluciones
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("felicitaciones")
            }
            style={{
              ...styles.navButton,
              ...(activeTab === "felicitaciones"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Felicitaciones
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audios")}
            style={{
              ...styles.navButton,
              ...(activeTab === "audios"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Audios
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pdas")}
            style={{
              ...styles.navButton,
              ...(activeTab === "pdas"
                ? styles.navButtonActive
                : {}),
            }}
          >
            PDA
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reportes")}
            style={{
              ...styles.navButton,
              ...(activeTab === "reportes"
                ? styles.navButtonActive
                : {}),
            }}
          >
            Reportes
          </button>
        </nav>

        <div style={styles.sidebarBottom}>
          <div style={styles.statusDot} />
          <span>
            Sistema conectado
          </span>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <div>
            <span style={styles.topbarKicker}>
              ADMINISTRACIÓN
            </span>

            <h1 style={styles.topbarTitle}>
              Portal Integral del Asesor
            </h1>
          </div>

          {selectedAdvisor && (
            <div style={styles.selectedAdvisor}>
              <span>Asesor seleccionado</span>
              <strong>{selectedAdvisor}</strong>
            </div>
          )}
        </header>

        {message && (
          <div style={styles.successMessage}>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {activeTab === "inicio" && renderInicio()}
        {activeTab === "asesores" && renderAsesores()}
        {activeTab === "calidad" && renderCalidad()}
        {activeTab === "productividad" &&
          renderProductividad()}
        {activeTab === "tipificaciones" &&
          renderTipificaciones()}
        {activeTab === "noVentas" &&
          renderNoVentas()}
        {activeTab === "devoluciones" &&
          renderDevoluciones()}
        {activeTab === "felicitaciones" &&
          renderFelicitaciones()}
        {activeTab === "audios" && renderAudios()}
        {activeTab === "pdas" && renderPdas()}
        {activeTab === "reportes" && renderReportes()}
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
    fontFamily:
      "Arial, Helvetica, sans-serif",
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

  logoTitle: {
    display: "block",
    fontSize: "14px",
    lineHeight: 1.2,
  },

  logoSubtitle: {
    display: "block",
    marginTop: "3px",
    fontSize: "11px",
    opacity: 0.65,
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

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
    transition: "0.2s",
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

  main: {
    flex: 1,
    minWidth: 0,
  },

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

  heroTitle: {
    margin: 0,
    fontSize: "30px",
  },

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
    gridTemplateColumns:
      "repeat(auto-fit, minmax(160px, 1fr))",
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

  statNumber: {
    fontSize: "27px",
    fontWeight: 800,
    color: PALETTE.navy,
  },

  statLabel: {
    fontSize: "11px",
    color: "#65757a",
  },

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

  cardTitle: {
    margin: 0,
    fontSize: "19px",
    color: PALETTE.navy,
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
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
    gridTemplateColumns:
      "minmax(240px, 300px) minmax(0, 1fr)",
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

  profileName: {
    margin: "6px 0 0",
    fontSize: "24px",
  },

  miniStats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
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

  sectionSpacing: {
    marginTop: "22px",
  },

  subTitle: {
    margin: "0 0 12px",
    fontSize: "14px",
    color: PALETTE.teal,
  },

  resultList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

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
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "10px",
  },

  resultGridItem: {
    display: "flex",
    flexDirection: "column",
  },

  resultText: {
    margin: 0,
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
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    alignItems: "start",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    fontSize: "11px",
    fontWeight: 700,
    color: PALETTE.navy,
  },

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

  smallNumberInput: {
    maxWidth: "120px",
  },

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
    fontFamily:
      "Arial, Helvetica, sans-serif",
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
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
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

  audioPlayer: {
    width: "100%",
    marginTop: "5px",
  },

  filters: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  filterSelect: {
    border: `1px solid ${PALETTE.soft}`,
    borderRadius: "8px",
    padding: "8px 10px",
    fontSize: "11px",
    background: "#ffffff",
    color: PALETTE.navy,
  },

  reportList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

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

  reportName: {
    margin: 0,
    fontSize: "17px",
  },

  reportGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "9px",
  },

  reportDetails: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "12px",
    marginTop: "14px",
    paddingTop: "14px",
    borderTop: `1px solid ${PALETTE.soft}`,
  },
};      <FormSection title="DEVOLUCIÓN">
        <Field
          label="Devolución"
          value={datos.devolucion}
          onChange={(v) =>
            actualizar(
              "devolucion",
              v
            )
          }
          type="textarea"
        />

        <Field
          label="Observaciones"
          value={datos.observaciones}
          onChange={(v) =>
            actualizar(
              "observaciones",
              v
            )
          }
          type="textarea"
        />
      </FormSection>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "24px",
        }}
      >
        <button
          type="button"
          onClick={guardarDevolucion}
          style={styles.primaryButton}
        >
          GUARDAR DEVOLUCIÓN
        </button>
      </div>
    </section>
  );
}

function FormularioAudio({
  datos,
  actualizar,
  toggle,
  guardarAudio,
}) {
  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <div>
          <h2
            style={{
              margin: 0,
              color: "#1F2937",
            }}
          >
            Nuevo audio
          </h2>

          <p style={styles.muted}>
            Cargá el audio correspondiente a
            la gestión realizada.
          </p>
        </div>
      </div>

      <div style={styles.formGrid}>
        <Field
          label="Asesor"
          value={datos.asesor}
          onChange={(v) =>
            actualizar("asesor", v)
          }
          type="select"
          options={asesores.map((a) => ({
            value: a.nombre,
            label: a.nombre,
          }))}
        />

        <Field
          label="¿A qué corresponde?"
          value={datos.corresponde}
          onChange={(v) =>
            actualizar(
              "corresponde",
              v
            )
          }
          type="select"
          options={[
            {
              value: "Calibración de Calidad",
              label:
                "Calibración de Calidad",
            },
            {
              value: "Productividad",
              label: "Productividad",
            },
            {
              value: "Tipificaciones",
              label: "Tipificaciones",
            },
            {
              value: "No Ventas",
              label: "No Ventas",
            },
          ]}
        />

        <Field
          label="Responsable"
          value={datos.responsable}
          onChange={(v) =>
            actualizar(
              "responsable",
              v
            )
          }
        />

        <Field
          label="Fecha"
          value={datos.fecha}
          onChange={(v) =>
            actualizar("fecha", v)
          }
          type="date"
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label style={styles.label}>
          Audio
        </label>

        <input
          type="file"
          accept="audio/*"
          onChange={(e) =>
            actualizar(
              "archivo",
              e.target.files?.[0] || null
            )
          }
          style={styles.input}
        />
      </div>

      <FormSection title="CALIDAD">
        <MultiSelect
          label="Aspectos trabajados"
          values={
            datos.aspectosCalidad
          }
          options={CALIDAD}
          onToggle={(v) =>
            toggle(
              "aspectosCalidad",
              v
            )
          }
        />
      </FormSection>

      <FormSection title="PRODUCTIVIDAD">
        <MultiSelect
          label="Aspectos trabajados"
          values={
            datos.aspectosProductividad
          }
          options={
            PRODUCTIVIDAD
          }
          onToggle={(v) =>
            toggle(
              "aspectosProductividad",
              v
            )
          }
        />
      </FormSection>

      <FormSection title="TIPIFICACIONES">
        <MultiSelect
          label="Tipificación"
          values={
            datos.tipificaciones
          }
          options={
            TIPIFICACIONES
          }
          onToggle={(v) =>
            toggle(
              "tipificaciones",
              v
            )
          }
        />
      </FormSection>

      <FormSection title="NO VENTAS">
        <MultiSelect
          label="O.M."
          values={datos.om}
          options={OM}
          onToggle={(v) =>
            toggle("om", v)
          }
        />

        <MultiSelect
          label="Fortalezas destacadas"
          values={
            datos.fortalezas
          }
          options={FORTALEZAS}
          onToggle={(v) =>
            toggle(
              "fortalezas",
              v
            )
          }
        />
      </FormSection>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "24px",
        }}
      >
        <button
          type="button"
          onClick={guardarAudio}
          style={styles.primaryButton}
        >
          GUARDAR AUDIO
        </button>
      </div>
    </section>
  );
}

function FormularioPDA({
  datos,
  actualizar,
  guardarPda,
}) {
  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <div>
          <h2
            style={{
              margin: 0,
              color: "#1F2937",
            }}
          >
            Nuevo Plan de Acción
          </h2>

          <p style={styles.muted}>
            Cargá el PDA correspondiente
            al asesor.
          </p>
        </div>
      </div>

      <div style={styles.formGrid}>
        <Field
          label="Asesor"
          value={datos.asesor}
          onChange={(v) =>
            actualizar("asesor", v)
          }
          type="select"
          options={asesores.map((a) => ({
            value: a.nombre,
            label: a.nombre,
          }))}
        />

        <Field
          label="Aspecto a trabajar"
          value={
            datos.aspecto
          }
          onChange={(v) =>
            actualizar(
              "aspecto",
              v
            )
          }
        />

        <Field
          label="Fecha desde"
          value={
            datos.fechaDesde
          }
          onChange={(v) =>
            actualizar(
              "fechaDesde",
              v
            )
          }
          type="date"
        />

        <Field
          label="Fecha hasta"
          value={
            datos.fechaHasta
          }
          onChange={(v) =>
            actualizar(
              "fechaHasta",
              v
            )
          }
          type="date"
        />

        <Field
          label="Objetivo"
          value={
            datos.objetivo
          }
          onChange={(v) =>
            actualizar(
              "objetivo",
              v
            )
          }
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "24px",
        }}
      >
        <button
          type="button"
          onClick={guardarPda}
          style={styles.primaryButton}
        >
          GUARDAR PDA
        </button>
      </div>
    </section>
  );
}
