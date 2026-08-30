```javascript
"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const ADMIN_EMAIL = "ayelenvillega42@gmail.com";

const ASESORES_BASE = [
  {
    id: "1c438fb1-018e-47d4-b278-1c6b8dac8743",
    nombre: "Mercado, Chiara",
    usuario: "",
    email: "chiara.mercado@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "1dc9b816-6ee3-4cd5-a917-857301e01a70",
    nombre: "Rojek, Luna",
    usuario: "",
    email: "luna.rojek@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "392b476b-3006-451c-8d9f-bd31772a22f1",
    nombre: "Aguilera, Trinidad",
    usuario: "",
    email: "trinidad.aguilera@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "55d51779-f49f-4721-a85c-1c27a1ac34be",
    nombre: "Cordoba, Tania",
    usuario: "",
    email: "tania.cordoba@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "5d644be6-879b-4c73-ab26-8e025f22bd63",
    nombre: "Bustos, Jesica",
    usuario: "",
    email: "jesica.bustos@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "66adbc56-cb5a-4c72-8d0d-88fb943f7130",
    nombre: "Cabrera, Antonella",
    usuario: "",
    email: "antonella.cabrera@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "747cd508-e79a-4515-9575-9f43f837c3ff",
    nombre: "Vasquez, Agustin",
    usuario: "",
    email: "agustin.vasquez@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "836fab43-60b3-45e6-bce8-9117f225b651",
    nombre: "Bustamante, Ailin",
    usuario: "",
    email: "ailin.bustamante@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "88e75230-baa9-487e-af0e-4c2e304e1f26",
    nombre: "Reartes, Maia",
    usuario: "",
    email: "maia.reartes@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "92837a42-c644-4bc3-8ec1-8e56e91ec5b5",
    nombre: "Tello, Marianela",
    usuario: "",
    email: "marianela.tello@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "ae30ff34-c741-461b-b760-8a53200f1941",
    nombre: "Viniegra, Agustín",
    usuario: "",
    email: "agustin.viniegra@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "b1ef4b29-6c25-4afa-8aca-66d2bb027bb6",
    nombre: "Acosta, Pamela",
    usuario: "",
    email: "pamela.acosta@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "b5375446-4177-41d6-a9e4-395808664251",
    nombre: "Simonetta, Valentina",
    usuario: "",
    email: "valentina.simonetta@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "b6090f19-1f81-48eb-8fd9-f57d86ec00a7",
    nombre: "Diaz, Milagros",
    usuario: "",
    email: "milagros.diaz@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "c0f98bf5-d67a-49b1-85b9-783b86233992",
    nombre: "Contreras, Gilary",
    usuario: "",
    email: "gilary.contreras@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "d455b4ea-d96c-4ea7-adcc-5feab89d1772",
    nombre: "Peralta, Belen",
    usuario: "",
    email: "belen.peralta@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "d6285e5d-23a7-4eeb-a7b2-7e4a6a2c8163",
    nombre: "Malqui, Xiomara",
    usuario: "",
    email: "xiomara.malqui@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "dbd31d0d-5277-4730-8702-69cc5ce20a0d",
    nombre: "Olmedo, Thomas",
    usuario: "",
    email: "thomas.olmedo@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "dc6a2244-d560-4219-bfb5-1dc5a094238f",
    nombre: "Gomez, Carla",
    usuario: "",
    email: "carla.gomez@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "ea60ff3a-17ec-416c-83a4-b4ca4634750c",
    nombre: "Bahamonde, Camila",
    usuario: "",
    email: "camila.bahamonde@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "f32521db-99de-404e-bbf3-f20e817ea832",
    nombre: "Ojeda, Luana",
    usuario: "",
    email: "luana.ojeda@portalcalidad.com",
    rol: "asesor",
    activo: true,
  },
  {
    id: "f7fdc70a-7a21-4631-bb47-d68390cb2e01",
    nombre: "Luna, Oriana",
    usuario: "",
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

export default function AdminPage() {
  const [usuario, setUsuario] = useState(null);
  const [asesores, setAsesores] = useState(ASESORES_BASE);
  const [reportes, setReportes] = useState([]);

  const [vista, setVista] = useState("inicio");
  const [asesorSeleccionado, setAsesorSeleccionado] =
    useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroCampania, setFiltroCampania] =
    useState("Todas");
  const [filtroEstado, setFiltroEstado] =
    useState("Todos");

  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const [reporte, setReporte] = useState(
    crearReporteInicial()
  );

  const [devolucion, setDevolucion] = useState(
    crearDevolucionInicial()
  );

  const [audio, setAudio] = useState(
    crearAudioInicial()
  );

  const [pda, setPda] = useState(
    crearPdaInicial()
  );

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
        "❌ Error al cargar el panel de administración."
      );
    } finally {
      setCargando(false);
    }
  }

  async function cargarAsesores() {
    try {
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
        console.error(
          "Error Supabase usuarios:",
          error
        );

        /*
         * Si Supabase bloquea la lectura por RLS,
         * mantenemos la lista base para que el panel
         * siga funcionando.
         */
        setAsesores(ASESORES_BASE);

        setMensaje(
          "⚠️ Se cargó la lista de asesores disponible."
        );

        return;
      }

      if (data && data.length > 0) {
        setAsesores(data);
      } else {
        setAsesores(ASESORES_BASE);
      }
    } catch (error) {
      console.error(
        "Error cargando asesores:",
        error
      );

      setAsesores(ASESORES_BASE);
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

  function seleccionarAsesor(asesor) {
    setAsesorSeleccionado(asesor);
    setVista("asesor");
  }

  function abrirReporte(asesor = null) {
    setReporte({
      ...crearReporteInicial(),
      asesor:
        asesor?.email ||
        asesor?.nombre ||
        "",
      nombreAsesor:
        asesor?.nombre || "",
    });

    setVista("reporte");
  }

  function abrirDevolucion(asesor = null) {
    setDevolucion({
      ...crearDevolucionInicial(),
      asesor:
        asesor?.nombre || "",
    });

    setVista("devolucion");
  }

  function abrirAudio(asesor = null) {
    setAudio({
      ...crearAudioInicial(),
      asesor:
        asesor?.nombre || "",
    });

    setVista("audios");
  }

  function abrirPda(asesor = null) {
    setPda({
      ...crearPdaInicial(),
      asesor:
        asesor?.nombre || "",
    });

    setVista("pda");
  }

  async function guardarReporte(e) {
    e.preventDefault();

    if (!reporte.asesor) {
      setMensaje(
        "❌ Seleccioná un asesor."
      );
      return;
    }

    const asesorEncontrado =
      asesores.find(
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
        reporte.nota === ""
          ? null
          : Number(reporte.nota),

      evolucion: reporte.evolucion,
      objetivo: reporte.objetivo,
      desvio: reporte.desvio,
      recomendacion:
        reporte.recomendacion,
      auditoria: reporte.auditoria,
      producto: reporte.producto,
      observaciones:
        reporte.observaciones,

      sph:
        reporte.sph === ""
          ? null
          : Number(reporte.sph),

      objetivo_sph:
        reporte.objetivoSph === ""
          ? null
          : Number(reporte.objetivoSph),

      ventas:
        reporte.ventas === ""
          ? null
          : Number(reporte.ventas),

      objetivo_ventas:
        reporte.objetivoVentas === ""
          ? null
          : Number(reporte.objetivoVentas),

      objetivo_campania:
        reporte.objetivoCampania,

      descripcion_campania:
        reporte.descripcionCampania,

      estado_sph:
        reporte.estadoSph,

      estado_ventas:
        reporte.estadoVentas,

      estado_campania:
        reporte.estadoCampania,

      gestion:
        reporte.gestion,
    };

    const { error } = await supabase
      .from("reportes")
      .upsert(datos, {
        onConflict:
          "usuario,semana",
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

  function toggleMulti(
    lista,
    valor,
    setter,
    campo
  ) {
    setter((prev) => {
      const actual = prev[campo] || [];

      const existe =
        actual.includes(valor);

      return {
        ...prev,
        [campo]: existe
          ? actual.filter(
              (item) => item !== valor
            )
          : [...actual, valor],
      };
    });
  }

  const asesoresFiltrados =
    useMemo(() => {
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
              r.usuario ===
                asesor.email ||
              r.asesor ===
                asesor.nombre
          );

        const campania =
          reporteAsesor?.producto ||
          "";

        const coincideCampania =
          filtroCampania === "Todas" ||
          campania === filtroCampania ||
          !reporteAsesor;

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

  const estadisticas =
    useMemo(() => {
      const cantidadAsesores =
        asesores.length;

      const reportesUnicos =
        new Set(
          reportes.map(
            (r) =>
              r.usuario ||
              r.asesor
          )
        ).size;

      return {
        asesores: cantidadAsesores,
        reportes: reportesUnicos,
        devoluciones: 0,
        anulaciones: 0,
      };
    }, [asesores, reportes]);

  if (cargando) {
    return (
      <main style={styles.page}>
        <div style={styles.loading}>
          <h2>
            Portal de Calidad
          </h2>

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

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() =>
                setVista("inicio")
              }
              style={styles.secondaryButton}
            >
              Inicio
            </button>

            <button
              onClick={cerrarSesion}
              style={styles.secondaryButton}
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {mensaje && (
          <div style={styles.message}>
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
            filtroCampania={
              filtroCampania
            }
            setFiltroCampania={
              setFiltroCampania
            }
            filtroEstado={filtroEstado}
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
            asesores={asesoresFiltrados}
            reportes={reportes}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
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
              abrirReporte={
                abrirReporte
              }
              abrirDevolucion={
                abrirDevolucion
              }
              abrirAudio={
                abrirAudio
              }
              abrirPda={abrirPda}
              volver={() =>
                setVista("asesores")
              }
            />
          )}

        {vista === "reporte" && (
          <FormularioReporte
            reporte={reporte}
            actualizar={
              actualizarReporte
            }
            guardar={
              guardarReporte
            }
            asesores={asesores}
            volver={() =>
              setVista(
                asesorSeleccionado
                  ? "asesor"
                  : "inicio"
              )
            }
          />
        )}

        {vista === "devolucion" && (
          <FormularioDevolucion
            datos={devolucion}
            actualizar={
              actualizarDevolucion
            }
            toggle={(valor, campo) =>
              toggleMulti(
                null,
                valor,
                setDevolucion,
                campo
              )
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
            toggle={(valor, campo) =>
              toggleMulti(
                null,
                valor,
                setAudio,
                campo
              )
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
            volver={() =>
              setVista(
                asesorSeleccionado
                  ? "asesor"
                  : "inicio"
              )
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
              style={styles.smallSelect}
              defaultValue="Semana 4 · Agosto"
            >
              <option>
                Semana 4 · Agosto
              </option>

              <option>
                Semana 3 · Agosto
              </option>

              <option>
                Semana 2 · Agosto
              </option>

              <option>
                Semana 1 · Agosto
              </option>
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
            title="PDA ACTIVOS"
            value="—"
          />

          <Stat
            title="DEVOLUCIONES PENDIENTES"
            value="—"
          />

          <Stat
            title="ANULACIONES"
            value="—"
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
              Vista general de los asesores.
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
            value={filtroCampania}
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
                  const r =
                    reportes.find(
                      (reporte) =>
                        reporte.usuario ===
                          asesor.email ||
                        reporte.asesor ===
                          asesor.nombre
                    );

                  const estado =
                    calcularEstado(r);

                  return (
                    <tr
                      key={asesor.id}
                    >
                      <td>
                        <strong>
                          {asesor.nombre}
                        </strong>
                      </td>

                      <td>
                        Hipotecario Seguros
                      </td>

                      <td>
                        {r?.nota ?? "—"}
                      </td>

                      <td>
                        {r?.sph ?? "—"}
                      </td>

                      <td>
                        —
                      </td>

                      <td>
                        <Estado
                          estado={estado}
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
      <h2>
        Asesores
      </h2>

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
                key={asesor.id}
                style={styles.advisorCard}
              >
                <h3>
                  {asesor.nombre}
                </h3>

                <p style={styles.muted}>
                  {asesor.email}
                </p>

                <p>
                  Calidad:{" "}
                  <strong>
                    {r?.nota ?? "—"}
                  </strong>
                </p>

                <p>
                  SPH:{" "}
                  <strong>
                    {r?.sph ?? "—"}
                  </strong>
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
  abrirReporte,
  abrirDevolucion,
  abrirAudio,
  abrirPda,
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

  const actual =
    reportesAsesor[0];

  return (
    <>
      <section style={styles.card}>
        <button
          onClick={volver}
          style={styles.secondaryButton}
        >
          ← Volver
        </button>

        <div style={{ marginTop: "20px" }}>
          <h2>
            {asesor.nombre}
          </h2>

          <p style={styles.muted}>
            {asesor.email}
          </p>
        </div>

        <div style={styles.tabs}>
          <button
            style={styles.tabActive}
          >
            CALIDAD
          </button>

          <button style={styles.tab}>
            PRODUCTIVIDAD
          </button>

          <button style={styles.tab}>
            TIPIFICACIONES
          </button>

          <button style={styles.tab}>
            NO VENTAS
          </button>

          <button style={styles.tab}>
            AUDIOS
          </button>

          <button style={styles.tab}>
            PDA
          </button>

          <button style={styles.tab}>
            EVOLUCIÓN
          </button>
        </div>

        <div style={styles.formGrid}>
          <InfoBlock
            title="Nota de calidad"
            value={
              actual?.nota ??
              "Sin reporte"
            }
          />

          <InfoBlock
            title="SPH"
            value={
              actual?.sph ??
              "Sin reporte"
            }
          />
        </div>

        <InfoBlock
          title="Evolución"
          value={
            actual?.evolucion
          }
        />

        <InfoBlock
          title="Desvíos"
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

        <div style={styles.buttonRow}>
          <button
            onClick={() =>
              abrirReporte(asesor)
            }
            style={styles.primaryButton}
          >
            + CARGAR REPORTE
          </button>

          <button
            onClick={() =>
              abrirDevolucion(asesor)
            }
            style={styles.secondaryButton}
          >
            + CARGAR DEVOLUCIÓN
          </button>

          <button
            onClick={() =>
              abrirPda(asesor)
            }
            style={styles.secondaryButton}
          >
            + NUEVO PDA
          </button>

          <button
            onClick={() =>
              abrirAudio(asesor)
            }
            style={styles.secondaryButton}
          >
            + SUBIR AUDIO
          </button>
        </div>
      </section>
    </>
  );
}

function FormularioReporte({
  reporte,
  actualizar,
  guardar,
  asesores,
  volver,
}) {
  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <div>
          <h2>
            Nuevo Reporte
          </h2>

          <p style={styles.muted}>
            Carga semanal del asesor.
          </p>
        </div>

        <button
          onClick={volver}
          style={styles.secondaryButton}
        >
          ← Volver
        </button>
      </div>

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
            (asesor) => ({
              value:
                asesor.email,
              label:
                asesor.nombre,
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
          options={[
            {
              value:
                "Semana 4 · Agosto",
              label:
                "Semana 4 · Agosto",
            },
            {
              value:
                "Semana 3 · Agosto",
              label:
                "Semana 3 · Agosto",
            },
            {
              value:
                "Semana 2 · Agosto",
              label:
                "Semana 2 · Agosto",
            },
            {
              value:
                "Semana 1 · Agosto",
              label:
                "Semana 1 · Agosto",
            },
          ]}
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

      <h3 style={styles.formTitle}>
        CALIDAD
      </h3>

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

      <Field
        label="Aspectos trabajados"
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
        label="Acciones"
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

      <h3 style={styles.formTitle}>
        PRODUCTIVIDAD
      </h3>

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
        label="Descripción de la campaña"
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
          options={estadoOptions()}
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
          options={estadoOptions()}
        />

        <Field
          label="Estado campaña"
          value={
            reporte.estadoCampania
          }
          onChange={(v) =>
            actualizar(
              "estadoCampania",
              v
            )
          }
          type="select"
          options={estadoOptions()}
        />
      </div>

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

      <button
        style={styles.primaryButton}
        onClick={guardar}
      >
        GUARDAR REPORTE
      </button>
    </section>
  );
}

function FormularioDevolucion({
  datos,
  actualizar,
  toggle,
  volver,
}) {
  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <div>
          <h2>
            Nueva devolución
          </h2>

          <p style={styles.muted}>
            Registro de acompañamiento.
          </p>
        </div>

        <button
          onClick={volver}
          style={styles.secondaryButton}
        >
          ← Volver
        </button>
      </div>

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
          (area) => ({
            value: area,
            label: area,
          })
        )}
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

      <MultiSelect
        label="Aspectos trabajados CALIDAD"
        options={CALIDAD}
        values={
          datos.aspectosCalidad
        }
        onToggle={(valor) =>
          toggle(
            valor,
            "aspectosCalidad"
          )
        }
      />

      <MultiSelect
        label="Acciones CALIDAD"
        options={
          ACCIONES_CALIDAD
        }
        values={
          datos.accionesCalidad || []
        }
        onToggle={(valor) =>
          toggle(
            valor,
            "accionesCalidad"
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
        onToggle={(valor) =>
          toggle(
            valor,
            "aspectosProductividad"
          )
        }
      />

      <MultiSelect
        label="Tipificaciones"
        options={
          TIPIFICACIONES
        }
        values={
          datos.tipificaciones
        }
        onToggle={(valor) =>
          toggle(
            valor,
            "tipificaciones"
          )
        }
      />

      <MultiSelect
        label="O.M. NO VENTAS"
        options={OM}
        values={
          datos.om
        }
        onToggle={(valor) =>
          toggle(
            valor,
            "om"
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
            value: "Correcto",
            label: "Correcto",
          },
          {
            value: "Incorrecto",
            label: "Incorrecto",
          },
        ]}
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
        options={[
          {
            value:
              "APLICA DEVOLUCION",
            label:
              "APLICA DEVOLUCION",
          },
          {
            value:
              "SEGUIMIENTO",
            label:
              "SEGUIMIENTO",
          },
          {
            value:
              "NO APLICA",
            label:
              "NO APLICA",
          },
        ]}
      />

      <MultiSelect
        label="Fortalezas destacadas"
        options={
          FORTALEZAS
        }
        values={
          datos.fortalezas
        }
        onToggle={(valor) =>
          toggle(
            valor,
            "fortalezas"
          )
        }
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
        style={styles.primaryButton}
        onClick={() =>
          alert(
            "Formulario de devolución preparado."
          )
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
  toggle,
  volver,
}) {
  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <div>
          <h2>
            Subir audio
          </h2>
        </div>

        <button
          onClick={volver}
          style={styles.secondaryButton}
        >
          ← Volver
        </button>
      </div>

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
        options={AREAS.map(
          (area) => ({
            value: area,
            label: area,
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

      <div style={styles.fileBox}>
        <label style={styles.label}>
          Audio
        </label>

        <input
          type="file"
          accept="audio/*"
          onChange={(e) =>
            actualizar(
              "archivo",
              e.target.files?.[0] ||
                null
            )
          }
        />
      </div>

      <MultiSelect
        label="Aspectos trabajados CALIDAD"
        options={CALIDAD}
        values={
          datos.aspectosCalidad
        }
        onToggle={(valor) =>
          toggle(
            valor,
            "aspectosCalidad"
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
        onToggle={(valor) =>
          toggle(
            valor,
            "aspectosProductividad"
          )
        }
      />

      <MultiSelect
        label="Tipificaciones"
        options={
          TIPIFICACIONES
        }
        values={
          datos.tipificaciones
        }
        onToggle={(valor) =>
          toggle(
            valor,
            "tipificaciones"
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
        style={styles.primaryButton}
        onClick={() =>
          alert(
            "Formulario de audio preparado."
          )
        }
      >
        GUARDAR AUDIO
      </button>
    </section>
  );
}

function FormularioPda({
  datos,
  actualizar,
  volver,
}) {
  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <div>
          <h2>
            Nuevo Plan de Acción
          </h2>
        </div>

        <button
          onClick={volver}
          style={styles.secondaryButton}
        >
          ← Volver
        </button>
      </div>

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

      <div style={styles.formGrid}>
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

      <button
        style={styles.primaryButton}
        onClick={() =>
          alert(
            "Formulario de PDA preparado."
          )
        }
      >
        GUARDAR PDA
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
      <div style={styles.sectionHeader}>
        <h2>
          Reportes
        </h2>

        <button
          onClick={() =>
            abrirReporte()
          }
          style={styles.primaryButton}
        >
          + NUEVO REPORTE
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Asesor</th>
              <th>Semana</th>
              <th>Producto</th>
              <th>Nota</th>
              <th>SPH</th>
            </tr>
          </thead>

          <tbody>
            {reportes.map(
              (r) => (
                <tr key={r.id}>
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
  seleccionarAsesor,
}) {
  return (
    <section style={styles.card}>
      <h2>
        Seguimiento
      </h2>

      <div style={styles.advisorGrid}>
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

            const estado =
              calcularEstado(r);

            return (
              <div
                key={asesor.id}
                style={styles.advisorCard}
              >
                <h3>
                  {asesor.nombre}
                </h3>

                <Estado
                  estado={estado}
                />

                <p style={styles.muted}>
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
    </section>
  );
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
    <span style={style}>
      {estado}
    </span>
  );
}

function InfoBlock({
  title,
  value,
}) {
  return (
    <div
      style={{
        marginTop: "18px",
      }}
    >
      <h3>
        {title}
      </h3>

      <p>
        {value ||
          "No hay información cargada."}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  options = [],
}) {
  return (
    <div
      style={{
        marginBottom: "16px",
      }}
    >
      <label style={styles.label}>
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          value={value ?? ""}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          style={{
            ...styles.input,
            minHeight: "100px",
            resize: "vertical",
          }}
        />
      ) : type === "select" ? (
        <select
          value={value ?? ""}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          style={styles.input}
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
                {option.label}
              </option>
            )
          )}
        </select>
      ) : (
        <input
          type={type}
          value={value ?? ""}
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

function MultiSelect({
  label,
  options,
  values,
  onToggle,
}) {
  const seleccionados =
    values || [];

  return (
    <div style={styles.multiBox}>
      <label style={styles.label}>
        {label}
      </label>

      <div style={styles.multiGrid}>
        {options.map(
          (option) => {
            const seleccionado =
              seleccionados.includes(
                option
              );

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  onToggle(
                    option
                  )
                }
                style={
                  seleccionado
                    ? styles.multiSelected
                    : styles.multiOption
                }
              >
                {option}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}

function calcularEstado(
  reporte
) {
  if (!reporte) {
    return "POR DEBAJO DEL OBJETIVO";
  }

  const nota =
    Number(reporte.nota);

  const objetivoCalidad =
    Number(
      reporte.objetivo
    );

  const sph =
    Number(reporte.sph);

  const objetivoSph =
    Number(
      reporte.objetivo_sph
    );

  const calidadOk =
    !Number.isNaN(nota) &&
    !Number.isNaN(
      objetivoCalidad
    ) &&
    nota >=
      objetivoCalidad;

  const productividadOk =
    !Number.isNaN(sph) &&
    !Number.isNaN(
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

function estadoOptions() {
  return [
    {
      value:
        "POR DEBAJO DEL OBJETIVO",
      label:
        "Por debajo del objetivo",
    },
    {
      value:
        "ALCANZADO",
      label:
        "Alcanzado",
    },
    {
      value:
        "SUPERADO",
      label:
        "Superado",
    },
  ];
}

function obtenerNombre(
  asesores,
  email
) {
  return (
    asesores.find(
      (a) =>
        a.email === email
    )?.nombre ||
    email ||
    "—"
  );
}

function crearReporteInicial() {
  return {
    asesor: "",
    nombreAsesor: "",
    semana:
      "Semana 4 · Agosto",
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
  };
}

function crearDevolucionInicial() {
  return {
    asesor: "",
    area: "Calidad",
    notaCalidad: "",
    aspectosCalidad: [],
    accionesCalidad: [],
    aspectosProductividad: [],
    tipificaciones: [],
    om: [],
    fortalezas: [],
    registroSistema: "",
    compromiso: "",
    observaciones: "",
  };
}

function crearAudioInicial() {
  return {
    asesor: "",
    area: "Calidad",
    responsable:
      "Ayelen Villega",
    fecha:
      new Date()
        .toISOString()
        .slice(0, 10),
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

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "#f4f6f8",
    padding: "30px",
    fontFamily:
      "Arial, sans-serif",
    color: "#20242a",
    boxSizing:
      "border-box",
  },

  container: {
    maxWidth: "1200px",
    margin: "auto",
  },

  loading: {
    minHeight:
      "calc(100vh - 60px)",
    display: "flex",
    flexDirection:
      "column",
    alignItems: "center",
    justifyContent:
      "center",
  },

  header: {
    background:
      "#ffffff",
    borderRadius: "18px",
    padding:
      "22px 24px",
    marginBottom:
      "20px",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.06)",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  title: {
    margin: 0,
    fontSize: "28px",
  },

  subtitle: {
    color:
      "#68707b",
    margin:
      "6px 0 0",
  },

  card: {
    background:
      "#ffffff",
    borderRadius: "18px",
    padding: "24px",
    marginBottom:
      "20px",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.06)",
  },

  message: {
    background:
      "#ffffff",
    borderRadius:
      "12px",
    padding:
      "14px 18px",
    marginBottom:
      "20px",
    border:
      "1px solid #e5e7eb",
  },

  weekRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    marginBottom:
      "20px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",
    gap: "16px",
  },

  stat: {
    background:
      "#f8fafc",
    border:
      "1px solid #e5e7eb",
    borderRadius:
      "14px",
    padding:
      "20px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    gap: "15px",
    marginBottom:
      "20px",
    flexWrap: "wrap",
  },

  filters: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "12px",
    marginBottom:
      "20px",
  },

  input: {
    width: "100%",
    boxSizing:
      "border-box",
    border:
      "1px solid #d8dde5",
    borderRadius:
      "10px",
    padding:
      "11px 12px",
    fontSize:
      "14px",
    background:
      "#ffffff",
  },

  smallSelect: {
    border:
      "1px solid #d8dde5",
    borderRadius:
      "10px",
    padding:
      "10px 12px",
    background:
      "#ffffff",
  },

  primaryButton: {
    border: "none",
    borderRadius:
      "10px",
    padding:
      "11px 16px",
    background:
      "#111827",
    color:
      "#ffffff",
    cursor:
      "pointer",
    fontWeight:
      "bold",
  },

  secondaryButton: {
    border:
      "1px solid #d8dde5",
    borderRadius:
      "10px",
    padding:
      "10px 15px",
    background:
      "#ffffff",
    color:
      "#20242a",
    cursor:
      "pointer",
    fontWeight:
      "bold",
  },

  linkButton: {
    border: "none",
    background:
      "transparent",
    color:
      "#2563eb",
    cursor:
      "pointer",
    fontWeight:
      "bold",
  },

  tableWrapper: {
    width: "100%",
    overflowX:
      "auto",
  },

  table: {
    width: "100%",
    borderCollapse:
      "collapse",
  },

  advisorGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap: "16px",
  },

  advisorCard: {
    border:
      "1px solid #e5e7eb",
    borderRadius:
      "14px",
    padding:
      "18px",
    background:
      "#ffffff",
  },

  tabs: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop:
      "20px",
    marginBottom:
      "20px",
  },

  tab: {
    border:
      "1px solid #d8dde5",
    borderRadius:
      "9px",
    padding:
      "9px 12px",
    background:
      "#ffffff",
    cursor:
      "pointer",
  },

  tabActive: {
    border:
      "1px solid #111827",
    borderRadius:
      "9px",
    padding:
      "9px 12px",
    background:
      "#111827",
    color:
      "#ffffff",
    cursor:
      "pointer",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
  },

  formTitle: {
    marginTop:
      "28px",
    marginBottom:
      "18px",
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop:
      "24px",
  },

  fileBox: {
    marginBottom:
      "20px",
    padding:
      "15px",
    border:
      "1px solid #e5e7eb",
    borderRadius:
      "10px",
  },

  multiBox: {
    marginBottom:
      "20px",
  },

  multiGrid: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop:
      "8px",
  },

  multiOption: {
    border:
      "1px solid #d8dde5",
    borderRadius:
      "9px",
    padding:
      "8px 11px",
    background:
      "#ffffff",
    cursor:
      "pointer",
    fontSize:
      "13px",
  },

  multiSelected: {
    border:
      "1px solid #111827",
    borderRadius:
      "9px",
    padding:
      "8px 11px",
    background:
      "#111827",
    color:
      "#ffffff",
    cursor:
      "pointer",
    fontSize:
      "13px",
  },

  label: {
    display:
      "block",
    fontWeight:
      "bold",
    marginBottom:
      "7px",
    fontSize:
      "14px",
  },

  muted: {
    color:
      "#68707b",
  },

  estadoRojo: {
    display:
      "inline-block",
    padding:
      "6px 9px",
    borderRadius:
      "8px",
    background:
      "#fecaca",
    color:
      "#991b1b",
    fontSize:
      "12px",
    fontWeight:
      "bold",
  },

  estadoVerde: {
    display:
      "inline-block",
    padding:
      "6px 9px",
    borderRadius:
      "8px",
    background:
      "#bbf7d0",
    color:
      "#166534",
    fontSize:
      "12px",
    fontWeight:
      "bold",
  },

  estadoSuperado: {
    display:
      "inline-block",
    padding:
      "6px 9px",
    borderRadius:
      "8px",
    background:
      "#86efac",
    color:
      "#14532d",
    fontSize:
      "12px",
    fontWeight:
      "bold",
  },

  estadoNeutral: {
    display:
      "inline-block",
    padding:
      "6px 9px",
    borderRadius:
      "8px",
    background:
      "#e5e7eb",
    color:
      "#374151",
    fontSize:
      "12px",
    fontWeight:
      "bold",
  },
};
```
