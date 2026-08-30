"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const ADMIN_EMAIL = "ayelenvillega42@gmail.com";

const SEMANAS = [
  "Semana 4 · Agosto",
  "Semana 3 · Agosto",
  "Semana 2 · Agosto",
  "Semana 1 · Agosto",
];

const CAMPANIAS = ["AP", "BM"];

const AREAS = [
  "Calidad",
  "Productividad",
  "Tipificaciones",
  "No Ventas",
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
  "NO ELEGIBLE / NO REÚNE REQUISITOS",
  "NO CONTESTA",
];

const OM_NO_VENTAS = [
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

const COMPROMISOS = [
  "APLICA DEVOLUCIÓN",
  "SEGUIMIENTO",
  "NO APLICA",
];

function fechaHoy() {
  return new Date().toISOString().slice(0, 10);
}

function nuevoReporte() {
  return {
    asesor: "",
    semana: "Semana 4 · Agosto",
    producto: "BM",
    nota: "",
    objetivo: "",
    evolucion: "",
    desvio: "",
    recomendacion: "",
    auditoria: "",
    observaciones: "",
    sph: "",
    objetivoSph: "",
    ventas: "",
    objetivoVentas: "",
    objetivoCampania: "",
    descripcionCampania: "",
    estadoSph: "",
    estadoVentas: "",
    estadoCampania: "",
    gestion: "",
    aspectosCalidad: [],
    accionesCalidad: [],
    aspectosProductividad: [],
    accionesProductividad: [],
    tipificaciones: [],
    compromisoTipificaciones: "",
    observacionesTipificaciones: "",
    cantidadNoVentas: "",
    coachingNoVentas: [],
    registroSistemaNoVentas: "",
    compromisoNoVentas: "",
    omNoVentas: [],
    fortalezasNoVentas: [],
    observacionesNoVentas: "",
  };
}

function nuevaDevolucion(asesor = "") {
  return {
    asesor,
    area: "Calidad",
    fecha: fechaHoy(),
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

function nuevoAudio(asesor = "") {
  return {
    asesor,
    area: "Calidad",
    responsable: "",
    fecha: fechaHoy(),
    archivo: null,
    aspectosCalidad: [],
    aspectosProductividad: [],
    tipificaciones: [],
    devolucion: "",
  };
}

function nuevoPda(asesor = "") {
  return {
    asesor,
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

function nuevaFelicitacion(asesor = "") {
  return {
    asesor,
    fecha: fechaHoy(),
    motivo: "",
    felicitacion: "",
    observaciones: "",
  };
}

function normalizarArray(valor) {
  if (Array.isArray(valor)) return valor;

  if (!valor) return [];

  if (typeof valor === "string") {
    try {
      const parsed = JSON.parse(valor);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {}

    return valor
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return [];
}

function nombreAsesor(asesores, email) {
  return (
    asesores.find((a) => a.email === email)?.nombre ||
    email ||
    "—"
  );
}

function coincideAsesor(registro, asesor) {
  if (!registro || !asesor) return false;

  return (
    registro.asesor_id === asesor.id ||
    registro.asesor_email === asesor.email ||
    registro.asesor === asesor.nombre
  );
}

function estadoDesdeReporte(reporte) {
  if (!reporte) return "SIN DATOS";

  const nota = Number(reporte.nota);
  const objetivoCalidad = Number(reporte.objetivo || 80);

  const sph = Number(reporte.sph);
  const objetivoSph = Number(reporte.objetivo_sph || 0.45);

  const calidadOk =
    Number.isFinite(nota) && nota >= objetivoCalidad;

  const sphOk =
    Number.isFinite(sph) && sph >= objetivoSph;

  if (calidadOk && sphOk) {
    const calidadSuperada =
      Number.isFinite(nota) && nota > objetivoCalidad;

    const sphSuperado =
      Number.isFinite(sph) && sph > objetivoSph;

    if (calidadSuperada && sphSuperado) {
      return "SUPERADO";
    }

    return "ALCANZADO";
  }

  return "POR DEBAJO DEL OBJETIVO";
}

function MultiSelect({
  label,
  options,
  value,
  onChange,
}) {
  const selected = normalizarArray(value);

  function toggle(option) {
    if (selected.includes(option)) {
      onChange(selected.filter((x) => x !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>

      <div style={styles.multiBox}>
        {options.map((option) => {
          const activo = selected.includes(option);

          return (
            <label
              key={option}
              style={{
                ...styles.multiOption,
                ...(activo
                  ? styles.multiOptionActive
                  : {}),
              }}
            >
              <input
                type="checkbox"
                checked={activo}
                onChange={() => toggle(option)}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div style={styles.selectedSummary}>
          Seleccionados: {selected.join(" · ")}
        </div>
      )}
    </div>
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
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            ...styles.input,
            minHeight: "110px",
            resize: "vertical",
          }}
        />
      ) : type === "select" ? (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
        >
          <option value="">Seleccionar</option>

          {options.map((option) => (
            <option
              key={
                typeof option === "string"
                  ? option
                  : option.value
              }
              value={
                typeof option === "string"
                  ? option
                  : option.value
              }
            >
              {typeof option === "string"
                ? option
                : option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={styles.input}
        />
      )}
    </div>
  );
}

function Estado({ estado }) {
  let style = styles.estadoNeutral;

  if (estado === "POR DEBAJO DEL OBJETIVO") {
    style = styles.estadoRojo;
  }

  if (estado === "ALCANZADO") {
    style = styles.estadoVerde;
  }

  if (estado === "SUPERADO") {
    style = styles.estadoSuperado;
  }

  return <span style={style}>{estado}</span>;
}

function Stat({ title, value }) {
  return (
    <div style={styles.stat}>
      <small>{title}</small>
      <strong>{value ?? "—"}</strong>
    </div>
  );
}

function Seccion({
  titulo,
  children,
  descripcion,
}) {
  return (
    <section style={styles.card}>
      <h2 style={styles.sectionTitle}>{titulo}</h2>

      {descripcion && (
        <p style={styles.muted}>{descripcion}</p>
      )}

      {children}
    </section>
  );
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
  const [asesorSeleccionado, setAsesorSeleccionado] =
    useState(null);

  const [tabAsesor, setTabAsesor] =
    useState("RESUMEN");

  const [busqueda, setBusqueda] = useState("");
  const [filtroCampania, setFiltroCampania] =
    useState("Todas");
  const [filtroEstado, setFiltroEstado] =
    useState("Todos");

  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const [reporte, setReporte] =
    useState(nuevoReporte());

  const [devolucion, setDevolucion] =
    useState(nuevaDevolucion());

  const [audio, setAudio] =
    useState(nuevoAudio());

  const [pda, setPda] =
    useState(nuevoPda());

  const [felicitacion, setFelicitacion] =
    useState(nuevaFelicitacion());

  const [guardando, setGuardando] =
    useState(false);

  useEffect(() => {
    verificarAdministrador();
  }, []);

  async function verificarAdministrador() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.email) {
        window.location.href = "/";
        return;
      }

      if (
        session.user.email.toLowerCase() !==
        ADMIN_EMAIL.toLowerCase()
      ) {
        window.location.href = "/";
        return;
      }

      setUsuario(session.user);

      await Promise.all([
        cargarAsesores(),
        cargarReportes(),
        cargarDevoluciones(),
        cargarAudios(),
        cargarPdas(),
        cargarFelicitaciones(),
      ]);
    } catch (error) {
      console.error(error);
      setMensaje(
        "❌ No se pudo verificar la sesión."
      );
    } finally {
      setCargando(false);
    }
  }

  async function cargarAsesores() {
    const { data, error } = await supabase
      .from("usuarios")
      .select(
        "id,nombre,usuario,email,rol,activo,created_at"
      )
      .eq("rol", "asesor")
      .eq("activo", true)
      .order("nombre", {
        ascending: true,
      });

    if (error) {
      console.error(error);
      setMensaje(
        "❌ No se pudieron cargar los asesores: " +
          error.message
      );
      return;
    }

    setAsesores(data || []);
  }

  async function cargarReportes() {
    const { data, error } = await supabase
      .from("reportes")
      .select("*")
      .order("id", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setReportes([]);
      return;
    }

    setReportes(data || []);
  }

  async function cargarDevoluciones() {
    const { data, error } = await supabase
      .from("devoluciones")
      .select("*")
      .order("id", {
        ascending: false,
      });

    if (error) {
      console.warn(
        "Tabla devoluciones:",
        error.message
      );
      setDevoluciones([]);
      return;
    }

    setDevoluciones(data || []);
  }

  async function cargarAudios() {
    const { data, error } = await supabase
      .from("audios")
      .select("*")
      .order("id", {
        ascending: false,
      });

    if (error) {
      console.warn(
        "Tabla audios:",
        error.message
      );
      setAudios([]);
      return;
    }

    setAudios(data || []);
  }

  async function cargarPdas() {
    const { data, error } = await supabase
      .from("pdas")
      .select("*")
      .order("id", {
        ascending: false,
      });

    if (error) {
      console.warn(
        "Tabla pdas:",
        error.message
      );
      setPdas([]);
      return;
    }

    setPdas(data || []);
  }

  async function cargarFelicitaciones() {
    const { data, error } = await supabase
      .from("felicitaciones")
      .select("*")
      .order("id", {
        ascending: false,
      });

    if (error) {
      console.warn(
        "Tabla felicitaciones:",
        error.message
      );
      setFelicitaciones([]);
      return;
    }

    setFelicitaciones(data || []);
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  function seleccionarAsesor(asesor) {
    setAsesorSeleccionado(asesor);
    setTabAsesor("RESUMEN");
    setVista("asesor");
  }

  function abrirReporte(asesor = null) {
    const nuevo = nuevoReporte();

    if (asesor) {
      nuevo.asesor = asesor.email;
    }

    setReporte(nuevo);
    setMensaje("");
    setVista("nuevoReporte");
  }

  function abrirDevolucion(asesor = null) {
    setDevolucion(
      nuevaDevolucion(
        asesor ? asesor.email : ""
      )
    );

    setMensaje("");
    setVista("devolucion");
  }

  function abrirAudio(asesor = null) {
    setAudio(
      nuevoAudio(
        asesor ? asesor.email : ""
      )
    );

    setMensaje("");
    setVista("audio");
  }

  function abrirPda(asesor = null) {
    setPda(
      nuevoPda(
        asesor ? asesor.email : ""
      )
    );

    setMensaje("");
    setVista("pda");
  }

  function abrirFelicitacion(asesor = null) {
    setFelicitacion(
      nuevaFelicitacion(
        asesor ? asesor.email : ""
      )
    );

    setMensaje("");
    setVista("felicitacion");
  }

  function volverDesdeFormulario() {
    setVista(
      asesorSeleccionado
        ? "asesor"
        : "inicio"
    );
  }

  async function guardarReporte() {
    if (!reporte.asesor) {
      setMensaje(
        "Seleccioná un asesor."
      );
      return;
    }

    if (!reporte.nota) {
      setMensaje(
        "Cargá la nota de calidad."
      );
      return;
    }

    setGuardando(true);
    setMensaje("");

    const datos = {
      asesor:
        asesores.find(
          (a) => a.email === reporte.asesor
        )?.nombre ||
        reporte.asesor,

      usuario: reporte.asesor,
      semana: reporte.semana,
      producto: reporte.producto,

      nota: Number(reporte.nota),
      objetivo: reporte.objetivo,
      evolucion: reporte.evolucion,
      desvio: reporte.desvio,
      recomendacion: reporte.recomendacion,
      auditoria: reporte.auditoria,
      observaciones: reporte.observaciones,

      sph: reporte.sph
        ? Number(reporte.sph)
        : null,

      objetivo_sph: reporte.objetivoSph
        ? Number(reporte.objetivoSph)
        : null,

      ventas: reporte.ventas
        ? Number(reporte.ventas)
        : null,

      objetivo_ventas:
        reporte.objetivoVentas
          ? Number(reporte.objetivoVentas)
          : null,

      objetivo_campania:
        reporte.objetivoCampania,

      descripcion_campania:
        reporte.descripcionCampania,

      estado_sph: reporte.estadoSph,
      estado_ventas: reporte.estadoVentas,
      estado_campania:
        reporte.estadoCampania,

      gestion: reporte.gestion,

      aspectos_calidad:
        reporte.aspectosCalidad,

      acciones_calidad:
        reporte.accionesCalidad,

      aspectos_productividad:
        reporte.aspectosProductividad,

      acciones_productividad:
        reporte.accionesProductividad,

      tipificaciones:
        reporte.tipificaciones,

      compromiso_tipificaciones:
        reporte.compromisoTipificaciones,

      observaciones_tipificaciones:
        reporte.observacionesTipificaciones,

      cantidad_no_ventas:
        reporte.cantidadNoVentas
          ? Number(reporte.cantidadNoVentas)
          : null,

      coaching_no_ventas:
        reporte.coachingNoVentas,

      registro_sistema_no_ventas:
        reporte.registroSistemaNoVentas,

      compromiso_no_ventas:
        reporte.compromisoNoVentas,

      om_no_ventas:
        reporte.omNoVentas,

      fortalezas_no_ventas:
        reporte.fortalezasNoVentas,

      observaciones_no_ventas:
        reporte.observacionesNoVentas,
    };

    const { error } = await supabase
      .from("reportes")
      .upsert(datos, {
        onConflict: "usuario,semana",
      });

    if (error) {
      console.error(error);

      setMensaje(
        "❌ No se pudo guardar el reporte: " +
          error.message
      );

      setGuardando(false);
      return;
    }

    await cargarReportes();

    setMensaje(
      "✓ REPORTE GUARDADO CORRECTAMENTE"
    );

    setGuardando(false);
  }

  async function guardarDevolucion() {
    if (!devolucion.asesor) {
      setMensaje(
        "Seleccioná un asesor."
      );
      return;
    }

    if (!devolucion.devolucion.trim()) {
      setMensaje(
        "Escribí la devolución."
      );
      return;
    }

    setGuardando(true);
    setMensaje("");

    const asesor = asesores.find(
      (a) => a.email === devolucion.asesor
    );

    const datos = {
      asesor_id: asesor?.id || null,
      asesor: asesor?.nombre || devolucion.asesor,
      asesor_email: devolucion.asesor,
      area: devolucion.area,
      responsable:
        usuario?.user_metadata?.nombre ||
        usuario?.email ||
        ADMIN_EMAIL,
      fecha: devolucion.fecha,

      nota_calidad:
        devolucion.notaCalidad
          ? Number(devolucion.notaCalidad)
          : null,

      aspectos_calidad:
        devolucion.aspectosCalidad,

      acciones_calidad:
        devolucion.accionesCalidad,

      aspectos_productividad:
        devolucion.aspectosProductividad,

      acciones_productividad:
        devolucion.accionesProductividad,

      tipificaciones:
        devolucion.tipificaciones,

      om:
        devolucion.om,

      registro_sistema:
        devolucion.registroSistema,

      fortalezas:
        devolucion.fortalezas,

      compromiso:
        devolucion.compromiso,

      devolucion:
        devolucion.devolucion,

      observaciones:
        devolucion.observaciones,

      estado: "Realizada",
    };

    const { error } = await supabase
      .from("devoluciones")
      .insert(datos);

    if (error) {
      console.error(error);

      setMensaje(
        "❌ No se pudo guardar la devolución: " +
          error.message
      );

      setGuardando(false);
      return;
    }

    await cargarDevoluciones();

    setMensaje(
      "✓ DEVOLUCIÓN GUARDADA CORRECTAMENTE"
    );

    setDevolucion(
      nuevaDevolucion(
        devolucion.asesor
      )
    );

    setGuardando(false);
  }

  async function guardarAudio() {
    if (!audio.asesor) {
      setMensaje(
        "Seleccioná un asesor."
      );
      return;
    }

    if (!audio.archivo) {
      setMensaje(
        "Seleccioná un archivo de audio."
      );
     
