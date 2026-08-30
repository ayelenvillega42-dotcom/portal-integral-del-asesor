
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

const CALIDAD_OPTIONS = [
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

const PRODUCTIVIDAD_OPTIONS = [
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

const TIPIFICACION_OPTIONS = [
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

const AREAS_AUDIO = [
  "Calibración de Calidad",
  "Productividad",
  "Tipificaciones",
  "No Ventas",
];

const ESTADOS = [
  "Por debajo del objetivo",
  "Alcanzado",
  "Superado",
];

function numero(valor) {
  if (valor === "" || valor === null || valor === undefined) {
    return null;
  }

  const n = Number(valor);
  return Number.isNaN(n) ? null : n;
}

function calcularEstado(reporte) {
  if (!reporte) return "Por debajo del objetivo";

  const calidad =
    Number(reporte.nota) >= Number(reporte.objetivo_calidad || 80);

  const productividad =
    Number(reporte.sph) >= Number(reporte.objetivo_sph || 0);

  if (calidad && productividad) return "Superado";
  if (calidad || productividad) return "Alcanzado";

  return "Por debajo del objetivo";
}

function estadoColor(estado) {
  if (estado === "Superado") {
    return {
      background: "#d8f5df",
      color: "#126b2d",
      border: "1px solid #a7dfb4",
    };
  }

  if (estado === "Alcanzado") {
    return {
      background: "#e8f8ec",
      color: "#28753c",
      border: "1px solid #bde6c7",
    };
  }

  return {
    background: "#fde3e3",
    color: "#a72a2a",
    border: "1px solid #efb5b5",
  };
}

function MultiSelect({
  title,
  options,
  values,
  onChange,
}) {
  function toggle(option) {
    if (values.includes(option)) {
      onChange(values.filter((item) => item !== option));
    } else {
      onChange([...values, option]);
    }
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={styles.label}>{title}</label>

      <div style={styles.multiBox}>
        {options.map((option) => {
          const seleccionado = values.includes(option);

          return (
            <button
              type="button"
              key={option}
              onClick={() => toggle(option)}
              style={{
                ...styles.multiOption,
                ...(seleccionado
                  ? styles.multiOptionActive
                  : {}),
              }}
            >
              {seleccionado ? "✓ " : ""}
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div style={styles.metric}>
      <div style={styles.metricTitle}>{title}</div>
      <div style={styles.metricValue}>{value}</div>
    </div>
  );
}

export default function AdminPage() {
  const [vista, setVista] = useState("inicio");

  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  const [asesores, setAsesores] = useState([]);
  const [reportes, setReportes] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroCampania, setFiltroCampania] = useState("Todas");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [semanaFiltro, setSemanaFiltro] = useState(
    "Semana 4 · Agosto"
  );

  const [mensaje, setMensaje] = useState("");

  const [asesorSeleccionado, setAsesorSeleccionado] =
    useState("");

  const [semana, setSemana] = useState(
    "Semana 4 · Agosto"
  );

  const [producto, setProducto] = useState("BM");

  const [nota, setNota] = useState("");
  const [objetivoCalidad, setObjetivoCalidad] =
    useState("80");
  const [evolucion, setEvolucion] = useState("");
  const [desvio, setDesvio] = useState("");
  const [recomendacion, setRecomendacion] =
    useState("");
  const [auditoria, setAuditoria] = useState("");
  const [observaciones, setObservaciones] =
    useState("");

  const [aspectosCalidad, setAspectosCalidad] =
    useState([]);

  const [aspectosProductividad, setAspectosProductividad] =
    useState([]);

  const [tipificaciones, setTipificaciones] =
    useState([]);

  const [sph, setSph] = useState("");
  const [objetivoSph, setObjetivoSph] =
    useState("");
  const [ventas, setVentas] = useState("");
  const [objetivoVentas, setObjetivoVentas] =
    useState("");
  const [objetivoCampania, setObjetivoCampania] =
    useState("");
  const [descripcionCampania, setDescripcionCampania] =
    useState("");

  const [estadoSph, setEstadoSph] = useState("");
  const [estadoVentas, setEstadoVentas] =
    useState("");
  const [estadoCampania, setEstadoCampania] =
    useState("");

  const [gestion, setGestion] = useState("");

  const [areaAudio, setAreaAudio] =
    useState("Calibración de Calidad");
  const [responsableAudio, setResponsableAudio] =
    useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [devolucionAudio, setDevolucionAudio] =
    useState("");

  const [pda, setPda] = useState({
    asesor: "",
    aspecto: "",
    desde: "",
    hasta: "",
    objetivo: "",
    metodologia: "",
    seguimiento: "",
    estado: "Activo",
  });

  useEffect(() => {
    verificarAdministrador();
  }, []);

  async function verificarAdministrador() {
    setCargando(true);

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error(error);
        setMensaje(
          "❌ No se pudo validar la sesión."
        );
        setCargando(false);
        return;
      }

      if (!user) {
        window.location.href = "/";
        return;
      }

      setUsuarioActual(user);

      if (
        user.email?.toLowerCase() !==
        ADMIN_EMAIL.toLowerCase()
      ) {
        window.location.href = "/";
        return;
      }

      await Promise.all([
        cargarAsesores(),
        cargarReportes(),
      ]);
    } catch (error) {
      console.error(error);
      setMensaje(
        "❌ Error al cargar el panel."
      );
    }

    setCargando(false);
  }

  async function cargarAsesores() {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("rol", "asesor")
      .eq("activo", true)
      .order("nombre", { ascending: true });

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
      .order("id", { ascending: false });

    if (error) {
      console.error(error);

      setMensaje(
        "❌ No se pudieron cargar los reportes: " +
          error.message
      );

      return;
    }

    setReportes(data || []);
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  function seleccionarAsesor(asesor) {
    setAsesorSeleccionado(
      asesor.email || asesor.usuario || asesor.nombre
    );

    setVista("reportes");
  }

  function limpiarReporte() {
    setAsesorSeleccionado("");
    setSemana("Semana 4 · Agosto");
    setProducto("BM");

    setNota("");
    setObjetivoCalidad("80");
    setEvolucion("");
    setDesvio("");
    setRecomendacion("");
    setAuditoria("");
    setObservaciones("");

    setAspectosCalidad([]);
    setAspectosProductividad([]);
    setTipificaciones([]);

    setSph("");
    setObjetivoSph("");
    setVentas("");
    setObjetivoVentas("");
    setObjetivoCampania("");
    setDescripcionCampania("");

    setEstadoSph("");
    setEstadoVentas("");
    setEstadoCampania("");
    setGestion("");

    setMensaje("");
  }

  async function guardarReporte(event) {
    event.preventDefault();

    if (!asesorSeleccionado) {
      setMensaje(
        "❌ Seleccioná un asesor."
      );
      return;
    }

    if (!semana) {
      setMensaje(
        "❌ Seleccioná una semana."
      );
      return;
    }

    const asesor = asesores.find(
      (item) =>
        item.email === asesorSeleccionado ||
        item.usuario === asesorSeleccionado ||
        item.nombre === asesorSeleccionado
    );

    const datos = {
      asesor:
        asesor?.nombre || asesorSeleccionado,
      usuario:
        asesor?.email ||
        asesor?.usuario ||
        asesorSeleccionado,
      semana,
      nota: numero(nota),
      evolucion,
      objetivo:
        objetivoCalidad ||
        "80",
      desvio,
      recomendacion,
      auditoria,
      producto,
      observaciones,
      sph: numero(sph),
      objetivo_sph: numero(objetivoSph),
      ventas: numero(ventas),
      objetivo_ventas: numero(
        objetivoVentas
      ),
      objetivo_campania:
        objetivoCampania,
      descripcion_campania:
        descripcionCampania,
      estado_sph: estadoSph,
      estado_ventas: estadoVentas,
      estado_campania:
        estadoCampania,
      gestion,
      aspectos_calidad:
        aspectosCalidad.join(" | "),
      aspectos_productividad:
        aspectosProductividad.join(" | "),
      tipificaciones:
        tipificaciones.join(" | "),
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

    setMensaje(
      "✓ Reporte guardado correctamente."
    );

    await cargarReportes();
  }

  function abrirNuevoReporte() {
    limpiarReporte();
    setVista("reportes");
  }

  const asesoresFiltrados = useMemo(() => {
    return asesores.filter((asesor) => {
      const texto =
        busqueda.toLowerCase();

      const coincideBusqueda =
        !texto ||
        asesor.nombre
          ?.toLowerCase()
          .includes(texto) ||
        asesor.email
          ?.toLowerCase()
          .includes(texto);

      const reporte = reportes.find(
        (r) =>
          (r.usuario === asesor.email ||
            r.usuario === asesor.usuario ||
            r.asesor === asesor.nombre) &&
          r.semana === semanaFiltro
      );

      const campania =
        reporte?.producto || "";

      const coincideCampania =
        filtroCampania === "Todas" ||
        campania === filtroCampania;

      const estado =
        calcularEstado(reporte);

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
    semanaFiltro,
  ]);

  const estadisticas = useMemo(() => {
    const reportesSemana =
      reportes.filter(
        (r) => r.semana === semanaFiltro
      );

    const pdaActivos = 0;
    const devoluciones = 0;
    const anulaciones = 0;

    return {
      asesores: asesores.length,
      pda: pdaActivos,
      devoluciones,
      anulaciones,
      reportes: reportesSemana.length,
    };
  }, [asesores, reportes, semanaFiltro]);

  const reporteSeleccionado = useMemo(() => {
    if (!asesorSeleccionado) return null;

    return reportes.find(
      (r) =>
        (r.usuario ===
          asesorSeleccionado ||
          r.asesor ===
            asesorSeleccionado) &&
        r.semana === semana
    );
  }, [
    reportes,
    asesorSeleccionado,
    semana,
  ]);

  useEffect(() => {
    if (!reporteSeleccionado) return;

    setNota(
      reporteSeleccionado.nota ?? ""
    );
    setEvolucion(
      reporteSeleccionado.evolucion || ""
    );
    setDesvio(
      reporteSeleccionado.desvio || ""
    );
    setRecomendacion(
      reporteSeleccionado.recomendacion ||
        ""
    );
    setAuditoria(
      reporteSeleccionado.auditoria || ""
    );
    setObservaciones(
      reporteSeleccionado.observaciones ||
        ""
    );

    setSph(
      reporteSeleccionado.sph ?? ""
    );
    setObjetivoSph(
      reporteSeleccionado.objetivo_sph ??
        ""
    );
    setVentas(
      reporteSeleccionado.ventas ?? ""
    );
    setObjetivoVentas(
      reporteSeleccionado.objetivo_ventas ??
        ""
    );
    setObjetivoCampania(
      reporteSeleccionado.objetivo_campania ||
        ""
    );
    setDescripcionCampania(
      reporteSeleccionado.descripcion_campania ||
        ""
    );

    setEstadoSph(
      reporteSeleccionado.estado_sph ||
        ""
    );
    setEstadoVentas(
      reporteSeleccionado.estado_ventas ||
        ""
    );
    setEstadoCampania(
      reporteSeleccionado.estado_campania ||
        ""
    );

    setGestion(
      reporteSeleccionado.gestion || ""
    );

    setProducto(
      reporteSeleccionado.producto ||
        "BM"
    );

    setAspectosCalidad(
      reporteSeleccionado.aspectos_calidad
        ? reporteSeleccionado.aspectos_calidad
            .split(" | ")
            .filter(Boolean)
        : []
    );

    setAspectosProductividad(
      reporteSeleccionado.aspectos_productividad
        ? reporteSeleccionado.aspectos_productividad
            .split(" | ")
            .filter(Boolean)
        : []
    );

    setTipificaciones(
      reporteSeleccionado.tipificaciones
        ? reporteSeleccionado.tipificaciones
            .split(" | ")
            .filter(Boolean)
        : []
    );
  }, [reporteSeleccionado]);

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

            <p style={styles.adminText}>
              Administrador:{" "}
              <strong>
                {usuarioActual?.email ||
                  ADMIN_EMAIL}
              </strong>
            </p>
          </div>

          <button
            type="button"
            onClick={cerrarSesion}
            style={styles.secondaryButton}
          >
            Cerrar sesión
          </button>
        </header>

        <nav style={styles.nav}>
          {[
            ["inicio", "Inicio"],
            ["asesores", "Asesores"],
            ["reportes", "Reportes"],
            ["audios", "Audios"],
            ["devoluciones", "Devoluciones"],
            ["pda", "PDA"],
            ["tipificaciones", "Tipificaciones"],
            ["noventas", "No Ventas"],
            ["seguimiento", "Seguimiento"],
          ].map(([id, nombre]) => (
            <button
              type="button"
              key={id}
              onClick={() => setVista(id)}
              style={{
                ...styles.navButton,
                ...(vista === id
                  ? styles.navButtonActive
                  : {}),
              }}
            >
              {nombre}
            </button>
          ))}
        </nav>

        {mensaje && (
          <div
            style={{
              ...styles.message,
              ...(mensaje.startsWith("❌")
                ? styles.errorMessage
                : styles.successMessage),
            }}
          >
            {mensaje}
          </div>
        )}

        {vista === "inicio" && (
          <Inicio
            estadisticas={estadisticas}
            asesores={asesoresFiltrados}
            reportes={reportes}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            semanaFiltro={semanaFiltro}
            setSemanaFiltro={setSemanaFiltro}
            filtroCampania={filtroCampania}
            setFiltroCampania={setFiltroCampania}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            seleccionarAsesor={seleccionarAsesor}
            abrirNuevoReporte={abrirNuevoReporte}
          />
        )}

        {vista === "asesores" && (
          <Asesores
            asesores={asesores}
            reportes={reportes}
            seleccionarAsesor={seleccionarAsesor}
          />
        )}

        {vista === "reportes" && (
          <ReporteForm
            asesores={asesores}
            asesorSeleccionado={
              asesorSeleccionado
            }
            setAsesorSeleccionado={
              setAsesorSeleccionado
            }
            semana={semana}
            setSemana={setSemana}
            producto={producto}
            setProducto={setProducto}
            nota={nota}
            setNota={setNota}
            objetivoCalidad={
              objetivoCalidad
            }
            setObjetivoCalidad={
              setObjetivoCalidad
            }
            evolucion={evolucion}
            setEvolucion={setEvolucion}
            desvio={desvio}
            setDesvio={setDesvio}
            recomendacion={recomendacion}
            setRecomendacion={
              setRecomendacion
            }
            auditoria={auditoria}
            setAuditoria={setAuditoria}
            observaciones={
              observaciones
            }
            setObservaciones={
              setObservaciones
            }
            aspectosCalidad={
              aspectosCalidad
            }
            setAspectosCalidad={
              setAspectosCalidad
            }
            aspectosProductividad={
              aspectosProductividad
            }
            setAspectosProductividad={
              setAspectosProductividad
            }
            tipificaciones={
              tipificaciones
            }
            setTipificaciones={
              setTipificaciones
            }
            sph={sph}
            setSph={setSph}
            objetivoSph={objetivoSph}
            setObjetivoSph={
              setObjetivoSph
            }
            ventas={ventas}
            setVentas={setVentas}
            objetivoVentas={
              objetivoVentas
            }
            setObjetivoVentas={
              setObjetivoVentas
            }
            objetivoCampania={
              objetivoCampania
            }
            setObjetivoCampania={
              setObjetivoCampania
            }
            descripcionCampania={
              descripcionCampania
            }
            setDescripcionCampania={
              setDescripcionCampania
            }
            estadoSph={estadoSph}
            setEstadoSph={setEstadoSph}
            estadoVentas={estadoVentas}
            setEstadoVentas={
              setEstadoVentas
            }
            estadoCampania={
              estadoCampania
            }
            setEstadoCampania={
              setEstadoCampania
            }
            gestion={gestion}
            setGestion={setGestion}
            guardarReporte={
              guardarReporte
            }
            limpiarReporte={
              limpiarReporte
            }
          />
        )}

        {vista === "audios" && (
          <Audios
            asesores={asesores}
            areaAudio={areaAudio}
            setAreaAudio={setAreaAudio}
            responsableAudio={
              responsableAudio
            }
            setResponsableAudio={
              setResponsableAudio
            }
            audioFile={audioFile}
            setAudioFile={setAudioFile}
            devolucionAudio={
              devolucionAudio
            }
            setDevolucionAudio={
              setDevolucionAudio
            }
            asesorSeleccionado={
              asesorSeleccionado
            }
            setAsesorSeleccionado={
              setAsesorSeleccionado
            }
            setMensaje={setMensaje}
          />
        )}

        {vista === "devoluciones" && (
          <Devoluciones
            asesores={asesores}
            setAsesorSeleccionado={
              setAsesorSeleccionado
            }
            setVista={setVista}
            setMensaje={setMensaje}
          />
        )}

        {vista === "pda" && (
          <PDA
            asesores={asesores}
            pda={pda}
            setPda={setPda}
            setMensaje={setMensaje}
          />
        )}

        {vista === "tipificaciones" && (
          <ModuloSimple
            titulo="Tipificaciones"
            descripcion="Consulta y seguimiento de tipificaciones del equipo."
            items={[
              "Resultado actual",
              "Objetivo",
              "Desvío",
              "Evolución",
              "Devoluciones",
            ]}
            abrirDevolucion={() =>
              setVista("devoluciones")
            }
          />
        )}

        {vista === "noventas" && (
          <ModuloSimple
            titulo="No Ventas"
            descripcion="Seguimiento de gestiones, resultados y oportunidades comerciales."
            items={[
              "Gestiones",
              "Resultados",
              "Aspectos trabajados",
              "Devoluciones",
              "Evolución",
            ]}
            abrirDevolucion={() =>
              setVista("devoluciones")
            }
          />
        )}

        {vista === "seguimiento" && (
          <Seguimiento
            estadisticas={estadisticas}
            abrirVista={setVista}
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
  semanaFiltro,
  setSemanaFiltro,
  filtroCampania,
  setFiltroCampania,
  filtroEstado,
  setFiltroEstado,
  seleccionarAsesor,
  abrirNuevoReporte,
}) {
  return (
    <>
      <div style={styles.pageTitleRow}>
        <div>
          <h2 style={styles.sectionTitle}>
            Inicio
          </h2>
          <p style={styles.muted}>
            Vista general del equipo.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirNuevoReporte}
          style={styles.primaryButton}
        >
          + CARGAR REPORTE
        </button>
      </div>

      <div style={styles.filterRow}>
        <select
          value={semanaFiltro}
          onChange={(e) =>
            setSemanaFiltro(e.target.value)
          }
          style={styles.smallSelect}
        >
          {SEMANAS.map((semana) => (
            <option key={semana}>
              {semana}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.statsGrid}>
        <Metric
          title="ASESORES"
          value={estadisticas.asesores}
        />

        <Metric
          title="PDA ACTIVOS"
          value={estadisticas.pda}
        />

        <Metric
          title="DEVOLUCIONES PENDIENTES"
          value={estadisticas.devoluciones}
        />

        <Metric
          title="ANULACIONES"
          value={estadisticas.anulaciones}
        />
      </div>

      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={styles.cardTitle}>
              Seguimiento del equipo
            </h2>
            <p style={styles.muted}>
              Vista general de los asesores.
            </p>
          </div>
        </div>

        <div style={styles.filterGrid}>
          <input
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
            placeholder="Buscar asesor..."
            style={styles.input}
          />

          <select
            value={filtroCampania}
            onChange={(e) =>
              setFiltroCampania(e.target.value)
            }
            style={styles.input}
          >
            <option value="Todas">
              Todas
            </option>
            {CAMPANIAS.map((campania) => (
              <option
                key={campania}
                value={campania}
              >
                {campania}
              </option>
            ))}
          </select>

          <select
            value={filtroEstado}
            onChange={(e) =>
              setFiltroEstado(e.target.value)
            }
            style={styles.input}
          >
            <option value="Todos">
              Todos
            </option>
            {ESTADOS.map((estado) => (
              <option
                key={estado}
                value={estado}
              >
                {estado}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>
                  Asesor
                </th>
                <th style={styles.th}>
                  Cuenta
                </th>
                <th style={styles.th}>
                  Calidad
                </th>
                <th style={styles.th}>
                  SPH
                </th>
                <th style={styles.th}>
                  PDA
                </th>
                <th style={styles.th}>
                  Estado
                </th>
                <th style={styles.th}>
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {asesores.map((asesor) => {
                const reporte =
                  reportes.find(
                    (r) =>
                      (r.usuario ===
                        asesor.email ||
                        r.asesor ===
                          asesor.nombre) &&
                      r.semana ===
                        semanaFiltro
                  );

                const estado =
                  calcularEstado(reporte);

                return (
                  <tr key={asesor.id}>
                    <td style={styles.td}>
                      <strong>
                        {asesor.nombre}
                      </strong>
                    </td>

                    <td style={styles.td}>
                      {reporte?.producto ||
                        "—"}
                    </td>

                    <td style={styles.td}>
                      {reporte?.nota ??
                        "—"}
                    </td>

                    <td style={styles.td}>
                      {reporte?.sph ??
                        "—"}
                    </td>

                    <td style={styles.td}>
                      No
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.status,
                          ...estadoColor(
                            estado
                          ),
                        }}
                      >
                        {estado}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <button
                        type="button"
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
              })}
            </tbody>
          </table>

          {asesores.length === 0 && (
            <div style={styles.empty}>
              No hay asesores para mostrar.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Asesores({
  asesores,
  reportes,
  seleccionarAsesor,
}) {
  return (
    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <h2 style={styles.cardTitle}>
            Asesores
          </h2>

          <p style={styles.muted}>
            Base de datos visual del equipo.
          </p>
        </div>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>
                Asesor
              </th>
              <th style={styles.th}>
                Email
              </th>
              <th style={styles.th}>
                Campaña
              </th>
              <th style={styles.th}>
                Calidad
              </th>
              <th style={styles.th}>
                SPH
              </th>
              <th style={styles.th}>
                Estado
              </th>
              <th style={styles.th}>
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {asesores.map((asesor) => {
              const reporte =
                reportes.find(
                  (r) =>
                    r.usuario ===
                      asesor.email ||
                    r.asesor ===
                      asesor.nombre
                );

              const estado =
                calcularEstado(reporte);

              return (
                <tr key={asesor.id}>
                  <td style={styles.td}>
                    <strong>
                      {asesor.nombre}
                    </strong>
                  </td>

                  <td style={styles.td}>
                    {asesor.email}
                  </td>

                  <td style={styles.td}>
                    {reporte?.producto ||
                      "—"}
                  </td>

                  <td style={styles.td}>
                    {reporte?.nota ??
                      "—"}
                  </td>

                  <td style={styles.td}>
                    {reporte?.sph ??
                      "—"}
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        ...estadoColor(
                          estado
                        ),
                      }}
                    >
                      {estado}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <button
                      type="button"
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
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ReporteForm(props) {
  const {
    asesores,
    asesorSeleccionado,
    setAsesorSeleccionado,
    semana,
    setSemana,
    producto,
    setProducto,
    nota,
    setNota,
    objetivoCalidad,
    setObjetivoCalidad,
    evolucion,
    setEvolucion,
    desvio,
    setDesvio,
    recomendacion,
    setRecomendacion,
    auditoria,
    setAuditoria,
    observaciones,
    setObservaciones,
    aspectosCalidad,
    setAspectosCalidad,
    aspectosProductividad,
    setAspectosProductividad,
    tipificaciones,
    setTipificaciones,
    sph,
    setSph,
    objetivoSph,
    setObjetivoSph,
    ventas,
    setVentas,
    objetivoVentas,
    setObjetivoVentas,
    objetivoCampania,
    setObjetivoCampania,
    descripcionCampania,
    setDescripcionCampania,
    estadoSph,
    setEstadoSph,
    estadoVentas,
    setEstadoVentas,
    estadoCampania,
    setEstadoCampania,
    gestion,
    setGestion,
    guardarReporte,
    limpiarReporte,
  } = props;

  return (
    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <h2 style={styles.cardTitle}>
            Nuevo reporte
          </h2>

          <p style={styles.muted}>
            Completá la información semanal
            del asesor.
          </p>
        </div>

        <button
          type="button"
          onClick={limpiarReporte}
          style={styles.secondaryButton}
        >
          Limpiar
        </button>
      </div>

      <form onSubmit={guardarReporte}>
        <div style={styles.formGrid}>
          <div>
            <label style={styles.label}>
              Asesor
            </label>

            <select
              value={asesorSeleccionado}
              onChange={(e) =>
                setAsesorSeleccionado(
                  e.target.value
                )
              }
              style={styles.input}
            >
              <option value="">
                Seleccionar asesor
              </option>

              {asesores.map((asesor) => (
                <option
                  key={asesor.id}
                  value={asesor.email}
                >
                  {asesor.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={styles.label}>
              Semana
            </label>

            <select
              value={semana}
              onChange={(e) =>
                setSemana(e.target.value)
              }
              style={styles.input}
            >
              {SEMANAS.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={styles.label}>
              Campaña
            </label>

            <select
              value={producto}
              onChange={(e) =>
                setProducto(e.target.value)
              }
              style={styles.input}
            >
              <option value="">
                Seleccionar
              </option>

              <option value="AP">
                AP
              </option>

              <option value="BM">
                BM
              </option>
            </select>
          </div>
        </div>

        <div style={styles.formSection}>
          <h3 style={styles.formSectionTitle}>
            CALIDAD
          </h3>

          <div style={styles.formGrid}>
            <Field
              label="Nota obtenida"
              type="number"
              value={nota}
              onChange={setNota}
              min="0"
              max="100"
            />

            <Field
              label="Objetivo semanal"
              type="number"
              value={objetivoCalidad}
              onChange={setObjetivoCalidad}
              min="0"
              max="100"
            />
          </div>

          <Field
            label="Evolución"
            value={evolucion}
            onChange={setEvolucion}
            placeholder="Evolución respecto de la semana anterior"
          />

          <Field
            label="Desvíos con mayor porcentaje de la semana"
            value={desvio}
            onChange={setDesvio}
            placeholder="Ingresá los principales desvíos"
          />

          <MultiSelect
            title="Aspectos trabajados CALIDAD"
            options={CALIDAD_OPTIONS}
            values={aspectosCalidad}
            onChange={setAspectosCalidad}
          />

          <Field
            label="Recomendación"
            value={recomendacion}
            onChange={setRecomendacion}
            textarea
            placeholder="Recomendación para el asesor"
          />

          <Field
            label="Auditoría"
            value={auditoria}
            onChange={setAuditoria}
            textarea
            placeholder="Detalle de auditoría"
          />

          <Field
            label="Observaciones"
            value={observaciones}
            onChange={setObservaciones}
            textarea
            placeholder="Observaciones adicionales"
          />
        </div>

        <div style={styles.formSection}>
          <h3 style={styles.formSectionTitle}>
            PRODUCTIVIDAD
          </h3>

          <div style={styles.formGrid}>
            <Field
              label="SPH"
              type="number"
              step="0.01"
              value={sph}
              onChange={setSph}
            />

            <Field
              label="Objetivo SPH"
              type="number"
              step="0.01"
              value={objetivoSph}
              onChange={setObjetivoSph}
            />

            <Field
              label="Ventas"
              type="number"
              value={ventas}
              onChange={setVentas}
            />

            <Field
              label="Objetivo ventas"
              type="number"
              value={objetivoVentas}
              onChange={setObjetivoVentas}
            />

            <Field
              label="Objetivo de la campaña"
              type="number"
              step="0.01"
              value={objetivoCampania}
              onChange={setObjetivoCampania}
            />
          </div>

          <Field
            label="Descripción de campaña"
            value={descripcionCampania}
            onChange={setDescripcionCampania}
            textarea
          />

          <MultiSelect
            title="Aspectos trabajados PRODUCTIVIDAD"
            options={PRODUCTIVIDAD_OPTIONS}
            values={aspectosProductividad}
            onChange={
              setAspectosProductividad
            }
          />

          <div style={styles.formGrid}>
            <SelectField
              label="Estado SPH"
              value={estadoSph}
              onChange={setEstadoSph}
              options={ESTADOS}
            />

            <SelectField
              label="Estado ventas"
              value={estadoVentas}
              onChange={setEstadoVentas}
              options={ESTADOS}
            />

            <SelectField
              label="Estado campaña"
              value={estadoCampania}
              onChange={setEstadoCampania}
              options={ESTADOS}
            />
          </div>

          <Field
            label="Gestión"
            value={gestion}
            onChange={setGestion}
            textarea
            placeholder="Detalle de gestión y seguimiento"
          />
        </div>

        <div style={styles.formSection}>
          <h3 style={styles.formSectionTitle}>
            TIPIFICACIONES
          </h3>

          <MultiSelect
            title="Desvíos / tipificaciones trabajadas"
            options={TIPIFICACION_OPTIONS}
            values={tipificaciones}
            onChange={setTipificaciones}
          />
        </div>

        <button
          type="submit"
          style={styles.primaryButtonLarge}
        >
          GUARDAR REPORTE
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  placeholder,
  min,
  max,
  step,
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={styles.label}>
        {label}
      </label>

      {textarea ? (
        <textarea
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          style={{
            ...styles.input,
            minHeight: "100px",
            resize: "vertical",
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
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
}) {
  return (
    <div>
      <label style={styles.label}>
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={styles.input}
      >
        <option value="">
          Seleccionar
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Audios({
  asesores,
  areaAudio,
  setAreaAudio,
  responsableAudio,
  setResponsableAudio,
  audioFile,
  setAudioFile,
  devolucionAudio,
  setDevolucionAudio,
  asesorSeleccionado,
  setAsesorSeleccionado,
  setMensaje,
}) {
  function cargarAudio() {
    if (!asesorSeleccionado) {
      setMensaje(
        "❌ Seleccioná un asesor para cargar el audio."
      );
      return;
    }

    if (!audioFile) {
      setMensaje(
        "❌ Seleccioná un archivo de audio."
      );
      return;
    }

    setMensaje(
      "✓ Audio preparado para carga. Falta conectar el almacenamiento de audios de Supabase."
    );
  }

  return (
    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <h2 style={styles.cardTitle}>
            Audios
          </h2>

          <p style={styles.muted}>
            Carga de audios y devolución.
          </p>
        </div>
      </div>

      <div style={styles.formGrid}>
        <div>
          <label style={styles.label}>
            Asesor
          </label>

          <select
            value={asesorSeleccionado}
            onChange={(e) =>
              setAsesorSeleccionado(
                e.target.value
              )
            }
            style={styles.input}
          >
            <option value="">
              Seleccionar asesor
            </option>

            {asesores.map((asesor) => (
              <option
                key={asesor.id}
                value={asesor.email}
              >
                {asesor.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>
            Área
          </label>

          <select
            value={areaAudio}
            onChange={(e) =>
              setAreaAudio(e.target.value)
            }
            style={styles.input}
          >
            {AREAS_AUDIO.map((area) => (
              <option key={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <Field
          label="Responsable"
          value={responsableAudio}
          onChange={setResponsableAudio}
          placeholder="Nombre del responsable"
        />

        <div>
          <label style={styles.label}>
            Audio
          </label>

          <input
            type="file"
            accept="audio/*"
            onChange={(e) =>
              setAudioFile(
                e.target.files?.[0] ||
                  null
              )
            }
            style={styles.input}
          />
        </div>
      </div>

      <Field
        label="Devolución"
        value={devolucionAudio}
        onChange={setDevolucionAudio}
        textarea
        placeholder="Escribí la devolución del audio"
      />

      <button
        type="button"
        onClick={cargarAudio}
        style={styles.primaryButton}
      >
        GUARDAR AUDIO
      </button>

      <div style={styles.historyBox}>
        <h3>
          HISTORIAL DE AUDIOS
        </h3>

        <div style={styles.empty}>
          Todavía no hay audios cargados
          en esta vista.
        </div>
      </div>
    </section>
  );
}

function Devoluciones({
  asesores,
  setAsesorSeleccionado,
  setVista,
  setMensaje,
}) {
  return (
    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <h2 style={styles.cardTitle}>
            Devoluciones
          </h2>

          <p style={styles.muted}>
            Gestión de devoluciones individuales.
          </p>
        </div>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>
                Asesor
              </th>
              <th style={styles.th}>
                Área
              </th>
              <th style={styles.th}>
                Estado
              </th>
              <th style={styles.th}>
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {asesores.map((asesor) => (
              <tr key={asesor.id}>
                <td style={styles.td}>
                  {asesor.nombre}
                </td>

                <td style={styles.td}>
                  Calidad
                </td>

                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.status,
                      background:
                        "#fff4d8",
                      color:
                        "#8a6200",
                    }}
                  >
                    Pendiente
                  </span>
                </td>

                <td style={styles.td}>
                  <button
                    type="button"
                    onClick={() => {
                      setAsesorSeleccionado(
                        asesor.email
                      );
                      setVista(
                        "reportes"
                      );
                      setMensaje(
                        "Cargá la devolución desde el reporte del asesor."
                      );
                    }}
                    style={
                      styles.linkButton
                    }
                  >
                    ABRIR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PDA({
  asesores,
  pda,
  setPda,
  setMensaje,
}) {
  function actualizar(campo, valor) {
    setPda((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function guardarPda(event) {
    event.preventDefault();

    if (!pda.asesor) {
      setMensaje(
        "❌ Seleccioná un asesor para el PDA."
      );
      return;
    }

    setMensaje(
      "✓ PDA preparado correctamente. La conexión definitiva con la tabla de PDA se realiza en el siguiente paso."
    );
  }

  return (
    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <h2 style={styles.cardTitle}>
            Planes de Acción
          </h2>

          <p style={styles.muted}>
            Administración de PDA activos.
          </p>
        </div>
      </div>

      <form onSubmit={guardarPda}>
        <div style={styles.formGrid}>
          <div>
            <label style={styles.label}>
              Asesor
            </label>

            <select
              value={pda.asesor}
              onChange={(e) =>
                actualizar(
                  "asesor",
                  e.target.value
                )
              }
              style={styles.input}
            >
              <option value="">
                Seleccionar asesor
              </option>

              {asesores.map((asesor) => (
                <option
                  key={asesor.id}
                  value={asesor.email}
                >
                  {asesor.nombre}
                </option>
              ))}
            </select>
          </div>

          <Field
            label="Aspecto a trabajar"
            value={pda.aspecto}
            onChange={(value) =>
              actualizar(
                "aspecto",
                value
              )
            }
          />

          <Field
            label="Desde"
            type="date"
            value={pda.desde}
            onChange={(value) =>
              actualizar(
                "desde",
                value
              )
            }
          />

          <Field
            label="Hasta"
            type="date"
            value={pda.hasta}
            onChange={(value) =>
              actualizar(
                "hasta",
                value
              )
            }
          />

          <Field
            label="Objetivo"
            value={pda.objetivo}
            onChange={(value) =>
              actualizar(
                "objetivo",
                value
              )
            }
          />

          <SelectField
            label="Estado"
            value={pda.estado}
            onChange={(value) =>
              actualizar(
                "estado",
                value
              )
            }
            options={[
              "Activo",
              "Finalizado",
            ]}
          />
        </div>

        <Field
          label="Metodología"
          value={pda.metodologia}
          onChange={(value) =>
            actualizar(
              "metodologia",
              value
            )
          }
          textarea
        />

        <Field
          label="Seguimiento"
          value={pda.seguimiento}
          onChange={(value) =>
            actualizar(
              "seguimiento",
              value
            )
          }
          textarea
        />

        <button
          type="submit"
          style={styles.primaryButton}
        >
          GUARDAR PDA
        </button>
      </form>
    </section>
  );
}

function ModuloSimple({
  titulo,
  descripcion,
  items,
  abrirDevolucion,
}) {
  return (
    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <h2 style={styles.cardTitle}>
            {titulo}
          </h2>

          <p style={styles.muted}>
            {descripcion}
          </p>
        </div>

        <button
          type="button"
          onClick={abrirDevolucion}
          style={styles.primaryButton}
        >
          + CARGAR DEVOLUCIÓN
        </button>
      </div>

      <div style={styles.statsGrid}>
        {items.map((item) => (
          <Metric
            key={item}
            title={item}
            value="—"
          />
        ))}
      </div>
    </section>
  );
}

function Seguimiento({
  estadisticas,
  abrirVista,
}) {
  return (
    <>
      <section style={styles.card}>
        <h2 style={styles.cardTitle}>
          Seguimiento
        </h2>

        <p style={styles.muted}>
          Esta pantalla funciona como lista
          de pendientes.
        </p>

        <div style={styles.statsGrid}>
          <Metric
            title="PDA ACTIVOS"
            value={estadisticas.pda}
          />

          <Metric
            title="DEVOLUCIONES"
            value={
              estadisticas.devoluciones
            }
          />

          <Metric
            title="AUDIOS"
            value="—"
          />

          <Metric
            title="REPORTES"
            value={estadisticas.reportes}
          />
        </div>
      </section>

      <section style={styles.card}>
        <h3 style={styles.formSectionTitle}>
          PENDIENTES
        </h3>

        <div style={styles.pendingList}>
          <button
            type="button"
            onClick={() =>
              abrirVista("pda")
            }
            style={styles.pendingItem}
          >
            <strong>PDA</strong>
            <span>
              Revisar seguimientos pendientes
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              abrirVista("devoluciones")
            }
            style={styles.pendingItem}
          >
            <strong>
              DEVOLUCIONES
            </strong>
            <span>
              Revisar devoluciones pendientes
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              abrirVista("audios")
            }
            style={styles.pendingItem}
          >
            <strong>AUDIOS</strong>
            <span>
              Revisar audios sin devolución
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              abrirVista("reportes")
            }
            style={styles.pendingItem}
          >
            <strong>REPORTES</strong>
            <span>
              Revisar reportes semanales
            </span>
          </button>
        </div>
      </section>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "28px",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    color: "#20242a",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "1250px",
    margin: "0 auto",
  },

  loading: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.06)",
    marginBottom: "14px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
  },

  subtitle: {
    margin: "5px 0 0",
    color: "#68707b",
    fontSize: "16px",
  },

  adminText: {
    margin: "10px 0 0",
    color: "#68707b",
    fontSize: "13px",
  },

  nav: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    background: "#ffffff",
    borderRadius: "14px",
    padding: "8px",
    marginBottom: "18px",
    boxShadow:
      "0 3px 14px rgba(0,0,0,0.05)",
  },

  navButton: {
    border: "none",
    background: "transparent",
    padding: "10px 13px",
    borderRadius: "9px",
    cursor: "pointer",
    color: "#59616d",
    fontWeight: 600,
  },

  navButtonActive: {
    background: "#20242a",
    color: "#ffffff",
  },

  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.06)",
  },

  pageTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "24px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "21px",
  },

  muted: {
    color: "#68707b",
    margin: "6px 0 0",
  },

  filterRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "18px",
  },

  filterGrid: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr 1fr",
    gap: "12px",
    marginBottom: "20px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },

  metric: {
    background: "#ffffff",
    border: "1px solid #e2e5e9",
    borderRadius: "15px",
    padding: "20px",
    minHeight: "92px",
    boxSizing: "border-box",
  },

  metricTitle: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#737b85",
    letterSpacing: "0.5px",
  },

  metricValue: {
    fontSize: "30px",
    fontWeight: 700,
    marginTop: "10px",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "6px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d9dce3",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "#ffffff",
  },

  smallSelect: {
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1px solid #d9dce3",
    background: "#ffffff",
    fontSize: "14px",
  },

  formSection: {
    borderTop:
      "1px solid #e8eaed",
    paddingTop: "24px",
    marginTop: "24px",
  },

  formSectionTitle: {
    margin: "0 0 18px",
    fontSize: "17px",
    letterSpacing: "0.5px",
  },

  multiBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    padding: "12px",
    borderRadius: "12px",
    border:
      "1px solid #e0e3e7",
    background: "#fafbfc",
  },

  multiOption: {
    border:
      "1px solid #d9dce3",
    background: "#ffffff",
    color: "#4c5560",
    borderRadius: "9px",
    padding: "9px 11px",
    cursor: "pointer",
    fontSize: "13px",
  },

  multiOptionActive: {
    background: "#20242a",
    color: "#ffffff",
    border:
      "1px solid #20242a",
  },

  primaryButton: {
    border: "none",
    borderRadius: "10px",
    background: "#20242a",
    color: "#ffffff",
    padding: "11px 17px",
    cursor: "pointer",
    fontWeight: 700,
  },

  primaryButtonLarge: {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    background: "#20242a",
    color: "#ffffff",
    padding: "15px",
    cursor: "pointer",
    fontWeight: 700,
    marginTop: "12px",
  },

  secondaryButton: {
    border:
      "1px solid #d9dce3",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#30353b",
    padding: "10px 15px",
    cursor: "pointer",
    fontWeight: 600,
  },

  linkButton: {
    border: "none",
    background: "transparent",
    color: "#20242a",
    cursor: "pointer",
    fontWeight: 700,
    padding: 0,
  },

  status: {
    display: "inline-block",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 700,
  },

  tableWrap: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px",
  },

  th: {
    textAlign: "left",
    padding: "13px 10px",
    borderBottom:
      "1px solid #e3e6ea",
    fontSize: "12px",
    color: "#68707b",
    textTransform: "uppercase",
  },

  td: {
    padding: "14px 10px",
    borderBottom:
      "1px solid #eef0f2",
    fontSize: "13px",
  },

  empty: {
    padding: "30px",
    textAlign: "center",
    color: "#7a828d",
  },

  message: {
    padding: "13px 15px",
    borderRadius: "11px",
    marginBottom: "18px",
    fontWeight: 600,
  },

  successMessage: {
    background: "#eaf7ef",
    border:
      "1px solid #b8e1c6",
    color: "#176b31",
  },

  errorMessage: {
    background: "#fff1f1",
    border:
      "1px solid #f0b5b5",
    color: "#a72a2a",
  },

  historyBox: {
    marginTop: "30px",
    paddingTop: "20px",
    borderTop:
      "1px solid #e5e7ea",
  },

  pendingList: {
    display: "grid",
    gap: "10px",
  },

  pendingItem: {
    width: "100%",
    border:
      "1px solid #e1e4e8",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "16px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    textAlign: "left",
  },
};
