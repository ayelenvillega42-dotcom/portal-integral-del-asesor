"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const ADMIN_EMAIL = "ayelenvillega42@gmail.com";

const ASESORES_BASE = [
  {
    id: "1c438fb1-018e-47d4-b278-1c6b8dac8743",
    nombre: "Mercado, Chiara",
    email: "chiara.mercado@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "1dc9b816-6ee3-4cd5-a917-857301e01a70",
    nombre: "Rojek, Luna",
    email: "luna.rojek@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "392b476b-3006-451c-8d9f-bd31772a22f1",
    nombre: "Aguilera, Trinidad",
    email: "trinidad.aguilera@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "55d51779-f49f-4721-a85c-1c27a1ac34be",
    nombre: "Cordoba, Tania",
    email: "tania.cordoba@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "5d644be6-879b-4c73-ab26-8e025f22bd63",
    nombre: "Bustos, Jesica",
    email: "jesica.bustos@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "66adbc56-cb5a-4c72-8d0d-88fb943f7130",
    nombre: "Cabrera, Antonella",
    email: "antonella.cabrera@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "747cd508-e79a-4515-9575-9f43f837c3ff",
    nombre: "Vasquez, Agustin",
    email: "agustin.vasquez@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "836fab43-60b3-45e6-bce8-9117f225b651",
    nombre: "Bustamante, Ailin",
    email: "ailin.bustamante@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "88e75230-baa9-487e-af0e-4c2e304e1f26",
    nombre: "Reartes, Maia",
    email: "maia.reartes@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "92837a42-c644-4bc3-8ec1-8e56e91ec5b5",
    nombre: "Tello, Marianela",
    email: "marianela.tello@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "ae30ff34-c741-461b-b760-8a53200f1941",
    nombre: "Viniegra, Agustín",
    email: "agustin.viniegra@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "b1ef4b29-6c25-4afa-8aca-66d2bb027bb6",
    nombre: "Acosta, Pamela",
    email: "pamela.acosta@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "b5375446-4177-41d6-a9e4-395808664251",
    nombre: "Simonetta, Valentina",
    email: "valentina.simonetta@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "b6090f19-1f81-48eb-8fd9-f57d86ec00a7",
    nombre: "Diaz, Milagros",
    email: "milagros.diaz@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "c0f98bf5-d67a-49b1-85b9-783b86233992",
    nombre: "Contreras, Gilary",
    email: "gilary.contreras@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "d455b4ea-d96c-4ea7-adcc-5feab89d1772",
    nombre: "Peralta, Belen",
    email: "belen.peralta@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "d6285e5d-23a7-4eeb-a7b2-7e4a6a2c8163",
    nombre: "Malqui, Xiomara",
    email: "xiomara.malqui@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "dbd31d0d-5277-4730-8702-69cc5ce20a0d",
    nombre: "Olmedo, Thomas",
    email: "thomas.olmedo@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "dc6a2244-d560-4219-bfb5-1dc5a094238f",
    nombre: "Gomez, Carla",
    email: "carla.gomez@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "ea60ff3a-17ec-416c-83a4-b4ca4634750c",
    nombre: "Bahamonde, Camila",
    email: "camila.bahamonde@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "f32521db-99de-404e-bbf3-f20e817ea832",
    nombre: "Ojeda, Luana",
    email: "luana.ojeda@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "f7fdc70a-7a21-4631-bb47-d68390cb2e01",
    nombre: "Luna, Oriana",
    email: "oriana.luna@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
];

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

function crearDevolucionInicial() {
  return {
    asesor: "",
    area: "Calidad",
    responsable: "Administrador",
    notaCalidad: "",
    aspectosCalidad: [],
    accionesCalidad: [],
    aspectosProductividad: [],
    accionesProductividad: [],
    tipificaciones: [],
    om: [],
    registroSistema: "",
    fortalezas: [],
    observaciones: "",
    devolucion: "",
  };
}

function crearAudioInicial() {
  return {
    asesor: "",
    area: "Calidad",
    responsable: "Administrador",
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
  };
}

function calcularEstado(reporte) {
  if (!reporte) return "POR DEBAJO DEL OBJETIVO";

  const nota = Number(reporte.nota);
  const sph = Number(reporte.sph);
  const objetivoSph = Number(reporte.objetivo_sph);

  const calidadOk =
    !Number.isNaN(nota) && nota >= 80;

  const productividadOk =
    !Number.isNaN(sph) &&
    !Number.isNaN(objetivoSph) &&
    sph >= objetivoSph;

  if (calidadOk && productividadOk) {
    return "SUPERADO";
  }

  if (calidadOk || productividadOk) {
    return "ALCANZADO";
  }

  return "POR DEBAJO DEL OBJETIVO";
}

export default function AdminPage() {
  const [usuario, setUsuario] = useState(null);
  const [asesores, setAsesores] = useState(ASESORES_BASE);
  const [reportes, setReportes] = useState([]);

  const [vista, setVista] = useState("inicio");
  const [subvista, setSubvista] = useState("");

  const [asesorSeleccionado, setAsesorSeleccionado] =
    useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroCampania, setFiltroCampania] =
    useState("Todas");
  const [filtroEstado, setFiltroEstado] =
    useState("Todos");

  const [semanaSeleccionada, setSemanaSeleccionada] =
    useState("Semana 4 · Agosto");

  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const [reporte, setReporte] = useState({
    asesor: "",
    semana: "Semana 4 · Agosto",
    campania: "BM",
    nota: "",
    objetivo: "",
    evolucion: "",
    desvio: "",
    recomendacion: "",
    auditoria: "",
    observacionesCalidad: "",
    sph: "",
    objetivoSph: "",
    ventas: "",
    objetivoVentas: "",
    objetivoCampania: "",
    descripcionCampania: "",
    observacionesProductividad: "",
    tipificacionesAuditadas: [],
    desvioTipificaciones: "",
    objetivoTipificaciones: "",
    resultadoTipificaciones: "",
    compromisoTipificaciones: "",
    observacionesTipificaciones: "",
    cantidadNoVentas: "",
    coachingNoVentas: "",
    registroNoVentas: "",
    compromisoNoVentas: "",
    principalesOM: [],
    fortalezas: [],
    observacionesNoVentas: "",
  });

  const [devolucion, setDevolucion] =
    useState(crearDevolucionInicial());

  const [audio, setAudio] =
    useState(crearAudioInicial());

  const [pda, setPda] =
    useState(crearPdaInicial());

  const [felicitacion, setFelicitacion] = useState({
    asesor: "",
    fecha: new Date().toISOString().slice(0, 10),
    motivo: "",
    observaciones: "",
  });

  const [feedback, setFeedback] = useState({
    asesor: "",
    fecha: new Date().toISOString().slice(0, 10),
    tipo: "Feedback individual",
    tema: "",
    observaciones: "",
  });

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
      ]);
    } catch (error) {
      console.error(error);
      setMensaje(
        "❌ No se pudo verificar el acceso."
      );
    }

    setCargando(false);
  }

  async function cargarAsesores() {
    try {
      const response = await fetch(
        "/api/admin/usuarios",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      const lista = Array.isArray(data)
        ? data
        : data?.usuarios || data?.data || [];

      if (lista.length > 0) {
        const soloAsesores = lista.filter(
          (item) =>
            item.rol === "asesor" &&
            item.activo !== false
        );

        if (soloAsesores.length > 0) {
          setAsesores(soloAsesores);
        }
      }
    } catch (error) {
      console.error(error);
    }
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

  async function cerrarSesion() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  function cambiarVista(nombre) {
    setVista(nombre);
    setSubvista("");
    setMensaje("");
  }

  function seleccionarAsesor(asesor) {
    setAsesorSeleccionado(asesor);
    setVista("asesor");
  }

  function abrirReporte(asesor = null) {
    const elegido =
      asesor ||
      asesorSeleccionado ||
      asesores[0];

    setReporte((prev) => ({
      ...prev,
      asesor: elegido?.email || "",
      semana: semanaSeleccionada,
    }));

    setVista("nuevo-reporte");
  }

  function actualizarReporte(campo, valor) {
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

  function actualizarFelicitacion(
    campo,
    valor
  ) {
    setFelicitacion((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function actualizarFeedback(
    campo,
    valor
  ) {
    setFeedback((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function toggleArray(
    array,
    valor
  ) {
    if (array.includes(valor)) {
      return array.filter(
        (item) => item !== valor
      );
    }

    return [...array, valor];
  }

  async function guardarReporte() {
    const asesor = asesores.find(
      (item) =>
        item.email === reporte.asesor
    );

    if (!reporte.asesor) {
      setMensaje(
        "❌ Seleccioná un asesor."
      );
      return;
    }

    const datos = {
      usuario: reporte.asesor,
      asesor:
        asesor?.nombre ||
        reporte.asesor,
      semana: reporte.semana,
      nota:
        reporte.nota === ""
          ? null
          : Number(reporte.nota),
      evolucion:
        reporte.evolucion || null,
      objetivo:
        reporte.objetivo || null,
      desvio:
        reporte.desvio || null,
      recomendacion:
        reporte.recomendacion || null,
      auditoria:
        reporte.auditoria || null,
      producto:
        reporte.campania || null,
      observaciones:
        [
          reporte.observacionesCalidad,
          reporte.observacionesProductividad,
          reporte.observacionesTipificaciones,
          reporte.observacionesNoVentas,
        ]
          .filter(Boolean)
          .join("\n\n") || null,
      sph:
        reporte.sph === ""
          ? null
          : Number(reporte.sph),
      objetivo_sph:
        reporte.objetivoSph === ""
          ? null
          : Number(
              reporte.objetivoSph
            ),
      ventas:
        reporte.ventas === ""
          ? null
          : Number(reporte.ventas),
      objetivo_ventas:
        reporte.objetivoVentas === ""
          ? null
          : Number(
              reporte.objetivoVentas
            ),
      objetivo_campania:
        reporte.objetivoCampania || null,
      descripcion_campania:
        reporte.descripcionCampania ||
        null,
      estado_sph:
        reporte.sph !== "" &&
        reporte.objetivoSph !== ""
          ? Number(reporte.sph) >=
            Number(
              reporte.objetivoSph
            )
            ? "Alcanzado"
            : "Por debajo del objetivo"
          : null,
      estado_ventas:
        reporte.ventas !== "" &&
        reporte.objetivoVentas !== ""
          ? Number(reporte.ventas) >=
            Number(
              reporte.objetivoVentas
            )
            ? "Alcanzado"
            : "Por debajo del objetivo"
          : null,
      estado_campania:
        reporte.nota !== "" &&
        Number(reporte.nota) >= 80
          ? "Alcanzado"
          : null,
      gestion:
        reporte.coachingNoVentas ||
        null,
    };

    setMensaje("Guardando reporte...");

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

    setMensaje(
      "✓ REPORTE GUARDADO CORRECTAMENTE"
    );

    await cargarReportes();
  }

  function limpiarReporte() {
    setReporte({
      asesor: "",
      semana: semanaSeleccionada,
      campania: "BM",
      nota: "",
      objetivo: "",
      evolucion: "",
      desvio: "",
      recomendacion: "",
      auditoria: "",
      observacionesCalidad: "",
      sph: "",
      objetivoSph: "",
      ventas: "",
      objetivoVentas: "",
      objetivoCampania: "",
      descripcionCampania: "",
      observacionesProductividad: "",
      tipificacionesAuditadas: [],
      desvioTipificaciones: "",
      objetivoTipificaciones: "",
      resultadoTipificaciones: "",
      compromisoTipificaciones: "",
      observacionesTipificaciones: "",
      cantidadNoVentas: "",
      coachingNoVentas: "",
      registroNoVentas: "",
      compromisoNoVentas: "",
      principalesOM: [],
      fortalezas: [],
      observacionesNoVentas: "",
    });
  }

  function guardarDevolucionLocal() {
    if (!devolucion.asesor) {
      setMensaje(
        "❌ Seleccioná un asesor."
      );
      return;
    }

    setMensaje(
      "✓ DEVOLUCIÓN CARGADA CORRECTAMENTE"
    );
  }

  function guardarAudioLocal() {
    if (!audio.asesor) {
      setMensaje(
        "❌ Seleccioná un asesor."
      );
      return;
    }

    if (!audio.archivo) {
      setMensaje(
        "❌ Seleccioná un archivo de audio."
      );
      return;
    }

    setMensaje(
      "✓ AUDIO CARGADO CORRECTAMENTE"
    );
  }

  function guardarPdaLocal() {
    if (!pda.asesor) {
      setMensaje(
        "❌ Seleccioná un asesor."
      );
      return;
    }

    setMensaje(
      "✓ PLAN DE ACCIÓN CARGADO CORRECTAMENTE"
    );
  }

  const asesoresFiltrados = useMemo(() => {
    return asesores.filter((asesor) => {
      const coincideBusqueda =
        !busqueda ||
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
        campania === filtroCampania ||
        (filtroCampania === "BM" &&
          campania === "BM") ||
        (filtroCampania === "AP" &&
          campania === "AP");

      const estado =
        calcularEstado(
          reporteAsesor
        );

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
    const cantidadAsesores =
      asesores.length;

    const cantidadReportes =
      new Set(
        reportes
          .filter(
            (r) =>
              r.semana ===
              semanaSeleccionada
          )
          .map(
            (r) =>
              r.usuario ||
              r.asesor
          )
      ).size;

    return {
      asesores:
        cantidadAsesores,
      reportes:
        cantidadReportes,
      devoluciones: "—",
      anulaciones: "—",
    };
  }, [
    asesores,
    reportes,
    semanaSeleccionada,
  ]);

  if (cargando) {
    return (
      <main style={styles.page}>
        <div style={styles.centerBox}>
          <div style={styles.card}>
            <h2>
              Portal de Calidad
            </h2>
            <p style={styles.muted}>
              Cargando panel de
              administración...
            </p>
          </div>
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

            {usuario?.email && (
              <p style={styles.adminText}>
                Administrador:{" "}
                <strong>
                  {usuario.email}
                </strong>
              </p>
            )}
          </div>

          <button
            onClick={cerrarSesion}
            style={styles.secondaryButton}
          >
            Cerrar sesión
          </button>
        </header>

        <nav style={styles.nav}>
          {[
            ["inicio", "Inicio"],
            ["semanas", "Semanas"],
            ["asesores", "Asesores"],
            ["reportes", "Reportes"],
            ["devoluciones", "Devoluciones"],
            ["audios", "Audios"],
            ["felicitaciones", "Felicitaciones"],
            ["feedback", "Feedback"],
            ["pda", "Planes de Acción"],
            ["tipificaciones", "Tipificaciones"],
            ["noventas", "No Ventas"],
            ["seguimiento", "Seguimiento"],
          ].map(([id, texto]) => (
            <button
              key={id}
              onClick={() =>
                cambiarVista(id)
              }
              style={{
                ...styles.navButton,
                ...(vista === id
                  ? styles.navButtonActive
                  : {}),
              }}
            >
              {texto}
            </button>
          ))}
        </nav>

        {mensaje && (
          <div style={styles.message}>
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
            semana={
              semanaSeleccionada
            }
            setSemana={
              setSemanaSeleccionada
            }
          />
        )}

        {vista === "semanas" && (
          <Semanas
            semana={
              semanaSeleccionada
            }
            setSemana={
              setSemanaSeleccionada
            }
            reportes={reportes}
            asesores={asesores}
            cambiarVista={
              cambiarVista
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

        {vista === "asesor" && (
          <FichaAsesor
            asesor={
              asesorSeleccionado
            }
            reportes={reportes}
            volver={() =>
              setVista("asesores")
            }
            abrirReporte={
              abrirReporte
            }
            cargarDevolucion={() => {
              setDevolucion(
                (prev) => ({
                  ...prev,
                  asesor:
                    asesorSeleccionado?.email ||
                    "",
                })
              );
              setVista(
                "devoluciones"
              );
            }}
            nuevoPda={() => {
              setPda(
                (prev) => ({
                  ...prev,
                  asesor:
                    asesorSeleccionado?.email ||
                    "",
                })
              );
              setVista("pda");
            }}
          />
        )}

        {vista === "reportes" && (
          <ListaReportes
            reportes={reportes}
            asesores={asesores}
            abrirReporte={
              abrirReporte
            }
            semana={
              semanaSeleccionada
            }
            setSemana={
              setSemanaSeleccionada
            }
          />
        )}

        {vista === "nuevo-reporte" && (
          <FormularioReporte
            reporte={reporte}
            actualizar={
              actualizarReporte
            }
            asesores={asesores}
            guardar={
              guardarReporte
            }
            volver={() =>
              setVista("reportes")
            }
            limpiar={
              limpiarReporte
            }
          />
        )}

        {vista === "devoluciones" && (
          <Devoluciones
            datos={devolucion}
            actualizar={
              actualizarDevolucion
            }
            asesores={asesores}
            guardar={
              guardarDevolucionLocal
            }
            cambiarVista={
              cambiarVista
            }
          />
        )}

        {vista === "audios" && (
          <Audios
            datos={audio}
            actualizar={
              actualizarAudio
            }
            asesores={asesores}
            guardar={
              guardarAudioLocal
            }
          />
        )}

        {vista === "felicitaciones" && (
          <Felicitaciones
            datos={felicitacion}
            actualizar={
              actualizarFelicitacion
            }
            asesores={asesores}
          />
        )}

        {vista === "feedback" && (
          <Feedback
            datos={feedback}
            actualizar={
              actualizarFeedback
            }
            asesores={asesores}
          />
        )}

        {vista === "pda" && (
          <Pda
            datos={pda}
            actualizar={
              actualizarPda
            }
            asesores={asesores}
            guardar={
              guardarPdaLocal
            }
          />
        )}

        {vista === "tipificaciones" && (
          <ModuloSimple
            titulo="Tipificaciones"
            descripcion="Consulta de resultados, objetivos, desvíos, evolución y devoluciones."
            reportes={reportes}
            asesores={asesores}
            tipo="tipificaciones"
          />
        )}

        {vista === "noventas" && (
          <ModuloSimple
            titulo="No Ventas"
            descripcion="Consulta de gestiones, resultados, aspectos trabajados, devoluciones y evolución."
            reportes={reportes}
            asesores={asesores}
            tipo="noventas"
          />
        )}

        {vista === "seguimiento" && (
          <Seguimiento
            asesores={asesores}
            reportes={reportes}
            seleccionarAsesor={
              seleccionarAsesor
            }
          />
        )}
      </div>
    </main>
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
  semana,
  setSemana,
}) {
  return (
    <>
      <section style={styles.card}>
        <div style={styles.weekRow}>
          <div>
            <p style={styles.muted}>
              Semana
            </p>

            <select
              value={semana}
              onChange={(e) =>
                setSemana(
                  e.target.value
                )
              }
              style={styles.smallSelect}
            >
              {SEMANAS.map(
                (item) => (
                  <option
                    key={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <Stat
            title="ASESORES"
            value={
              estadisticas.asesores
            }
          />

          <Stat
            title="REPORTES CARGADOS"
            value={
              estadisticas.reportes
            }
          />

          <Stat
            title="DEVOLUCIONES PENDIENTES"
            value={
              estadisticas.devoluciones
            }
          />

          <Stat
            title="ANULACIONES"
            value={
              estadisticas.anulaciones
            }
          />
        </div>
      </section>

      <section style={styles.card}>
        <div style={styles.sectionHeader}>
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
            style={styles.primaryButton}
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
            <option>
              POR DEBAJO DEL OBJETIVO
            </option>
            <option>
              ALCANZADO
            </option>
            <option>
              SUPERADO
            </option>
          </select>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Asesor</th>
                <th>Cuenta</th>
                <th>Calidad</th>
                <th>SPH</th>
                <th>PDA</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {asesores.map(
                (asesor) => {
                  const reporte =
                    reportes.find(
                      (r) =>
                        r.usuario ===
                          asesor.email ||
                        r.asesor ===
                          asesor.nombre
                    );

                  const estado =
                    calcularEstado(
                      reporte
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
                        {reporte?.producto ||
                          "—"}
                      </td>

                      <td>
                        {reporte?.nota ??
                          "—"}
                      </td>

                      <td>
                        {reporte?.sph ??
                          "—"}
                      </td>

                      <td>
                        —
                      </td>

                      <td>
                        <Estado
                          estado={
                            estado
                          }
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

function Semanas({
  semana,
  setSemana,
  reportes,
  asesores,
  cambiarVista,
}) {
  const reportesSemana =
    reportes.filter(
      (r) =>
        r.semana === semana
    );

  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <div>
          <h2>
            Semanas
          </h2>

          <p style={styles.muted}>
            Organización de toda la
            información semanal.
          </p>
        </div>

        <select
          value={semana}
          onChange={(e) =>
            setSemana(
              e.target.value
            )
          }
          style={styles.smallSelect}
        >
          {SEMANAS.map(
            (item) => (
              <option
                key={item}
              >
                {item}
              </option>
            )
          )}
        </select>
      </div>

      <div style={styles.moduleGrid}>
        {[
          [
            "REPORTES",
            reportesSemana.length,
            "reportes",
          ],
          [
            "DEVOLUCIONES",
            "—",
            "devoluciones",
          ],
          [
            "AUDIOS",
            "—",
            "audios",
          ],
          [
            "PLANES DE ACCIÓN",
            "—",
            "pda",
          ],
          [
            "TIPIFICACIONES",
            "—",
            "tipificaciones",
          ],
          [
            "NO VENTAS",
            "—",
            "noventas",
          ],
          [
            "SEGUIMIENTO",
            "—",
            "seguimiento",
          ],
          [
            "FELICITACIONES",
            "—",
            "felicitaciones",
          ],
        ].map(
          ([titulo, valor, vista]) => (
            <button
              key={titulo}
              onClick={() =>
                cambiarVista(
                  vista
                )
              }
              style={
                styles.moduleCard
              }
            >
              <strong>
                {titulo}
              </strong>
              <span>
                {valor}
              </span>
            </button>
          )
        )}
      </div>

      <div style={styles.infoBox}>
        <strong>
          Resumen de la semana
        </strong>

        <p style={styles.muted}>
          {reportesSemana.length}{" "}
          reportes cargados para{" "}
          {asesores.length} asesores.
        </p>
      </div>
    </section>
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
      <div style={styles.sectionHeader}>
        <div>
          <h2>
            Asesores
          </h2>

          <p style={styles.muted}>
            Base de datos visual de
            todos los asesores.
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

      <div style={styles.advisorGrid}>
        {asesores.map(
          (asesor) => {
            const reporte =
              reportes.find(
                (r) =>
                  r.usuario ===
                    asesor.email ||
                  r.asesor ===
                    asesor.nombre
              );

            return (
              <div
                key={asesor.id}
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
                  {asesor.email}
                </p>

                <div
                  style={
                    styles.miniMetrics
                  }
                >
                  <span>
                    Calidad:{" "}
                    {reporte?.nota ??
                      "—"}
                  </span>

                  <span>
                    SPH:{" "}
                    {reporte?.sph ??
                      "—"}
                  </span>
                </div>

                <Estado
                  estado={
                    calcularEstado(
                      reporte
                    )
                  }
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
  volver,
  abrirReporte,
  cargarDevolucion,
  nuevoPda,
}) {
  if (!asesor) {
    return (
      <section style={styles.card}>
        <h2>
          No hay asesor seleccionado
        </h2>

        <button
          onClick={volver}
          style={
            styles.secondaryButton
          }
        >
          Volver
        </button>
      </section>
    );
  }

  const reporte =
    reportes.find(
      (r) =>
        r.usuario ===
          asesor.email ||
        r.asesor ===
          asesor.nombre
    );

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

      <div
        style={{
          marginTop: 20,
        }}
      >
        <h2>
          {asesor.nombre}
        </h2>

        <p style={styles.muted}>
          {asesor.email}
        </p>
      </div>

      <div style={styles.profileTabs}>
        <span>
          CALIDAD
        </span>
        <span>
          PRODUCTIVIDAD
        </span>
        <span>
          TIPIFICACIONES
        </span>
        <span>
          NO VENTAS
        </span>
        <span>
          AUDIOS
        </span>
        <span>
          PDA
        </span>
        <span>
          EVOLUCIÓN
        </span>
      </div>

      <div style={styles.statsGrid}>
        <Stat
          title="CALIDAD"
          value={
            reporte?.nota ?? "—"
          }
        />

        <Stat
          title="SPH"
          value={
            reporte?.sph ?? "—"
          }
        />

        <Stat
          title="VENTAS"
          value={
            reporte?.ventas ?? "—"
          }
        />

        <div style={styles.stat}>
          <small>ESTADO</small>
          <Estado
            estado={
              calcularEstado(
                reporte
              )
            }
          />
        </div>
      </div>

      <div style={styles.actionRow}>
        <button
          onClick={() =>
            abrirReporte(
              asesor
            )
          }
          style={styles.primaryButton}
        >
          + CARGAR REPORTE
        </button>

        <button
          onClick={
            cargarDevolucion
          }
          style={styles.secondaryButton}
        >
          + CARGAR DEVOLUCIÓN
        </button>

        <button
          onClick={nuevoPda}
          style={styles.secondaryButton}
        >
          + NUEVO PDA
        </button>
      </div>
    </section>
  );
}

function ListaReportes({
  reportes,
  asesores,
  abrirReporte,
  semana,
  setSemana,
}) {
  const filtrados =
    reportes.filter(
      (r) =>
        !semana ||
        r.semana === semana
    );

  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <div>
          <h2>
            Reportes
          </h2>

          <p style={styles.muted}>
            Reportes semanales de
            calidad y productividad.
          </p>
        </div>

        <button
          onClick={() =>
            abrirReporte()
          }
          style={styles.primaryButton}
        >
          + NUEVO REPORTE
        </button>
      </div>

      <div style={styles.filters}>
        <select
          value={semana}
          onChange={(e) =>
            setSemana(
              e.target.value
            )
          }
          style={styles.input}
        >
          {SEMANAS.map(
            (item) => (
              <option
                key={item}
              >
                {item}
              </option>
            )
          )}
        </select>

        <button
          onClick={() =>
            window.print()
          }
          style={styles.secondaryButton}
        >
          IMPRIMIR
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Asesor</th>
              <th>Semana</th>
              <th>Cuenta</th>
              <th>Nota</th>
              <th>SPH</th>
              <th>Ventas</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map(
              (r) => (
                <tr key={r.id}>
                  <td>
                    {r.asesor ||
                      asesores.find(
                        (a) =>
                          a.email ===
                          r.usuario
                      )?.nombre ||
                      "—"}
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
                    {r.nota ?? "—"}
                  </td>

                  <td>
                    {r.sph ?? "—"}
                  </td>

                  <td>
                    {r.ventas ?? "—"}
                  </td>

                  <td>
                    <Estado
                      estado={
                        calcularEstado(
                          r
                        )
                      }
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.printBox}>
        <strong>
          IMPRESIÓN MASIVA
        </strong>

        <p style={styles.muted}>
          Seleccioná la semana y
          utilizá IMPRIMIR para
          generar el documento.
        </p>

        <button
          onClick={() =>
            window.print()
          }
          style={styles.primaryButton}
        >
          IMPRIMIR SELECCIONADOS
        </button>
      </div>
    </section>
  );
}

function FormularioReporte({
  reporte,
  actualizar,
  asesores,
  guardar,
  volver,
  limpiar,
}) {
  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
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
              marginTop: 18,
            }}
          >
            Nuevo reporte
          </h2>
        </div>
      </div>

      <div style={styles.formGrid}>
        <SelectField
          label="Asesor"
          value={reporte.asesor}
          onChange={(v) =>
            actualizar(
              "asesor",
              v
            )
          }
          options={asesores.map(
            (a) => ({
              value: a.email,
              label: a.nombre,
            })
          )}
          placeholder="Seleccionar asesor"
        />

        <SelectField
          label="Semana"
          value={reporte.semana}
          onChange={(v) =>
            actualizar(
              "semana",
              v
            )
          }
          options={SEMANAS.map(
            (item) => ({
              value: item,
              label: item,
            })
          )}
        />

        <SelectField
          label="Campaña"
          value={
            reporte.campania
          }
          onChange={(v) =>
            actualizar(
              "campania",
              v
            )
          }
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
            value={reporte.nota}
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
        </div>

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
          type="textarea"
        />

        <Field
          label="Desvíos con mayor porcentaje de la semana"
          value={reporte.desvio}
          onChange={(v) =>
            actualizar(
              "desvio",
              v
            )
          }
          type="textarea"
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
          type="textarea"
        />

        <MultiSelect
          label="Aspectos trabajados"
          options={CALIDAD}
          values={
            reporte.aspectosCalidad ||
            []
          }
          onChange={(values) =>
            actualizar(
              "aspectosCalidad",
              values
            )
          }
        />

        <MultiSelect
          label="Acciones"
          options={
            ACCIONES_CALIDAD
          }
          values={
            reporte.accionesCalidad ||
            []
          }
          onChange={(values) =>
            actualizar(
              "accionesCalidad",
              values
            )
          }
        />

        <Field
          label="Observaciones"
          value={
            reporte.observacionesCalidad
          }
          onChange={(v) =>
            actualizar(
              "observacionesCalidad",
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
            value={reporte.sph}
            onChange={(v) =>
              actualizar(
                "sph",
                v
              )
            }
            type="number"
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
          />

          <Field
            label="Ventas"
            value={reporte.ventas}
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
          type="number"
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
          options={
            PRODUCTIVIDAD
          }
          values={
            reporte.aspectosProductividad ||
            []
          }
          onChange={(values) =>
            actualizar(
              "aspectosProductividad",
              values
            )
          }
        />

        <MultiSelect
          label="Acciones"
          options={
            ACCIONES_PRODUCTIVIDAD
          }
          values={
            reporte.accionesProductividad ||
            []
          }
          onChange={(values) =>
            actualizar(
              "accionesProductividad",
              values
            )
          }
        />

        <Field
          label="Observaciones"
          value={
            reporte.observacionesProductividad
          }
          onChange={(v) =>
            actualizar(
              "observacionesProductividad",
              v
            )
          }
          type="textarea"
        />
      </FormSection>

      <FormSection title="TIPIFICACIONES">
        <MultiSelect
          label="Tipificaciones auditadas"
          options={
            TIPIFICACIONES
          }
          values={
            reporte.tipificacionesAuditadas ||
            []
          }
          onChange={(values) =>
            actualizar(
              "tipificacionesAuditadas",
              values
            )
          }
        />

        <div style={styles.formGrid}>
          <Field
            label="Desvío"
            value={
              reporte.desvioTipificaciones
            }
            onChange={(v) =>
              actualizar(
                "desvioTipificaciones",
                v
              )
            }
            type="number"
          />

          <Field
            label="Objetivo"
            value={
              reporte.objetivoTipificaciones
            }
            onChange={(v) =>
              actualizar(
                "objetivoTipificaciones",
                v
              )
            }
            type="number"
          />

          <Field
            label="Resultado"
            value={
              reporte.resultadoTipificaciones
            }
            onChange={(v) =>
              actualizar(
                "resultadoTipificaciones",
                v
              )
            }
            type="number"
          />
        </div>

        <SelectField
          label="Compromiso"
          value={
            reporte.compromisoTipificaciones
          }
          onChange={(v) =>
            actualizar(
              "compromisoTipificaciones",
              v
            )
          }
          options={[
            "APLICA DEVOLUCION",
            "SEGUIMIENTO",
            "NO APLICA",
          ].map((x) => ({
            value: x,
            label: x,
          }))}
          placeholder="Seleccionar"
        />

        <Field
          label="Observaciones"
          value={
            reporte.observacionesTipificaciones
          }
          onChange={(v) =>
            actualizar(
              "observacionesTipificaciones",
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
            reporte.cantidadNoVentas
          }
          onChange={(v) =>
            actualizar(
              "cantidadNoVentas",
              v
            )
          }
          type="number"
        />

        <Field
          label="Coaching"
          value={
            reporte.coachingNoVentas
          }
          onChange={(v) =>
            actualizar(
              "coachingNoVentas",
              v
            )
          }
          type="textarea"
        />

        <SelectField
          label="Registro en sistema"
          value={
            reporte.registroNoVentas
          }
          onChange={(v) =>
            actualizar(
              "registroNoVentas",
              v
            )
          }
          options={[
            "Correcto",
            "Incorrecto",
          ].map((x) => ({
            value: x,
            label: x,
          }))}
          placeholder="Seleccionar"
        />

        <SelectField
          label="Compromiso"
          value={
            reporte.compromisoNoVentas
          }
          onChange={(v) =>
            actualizar(
              "compromisoNoVentas",
              v
            )
          }
          options={[
            "APLICA DEVOLUCION",
            "SEGUIMIENTO",
            "NO APLICA",
          ].map((x) => ({
            value: x,
            label: x,
          }))}
          placeholder="Seleccionar"
        />

        <MultiSelect
          label="Principales O.M."
          options={OM}
          values={
            reporte.principalesOM ||
            []
          }
          onChange={(values) =>
            actualizar(
              "principalesOM",
              values
            )
          }
        />

        <MultiSelect
          label="Fortalezas"
          options={
            FORTALEZAS
          }
          values={
            reporte.fortalezas ||
            []
          }
          onChange={(values) =>
            actualizar(
              "fortalezas",
              values
            )
          }
        />

        <Field
          label="Observaciones"
          value={
            reporte.observacionesNoVentas
          }
          onChange={(v) =>
            actualizar(
              "observacionesNoVentas",
              v
            )
          }
          type="textarea"
        />
      </FormSection>

      <div style={styles.actionRow}>
        <button
          onClick={guardar}
          style={styles.primaryButton}
        >
          GUARDAR REPORTE
        </button>

        <button
          onClick={limpiar}
          style={
            styles.secondaryButton
          }
        >
          LIMPIAR
        </button>
      </div>
    </section>
  );
}

function Devoluciones({
  datos,
  actualizar,
  asesores,
  guardar,
}) {
  return (
    <section style={styles.card}>
      <h2>
        Devoluciones
      </h2>

      <p style={styles.muted}>
        Nueva devolución. No es
        obligatorio completar
        todos los puntos.
      </p>

      <SelectField
        label="Asesor"
        value={datos.asesor}
        onChange={(v) =>
          actualizar(
            "asesor",
            v
          )
        }
        options={asesores.map(
          (a) => ({
            value: a.email,
            label: a.nombre,
          })
        )}
        placeholder="Seleccionar asesor"
      />

      <div style={styles.formGrid}>
        <SelectField
          label="Área"
          value={datos.area}
          onChange={(v) =>
            actualizar(
              "area",
              v
            )
          }
          options={AREAS.map(
            (x) => ({
              value: x,
              label: x,
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
      </div>

      <FormSection title="CALIDAD">
        <MultiSelect
          label="Aspectos trabajados"
          options={CALIDAD}
          values={
            datos.aspectosCalidad
          }
          onChange={(v) =>
            actualizar(
              "aspectosCalidad",
              v
            )
          }
        />

        <MultiSelect
          label="Acciones"
          options={
            ACCIONES_CALIDAD
          }
          values={
            datos.accionesCalidad
          }
          onChange={(v) =>
            actualizar(
              "accionesCalidad",
              v
            )
          }
        />
      </FormSection>

      <FormSection title="PRODUCTIVIDAD">
        <MultiSelect
          label="Aspectos trabajados"
          options={
            PRODUCTIVIDAD
          }
          values={
            datos.aspectosProductividad
          }
          onChange={(v) =>
            actualizar(
              "aspectosProductividad",
              v
            )
          }
        />

        <MultiSelect
          label="Acciones"
          options={
            ACCIONES_PRODUCTIVIDAD
          }
          values={
            datos.accionesProductividad
          }
          onChange={(v) =>
            actualizar(
              "accionesProductividad",
              v
            )
          }
        />
      </FormSection>

      <FormSection title="TIPIFICACIONES">
        <MultiSelect
          label="Tipificación"
          options={
            TIPIFICACIONES
          }
          values={
            datos.tipificaciones
          }
          onChange={(v) =>
            actualizar(
              "tipificaciones",
              v
            )
          }
        />
      </FormSection>

      <FormSection title="NO VENTAS">
        <MultiSelect
          label="O.M."
          options={OM}
          values={datos.om}
          onChange={(v) =>
            actualizar(
              "om",
              v
            )
          }
        />

        <SelectField
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
          options={[
            "Correcto",
            "Incorrecto",
          ].map((x) => ({
            value: x,
            label: x,
          }))}
          placeholder="Seleccionar"
        />

        <MultiSelect
          label="Fortalezas destacadas"
          options={
            FORTALEZAS
          }
          values={
            datos.fortalezas
          }
          onChange={(v) =>
            actualizar(
              "fortalezas",
              v
            )
          }
        />
      </FormSection>

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
        style={styles.primaryButton}
      >
        GUARDAR DEVOLUCIÓN
      </button>
    </section>
  );
}

function Audios({
  datos,
  actualizar,
  asesores,
  guardar,
}) {
  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <div>
          <h2>
            Audios
          </h2>

          <p style={styles.muted}>
            Gestión de audios y
            devoluciones.
          </p>
        </div>

        <button
          onClick={() =>
            document
              .getElementById(
                "audioArchivo"
              )
              ?.click()
          }
          style={styles.primaryButton}
        >
          + SUBIR AUDIO
        </button>
      </div>

      <input
        id="audioArchivo"
        type="file"
        accept="audio/*"
        style={{
          display: "none",
        }}
        onChange={(e) =>
          actualizar(
            "archivo",
            e.target.files?.[0] ||
              null
          )
        }
      />

      {datos.archivo && (
        <div style={styles.fileBox}>
          Archivo seleccionado:{" "}
          <strong>
            {datos.archivo.name}
          </strong>
        </div>
      )}

      <SelectField
        label="Asesor"
        value={datos.asesor}
        onChange={(v) =>
          actualizar(
            "asesor",
            v
          )
        }
        options={asesores.map(
          (a) => ({
            value: a.email,
            label: a.nombre,
          })
        )}
        placeholder="Seleccionar asesor"
      />

      <SelectField
        label="¿A qué corresponde?"
        value={datos.area}
        onChange={(v) =>
          actualizar(
            "area",
            v
          )
        }
        options={[
          "Calibración de Calidad",
          "Productividad",
          "Tipificaciones",
          "No Ventas",
        ].map((x) => ({
          value: x,
          label: x,
        }))}
      />

      <div style={styles.formGrid}>
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
          value={datos.fecha}
          onChange={(v) =>
            actualizar(
              "fecha",
              v
            )
          }
          type="date"
        />
      </div>

      <MultiSelect
        label="Aspectos trabajados CALIDAD"
        options={CALIDAD}
        values={
          datos.aspectosCalidad
        }
        onChange={(v) =>
          actualizar(
            "aspectosCalidad",
            v
          )
        }
      />

      <MultiSelect
        label="Aspectos trabajados PRODUCTIVIDAD"
        options={
          PRODUCTIVIDAD
        }
        values={
          datos.aspectosProductividad
        }
        onChange={(v) =>
          actualizar(
            "aspectosProductividad",
            v
          )
        }
      />

      <MultiSelect
        label="Tipificación"
        options={
          TIPIFICACIONES
        }
        values={
          datos.tipificaciones
        }
        onChange={(v) =>
          actualizar(
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
        style={styles.primaryButton}
      >
        GUARDAR AUDIO
      </button>

      <div style={styles.cardInner}>
        <h3>
          HISTORIAL DE AUDIOS
        </h3>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Asesor</th>
                <th>Área</th>
                <th>Responsable</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  —
                </td>
                <td>
                  —
                </td>
                <td>
                  —
                </td>
                <td>
                  —
                </td>
                <td>
                  Pendiente
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Felicitaciones({
  datos,
  actualizar,
  asesores,
}) {
  return (
    <section style={styles.card}>
      <h2>
        Felicitaciones
      </h2>

      <p style={styles.muted}>
        Registro de reconocimientos
        y buenas prácticas de los
        asesores.
      </p>

      <SelectField
        label="Asesor"
        value={datos.asesor}
        onChange={(v) =>
          actualizar(
            "asesor",
            v
          )
        }
        options={asesores.map(
          (a) => ({
            value: a.email,
            label: a.nombre,
          })
        )}
        placeholder="Seleccionar asesor"
      />

      <Field
        label="Fecha"
        value={datos.fecha}
        onChange={(v) =>
          actualizar(
            "fecha",
            v
          )
        }
        type="date"
      />

      <Field
        label="Motivo de la felicitación"
        value={datos.motivo}
        onChange={(v) =>
          actualizar(
            "motivo",
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
        onClick={() =>
          alert(
            "Felicitación preparada para guardar."
          )
        }
        style={styles.primaryButton}
      >
        GUARDAR FELICITACIÓN
      </button>
    </section>
  );
}

function Feedback({
  datos,
  actualizar,
  asesores,
}) {
  return (
    <section style={styles.card}>
      <h2>
        Feedback
      </h2>

      <p style={styles.muted}>
        Registro de feedback y
        acompañamiento realizado.
      </p>

      <SelectField
        label="Asesor"
        value={datos.asesor}
        onChange={(v) =>
          actualizar(
            "asesor",
            v
          )
        }
        options={asesores.map(
          (a) => ({
            value: a.email,
            label: a.nombre,
          })
        )}
        placeholder="Seleccionar asesor"
      />

      <Field
        label="Fecha"
        value={datos.fecha}
        onChange={(v) =>
          actualizar(
            "fecha",
            v
          )
        }
        type="date"
      />

      <SelectField
        label="Tipo"
        value={datos.tipo}
        onChange={(v) =>
          actualizar(
            "tipo",
            v
          )
        }
        options={[
          "Feedback individual",
          "Espacio de coaching",
          "Escucha en línea",
          "Devolución mediante Meet",
          "Escucha de llamada de un compañero",
          "Calibración conjunta de audio",
          "Otros",
        ].map((x) => ({
          value: x,
          label: x,
        }))}
      />

      <Field
        label="Tema trabajado"
        value={datos.tema}
        onChange={(v) =>
          actualizar(
            "tema",
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
        onClick={() =>
          alert(
            "Feedback preparado para guardar."
          )
        }
        style={styles.primaryButton}
      >
        GUARDAR FEEDBACK
      </button>
    </section>
  );
}

function Pda({
  datos,
  actualizar,
  asesores,
  guardar,
}) {
  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <div>
          <h2>
            Planes de Acción
          </h2>

          <p style={styles.muted}>
            Administración de todos
            los PDA.
          </p>
        </div>

        <button
          onClick={guardar}
          style={styles.primaryButton}
        >
          + NUEVO PLAN DE ACCIÓN
        </button>
      </div>

      <div style={styles.formGrid}>
        <SelectField
          label="Asesor"
          value={datos.asesor}
          onChange={(v) =>
            actualizar(
              "asesor",
              v
            )
          }
          options={asesores.map(
            (a) => ({
              value: a.email,
              label: a.nombre,
            })
          )}
          placeholder="Seleccionar asesor"
        />

        <Field
          label="Aspecto a trabajar"
          value={datos.aspecto}
          onChange={(v) =>
            actualizar(
              "aspecto",
              v
            )
          }
        />

        <Field
          label="Fecha desde"
          value={datos.desde}
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
          value={datos.hasta}
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
        value={datos.objetivo}
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

      <button
        onClick={guardar}
        style={styles.primaryButton}
      >
        GUARDAR PDA
      </button>

      <div style={styles.cardInner}>
        <h3>
          PDA ACTIVOS
        </h3>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Asesor</th>
                <th>Aspecto</th>
                <th>Desde</th>
                <th>Hasta</th>
                <th>Objetivo</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  —
                </td>
                <td>
                  —
                </td>
                <td>
                  —
                </td>
                <td>
                  —
                </td>
                <td>
                  —
                </td>
                <td>
                  Activo
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ModuloSimple({
  titulo,
  descripcion,
  reportes,
  asesores,
  tipo,
}) {
  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <div>
          <h2>
            {titulo}
          </h2>

          <p style={styles.muted}>
            {descripcion}
          </p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <Stat
          title="ASESORES"
          value={
            asesores.length
          }
        />

        <Stat
          title="REPORTES"
          value={
            reportes.length
          }
        />

        <Stat
          title="RESULTADO"
          value="—"
        />

        <Stat
          title="DEVOLUCIONES"
          value="—"
        />
      </div>

      <div style={styles.infoBox}>
        <strong>
          {tipo ===
          "tipificaciones"
            ? "Información de tipificaciones"
            : "Información de no ventas"}
        </strong>

        <p style={styles.muted}>
          Esta sección queda
          preparada para consultar
          resultados, objetivos,
          desvíos, evolución y
          devoluciones.
        </p>
      </div>
    </section>
  );
}

function Seguimiento({
  asesores,
  reportes,
  seleccionarAsesor,
}) {
  return (
    <section style={styles.card}>
      <h2>
        Seguimiento
      </h2>

      <p style={styles.muted}>
        Lista de pendientes del
        administrador.
      </p>

      <div style={styles.statsGrid}>
        <Stat
          title="PDA"
          value="—"
        />

        <Stat
          title="DEVOLUCIONES"
          value="—"
        />

        <Stat
          title="AUDIOS"
          value="—"
        />

        <Stat
          title="REPORTES"
          value={
            asesores.length -
            reportes.length >
            0
              ? asesores.length -
                reportes.length
              : 0
          }
        />
      </div>

      <div style={styles.cardInner}>
        <h3>
          ASESORES EN SEGUIMIENTO
        </h3>

        <div style={styles.advisorGrid}>
          {asesores.map(
            (asesor) => {
              const reporte =
                reportes.find(
                  (r) =>
                    r.usuario ===
                      asesor.email ||
                    r.asesor ===
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
                    estado={
                      calcularEstado(
                        reporte
                      )
                    }
                  />

                  <p style={styles.muted}>
                    Último reporte:{" "}
                    {reporte?.semana ||
                      "Pendiente"}
                  </p>

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
                    VER SEGUIMIENTO
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}

function FormSection({
  title,
  children,
}) {
  return (
    <div style={styles.formSection}>
      <h3>
        {title}
      </h3>

      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          style={
            styles.textarea
          }
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          style={styles.input}
        />
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label}
      </label>

      <select
        value={value || ""}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        style={styles.input}
      >
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => {
          const valueOption =
            typeof option ===
            "string"
              ? option
              : option.value;

          const labelOption =
            typeof option ===
            "string"
              ? option
              : option.label;

          return (
            <option
              key={
                valueOption
              }
              value={
                valueOption
              }
            >
              {labelOption}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function MultiSelect({
  label,
  options,
  values,
  onChange,
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label}
      </label>

      <div
        style={
          styles.multiSelect
        }
      >
        {options.map(
          (option) => {
            const activo =
              values.includes(
                option
              );

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
                  onChange={() =>
                    onChange(
                      toggleValue(
                        values,
                        option
                      )
                    )
                  }
                />

                <span>
                  {option}
                </span>
              </label>
            );
          }
        )}
      </div>
    </div>
  );
}

function toggleValue(
  values,
  value
) {
  return values.includes(value)
    ? values.filter(
        (item) =>
          item !== value
      )
    : [...values, value];
}

function Stat({
  title,
  value,
}) {
  return (
    <div style={styles.stat}>
      <small>
        {title}
      </small>

      <strong>
        {value}
      </strong>
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
      style={{
        ...styles.estado,
        ...style,
      }}
    >
      {estado}
    </span>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "25px",
    fontFamily:
      "Arial, sans-serif",
    color: "#20242a",
  },

  centerBox: {
    maxWidth: "500px",
    margin: "100px auto",
  },

  container: {
    maxWidth: "1400px",
    margin: "auto",
  },

  header: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "24px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.06)",
    marginBottom: "15px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
  },

  subtitle: {
    margin:
      "7px 0 0 0",
    color: "#68707b",
  },

  adminText: {
    margin:
      "8px 0 0 0",
    color: "#68707b",
    fontSize: "13px",
  },

  nav: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "10px",
    display: "flex",
    gap: "7px",
    flexWrap: "wrap",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },

  navButton: {
    border: "none",
    background: "#f1f3f5",
    color: "#444",
    padding:
      "10px 13px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
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
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.06)",
  },

  cardInner: {
    background: "#f8f9fa",
    borderRadius: "14px",
    padding: "20px",
    marginTop: "25px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  weekRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "15px",
  },

  stat: {
    background: "#f8f9fa",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  statStrong: {
    fontSize: "26px",
  },

  filters: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "12px",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border:
      "1px solid #d9dce3",
    fontSize: "14px",
    boxSizing:
      "border-box",
    background: "#ffffff",
  },

  smallSelect: {
    padding: "11px 14px",
    borderRadius: "10px",
    border:
      "1px solid #d9dce3",
    background: "#ffffff",
    fontSize: "14px",
  },

  textarea: {
    width: "100%",
    minHeight: "110px",
    padding: "12px",
    borderRadius: "10px",
    border:
      "1px solid #d9dce3",
    fontSize: "14px",
    boxSizing:
      "border-box",
    resize: "vertical",
    fontFamily:
      "Arial, sans-serif",
  },

  field: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    fontWeight: 600,
    fontSize: "13px",
    marginBottom: "7px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },

  formSection: {
    background: "#f8f9fa",
    borderRadius: "15px",
    padding: "20px",
    marginBottom: "20px",
  },

  formSection h3: {
    marginTop: 0,
  },

  multiSelect: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "8px",
  },

  multiOption: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px",
    borderRadius: "9px",
    border:
      "1px solid #e0e3e7",
    background: "#ffffff",
    fontSize: "13px",
    cursor: "pointer",
  },

  multiOptionActive: {
    border:
      "1px solid #9aa1a9",
    background: "#eef1f4",
    fontWeight: 600,
  },

  primaryButton: {
    border: "none",
    borderRadius: "10px",
    padding:
      "11px 17px",
    background: "#20242a",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
  },

  secondaryButton: {
    border:
      "1px solid #d7dbe0",
    borderRadius: "10px",
    padding:
      "10px 15px",
    background: "#ffffff",
    color: "#20242a",
    cursor: "pointer",
    fontWeight: 600,
  },

  linkButton: {
    border: "none",
    background: "transparent",
    color: "#20242a",
    cursor: "pointer",
    fontWeight: 700,
    textDecoration:
      "underline",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse:
      "collapse",
    fontSize: "14px",
  },

  advisorGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(270px, 1fr))",
    gap: "15px",
  },

  advisorCard: {
    background: "#f8f9fa",
    borderRadius: "14px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  miniMetrics: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    fontSize: "13px",
  },

  profileTabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    margin:
      "20px 0",
  },

  profileTabsSpan: {
    background: "#f1f3f5",
    padding:
      "9px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 700,
  },

  actionRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "20px",
  },

  estado: {
    display: "inline-block",
    padding:
      "6px 9px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: 800,
  },

  estadoRojo: {
    background: "#ffd9d9",
    color: "#a40000",
  },

  estadoVerde: {
    background: "#dff3df",
    color: "#276b27",
  },

  estadoSuperado: {
    background: "#bde8bd",
    color: "#145c14",
  },

  estadoNeutral: {
    background: "#eceff1",
    color: "#555",
  },

  message: {
    background: "#eef4ff",
    border:
      "1px solid #cddcff",
    borderRadius: "12px",
    padding: "14px",
    marginBottom: "18px",
    fontWeight: 600,
  },

  infoBox: {
    background: "#f5f7f9",
    borderRadius: "14px",
    padding: "18px",
    marginTop: "20px",
  },

  moduleGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },

  moduleCard: {
    border:
      "1px solid #e0e3e7",
    borderRadius: "14px",
    background: "#ffffff",
    padding: "22px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "10px",
    textAlign: "left",
  },

  printBox: {
    marginTop: "25px",
    padding: "20px",
    borderRadius: "14px",
    background: "#f8f9fa",
  },

  fileBox: {
    background: "#eef5ff",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "18px",
  },

  muted: {
    color: "#68707b",
  },
};
