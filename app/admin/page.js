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

export default function AdminPage() {
  const [usuario, setUsuario] = useState(null);
  const [asesores, setAsesores] = useState([]);
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
      window.location.href = "/";
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
        "❌ No se pudieron cargar los asesores."
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
          campania === filtroCampania;

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

        <div style={styles.actionRow}>
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
              abrirDevolucion(
                asesor
              )
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

      <section style={styles.card}>
        <h2>
          Último reporte
        </h2>

        {actual ? (
          <>
            <div style={styles.statsGrid}>
              <Stat
                title="CALIDAD"
                value={
                  actual.nota ??
                  "—"
                }
              />

              <Stat
                title="SPH"
                value={
                  actual.sph ??
                  "—"
                }
              />

              <Stat
                title="VENTAS"
                value={
                  actual.ventas ??
                  "—"
                }
              />

              <Stat
                title="SEMANA"
                value={
                  actual.semana ||
                  "—"
                }
              />
            </div>

            <InfoBlock
              title="Evolución"
              value={
                actual.evolucion
              }
            />

            <InfoBlock
              title="Desvío"
              value={
                actual.desvio
              }
            />

            <InfoBlock
              title="Recomendación"
              value={
                actual.recomendacion
              }
            />
          </>
        ) : (
          <p style={styles.muted}>
            Todavía no hay reportes
            cargados para este asesor.
          </p>
        )}
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
    <form
      onSubmit={guardar}
    >
      <section style={styles.card}>
        <div style={styles.sectionHeader}>
          <h2>
            Nuevo reporte
          </h2>

          <button
            type="button"
            onClick={volver}
            style={styles.secondaryButton}
          >
            ← Volver
          </button>
        </div>

        <div style={styles.formGrid}>
          <Field
            label="Asesor"
            value={reporte.asesor}
            onChange={(v) =>
              actualizar(
                "asesor",
                v
              )
            }
            type="select"
            options={[
              ...asesores.map(
                (a) => ({
                  value: a.email,
                  label:
                    a.nombre,
                })
              ),
            ]}
          />

          <Field
            label="Semana"
            value={reporte.semana}
            onChange={(v) =>
              actualizar(
                "semana",
                v
              )
            }
          />

          <Field
            label="Campaña / Producto"
            value={reporte.producto}
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
                label: "AP - Accidentes Personales",
              },
              {
                value: "BM",
                label: "BM - Bienes Móviles",
              },
            ]}
          />

          <Field
            label="Nota de calidad"
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
            value={reporte.objetivo}
            onChange={(v) =>
              actualizar(
                "objetivo",
                v
              )
            }
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

          <Field
            label="Objetivo de campaña"
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
        </div>

        <Field
          label="Evolución"
          value={reporte.evolucion}
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
          value={reporte.auditoria}
          onChange={(v) =>
            actualizar(
              "auditoria",
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

        <Field
          label="Gestión / acciones realizadas"
          value={reporte.gestion}
          onChange={(v) =>
            actualizar(
              "gestion",
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

        <button
          type="submit"
          style={styles.primaryButton}
        >
          GUARDAR REPORTE
        </button>
      </section>
    </form>
  );
}

function FormularioDevolucion({
  datos,
  actualizar,
  volver,
}) {
  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <h2>
          Nueva devolución
        </h2>

        <button
          onClick={volver}
          style={styles.secondaryButton}
        >
          ← Volver
        </button>
      </div>

      <Field
        label="Asesor"
        value={datos.asesor}
        onChange={(v) =>
          actualizar(
            "asesor",
            v
          )
        }
      />

      <Field
        label="Área"
        value={datos.area}
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
        label="Nota calidad obtenida"
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

      <div style={styles.placeholderBox}>
        <strong>
          Aspectos trabajados
        </strong>

        <p style={styles.muted}>
          En esta primera conexión
          dejamos preparado el
          formulario. Los ítems
          específicos se incorporarán
          en la tabla correspondiente.
        </p>
      </div>

      <button
        style={styles.primaryButton}
        onClick={() =>
          alert(
            "Formulario preparado. Para guardar las devoluciones necesitamos conectar la tabla correspondiente."
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
  volver,
}) {
  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <h2>
          Subir audio
        </h2>

        <button
          onClick={volver}
          style={styles.secondaryButton}
        >
          ← Volver
        </button>
      </div>

      <Field
        label="Asesor"
        value={datos.asesor}
        onChange={(v) =>
          actualizar(
            "asesor",
            v
          )
        }
      />

      <Field
        label="¿A qué corresponde?"
        value={datos.area}
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
          actualizar(
            "fecha",
            v
          )
        }
        type="date"
      />

      <label style={styles.label}>
        Audio
      </label>

      <input
        type="file"
        accept="audio/*"
        style={styles.input}
        onChange={(e) =>
          actualizar(
            "archivo",
            e.target.files?.[0] ||
              null
          )
        }
      />

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

      <button
        style={styles.primaryButton}
        onClick={() =>
          alert(
            "Audio seleccionado. La carga al almacenamiento se conecta en el siguiente paso."
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
        <h2>
          Nuevo Plan de Acción
        </h2>

        <button
          onClick={volver}
          style={styles.secondaryButton}
        >
          ← Volver
        </button>
      </div>

      <Field
        label="Asesor"
        value={datos.asesor}
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

  sectionHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    gap: "15px",
    flexWrap:
      "wrap",
    marginBottom:
      "20px",
  },

  weekRow: {
    marginBottom:
      "20px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "15px",
  },

  stat: {
    padding: "20px",
    background:
      "#f8fafc",
    border:
      "1px solid #e5e7eb",
    borderRadius:
      "14px",
  },

  statTitle: {
    color:
      "#68707b",
  },

  statValue: {
    display:
      "block",
    fontSize:
      "28px",
    marginTop:
      "8px",
  },

  muted: {
    color:
      "#68707b",
  },

  filters: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr 1fr",
    gap: "12px",
    marginBottom:
      "20px",
  },

  input: {
    width: "100%",
    padding:
      "12px",
    borderRadius:
      "10px",
    border:
      "1px solid #d9dce3",
    fontSize:
      "14px",
    boxSizing:
      "border-box",
    background:
      "#ffffff",
  },

  smallSelect: {
    padding:
      "10px 12px",
    borderRadius:
      "10px",
    border:
      "1px solid #d9dce3",
    background:
      "#ffffff",
  },

  label: {
    display:
      "block",
    fontWeight:
      "bold",
    marginBottom:
      "6px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },

  tableWrapper: {
    overflowX:
      "auto",
  },

  table: {
    width:
      "100%",
    borderCollapse:
      "collapse",
  },

  advisorGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },

  advisorCard: {
    border:
      "1px solid #e5e7eb",
    borderRadius:
      "14px",
    padding:
      "18px",
  },

  primaryButton: {
    padding:
      "12px 18px",
    border: "none",
    borderRadius:
      "10px",
    background:
      "#20242a",
    color:
      "#ffffff",
    cursor:
      "pointer",
    fontSize:
      "14px",
    fontWeight:
      "bold",
  },

  secondaryButton: {
    padding:
      "11px 17px",
    border:
      "1px solid #d9dce3",
    borderRadius:
      "10px",
    background:
      "#ffffff",
    color:
      "#20242a",
    cursor:
      "pointer",
    fontSize:
      "14px",
  },

  linkButton: {
    border: "none",
    background:
      "transparent",
    color:
      "#20242a",
    cursor:
      "pointer",
    fontWeight:
      "bold",
    padding: 0,
  },

  actionRow: {
    display: "flex",
    gap: "10px",
    flexWrap:
      "wrap",
    marginTop:
      "25px",
  },

  tabs: {
    display: "flex",
    gap: "8px",
    overflowX:
      "auto",
    marginTop:
      "25px",
    paddingBottom:
      "5px",
  },

  tab: {
    padding:
      "10px 14px",
    border:
      "1px solid #e5e7eb",
    borderRadius:
      "9px",
    background:
      "#ffffff",
    whiteSpace:
      "nowrap",
  },

  tabActive: {
    padding:
      "10px 14px",
    border:
      "1px solid #20242a",
    borderRadius:
      "9px",
    background:
      "#20242a",
    color:
      "#ffffff",
    whiteSpace:
      "nowrap",
  },

  message: {
    padding:
      "14px 18px",
    borderRadius:
      "10px",
    background:
      "#eaf7ef",
    border:
      "1px solid #b8e1c6",
    marginBottom:
      "20px",
  },

  placeholderBox: {
    padding:
      "18px",
    borderRadius:
      "12px",
    background:
      "#f8fafc",
    border:
      "1px solid #e5e7eb",
    marginBottom:
      "18px",
  },

  estadoRojo: {
    display:
      "inline-block",
    padding:
      "6px 9px",
    borderRadius:
      "8px",
    background:
      "#fee2e2",
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
      "#dcfce7",
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
