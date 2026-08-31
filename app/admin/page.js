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
  ["Cordoba, Tania", "8202", "tania.cordoba@portalcalidad.com"],
  ["Diaz, Milagros", "8212", "milagros.diaz@portalcalidad.com"],
  ["Gomez, Carla", "8126", "carla.gomez@portalcalidad.com"],
  ["Luna, Oriana", "8097", "oriana.luna@portalcalidad.com"],
  ["Malqui, Xiomara", "8092", "xiomara.malqui@portalcalidad.com"],
  ["Mercado, Chiara", "8209", "chiara.mercado@portalcalidad.com"],
  ["Ojeda, Luana", "8200", "luana.ojeda@portalcalidad.com"],
  ["Olmedo, Thomas", "8192", "thomas.olmedo@portalcalidad.com"],
  ["Peralta, Belen", "8207", "belen.peralta@portalcalidad.com"],
  ["Reartes, Maia", "8201", "maia.reartes@portalcalidad.com"],
  ["Rojek, Luna", "8213", "luna.rojek@portalcalidad.com"],
  ["Simonetta, Valentina", "8191", "valentina.simonetta@portalcalidad.com"],
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

    gestion: "",
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

  useEffect(() => {
    verificarAdministrador();

    try {
      setDevoluciones(
        JSON.parse(localStorage.getItem("portal_devoluciones") || "[]")
      );
      setAudios(
        JSON.parse(localStorage.getItem("portal_audios") || "[]")
      );
      setPdas(
        JSON.parse(localStorage.getItem("portal_pdas") || "[]")
      );
      setFelicitaciones(
        JSON.parse(
          localStorage.getItem("portal_felicitaciones") || "[]"
        )
      );
    } catch (error) {
      console.error(error);
    }
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
        session.user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
      ) {
        window.location.href = "/";
        return;
      }

      setUsuario(session.user);

      await Promise.all([
        cargarAsesores(),
        cargarReportes(),
      ]);
    } catch (error) {
      console.error(error);
      setMensaje("❌ No se pudo verificar la sesión.");
    } finally {
      setCargando(false);
    }
  }

  async function cargarAsesores() {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id,nombre,usuario,email,rol,activo,created_at")
      .eq("rol", "asesor")
      .eq("activo", true)
      .order("nombre", { ascending: true });

    if (error || !data || data.length === 0) {
      console.error(error);

      setAsesores(
        ASESoresNormalizados()
      );

      if (error) {
        setMensaje(
          "⚠️ No se pudieron cargar los asesores desde Supabase. Se muestran los asesores registrados."
        );
      }

      return;
    }

    setAsesores(data);
  }

  function ASESoresNormalizados() {
    return ASESoresFallback();
  }

  function ASESoresFallback() {
    return ASESoresBase();
  }

  function ASESoresBase() {
    return ASESores_FALLBACK();
  }

  function ASESores_FALLBACK() {
    return ASESores_FALLBACK_DATA();
  }

  function ASESores_FALLBACK_DATA() {
    return ASESoresBaseData();
  }

  function ASESoresBaseData() {
    return ASESOR_DATA();
  }

  function ASESOR_DATA() {
    return ASESOR_DATA_ARRAY().map(crearAsesorFallback);
  }

  function ASESOR_DATA_ARRAY() {
    return ASESOR_LISTA;
  }

  async function cargarReportes() {
    const { data, error } = await supabase
      .from("reportes")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      setReportes([]);
      return;
    }

    setReportes(data || []);
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  function seleccionarAsesor(asesor) {
    setAsesorSeleccionado(asesor);
    setSubVistaAsesor("resumen");
    setVista("asesor");
  }

  function abrirReporte(asesor = null) {
    const nuevo = crearReporteInicial();

    if (asesor) {
      nuevo.asesor = asesor.email || asesor.nombre;
      nuevo.nombreAsesor = asesor.nombre;
    }

    setReporte(nuevo);
    setVista("reporte");
  }

  function abrirDevolucion(asesor = null) {
    const nuevo = crearDevolucionInicial();

    if (asesor) {
      nuevo.asesor = asesor.nombre;
    }

    nuevo.responsable =
      usuario?.user_metadata?.nombre ||
      usuario?.email ||
      "Administrador";

    setDevolucion(nuevo);
    setVista("devolucion");
  }

  function abrirAudio(asesor = null) {
    const nuevo = crearAudioInicial();

    if (asesor) {
      nuevo.asesor = asesor.nombre;
    }

    nuevo.responsable =
      usuario?.user_metadata?.nombre ||
      usuario?.email ||
      "Administrador";

    setAudio(nuevo);
    setVista("audios");
  }

  function abrirPda(asesor = null) {
    const nuevo = crearPdaInicial();

    if (asesor) {
      nuevo.asesor = asesor.nombre;
    }

    setPda(nuevo);
    setVista("pda");
  }

  function abrirFelicitacion(asesor = null) {
    const nuevo = crearFelicitacionInicial();

    if (asesor) {
      nuevo.asesor = asesor.nombre;
    }

    nuevo.responsable =
      usuario?.user_metadata?.nombre ||
      usuario?.email ||
      "Administrador";

    setFelicitacion(nuevo);
    setVista("felicitaciones");
  }

  async function guardarReporte(e) {
    e.preventDefault();

    if (!reporte.asesor) {
      setMensaje("❌ Seleccioná un asesor.");
      return;
    }

    const asesorEncontrado = asesores.find(
      (a) =>
        a.email === reporte.asesor ||
        a.nombre === reporte.asesor
    );

    const datos = {
      asesor:
        asesorEncontrado?.nombre ||
        reporte.nombreAsesor ||
        reporte.asesor,

      usuario:
        asesorEncontrado?.email ||
        reporte.asesor,

      semana: reporte.semana,

      nota:
        reporte.nota === "" ? null : Number(reporte.nota),

      evolucion: reporte.evolucion,
      objetivo: reporte.objetivo,
      desvio: reporte.desvio,
      recomendacion: reporte.recomendacion,
      auditoria: reporte.auditoria,
      producto: reporte.producto,
      observaciones: reporte.observaciones,

      sph:
        reporte.sph === "" ? null : Number(reporte.sph),

      objetivo_sph:
        reporte.objetivoSph === ""
          ? null
          : Number(reporte.objetivoSph),

      ventas:
        reporte.ventas === "" ? null : Number(reporte.ventas),

      objetivo_ventas:
        reporte.objetivoVentas === ""
          ? null
          : Number(reporte.objetivoVentas),

      objetivo_campania: reporte.objetivoCampania,
      descripcion_campania: reporte.descripcionCampania,

      estado_sph: reporte.estadoSph,
      estado_ventas: reporte.estadoVentas,
      estado_campania: reporte.estadoCampania,

      gestion: reporte.gestion,

      aspectos_calidad: reporte.aspectosCalidad,
      acciones_calidad: reporte.accionesCalidad,
      aspectos_productividad: reporte.aspectosProductividad,
      acciones_productividad: reporte.accionesProductividad,

      tipificaciones_auditadas:
        reporte.tipificacionesAuditadas,

      tipificaciones_desvio:
        reporte.tipificacionesDesvio,

      tipificaciones_objetivo:
        reporte.tipificacionesObjetivo,

      tipificaciones_resultado:
        reporte.tipificacionesResultado,

      tipificaciones_compromiso:
        reporte.tipificacionesCompromiso,

      tipificaciones_observaciones:
        reporte.tipificacionesObservaciones,

      no_ventas_cantidad:
        reporte.noVentasCantidad === ""
          ? null
          : Number(reporte.noVentasCantidad),

      no_ventas_coaching:
        reporte.noVentasCoaching,

      no_ventas_registro:
        reporte.noVentasRegistro,

      no_ventas_compromiso:
        reporte.noVentasCompromiso,

      no_ventas_om:
        reporte.noVentasOM,

      no_ventas_fortalezas:
        reporte.noVentasFortalezas,

      no_ventas_observaciones:
        reporte.noVentasObservaciones,
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
      return;
    }

    setMensaje("✓ Reporte guardado correctamente.");
    await cargarReportes();

    setTimeout(() => {
      setMensaje("");
    }, 3000);
  }

  function guardarLocal(key, data, setter) {
    const nuevo = {
      ...data,
      id: Date.now(),
      creadoEn: new Date().toISOString(),
    };

    const actual =
      JSON.parse(localStorage.getItem(key) || "[]");

    const lista = [nuevo, ...actual];

    localStorage.setItem(key, JSON.stringify(lista));
    setter(lista);

    return nuevo;
  }

  function guardarDevolucion(e) {
    e.preventDefault();

    if (!devolucion.asesor) {
      setMensaje("❌ Seleccioná un asesor.");
      return;
    }

    guardarLocal(
      "portal_devoluciones",
      devolucion,
      setDevoluciones
    );

    setMensaje("✓ Devolución guardada correctamente.");

    setDevolucion(crearDevolucionInicial());

    setTimeout(() => {
      setMensaje("");
    }, 3000);
  }

  function guardarPda(e) {
    e.preventDefault();

    if (!pda.asesor || !pda.aspecto) {
      setMensaje(
        "❌ Seleccioná un asesor y el aspecto a trabajar."
      );
      return;
    }

    guardarLocal(
      "portal_pdas",
      pda,
      setPdas
    );

    setMensaje("✓ PDA guardado correctamente.");

    setPda(crearPdaInicial());

    setTimeout(() => {
      setMensaje("");
    }, 3000);
  }

  function guardarFelicitacion(e) {
    e.preventDefault();

    if (
      !felicitacion.asesor ||
      !felicitacion.mensaje
    ) {
      setMensaje(
        "❌ Seleccioná un asesor y escribí la felicitación."
      );
      return;
    }

    guardarLocal(
      "portal_felicitaciones",
      felicitacion,
      setFelicitaciones
    );

    setMensaje(
      "✓ Felicitación guardada correctamente."
    );

    setFelicitacion(crearFelicitacionInicial());

    setTimeout(() => {
      setMensaje("");
    }, 3000);
  }

  async function guardarAudio(e) {
    e.preventDefault();

    if (!audio.asesor) {
      setMensaje("❌ Seleccioná un asesor.");
      return;
    }

    if (!audio.archivo) {
      setMensaje(
        "❌ Seleccioná un archivo de audio."
      );
      return;
    }

    let archivoUrl = "";
    let nombreArchivo = audio.archivo.name;

    try {
      const extension =
        audio.archivo.name.split(".").pop();

      const nombreSeguro =
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("audios")
          .upload(
            nombreSeguro,
            audio.archivo
          );

      if (!uploadError) {
        const { data } =
          supabase.storage
            .from("audios")
            .getPublicUrl(nombreSeguro);

        archivoUrl =
          data?.publicUrl || "";
      } else {
        console.warn(
          "No se pudo subir al bucket audios:",
          uploadError
        );
      }
    } catch (error) {
      console.error(error);
    }

    const datoAudio = {
      ...audio,
      archivo: null,
      nombreArchivo,
      archivoUrl,
      estado: "Pendiente",
    };

    guardarLocal(
      "portal_audios",
      datoAudio,
      setAudios
    );

    setMensaje("✓ Audio cargado correctamente.");

    setAudio(crearAudioInicial());

    setTimeout(() => {
      setMensaje("");
    }, 3000);
  }

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

  function actualizarFelicitacion(campo, valor) {
    setFelicitacion((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function toggleArray(
    setter,
    campo,
    valor
  ) {
    setter((prev) => {
      const actual = prev[campo] || [];

      if (actual.includes(valor)) {
        return {
          ...prev,
          [campo]: actual.filter(
            (item) => item !== valor
          ),
        };
      }

      return {
        ...prev,
        [campo]: [...actual, valor],
      };
    });
  }

  const asesoresFiltrados = useMemo(() => {
    return asesores.filter((asesor) => {
      const coincideBusqueda =
        asesor.nombre
          ?.toLowerCase()
          .includes(
            busqueda.toLowerCase()
          );

      const reporteAsesor =
        reportes.find(
          (r) =>
            r.usuario === asesor.email ||
            r.asesor === asesor.nombre
        );

      const campania =
        reporteAsesor?.producto || "";

      const coincideCampania =
        filtroCampania === "Todas" ||
        campania === filtroCampania;

      const estado =
        calcularEstado(reporteAsesor);

      const coincideEstado =
        filtroEstado === "Todos" ||
        estado === filtroEstado;

      return (
        coincideBusqueda &&
        coincideCampania &&
        coincideEstado
      );
    });
  }, [
    asesores,
    reportes,
    busqueda,
    filtroCampania,
    filtroEstado,
  ]);

  const estadisticas = useMemo(() => {
    const devolucionesPendientes =
      devoluciones.filter(
        (d) =>
          d.compromiso ===
          "SEGUIMIENTO"
      ).length;

    const pdasActivos =
      pdas.filter(
        (p) =>
          p.estado === "Activo"
      ).length;

    const reportesPendientes =
      asesores.filter(
        (a) =>
          !reportes.some(
            (r) =>
              r.usuario === a.email ||
              r.asesor === a.nombre
          )
      ).length;

    return {
      asesores: asesores.length,
      pdas: pdasActivos,
      devoluciones: devolucionesPendientes,
      reportes: reportesPendientes,
    };
  }, [
    asesores,
    reportes,
    devoluciones,
    pdas,
  ]);

  if (cargando) {
    return (
      <main style={styles.page}>
        <div style={styles.loading}>
          <h2>Portal de Calidad</h2>
          <p>
            Cargando panel de administración...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Portal de Calidad
            </h1>

            <p style={styles.subtitle}>
              Panel de Administración
            </p>
          </div>

          <div style={styles.headerActions}>
            <span style={styles.adminLabel}>
              Administrador:{" "}
              <strong>
                {usuario?.email}
              </strong>
            </span>

            <button
              onClick={cerrarSesion}
              style={styles.secondaryButton}
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <nav style={styles.nav}>
          <NavButton
            active={vista === "inicio"}
            onClick={() =>
              setVista("inicio")
            }
          >
            Inicio
          </NavButton>

          <NavButton
            active={
              vista === "asesores" ||
              vista === "asesor"
            }
            onClick={() =>
              setVista("asesores")
            }
          >
            Asesores
          </NavButton>

          <NavButton
            active={
              vista === "devolucion"
            }
            onClick={() =>
              abrirDevolucion()
            }
          >
            Devoluciones
          </NavButton>

          <NavButton
            active={
              vista === "audios"
            }
            onClick={() =>
              abrirAudio()
            }
          >
            Audios
          </NavButton>

          <NavButton
            active={
              vista === "pda"
            }
            onClick={() =>
              abrirPda()
            }
          >
            PDA
          </NavButton>

          <NavButton
            active={
              vista ===
              "felicitaciones"
            }
            onClick={() =>
              abrirFelicitacion()
            }
          >
            Felicitaciones
          </NavButton>

          <NavButton
            active={
              vista ===
              "seguimiento"
            }
            onClick={() =>
              setVista("seguimiento")
            }
          >
            Seguimiento
          </NavButton>

          <NavButton
            active={
              vista === "reportes"
            }
            onClick={() =>
              setVista("reportes")
            }
          >
            Reportes
          </NavButton>
        </nav>

        {mensaje && (
          <div
            style={{
              ...styles.message,
              background:
                mensaje.includes("❌")
                  ? "#fff1f1"
                  : "#eaf7ef",
              borderColor:
                mensaje.includes("❌")
                  ? "#efb3b3"
                  : "#b7dfc3",
            }}
          >
            {mensaje}
          </div>
        )}

        {vista === "inicio" && (
          <Inicio
            estadisticas={
              estadisticas
            }
            asesores={
              asesoresFiltrados
            }
            reportes={reportes}
            busqueda={busqueda}
            setBusqueda={
              setBusqueda
            }
            filtroCampania={
              filtroCampania
            }
            setFiltroCampania={
              setFiltroCampania
            }
            filtroEstado={
              filtroEstado
            }
            setFiltroEstado={
              setFiltroEstado
            }
            seleccionarAsesor={
              seleccionarAsesor
            }
            abrirReporte={
              abrirReporte
            }
          />
        )}

        {vista === "asesores" && (
          <Asesores
            asesores={
              asesoresFiltrados
            }
            reportes={reportes}
            busqueda={busqueda}
            setBusqueda={
              setBusqueda
            }
            seleccionarAsesor={
              seleccionarAsesor
            }
          />
        )}

        {vista === "asesor" &&
          asesorSeleccionado && (
            <FichaAsesor
              asesor={
                asesorSeleccionado
              }
              reportes={reportes}
              devoluciones={
                devoluciones
              }
              audios={audios}
              pdas={pdas}
              felicitaciones={
                felicitaciones
              }
              subVista={
                subVistaAsesor
              }
              setSubVista={
                setSubVistaAsesor
              }
              abrirReporte={
                abrirReporte
              }
              abrirDevolucion={
                abrirDevolucion
              }
              abrirAudio={
                abrirAudio
              }
              abrirPda={
                abrirPda
              }
              abrirFelicitacion={
                abrirFelicitacion
              }
              volver={() =>
                setVista("asesores")
              }
            />
          )}

        {vista === "devolucion" && (
          <FormularioDevolucion
            datos={devolucion}
            actualizar={
              actualizarDevolucion
            }
            asesores={asesores}
            toggle={(campo, valor) =>
              toggleArray(
                setDevolucion,
                campo,
                valor
              )
            }
            guardar={
              guardarDevolucion
            }
            volver={() =>
              setVista(
                asesorSeleccionado
                  ? "asesor"
                  : "inicio"
              )
            }
          />
        )}

        {vista === "audios" && (
          <FormularioAudio
            datos={audio}
            actualizar={
              actualizarAudio
            }
            asesores={asesores}
            toggle={(campo, valor) =>
              toggleArray(
                setAudio,
                campo,
                valor
              )
            }
            guardar={
              guardarAudio
            }
            volver={() =>
              setVista(
                asesorSeleccionado
                  ? "asesor"
                  : "inicio"
              )
            }
          />
        )}

        {vista === "pda" && (
          <FormularioPda
            datos={pda}
            actualizar={
              actualizarPda
            }
            asesores={asesores}
            guardar={guardarPda}
            volver={() =>
              setVista(
                asesorSeleccionado
                  ? "asesor"
                  : "inicio"
              )
            }
          />
        )}

        {vista === "felicitaciones" && (
          <FormularioFelicitacion
            datos={
              felicitacion
            }
            actualizar={
              actualizarFelicitacion
            }
            asesores={asesores}
            guardar={
              guardarFelicitacion
            }
            volver={() =>
              setVista(
                asesorSeleccionado
                  ? "asesor"
                  : "inicio"
              )
            }
          />
        )}

        {vista === "seguimiento" && (
          <Seguimiento
            asesores={asesores}
            reportes={reportes}
            devoluciones={
              devoluciones
            }
            audios={audios}
            pdas={pdas}
            seleccionarAsesor={
              seleccionarAsesor
            }
            abrirDevolucion={
              abrirDevolucion
            }
            abrirAudio={
              abrirAudio
            }
            abrirPda={abrirPda}
            abrirReporte={
              abrirReporte
            }
          />
        )}

        {vista === "reportes" && (
          <ListaReportes
            reportes={reportes}
            asesores={asesores}
            abrirReporte={
              abrirReporte
            }
          />
        )}

        {vista === "reporte" && (
          <FormularioReporte
            reporte={reporte}
            actualizar={
              actualizarReporte
            }
            toggle={(campo, valor) =>
              toggleArray(
                setReporte,
                campo,
                valor
              )
            }
            asesores={asesores}
            guardar={
              guardarReporte
            }
            volver={() =>
              setVista(
                asesorSeleccionado
                  ? "asesor"
                  : "reportes"
              )
            }
          />
        )}
      </div>
    </main>
  );
}

function NavButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.navButton,
        ...(active
          ? styles.navButtonActive
          : {}),
      }}
    >
      {children}
    </button>
  );
}

function Inicio({
  estadisticas,
  asesores,
  reportes,
  busqueda,
  setBusqueda,
  filtroCampania,
  setFiltroCampania,
  filtroEstado,
  setFiltroEstado,
  seleccionarAsesor,
  abrirReporte,
}) {
  return (
    <>
      <section style={styles.card}>
        <div style={styles.weekHeader}>
          <div>
            <h2 style={{ margin: 0 }}>
              Portal de Calidad
            </h2>

            <p style={styles.muted}>
              Panel de Administración
            </p>
          </div>

          <select
            defaultValue={
              "Semana 4 · Agosto"
            }
            style={
              styles.smallSelect
            }
          >
            {SEMANAS.map(
              (semana) => (
                <option
                  key={semana}
                >
                  {semana}
                </option>
              )
            )}
          </select>
        </div>

        <div style={styles.statsGrid}>
          <Stat
            title="ASESORES"
            value={
              estadisticas.asesores
            }
          />

          <Stat
            title="PDA ACTIVOS"
            value={
              estadisticas.pdas
            }
          />

          <Stat
            title="DEVOLUCIONES PENDIENTES"
            value={
              estadisticas.devoluciones
            }
          />

          <Stat
            title="REPORTES PENDIENTES"
            value={
              estadisticas.reportes
            }
          />
        </div>
      </section>

      <section style={styles.card}>
        <div
          style={
            styles.sectionHeader
          }
        >
          <div>
            <h2>
              Seguimiento del equipo
            </h2>

            <p style={styles.muted}>
              Vista general de los
              asesores.
            </p>
          </div>

          <button
            onClick={() =>
              abrirReporte()
            }
            style={
              styles.primaryButton
            }
          >
            + CARGAR REPORTE
          </button>
        </div>

        <div style={styles.filters}>
          <input
            value={busqueda}
            onChange={(e) =>
              setBusqueda(
                e.target.value
              )
            }
            placeholder="Buscar asesor..."
            style={styles.input}
          />

          <select
            value={
              filtroCampania
            }
            onChange={(e) =>
              setFiltroCampania(
                e.target.value
              )
            }
            style={styles.input}
          >
            <option>
              Todas
            </option>
            <option>
              AP
            </option>
            <option>
              BM
            </option>
          </select>

          <select
            value={filtroEstado}
            onChange={(e) =>
              setFiltroEstado(
                e.target.value
              )
            }
            style={styles.input}
          >
            <option>
              Todos
            </option>

            {ESTADOS.map(
              (estado) => (
                <option
                  key={estado}
                >
                  {estado}
                </option>
              )
            )}
          </select>
        </div>

        <div
          style={
            styles.tableWrapper
          }
        >
          <table
            style={styles.table}
          >
            <thead>
              <tr>
                <th>Asesor</th>
                <th>Cuenta</th>
                <th>Calidad</th>
                <th>SPH</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {asesores.map(
                (asesor) => {
                  const r =
                    reportes.find(
                      (reporte) =>
                        reporte.usuario ===
                          asesor.email ||
                        reporte.asesor ===
                          asesor.nombre
                    );

                  return (
                    <tr
                      key={
                        asesor.id
                      }
                    >
                      <td>
                        <strong>
                          {
                            asesor.nombre
                          }
                        </strong>
                      </td>

                      <td>
                        {r?.producto ||
                          "—"}
                      </td>

                      <td>
                        {r?.nota ??
                          "—"}
                      </td>

                      <td>
                        {r?.sph ??
                          "—"}
                      </td>

                      <td>
                        <Estado
                          estado={calcularEstado(
                            r
                          )}
                        />
                      </td>

                      <td>
                        <button
                          onClick={() =>
                            seleccionarAsesor(
                              asesor
                            )
                          }
                          style={
                            styles.linkButton
                          }
                        >
                          VER ASESOR
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function Asesores({
  asesores,
  reportes,
  busqueda,
  setBusqueda,
  seleccionarAsesor,
}) {
  return (
    <section style={styles.card}>
      <div
        style={
          styles.sectionHeader
        }
      >
        <div>
          <h2>
            Asesores
          </h2>

          <p style={styles.muted}>
            Buscá un asesor para
            consultar toda su
            evolución.
          </p>
        </div>
      </div>

      <input
        value={busqueda}
        onChange={(e) =>
          setBusqueda(
            e.target.value
          )
        }
        placeholder="Buscar asesor..."
        style={styles.input}
      />

      <div
        style={
          styles.advisorGrid
        }
      >
        {asesores.map(
          (asesor) => {
            const r =
              reportes.find(
                (reporte) =>
                  reporte.usuario ===
                    asesor.email ||
                  reporte.asesor ===
                    asesor.nombre
              );

            return (
              <div
                key={
                  asesor.id
                }
                style={
                  styles.advisorCard
                }
              >
                <h3>
                  {
                    asesor.nombre
                  }
                </h3>

                <p style={styles.muted}>
                  {
                    asesor.email
                  }
                </p>

                <div
                  style={
                    styles.miniMetrics
                  }
                >
                  <div>
                    <small>
                      Calidad
                    </small>
                    <strong>
                      {r?.nota ??
                        "—"}
                    </strong>
                  </div>

                  <div>
                    <small>
                      SPH
                    </small>
                    <strong>
                      {r?.sph ??
                        "—"}
                    </strong>
                  </div>
                </div>

                <Estado
                  estado={calcularEstado(
                    r
                  )}
                />

                <button
                  onClick={() =>
                    seleccionarAsesor(
                      asesor
                    )
                  }
                  style={
                    styles.primaryButton
                  }
                >
                  VER ASESOR
                </button>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}

function FichaAsesor({
  asesor,
  reportes,
  devoluciones,
  audios,
  pdas,
  felicitaciones,
  subVista,
  setSubVista,
  abrirReporte,
  abrirDevolucion,
  abrirAudio,
  abrirPda,
  abrirFelicitacion,
  volver,
}) {
  const reportesAsesor =
    reportes.filter(
      (r) =>
        r.usuario ===
          asesor.email ||
        r.asesor ===
          asesor.nombre
    );

  const devolucionesAsesor =
    devoluciones.filter(
      (d) =>
        d.asesor ===
        asesor.nombre
    );

  const audiosAsesor =
    audios.filter(
      (a) =>
        a.asesor ===
        asesor.nombre
    );

  const pdasAsesor =
    pdas.filter(
      (p) =>
        p.asesor ===
        asesor.nombre
    );

  const felicitacionesAsesor =
    felicitaciones.filter(
      (f) =>
        f.asesor ===
        asesor.nombre
    );

  const actual =
    reportesAsesor[0];

  return (
    <>
      <section style={styles.card}>
        <button
          onClick={volver}
          style={
            styles.secondaryButton
          }
        >
          ← Volver
        </button>

        <div
          style={{
            marginTop: "22px",
          }}
        >
          <div
            style={
              styles.profileHeader
            }
          >
            <div>
              <h2
                style={{
                  margin: 0,
                }}
              >
                {asesor.nombre}
              </h2>

              <p style={styles.muted}>
                {asesor.email}
              </p>
            </div>

            <Estado
              estado={calcularEstado(
                actual
              )}
            />
          </div>

          <div
            style={
              styles.actionRow
            }
          >
            <button
              onClick={() =>
                abrirReporte(
                  asesor
                )
              }
              style={
                styles.primaryButton
              }
            >
              + CARGAR REPORTE
            </button>

            <button
              onClick={() =>
                abrirDevolucion(
                  asesor
                )
              }
              style={
                styles.secondaryButton
              }
            >
              + CARGAR DEVOLUCIÓN
            </button>

            <button
              onClick={() =>
                abrirAudio(asesor)
              }
              style={
                styles.secondaryButton
              }
            >
              + SUBIR AUDIO
            </button>

            <button
              onClick={() =>
                abrirPda(asesor)
              }
              style={
                styles.secondaryButton
              }
            >
              + NUEVO PDA
            </button>

            <button
              onClick={() =>
                abrirFelicitacion(
                  asesor
                )
              }
              style={
                styles.secondaryButton
              }
            >
              + FELICITACIÓN
            </button>
          </div>
        </div>

        <div style={styles.tabs}>
          {[
            ["resumen", "RESUMEN"],
            ["calidad", "CALIDAD"],
            [
              "productividad",
              "PRODUCTIVIDAD",
            ],
            [
              "tipificaciones",
              "TIPIFICACIONES",
            ],
            [
              "noventas",
              "NO VENTAS",
            ],
            ["audios", "AUDIOS"],
            ["pda", "PDA"],
            [
              "devoluciones",
              "DEVOLUCIONES",
            ],
            [
              "felicitaciones",
              "FELICITACIONES",
            ],
            [
              "evolucion",
              "EVOLUCIÓN",
            ],
          ].map(
            ([value, label]) => (
              <button
                key={value}
                onClick={() =>
                  setSubVista(
                    value
                  )
                }
                style={
                  subVista ===
                  value
                    ? styles.tabActive
                    : styles.tab
                }
              >
                {label}
              </button>
            )
          )}
        </div>
      </section>

      {subVista === "resumen" && (
        <ResumenAsesor
          actual={actual}
          reportes={
            reportesAsesor
          }
          devoluciones={
            devolucionesAsesor
          }
          audios={
            audiosAsesor
          }
          pdas={pdasAsesor}
          felicitaciones={
            felicitacionesAsesor
          }
        />
      )}

      {subVista === "calidad" && (
        <section style={styles.card}>
          <h2>Calidad</h2>

          <div style={styles.grid}>
            <Metric
              title="Nota actual"
              value={
                actual?.nota ??
                "—"
              }
            />

            <Metric
              title="Objetivo"
              value={
                actual?.objetivo ??
                "—"
              }
            />

            <Metric
              title="Evolución"
              value={
                actual?.evolucion ||
                "—"
              }
            />
          </div>

          <InfoBlock
            title="Desvíos principales"
            value={
              actual?.desvio
            }
          />

          <InfoBlock
            title="Recomendación"
            value={
              actual?.recomendacion
            }
          />

          <InfoBlock
            title="Aspectos trabajados"
            value={formatearArray(
              actual?.aspectos_calidad
            )}
          />

          <InfoBlock
            title="Acciones realizadas"
            value={formatearArray(
              actual?.acciones_calidad
            )}
          />

          <InfoBlock
            title="Observaciones"
            value={
              actual?.observaciones
            }
          />
        </section>
      )}

      {subVista ===
        "productividad" && (
        <section style={styles.card}>
          <h2>
            Productividad
          </h2>

          <div style={styles.grid}>
            <Metric
              title="SPH"
              value={
                actual?.sph ??
                "—"
              }
              extra={`Objetivo: ${
                actual?.objetivo_sph ??
                "—"
              }`}
            />

            <Metric
              title="Ventas"
              value={
                actual?.ventas ??
                "—"
              }
              extra={`Objetivo: ${
                actual?.objetivo_ventas ??
                "—"
              }`}
            />

            <Metric
              title="Estado SPH"
              value={
                actual?.estado_sph ||
                "—"
              }
            />

            <Metric
              title="Estado ventas"
              value={
                actual?.estado_ventas ||
                "—"
              }
            />
          </div>

          <InfoBlock
            title="Aspectos trabajados"
            value={formatearArray(
              actual?.aspectos_productividad
            )}
          />

          <InfoBlock
            title="Acciones realizadas"
            value={formatearArray(
              actual?.acciones_productividad
            )}
          />

          <InfoBlock
            title="Objetivo de campaña"
            value={
              actual?.objetivo_campania
            }
          />

          <InfoBlock
            title="Descripción"
            value={
              actual?.descripcion_campania
            }
          />
        </section>
      )}

      {subVista ===
        "tipificaciones" && (
        <section style={styles.card}>
          <h2>
            Tipificaciones
          </h2>

          <div style={styles.grid}>
            <Metric
              title="Resultado actual"
              value={
                actual?.tipificaciones_resultado ??
                "—"
              }
            />

            <Metric
              title="Objetivo"
              value={
                actual?.tipificaciones_objetivo ??
                "—"
              }
            />

            <Metric
              title="Desvío"
              value={
                actual?.tipificaciones_desvio ??
                "—"
              }
            />
          </div>

          <InfoBlock
            title="Tipificaciones auditadas"
            value={formatearArray(
              actual?.tipificaciones_auditadas
            )}
          />

          <InfoBlock
            title="Compromiso"
            value={
              actual?.tipificaciones_compromiso
            }
          />

          <InfoBlock
            title="Observaciones"
            value={
              actual?.tipificaciones_observaciones
            }
          />

          <h3
            style={{
              marginTop: "30px",
            }}
          >
            Devoluciones
          </h3>

          <ListaSimple
            items={
              devolucionesAsesor.filter(
                (d) =>
                  d.area ===
                  "Tipificaciones"
              )
            }
          />
        </section>
      )}

      {subVista ===
        "noventas" && (
        <section style={styles.card}>
          <h2>
            No Ventas
          </h2>

          <div style={styles.grid}>
            <Metric
              title="Cantidad"
              value={
                actual?.no_ventas_cantidad ??
                "—"
              }
            />

            <Metric
              title="Registro en sistema"
              value={
                actual?.no_ventas_registro ||
                "—"
              }
            />

            <Metric
              title="Compromiso"
              value={
                actual?.no_ventas_compromiso ||
                "—"
              }
            />
          </div>

          <InfoBlock
            title="Coaching"
            value={formatearArray(
              actual?.no_ventas_coaching
            )}
          />

          <InfoBlock
            title="Principales O.M."
            value={formatearArray(
              actual?.no_ventas_om
            )}
          />

          <InfoBlock
            title="Fortalezas"
            value={formatearArray(
              actual?.no_ventas_fortalezas
            )}
          />

          <InfoBlock
            title="Observaciones"
            value={
              actual?.no_ventas_observaciones
            }
          />
        </section>
      )}

      {subVista === "audios" && (
        <section style={styles.card}>
          <h2>Audios</h2>

          <ListaAudios
            audios={
              audiosAsesor
            }
          />
        </section>
      )}

      {subVista === "pda" && (
        <section style={styles.card}>
          <h2>
            Planes de Acción
          </h2>

          <ListaPdas
            pdas={pdasAsesor}
          />
        </section>
      )}

      {subVista ===
        "devoluciones" && (
        <section style={styles.card}>
          <h2>
            Devoluciones
          </h2>

          <ListaDevoluciones
            devoluciones={
              devolucionesAsesor
            }
          />
        </section>
      )}

      {subVista ===
        "felicitaciones" && (
        <section style={styles.card}>
          <h2>
            Felicitaciones
          </h2>

          <ListaFelicitaciones
            felicitaciones={
              felicitacionesAsesor
            }
          />
        </section>
      )}

      {subVista ===
        "evolucion" && (
        <section style={styles.card}>
          <h2>
            Evolución de Calidad
          </h2>

          <EvolucionCalidad
            reportes={
              reportesAsesor
            }
          />
        </section>
      )}
    </>
  );
}

function ResumenAsesor({
  actual,
  reportes,
  devoluciones,
  audios,
  pdas,
  felicitaciones,
}) {
  return (
    <>
      <section style={styles.card}>
        <h2>
          Resumen del asesor
        </h2>

        <div style={styles.grid}>
          <Metric
            title="Calidad actual"
            value={
              actual?.nota ??
              "—"
            }
            extra={`Objetivo: ${
              actual?.objetivo ??
              "—"
            }`}
          />

          <Metric
            title="SPH"
            value={
              actual?.sph ??
              "—"
            }
            extra={`Objetivo: ${
              actual?.objetivo_sph ??
              "—"
            }`}
          />

          <Metric
            title="Ventas"
            value={
              actual?.ventas ??
              "—"
            }
          />

          <Metric
            title="Estado"
            value={
              calcularEstado(
                actual
              )
            }
          />
        </div>
      </section>

      <section style={styles.card}>
        <h2>
          Actividad del asesor
        </h2>

        <div style={styles.grid}>
          <Metric
            title="Devoluciones"
            value={
              devoluciones.length
            }
          />

          <Metric
            title="Audios"
            value={
              audios.length
            }
          />

          <Metric
            title="PDA"
            value={
              pdas.length
            }
          />

          <Metric
            title="Felicitaciones"
            value={
              felicitaciones.length
            }
          />
        </div>
      </section>

      <section style={styles.card}>
        <h2>
          Historial de Calidad
        </h2>

        <EvolucionCalidad
          reportes={reportes}
        />
      </section>
    </>
  );
}

function EvolucionCalidad({
  reportes,
}) {
  const ordenados =
    [...reportes].reverse();

  if (
    ordenados.length ===
    0
  ) {
    return (
      <p style={styles.muted}>
        Todavía no hay
        reportes suficientes
        para mostrar la
        evolución.
      </p>
    );
  }

  return (
    <div>
      <div
        style={
          styles.evolutionGrid
        }
      >
        {ordenados.map(
          (r, index) => (
            <div
              key={
                r.id ||
                `${r.semana}-${index}`
              }
              style={
                styles.evolutionItem
              }
            >
              <span
                style={
                  styles.evolutionWeek
                }
              >
                {r.semana}
              </span>

              <strong
                style={{
                  fontSize:
                    "28px",
                }}
              >
                {r.nota ??
                  "—"}
              </strong>

              {index > 0 && (
                <small
                  style={
                    styles.muted
                  }
                >
                  {calcularDiferencia(
                    r.nota,
                    ordenados[
                      index - 1
                    ]?.nota
                  )}
                </small>
              )}
            </div>
          )
        )}
      </div>

      <div
        style={{
          marginTop: "25px",
        }}
      >
        <h3>
          Evolución semanal
        </h3>

        <div
          style={
            styles.simpleChart
          }
        >
          {ordenados.map(
            (r, index) => {
              const nota =
                Number(
                  r.nota
                );

              const altura =
                Number.isFinite(
                  nota
                )
                  ? Math.max(
                      10,
                      Math.min(
                        100,
                        nota
                      )
                    )
                  : 5;

              return (
                <div
                  key={
                    `${r.id}-${index}`
                  }
                  style={
                    styles.barColumn
                  }
                >
                  <div
                    style={{
                      ...styles.bar,
                      height: `${altura}%`,
                    }}
                    title={`${
                      r.semana
                    }: ${
                      r.nota ??
                      "—"
                    }`}
                  />

                  <small>
                    {r.semana
                      ?.replace(
                        "Semana ",
                        "S"
                      )
                      .replace(
                        " · Agosto",
                        ""
                      )}
                  </small>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

function FormularioDevolucion({
  datos,
  actualizar,
  asesores,
  toggle,
  guardar,
  volver,
}) {
  return (
    <section style={styles.card}>
      <div
        style={
          styles.sectionHeader
        }
      >
        <div>
          <button
            onClick={volver}
            style={
              styles.secondaryButton
            }
          >
            ← Volver
          </button>

          <h2
            style={{
              marginTop:
                "20px",
            }}
          >
            Nueva devolución
          </h2>

          <p style={styles.muted}>
            Cargá la devolución
            realizada al asesor.
          </p>
        </div>
      </div>

      <div style={styles.formGrid}>
        <Field
          label="Asesor"
          value={
            datos.asesor
          }
          onChange={(v) =>
            actualizar(
              "asesor",
              v
            )
          }
          type="select"
          options={asesores.map(
            (a) => ({
              value:
                a.nombre,
              label:
                a.nombre,
            })
          )}
        />

        <Field
          label="Área"
          value={
            datos.area
          }
          onChange={(v) =>
            actualizar(
              "area",
              v
            )
          }
          type="select"
          options={AREAS.map(
            (a) => ({
              value: a,
              label: a,
            })
          )}
        />

        <Field
          label="Responsable"
          value={
            datos.responsable
          }
          onChange={(v) =>
            actualizar(
              "responsable",
              v
            )
          }
        />

        <Field
          label="Fecha"
          value={
            datos.fecha
          }
          onChange={(v) =>
            actualizar(
              "fecha",
              v
            )
          }
          type="date"
        />
      </div>

      <FormSection title="CALIDAD">
        <Field
          label="Nota CALIDAD obtenida"
          value={
            datos.notaCalidad
          }
          onChange={(v) =>
            actualizar(
              "notaCalidad",
              v
            )
          }
          type="number"
        />

        <MultiSelect
          label="Aspectos trabajados"
          values={
            datos.aspectosCalidad
          }
          options={
            CALIDAD
          }
          onToggle={(v) =>
            toggle(
              "aspectosCalidad",
              v
            )
          }
        />

        <MultiSelect
          label="Acciones"
          values={
            datos.accionesCalidad
          }
          options={
            ACCIONES_CALIDAD
          }
          onToggle={(v) =>
            toggle(
              "accionesCalidad",
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

        <MultiSelect
          label="Acciones"
          values={
            datos.accionesProductividad
          }
          options={
            ACCIONES_PRODUCTIVIDAD
          }
          onToggle={(v) =>
            toggle(
              "accionesProductividad",
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
          values={
            datos.om
          }
          options={OM}
          onToggle={(v) =>
            toggle(
              "om",
              v
            )
          }
        />

        <Field
          label="Registro en sistema"
          value={
            datos.registroSistema
          }
          onChange={(v) =>
            actualizar(
              "registroSistema",
              v
            )
          }
          type="select"
          options={[
            {
              value:
                "Correcto",
              label:
                "Correcto",
            },
            {
              value:
                "Incorrecto",
              label:
                "Incorrecto",
            },
          ]}
        />

        <MultiSelect
          label="Fortalezas destacadas"
          values={
            datos.fortalezas
          }
          options={
            FORTALEZAS
          }
          onToggle={(v) =>
            toggle(
              "fortalezas",
              v
            )
          }
        />

        <Field
          label="Compromiso"
          value={
            datos.compromiso
          }
          onChange={(v) =>
            actualizar(
              "compromiso",
              v
            )
          }
          type="select"
          options={COMPROMISOS.map(
            (c) => ({
              value: c,
              label: c,
            })
          )}
        />
      </FormSection>

      <FormSection title="DEVOLUCIÓN">
        <Field
          label="Devolución"
          value={
            datos.devolucion
          }
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
          value={
            datos.observaciones
          }
          onChange={(v) =>
            actualizar(
              "observaciones",
              v
            )
          }
          type="textarea"
        />
      </FormSection>

      <button
        onClick={guardar}
        style={
          styles.primaryButtonLarge
        }
      >
        GUARDAR DEVOLUCIÓN
      </button>
    </section>
  );
}

function FormularioAudio({
  datos,
  actualizar,
  asesores,
  toggle,
  guardar,
  volver,
}) {
  return (
    <section style={styles.card}>
      <button
        onClick={volver}
        style={
          styles.secondaryButton
        }
      >
        ← Volver
      </button>

      <h2
        style={{
          marginTop:
            "20px",
        }}
      >
        Audios
      </h2>

      <p style={styles.muted}>
        Cargá el audio y
        registrá qué se trabajó.
      </p>

      <div style={styles.formGrid}>
        <Field
          label="Asesor"
          value={
            datos.asesor
          }
          onChange={(v) =>
            actualizar(
              "asesor",
              v
            )
          }
          type="select"
          options={asesores.map(
            (a) => ({
              value:
                a.nombre,
              label:
                a.nombre,
            })
          )}
        />

        <Field
          label="¿A qué corresponde?"
          value={
            datos.area
          }
          onChange={(v) =>
            actualizar(
              "area",
              v
            )
          }
          type="select"
          options={[
            "Calibración de Calidad",
            "Productividad",
            "Tipificaciones",
            "No Ventas",
          ].map((v) => ({
            value: v,
            label: v,
          }))}
        />

        <Field
          label="Responsable"
          value={
            datos.responsable
          }
          onChange={(v) =>
            actualizar(
              "responsable",
              v
            )
          }
        />

        <Field
          label="Fecha"
          value={
            datos.fecha
          }
          onChange={(v) =>
            actualizar(
              "fecha",
              v
            )
          }
          type="date"
        />
      </div>

      <div style={styles.fileBox}>
        <label style={styles.label}>
          Audio
        </label>

        <input
          type="file"
          accept="audio/*,.mp3,.wav,.m4a"
          onChange={(e) =>
            actualizar(
              "archivo",
              e.target.files?.[0] ||
                null
            )
          }
          style={styles.input}
        />

        {datos.archivo && (
          <p style={styles.muted}>
            Archivo seleccionado:{" "}
            <strong>
              {datos.archivo.name}
            </strong>
          </p>
        )}
      </div>

      <MultiSelect
        label="Aspectos trabajados CALIDAD"
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

      <MultiSelect
        label="Aspectos trabajados PRODUCTIVIDAD"
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

      <Field
        label="Devolución"
        value={
          datos.devolucion
        }
        onChange={(v) =>
          actualizar(
            "devolucion",
            v
          )
        }
        type="textarea"
      />

      <button
        onClick={guardar}
        style={
          styles.primaryButtonLarge
        }
      >
        GUARDAR AUDIO
      </button>

      <section
        style={{
          ...styles.innerCard,
          marginTop:
            "30px",
        }}
      >
        <h3>
          Historial de audios
        </h3>

        <ListaAudios
          audios={[]}
          mensajeVacio="Los audios cargados aparecerán en el historial del asesor."
        />
      </section>
    </section>
  );
}

function FormularioPda({
  datos,
  actualizar,
  asesores,
  guardar,
  volver,
}) {
  return (
    <section style={styles.card}>
      <button
        onClick={volver}
        style={
          styles.secondaryButton
        }
      >
        ← Volver
      </button>

      <h2
        style={{
          marginTop:
            "20px",
        }}
      >
        Nuevo Plan de Acción
      </h2>

      <div style={styles.formGrid}>
        <Field
          label="Asesor"
          value={
            datos.asesor
          }
          onChange={(v) =>
            actualizar(
              "asesor",
              v
            )
          }
          type="select"
          options={asesores.map(
            (a) => ({
              value:
                a.nombre,
              label:
                a.nombre,
            })
          )}
        />

        <Field
          label="Aspecto"
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
            datos.desde
          }
          onChange={(v) =>
            actualizar(
              "desde",
              v
            )
          }
          type="date"
        />

        <Field
          label="Fecha hasta"
          value={
            datos.hasta
          }
          onChange={(v) =>
            actualizar(
              "hasta",
              v
            )
          }
          type="date"
        />
      </div>

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
        type="textarea"
      />

      <Field
        label="Diagnóstico"
        value={
          datos.diagnostico
        }
        onChange={(v) =>
          actualizar(
            "diagnostico",
            v
          )
        }
        type="textarea"
      />

      <Field
        label="Metodología"
        value={
          datos.metodologia
        }
        onChange={(v) =>
          actualizar(
            "metodologia",
            v
          )
        }
        type="textarea"
      />

      <Field
        label="Seguimiento"
        value={
          datos.seguimiento
        }
        onChange={(v) =>
          actualizar(
            "seguimiento",
            v
          )
        }
        type="textarea"
      />

      <Field
        label="Estado"
        value={
          datos.estado
        }
        onChange={(v) =>
          actualizar(
            "estado",
            v
          )
        }
        type="select"
        options={[
          {
            value: "Activo",
            label: "Activo",
          },
          {
            value: "Finalizado",
            label: "Finalizado",
          },
          {
            value: "Pendiente",
            label: "Pendiente",
          },
        ]}
      />

      <button
        onClick={guardar}
        style={
          styles.primaryButtonLarge
        }
      >
        GUARDAR PDA
      </button>
    </section>
  );
}

function FormularioFelicitacion({
  datos,
  actualizar,
  asesores,
  guardar,
  volver,
}) {
  return (
    <section style={styles.card}>
      <button
        onClick={volver}
        style={
          styles.secondaryButton
        }
      >
        ← Volver
      </button>

      <h2
        style={{
          marginTop:
            "20px",
        }}
      >
        Nueva felicitación
      </h2>

      <p style={styles.muted}>
        Registrá un reconocimiento
        positivo para el asesor.
      </p>

      <div style={styles.formGrid}>
        <Field
          label="Asesor"
          value={
            datos.asesor
          }
          onChange={(v) =>
            actualizar(
              "asesor",
              v
            )
          }
          type="select"
          options={asesores.map(
            (a) => ({
              value:
                a.nombre,
              label:
                a.nombre,
            })
          )}
        />

        <Field
          label="Fecha"
          value={
            datos.fecha
          }
          onChange={(v) =>
            actualizar(
              "fecha",
              v
            )
          }
          type="date"
        />

        <Field
          label="Responsable"
          value={
            datos.responsable
          }
          onChange={(v) =>
            actualizar(
              "responsable",
              v
            )
          }
        />

        <Field
          label="Motivo / aspecto destacado"
          value={
            datos.motivo
          }
          onChange={(v) =>
            actualizar(
              "motivo",
              v
            )
          }
        />
      </div>

      <Field
        label="Felicitación"
        value={
          datos.mensaje
        }
        onChange={(v) =>
          actualizar(
            "mensaje",
            v
          )
        }
        type="textarea"
      />

      <Field
        label="Observaciones"
        value={
          datos.observaciones
        }
        onChange={(v) =>
          actualizar(
            "observaciones",
            v
          )
        }
        type="textarea"
      />

      <button
        onClick={guardar}
        style={
          styles.primaryButtonLarge
        }
      >
        GUARDAR FELICITACIÓN
      </button>
    </section>
  );
}

function FormularioReporte({
  reporte,
  actualizar,
  toggle,
  asesores,
  guardar,
  volver,
}) {
  return (
    <section style={styles.card}>
      <button
        onClick={volver}
        style={
          styles.secondaryButton
        }
      >
        ← Volver
      </button>

      <h2
        style={{
          marginTop:
            "20px",
        }}
      >
        Nuevo reporte
      </h2>

      <div style={styles.formGrid}>
        <Field
          label="Asesor"
          value={
            reporte.asesor
          }
          onChange={(v) =>
            actualizar(
              "asesor",
              v
            )
          }
          type="select"
          options={asesores.map(
            (a) => ({
              value:
                a.email,
              label:
                a.nombre,
            })
          )}
        />

        <Field
          label="Semana"
          value={
            reporte.semana
          }
          onChange={(v) =>
            actualizar(
              "semana",
              v
            )
          }
          type="select"
          options={SEMANAS.map(
            (s) => ({
              value: s,
              label: s,
            })
          )}
        />

        <Field
          label="Campaña"
          value={
            reporte.producto
          }
          onChange={(v) =>
            actualizar(
              "producto",
              v
            )
          }
          type="select"
          options={[
            {
              value: "AP",
              label: "AP",
            },
            {
              value: "BM",
              label: "BM",
            },
          ]}
        />
      </div>

      <FormSection title="CALIDAD">
        <div style={styles.formGrid}>
          <Field
            label="Nota obtenida"
            value={
              reporte.nota
            }
            onChange={(v) =>
              actualizar(
                "nota",
                v
              )
            }
            type="number"
          />

          <Field
            label="Objetivo semanal"
            value={
              reporte.objetivo
            }
            onChange={(v) =>
              actualizar(
                "objetivo",
                v
              )
            }
            type="number"
          />

          <Field
            label="Evolución"
            value={
              reporte.evolucion
            }
            onChange={(v) =>
              actualizar(
                "evolucion",
                v
              )
            }
          />
        </div>

        <Field
          label="Desvíos con mayor porcentaje de la semana"
          value={
            reporte.desvio
          }
          onChange={(v) =>
            actualizar(
              "desvio",
              v
            )
          }
          type="textarea"
        />

        <InfoAuto
          title="Aspectos trabajados"
          values={
            reporte.aspectosCalidad
          }
        />

        <MultiSelect
          label="Aspectos trabajados"
          values={
            reporte.aspectosCalidad
          }
          options={CALIDAD}
          onToggle={(v) =>
            toggle(
              "aspectosCalidad",
              v
            )
          }
        />

        <MultiSelect
          label="Acciones"
          values={
            reporte.accionesCalidad
          }
          options={
            ACCIONES_CALIDAD
          }
          onToggle={(v) =>
            toggle(
              "accionesCalidad",
              v
            )
          }
        />

        <Field
          label="Recomendación"
          value={
            reporte.recomendacion
          }
          onChange={(v) =>
            actualizar(
              "recomendacion",
              v
            )
          }
          type="textarea"
        />

        <Field
          label="Auditoría"
          value={
            reporte.auditoria
          }
          onChange={(v) =>
            actualizar(
              "auditoria",
              v
            )
          }
        />

        <Field
          label="Observaciones"
          value={
            reporte.observaciones
          }
          onChange={(v) =>
            actualizar(
              "observaciones",
              v
            )
          }
          type="textarea"
        />
      </FormSection>

      <FormSection title="PRODUCTIVIDAD">
        <div style={styles.formGrid}>
          <Field
            label="SPH"
            value={
              reporte.sph
            }
            onChange={(v) =>
              actualizar(
                "sph",
                v
              )
            }
            type="number"
            step="0.01"
          />

          <Field
            label="Objetivo SPH"
            value={
              reporte.objetivoSph
            }
            onChange={(v) =>
              actualizar(
                "objetivoSph",
                v
              )
            }
            type="number"
            step="0.01"
          />

          <Field
            label="Ventas"
            value={
              reporte.ventas
            }
            onChange={(v) =>
              actualizar(
                "ventas",
                v
              )
            }
            type="number"
          />

          <Field
            label="Objetivo ventas"
            value={
              reporte.objetivoVentas
            }
            onChange={(v) =>
              actualizar(
                "objetivoVentas",
                v
              )
            }
            type="number"
          />
        </div>

        <Field
          label="Objetivo de la campaña"
          value={
            reporte.objetivoCampania
          }
          onChange={(v) =>
            actualizar(
              "objetivoCampania",
              v
            )
          }
          type="textarea"
        />

        <Field
          label="Descripción de campaña"
          value={
            reporte.descripcionCampania
          }
          onChange={(v) =>
            actualizar(
              "descripcionCampania",
              v
            )
          }
          type="textarea"
        />

        <MultiSelect
          label="Aspectos trabajados"
          values={
            reporte.aspectosProductividad
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

        <MultiSelect
          label="Acciones"
          values={
            reporte.accionesProductividad
          }
          options={
            ACCIONES_PRODUCTIVIDAD
          }
          onToggle={(v) =>
            toggle(
              "accionesProductividad",
              v
            )
          }
        />

        <div style={styles.formGrid}>
          <Field
            label="Estado SPH"
            value={
              reporte.estadoSph
            }
            onChange={(v) =>
              actualizar(
                "estadoSph",
                v
              )
            }
            type="select"
            options={ESTADOS.map(
              (e) => ({
                value: e,
                label: e,
              })
            )}
          />

          <Field
            label="Estado ventas"
            value={
              reporte.estadoVentas
            }
            onChange={(v) =>
              actualizar(
                "estadoVentas",
                v
              )
            }
            type="select"
            options={ESTADOS.map(
              (e) => ({
                value: e,
                label: e,
              })
            )}
          />
        </div>
      </FormSection>

      <FormSection title="TIPIFICACIONES">
        <MultiSelect
          label="Tipificaciones auditadas"
          values={
            reporte.tipificacionesAuditadas
          }
          options={
            TIPIFICACIONES
          }
          onToggle={(v) =>
            toggle(
              "tipificacionesAuditadas",
              v
            )
          }
        />

        <div style={styles.formGrid}>
          <Field
            label="Desvío"
            value={
              reporte.tipificacionesDesvio
            }
            onChange={(v) =>
              actualizar(
                "tipificacionesDesvio",
                v
              )
            }
            type="number"
            step="0.01"
          />

          <Field
            label="Objetivo"
            value={
              reporte.tipificacionesObjetivo
            }
            onChange={(v) =>
              actualizar(
                "tipificacionesObjetivo",
                v
              )
            }
            type="number"
            step="0.01"
          />

          <Field
            label="Resultado"
            value={
              reporte.tipificacionesResultado
            }
            onChange={(v) =>
              actualizar(
                "tipificacionesResultado",
                v
              )
            }
            type="number"
            step="0.01"
          />

          <Field
            label="Compromiso"
            value={
              reporte.tipificacionesCompromiso
            }
            onChange={(v) =>
              actualizar(
                "tipificacionesCompromiso",
                v
              )
            }
            type="select"
            options={COMPROMISOS.map(
              (c) => ({
                value: c,
                label: c,
              })
            )}
          />
        </div>

        <Field
          label="Observaciones"
          value={
            reporte.tipificacionesObservaciones
          }
          onChange={(v) =>
            actualizar(
              "tipificacionesObservaciones",
              v
            )
          }
          type="textarea"
        />
      </FormSection>

      <FormSection title="NO VENTAS">
        <Field
          label="Cantidad"
          value={
            reporte.noVentasCantidad
          }
          onChange={(v) =>
            actualizar(
              "noVentasCantidad",
              v
            )
          }
          type="number"
        />

        <MultiSelect
          label="Coaching"
          values={
            reporte.noVentasCoaching
          }
          options={
            ACCIONES_PRODUCTIVIDAD
          }
          onToggle={(v) =>
            toggle(
              "noVentasCoaching",
              v
            )
          }
        />

        <Field
          label="Registro en sistema"
          value={
            reporte.noVentasRegistro
          }
          onChange={(v) =>
            actualizar(
              "noVentasRegistro",
              v
            )
          }
          type="select"
          options={[
            {
              value:
                "Correcto",
              label:
                "Correcto",
            },
            {
              value:
                "Incorrecto",
              label:
                "Incorrecto",
            },
          ]}
        />

        <Field
          label="Compromiso"
          value={
            reporte.noVentasCompromiso
          }
          onChange={(v) =>
            actualizar(
              "noVentasCompromiso",
              v
            )
          }
          type="select"
          options={COMPROMISOS.map(
            (c) => ({
              value: c,
              label: c,
            })
          )}
        />

        <MultiSelect
          label="Principales O.M."
          values={
            reporte.noVentasOM
          }
          options={OM}
          onToggle={(v) =>
            toggle(
              "noVentasOM",
              v
            )
          }
        />

        <MultiSelect
          label="Fortalezas"
          values={
            reporte.noVentasFortalezas
          }
          options={
            FORTALEZAS
          }
          onToggle={(v) =>
            toggle(
              "noVentasFortalezas",
              v
            )
          }
        />

        <Field
          label="Observaciones"
          value={
            reporte.noVentasObservaciones
          }
          onChange={(v) =>
            actualizar(
              "noVentasObservaciones",
              v
            )
          }
          type="textarea"
        />
      </FormSection>

      <FormSection title="ACCIONES REALIZADAS EN LA SEMANA">
        <Field
          label="Gestión"
          value={
            reporte.gestion
          }
          onChange={(v) =>
            actualizar(
              "gestion",
              v
            )
          }
          type="textarea"
        />
      </FormSection>

      <button
        onClick={guardar}
        style={
          styles.primaryButtonLarge
        }
      >
        GUARDAR REPORTE
      </button>
    </section>
  );
}

function ListaReportes({
  reportes,
  asesores,
  abrirReporte,
}) {
  return (
    <section style={styles.card}>
      <div
        style={
          styles.sectionHeader
        }
      >
        <div>
          <h2>
            Reportes
          </h2>

          <p style={styles.muted}>
            Esta es la última
            sección del menú.
          </p>
        </div>

        <button
          onClick={() =>
            abrirReporte()
          }
          style={
            styles.primaryButton
          }
        >
          + NUEVO REPORTE
        </button>
      </div>

      <div
        style={
          styles.printBar
        }
      >
        <button
          onClick={() =>
            window.print()
          }
          style={
            styles.secondaryButton
          }
        >
          IMPRIMIR
        </button>

        <button
          onClick={() =>
            window.print()
          }
          style={
            styles.primaryButton
          }
        >
          IMPRIMIR SELECCIONADOS
        </button>
      </div>

      <div
        style={
          styles.tableWrapper
        }
      >
        <table
          style={styles.table}
        >
          <thead>
            <tr>
              <th>Asesor</th>
              <th>Semana</th>
              <th>Campaña</th>
              <th>Nota</th>
              <th>SPH</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {reportes.map(
              (r) => (
                <tr
                  key={r.id}
                >
                  <td>
                    {r.asesor ||
                      obtenerNombre(
                        asesores,
                        r.usuario
                      )}
                  </td>

                  <td>
                    {r.semana ||
                      "—"}
                  </td>

                  <td>
                    {r.producto ||
                      "—"}
                  </td>

                  <td>
                    {r.nota ??
                      "—"}
                  </td>

                  <td>
                    {r.sph ??
                      "—"}
                  </td>

                  <td>
                    <Estado
                      estado={calcularEstado(
                        r
                      )}
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Seguimiento({
  asesores,
  reportes,
  devoluciones,
  audios,
  pdas,
  seleccionarAsesor,
  abrirDevolucion,
  abrirAudio,
  abrirPda,
  abrirReporte,
}) {
  const hoy = new Date()
    .toISOString()
    .slice(0, 10);

  const pdasPendientes =
    pdas.filter(
      (p) =>
        p.estado !==
        "Finalizado"
    );

  const devolucionesPendientes =
    devoluciones.filter(
      (d) =>
        d.compromiso ===
        "SEGUIMIENTO"
    );

  const audiosPendientes =
    audios.filter(
      (a) =>
        a.estado ===
        "Pendiente"
    );

  return (
    <>
      <section style={styles.card}>
        <div
          style={
            styles.sectionHeader
          }
        >
          <div>
            <h2>
              Seguimiento
            </h2>

            <p style={styles.muted}>
              Lista de pendientes.
            </p>
          </div>
        </div>

        <div style={styles.grid}>
          <div
            style={
              styles.pendingCard
            }
          >
            <span>
              PDA
            </span>

            <strong>
              {
                pdasPendientes.length
              }
            </strong>

            <button
              onClick={() =>
                abrirPda()
              }
              style={
                styles.linkButton
              }
            >
              NUEVO PDA
            </button>
          </div>

          <div
            style={
              styles.pendingCard
            }
          >
            <span>
              DEVOLUCIONES
            </span>

            <strong>
              {
                devolucionesPendientes.length
              }
            </strong>

            <button
              onClick={() =>
                abrirDevolucion()
              }
              style={
                styles.linkButton
              }
            >
              CARGAR DEVOLUCIÓN
            </button>
          </div>

          <div
            style={
              styles.pendingCard
            }
          >
            <span>
              AUDIOS
            </span>

            <strong>
              {
                audiosPendientes.length
              }
            </strong>

            <button
              onClick={() =>
                abrirAudio()
              }
              style={
                styles.linkButton
              }
            >
              SUBIR AUDIO
            </button>
          </div>
        </div>
      </section>

      <section style={styles.card}>
        <h2>
          Seguimiento por asesor
        </h2>

        <div
          style={
            styles.advisorGrid
          }
        >
          {asesores.map(
            (asesor) => {
              const r =
                reportes.find(
                  (reporte) =>
                    reporte.usuario ===
                      asesor.email ||
                    reporte.asesor ===
                      asesor.nombre
                );

              return (
                <div
                  key={
                    asesor.id
                  }
                  style={
                    styles.advisorCard
                  }
                >
                  <h3>
                    {
                      asesor.nombre
                    }
                  </h3>

                  <Estado
                    estado={calcularEstado(
                      r
                    )}
                  />

                  <p
                    style={
                      styles.muted
                    }
                  >
                    Último reporte:{" "}
                    {r?.semana ||
                      "Pendiente"}
                  </p>

                  <button
                    onClick={() =>
                      seleccionarAsesor(
                        asesor
                      )
                    }
                    style={
                      styles.primaryButton
                    }
                  >
                    VER SEGUIMIENTO
                  </button>
                </div>
              );
            }
          )}
        </div>
      </section>
    </>
  );
}

function ListaDevoluciones({
  devoluciones,
}) {
  if (
    devoluciones.length ===
    0
  ) {
    return (
      <p style={styles.muted}>
        No hay devoluciones
        cargadas para este
        asesor.
      </p>
    );
  }

  return (
    <div
      style={
        styles.listStack
      }
    >
      {devoluciones.map(
        (d) => (
          <div
            key={d.id}
            style={
              styles.historyCard
            }
          >
            <div
              style={
                styles.historyTop
              }
            >
              <strong>
                {d.fecha}
              </strong>

              <span>
                {d.area}
              </span>

              <span>
                {d.responsable}
              </span>
            </div>

            {d.devolucion && (
              <p>
                {d.devolucion}
              </p>
            )}

            {d.compromiso && (
              <EstadoTexto
                texto={
                  d.compromiso
                }
              />
            )}
          </div>
        )
      )}
    </div>
  );
}

function ListaAudios({
  audios,
  mensajeVacio,
}) {
  if (
    audios.length ===
    0
  ) {
    return (
      <p style={styles.muted}>
        {mensajeVacio ||
          "No hay audios cargados."}
      </p>
    );
  }

  return (
    <div
      style={
        styles.listStack
      }
    >
      {audios.map(
        (audio) => (
          <div
            key={
              audio.id
            }
            style={
              styles.historyCard
            }
          >
            <div
              style={
                styles.historyTop
              }
            >
              <strong>
                {audio.fecha}
              </strong>

              <span>
                {audio.area}
              </span>

              <span>
                {audio.responsable}
              </span>

              <EstadoTexto
                texto={
                  audio.estado ||
                  "Pendiente"
                }
              />
            </div>

            <p>
              <strong>
                Archivo:
              </strong>{" "}
              {
                audio.nombreArchivo ||
                "—"
              }
            </p>

            {audio.archivoUrl && (
              <audio
                controls
                src={
                  audio.archivoUrl
                }
                style={{
                  width:
                    "100%",
                  marginTop:
                    "10px",
                }}
              />
            )}

            {audio.devolucion && (
              <p>
                <strong>
                  Devolución:
                </strong>{" "}
                {
                  audio.devolucion
                }
              </p>
            )}
          </div>
        )
      )}
    </div>
  );
}

function ListaPdas({
  pdas,
}) {
  if (
    pdas.length ===
    0
  ) {
    return (
      <p style={styles.muted}>
        No hay PDA cargados.
      </p>
    );
  }

  return (
    <div
      style={
        styles.listStack
      }
    >
      {pdas.map(
        (pda) => (
          <div
            key={
              pda.id
            }
            style={
              styles.historyCard
            }
          >
            <div
              style={
                styles.historyTop
              }
            >
              <strong>
                {pda.aspecto}
              </strong>

              <span>
                {pda.desde} →{" "}
                {pda.hasta}
              </span>

              <EstadoTexto
                texto={
                  pda.estado
                }
              />
            </div>

            <p>
              {pda.objetivo}
            </p>
          </div>
        )
      )}
    </div>
  );
}

function ListaFelicitaciones({
  felicitaciones,
}) {
  if (
    felicitaciones.length ===
    0
  ) {
    return (
      <p style={styles.muted}>
        No hay felicitaciones
        cargadas para este
        asesor.
      </p>
    );
  }

  return (
    <div
      style={
        styles.listStack
      }
    >
      {felicitaciones.map(
        (f) => (
          <div
            key={
              f.id
            }
            style={
              styles.positiveCard
            }
          >
            <div
              style={
                styles.historyTop
              }
            >
              <strong>
                {f.fecha}
              </strong>

              <span>
                {f.motivo ||
                  "Reconocimiento"}
              </span>

              <span>
                {f.responsable}
              </span>
            </div>

            <p>
              {f.mensaje}
            </p>

            {f.observaciones && (
              <p
                style={
                  styles.muted
                }
              >
                {f.observaciones}
              </p>
            )}
          </div>
        )
      )}
    </div>
  );
}

function ListaSimple({
  items,
}) {
  if (
    !items ||
    items.length === 0
  ) {
    return (
      <p style={styles.muted}>
        No hay información
        cargada.
      </p>
    );
  }

  return (
    <div
      style={
        styles.listStack
      }
    >
      {items.map(
        (item) => (
          <div
            key={
              item.id
            }
            style={
              styles.historyCard
            }
          >
            {item.devolucion ||
              "Devolución registrada."}
          </div>
        )
      )}
    </div>
  );
}

function FormSection({
  title,
  children,
}) {
  return (
    <section
      style={
        styles.formSection
      }
    >
      <h3>
        {title}
      </h3>

      {children}
    </section>
  );
}

function MultiSelect({
  label,
  values,
  options,
  onToggle,
}) {
  return (
    <div
      style={
        styles.multiSection
      }
    >
      <label
        style={
          styles.label
        }
      >
        {label}
      </label>

      <div
        style={
          styles.multiGrid
        }
      >
        {options.map(
          (option) => {
            const activo =
              values?.includes(
                option
              );

            return (
              <button
                type="button"
                key={
                  option
                }
                onClick={() =>
                  onToggle(
                    option
                  )
                }
                style={{
                  ...styles.multiOption,
                  ...(activo
                    ? styles.multiOptionActive
                    : {}),
                }}
              >
                {activo
                  ? "✓ "
                  : ""}
                {option}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  options = [],
  step,
}) {
  return (
    <div
      style={
        styles.field
      }
    >
      <label
        style={
          styles.label
        }
      >
        {label}
      </label>

      {type ===
      "textarea" ? (
        <textarea
          value={
            value ??
            ""
          }
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          style={{
            ...styles.input,
            minHeight:
              "110px",
            resize:
              "vertical",
          }}
        />
      ) : type ===
        "select" ? (
        <select
          value={
            value ??
            ""
          }
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          style={
            styles.input
          }
        >
          <option value="">
            Seleccionar
          </option>

          {options.map(
            (option) => (
              <option
                key={
                  option.value
                }
                value={
                  option.value
                }
              >
                {
                  option.label
                }
              </option>
            )
          )}
        </select>
      ) : (
        <input
          type={type}
          value={
            value ??
            ""
          }
          step={step}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          style={
            styles.input
          }
        />
      )}
    </div>
  );
}

function InfoAuto({
  title,
  values,
}) {
  if (
    !values ||
    values.length === 0
  ) {
    return null;
  }

  return (
    <div
      style={
        styles.autoInfo
      }
    >
      <strong>
        {title} cargados:
      </strong>

      <p>
        {values.join(
          " · "
        )}
      </p>
    </div>
  );
}

function Metric({
  title,
  value,
  extra,
}) {
  return (
    <div
      style={
        styles.metric
      }
    >
      <small>
        {title}
      </small>

      <strong
        style={{
          display:
            "block",
          fontSize:
            "24px",
          marginTop:
            "8px",
        }}
      >
        {value}
      </strong>

      {extra && (
        <small
          style={{
            display:
              "block",
            marginTop:
              "6px",
            color:
              "#68707b",
          }}
        >
          {extra}
        </small>
      )}
    </div>
  );
}

function Stat({
  title,
  value,
}) {
  return (
    <div
      style={
        styles.stat
      }
    >
      <small>
        {title}
      </small>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function InfoBlock({
  title,
  value,
}) {
  return (
    <div
      style={{
        marginTop:
          "20px",
      }}
    >
      <h3>
        {title}
      </h3>

      <p
        style={{
          whiteSpace:
            "pre-wrap",
        }}
      >
        {value ||
          "No hay información cargada."}
      </p>
    </div>
  );
}

function Estado({
  estado,
}) {
  let style =
    styles.estadoNeutral;

  if (
    estado ===
    "POR DEBAJO DEL OBJETIVO"
  ) {
    style =
      styles.estadoRojo;
  }

  if (
    estado ===
    "ALCANZADO"
  ) {
    style =
      styles.estadoVerde;
  }

  if (
    estado ===
    "SUPERADO"
  ) {
    style =
      styles.estadoSuperado;
  }

  return (
    <span
      style={style}
    >
      {estado}
    </span>
  );
}

function EstadoTexto({
  texto,
}) {
  return (
    <span
      style={{
        ...styles.badge,
        background:
          texto ===
          "Pendiente"
            ? "#fff3cd"
            : "#eaf7ef",
      }}
    >
      {texto}
    </span>
  );
}

function calcularEstado(
  reporte
) {
  if (!reporte) {
    return "POR DEBAJO DEL OBJETIVO";
  }

  const nota =
    Number(
      reporte.nota
    );

  const objetivoCalidad =
    Number(
      reporte.objetivo
    );

  const sph =
    Number(
      reporte.sph
    );

  const objetivoSph =
    Number(
      reporte.objetivo_sph
    );

  const calidadOk =
    Number.isFinite(
      nota
    ) &&
    Number.isFinite(
      objetivoCalidad
    ) &&
    nota >=
      objetivoCalidad;

  const productividadOk =
    Number.isFinite(
      sph
    ) &&
    Number.isFinite(
      objetivoSph
    ) &&
    sph >=
      objetivoSph;

  if (
    calidadOk &&
    productividadOk
  ) {
    return "SUPERADO";
  }

  if (
    calidadOk ||
    productividadOk
  ) {
    return "ALCANZADO";
  }

  return "POR DEBAJO DEL OBJETIVO";
}

function calcularDiferencia(
  actual,
  anterior
) {
  const a =
    Number(actual);

  const b =
    Number(anterior);

  if (
    !Number.isFinite(
      a
    ) ||
    !Number.isFinite(
      b
    )
  ) {
    return "Sin comparación";
  }

  const diferencia =
    a - b;

  if (
    diferencia > 0
  ) {
    return `↑ +${diferencia} pts`;
  }

  if (
    diferencia < 0
  ) {
    return `↓ ${diferencia} pts`;
  }

  return "→ Sin variación";
}

function formatearArray(
  valores
) {
  if (
    !valores ||
    !Array.isArray(
      valores
    ) ||
    valores.length === 0
  ) {
    return "No hay información cargada.";
  }

  return valores.join(
    " · "
  );
}

function obtenerNombre(
  asesores,
  email
) {
  return (
    asesores.find(
      (a) =>
        a.email ===
        email
    )?.nombre ||
    email ||
    "—"
  );
}

/*
  Lista completa de asesores utilizada
  como respaldo si Supabase no responde.
*/
const ASESOR_LISTA = [
  ["Acosta, Pamela", "8134", "acosta.pamela@portalcalidad.com"],
  ["Aguilera, Trinidad", "8196", "aguilera.trinidad@portalcalidad.com"],
  ["Bahamonde, Camila", "8135", "bahamonde.camila@portalcalidad.com"],
  ["Bustamante, Ailin", "8188", "bustamante.ailin@portalcalidad.com"],
  ["Bustos, Jesica", "8141", "bustos.jesica@portalcalidad.com"],
  ["Cabrera, Antonella", "8187", "cabrera.antonella@portalcalidad.com"],
  ["Contreras, Gilary", "8046", "contreras.gilary@portalcalidad.com"],
  ["Cordoba, Tania", "8202", "tania.cordoba@portalcalidad.com"],
  ["Diaz, Milagros", "8212", "milagros.diaz@portalcalidad.com"],
  ["Gomez, Carla", "8126", "carla.gomez@portalcalidad.com"],
  ["Luna, Oriana", "8097", "oriana.luna@portalcalidad.com"],
  ["Malqui, Xiomara", "8092", "xiomara.malqui@portalcalidad.com"],
  ["Mercado, Chiara", "8209", "mercado.chiara@portalcalidad.com"],
  ["Ojeda, Luana", "8200", "luana.ojeda@portalcalidad.com"],
  ["Olmedo, Thomas", "8192", "olmedo.thomas@portalcalidad.com"],
  ["Peralta, Belen", "8207", "peralta.belen@portalcalidad.com"],
  ["Reartes, Maia", "8201", "reartes.maia@portalcalidad.com"],
  ["Rojek, Luna", "8213", "rojek.luna@portalcalidad.com"],
  ["Simonetta, Valentina", "8191", "simonetta.valentina@portalcalidad.com"],
  ["Tello, Marianela", "8042", "tello.marianela@portalcalidad.com"],
  ["Vasquez, Agustin", "8136", "agustin.vasquez@portalcalidad.com"],
  ["Viniegra, Agustín", "8199", "agustin.viniegra@portalcalidad.com"],
];

const ASESores_FALLBACK_DATA = ASESOR_LISTA;

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    color: "#20242a",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "1250px",
    margin: "0 auto",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    color: "#20242a",
  },

  header: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "22px 25px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
  },

  title: {
    margin: 0,
    fontSize: "30px",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#68707b",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  adminLabel: {
    color: "#68707b",
    fontSize: "14px",
  },

  nav: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "8px",
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "18px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
  },

  navButton: {
    border: "none",
    background: "transparent",
    padding: "11px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#5f6670",
  },

  navButtonActive: {
    background: "#20242a",
    color: "#ffffff",
  },

  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
  },

  innerCard: {
    background: "#f8fafb",
    borderRadius: "14px",
    padding: "18px",
  },

  message: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid",
    marginBottom: "18px",
    fontWeight: "600",
  },

  muted: {
    color: "#68707b",
  },

  weekHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "25px",
  },

  smallSelect: {
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1px solid #d9dce3",
    background: "#ffffff",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
  },

  stat: {
    background: "#f7f8fa",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  statStrong: {
    fontSize: "28px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },

  filters: {
    display: "grid",
    gridTemplateColumns:
      "minmax(250px, 2fr) repeat(2, minmax(160px, 1fr))",
    gap: "12px",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px 13px",
    borderRadius: "10px",
    border: "1px solid #d9dce3",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "#ffffff",
  },

  field: {
    marginBottom: "17px",
  },

  label: {
    display: "block",
    fontWeight: "700",
    marginBottom: "7px",
    fontSize: "14px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },

  formSection: {
    background: "#f8fafb",
    border: "1px solid #e7eaee",
    borderRadius: "15px",
    padding: "20px",
    marginTop: "20px",
  },

  multiSection: {
    marginBottom: "20px",
  },

  multiGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "8px",
  },

  multiOption: {
    border: "1px solid #d9dce3",
    background: "#ffffff",
    borderRadius: "9px",
    padding: "10px",
    textAlign: "left",
    cursor: "pointer",
    color: "#3f4650",
  },

  multiOptionActive: {
    background: "#20242a",
    color: "#ffffff",
    borderColor: "#20242a",
  },

  primaryButton: {
    border: "none",
    background: "#20242a",
    color: "#ffffff",
    padding: "11px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },

  primaryButtonLarge: {
    width: "100%",
    border: "none",
    background: "#20242a",
    color: "#ffffff",
    padding: "15px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    marginTop: "25px",
  },

  secondaryButton: {
    border: "1px solid #d9dce3",
    background: "#ffffff",
    color: "#20242a",
    padding: "10px 15px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  linkButton: {
    border: "none",
    background: "transparent",
    color: "#20242a",
    padding: "8px 0",
    cursor: "pointer",
    fontWeight: "700",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  advisorGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },

  advisorCard: {
    border: "1px solid #e5e8ec",
    borderRadius: "15px",
    padding: "18px",
    background: "#ffffff",
  },

  miniMetrics: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    margin: "16px 0",
  },

  profileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },

  actionRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "20px",
  },

  tabs: {
    display: "flex",
    gap: "7px",
    flexWrap: "wrap",
    marginTop: "25px",
    paddingTop: "18px",
    borderTop: "1px solid #e8ebee",
  },

  tab: {
    border: "1px solid #dfe2e6",
    background: "#ffffff",
    padding: "10px 12px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },

  tabActive: {
    border: "1px solid #20242a",
    background: "#20242a",
    color: "#ffffff",
    padding: "10px 12px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
  },

  metric: {
    background: "#f7f8fa",
    borderRadius: "13px",
    padding: "18px",
  },

  estadoNeutral: {
    display: "inline-block",
    padding: "6px 9px",
    borderRadius: "8px",
    background: "#edf0f2",
    color: "#555c65",
    fontSize: "12px",
    fontWeight: "800",
  },

  estadoRojo: {
    display: "inline-block",
    padding: "6px 9px",
    borderRadius: "8px",
    background: "#ffd9d9",
    color: "#a32020",
    fontSize: "12px",
    fontWeight: "800",
  },

  estadoVerde: {
    display: "inline-block",
    padding: "6px 9px",
    borderRadius: "8px",
    background: "#d9f2df",
    color: "#236b35",
    fontSize: "12px",
    fontWeight: "800",
  },

  estadoSuperado: {
    display: "inline-block",
    padding: "6px 9px",
    borderRadius: "8px",
    background: "#9fe0ad",
    color: "#145524",
    fontSize: "12px",
    fontWeight: "800",
  },

  badge: {
    display: "inline-block",
    padding: "6px 9px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
  },

  autoInfo: {
    background: "#eef5ff",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "15px",
  },

  fileBox: {
    margin: "15px 0 20px",
  },

  listStack: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  historyCard: {
    border: "1px solid #e4e7eb",
    borderRadius: "13px",
    padding: "16px",
    background: "#ffffff",
  },

  positiveCard: {
    border: "1px solid #c8e6d0",
    borderRadius: "13px",
    padding: "16px",
    background: "#f1fbf4",
  },

  historyTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "10px",
  },

  pendingCard: {
    background: "#f8fafb",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  printBar: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginBottom: "18px",
  },

  evolutionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "12px",
  },

  evolutionItem: {
    background: "#f7f8fa",
    borderRadius: "13px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  evolutionWeek: {
    fontSize: "13px",
    color: "#68707b",
  },

  simpleChart: {
    height: "240px",
    display: "flex",
    alignItems: "flex-end",
    gap: "18px",
    padding: "20px",
    borderRadius: "14px",
    background: "#f7f8fa",
  },

  barColumn: {
    height: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "8px",
  },

  bar: {
    width: "min(55px, 80%)",
    minHeight: "10px",
    borderRadius: "8px 8px 3px 3px",
    background: "#20242a",
  },
};
