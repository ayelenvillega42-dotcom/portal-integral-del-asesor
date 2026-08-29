"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

const semanas = [
  "Semana 1 · Agosto",
  "Semana 2 · Agosto",
  "Semana 3 · Agosto",
  "Semana 4 · Agosto",
];

const pestañasAsesor = [
  { id: "inicio", label: "Inicio", icon: "🏠" },
  { id: "calidad", label: "Calidad", icon: "📊" },
  { id: "productividad", label: "Productividad", icon: "📈" },
  { id: "tipificaciones", label: "Tipificaciones", icon: "🏷️" },
  { id: "no-ventas", label: "No Ventas", icon: "🚫" },
  { id: "felicitaciones", label: "Mis Felicitaciones", icon: "🏆" },
  { id: "evolutivo", label: "Evolutivo", icon: "📈" },
  { id: "feedback", label: "Feedback", icon: "💬" },
];

const pestañasAdmin = [
  { id: "admin-inicio", label: "Inicio", icon: "🏠" },
  { id: "admin-asesores", label: "Asesores", icon: "👥" },
  { id: "admin-reportes", label: "Reportes", icon: "📋" },
];

export default function Page() {
  const [cargando, setCargando] = useState(true);
  const [logueado, setLogueado] = useState(false);
  const [perfil, setPerfil] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [iniciando, setIniciando] = useState(false);

  useEffect(() => {
    verificarSesion();

    if (!supabase) {
      setCargando(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await cargarPerfil(session.user);
        } else {
          setPerfil(null);
          setLogueado(false);
        }

        setCargando(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function verificarSesion() {
    if (!supabase) {
      setCargando(false);
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await cargarPerfil(session.user);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  }

  async function cargarPerfil(usuarioAuth) {
    if (!supabase || !usuarioAuth) return;

    const emailAuth = usuarioAuth.email?.trim().toLowerCase();

    if (!emailAuth) {
      setError(
        "Tu usuario no tiene un correo electrónico asociado."
      );
      setPerfil(null);
      setLogueado(false);
      return;
    }

    const { data, error } = await supabase
      .from("perfiles")
      .select("*")
      .eq("email", emailAuth)
      .single();

    if (error) {
      console.error("Error cargando perfil:", error);
      setError(
        "Tu usuario existe, pero no encontramos tu perfil en el portal."
      );
      setPerfil(null);
      setLogueado(false);
      return;
    }

    if (!data.activo) {
      setError(
        "Tu perfil está inactivo. Comunicate con el administrador."
      );
      setPerfil(null);
      setLogueado(false);
      return;
    }

    setPerfil({
      ...data,
      authUser: usuarioAuth,
    });

    setLogueado(true);
    setError("");
  }

  async function iniciarSesion(e) {
    e.preventDefault();

    setError("");

    if (!supabase) {
      setError(
        "No está configurada la conexión con Supabase."
      );
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError(
        "Ingresá tu correo electrónico y contraseña."
      );
      return;
    }

    setIniciando(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (error) {
        console.error("Error de login:", error);

        setError(
          "El correo o la contraseña no son correctos."
        );
        return;
      }

      if (!data.user) {
        setError("No se pudo iniciar sesión.");
        return;
      }

      await cargarPerfil(data.user);
    } catch (error) {
      console.error(error);

      setError(
        "Ocurrió un error al iniciar sesión."
      );
    } finally {
      setIniciando(false);
    }
  }

  async function cerrarSesion() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setPerfil(null);
    setLogueado(false);
    setEmail("");
    setPassword("");
    setError("");
  }

  if (cargando) {
    return (
      <main style={styles.loginPage}>
        <div style={styles.loginCard}>
          <div style={styles.logoCircle}>P</div>

          <h1 style={styles.loginTitle}>
            Portal Integral del Asesor
          </h1>

          <p style={styles.loginSubtitle}>
            Cargando tu información...
          </p>
        </div>
      </main>
    );
  }

  if (!logueado || !perfil) {
    return (
      <main style={styles.loginPage}>
        <div style={styles.loginCard}>
          <div style={styles.logoCircle}>P</div>

          <h1 style={styles.loginTitle}>
            Portal Integral del Asesor
          </h1>

          <p style={styles.loginSubtitle}>
            Ingresá para consultar tu información semanal.
          </p>

          <form onSubmit={iniciarSesion}>
            <label style={styles.label}>
              Correo electrónico
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Ingresá tu correo"
              style={styles.input}
              required
            />

            <label style={styles.label}>
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Ingresá tu contraseña"
              style={styles.input}
              required
            />

            {error && (
              <div style={styles.errorBox}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                ...styles.primaryButton,
                opacity: iniciando ? 0.7 : 1,
              }}
              disabled={iniciando}
            >
              {iniciando
                ? "Ingresando..."
                : "Ingresar"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (perfil.rol === "administrador") {
    return (
      <AdministradorPortal
        perfil={perfil}
        cerrarSesion={cerrarSesion}
      />
    );
  }

  return (
    <AsesorPortal
      perfil={perfil}
      cerrarSesion={cerrarSesion}
    />
  );
}

function AsesorPortal({ perfil, cerrarSesion }) {
  const [pestañaActiva, setPestañaActiva] =
    useState("inicio");

  const [semanaSeleccionada, setSemanaSeleccionada] =
    useState("Semana 4 · Agosto");

  const nombreCompleto =
    perfil.nombre ||
    perfil.email ||
    "Asesor";

  const nombre =
    nombreCompleto.includes(",")
      ? nombreCompleto.split(",")[1]?.trim() ||
        nombreCompleto
      : nombreCompleto;

  const usuario =
    perfil.usuario ||
    "—";

  return (
    <main style={styles.portalPage}>
      <div style={styles.portalLayout}>
        <aside style={styles.sidebar}>
          <div style={styles.brand}>
            <div style={styles.brandIcon}>P</div>

            <div>
              <strong>Portal Integral</strong>

              <span style={styles.sidebarSubtitle}>
                del Asesor
              </span>
            </div>
          </div>

          <div style={styles.userBox}>
            <div style={styles.avatar}>
              {nombre.charAt(0).toUpperCase()}
            </div>

            <div style={{ minWidth: 0 }}>
              <strong
                style={{
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {nombre}
              </strong>

              <span style={styles.userSmall}>
                Usuario {usuario}
              </span>
            </div>
          </div>

          <nav style={styles.navigation}>
            {pestañasAsesor.map((item) => {
              const activa =
                pestañaActiva === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    setPestañaActiva(item.id)
                  }
                  style={{
                    ...styles.navButton,
                    ...(activa
                      ? styles.navButtonActive
                      : {}),
                  }}
                >
                  <span style={styles.navIcon}>
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={cerrarSesion}
            style={styles.logoutButton}
          >
            Cerrar sesión
          </button>
        </aside>

        <section style={styles.mainArea}>
          <header style={styles.topbar}>
            <div>
              <div style={styles.topbarKicker}>
                PORTAL INTEGRAL DEL ASESOR
              </div>

              <h1 style={styles.topbarTitle}>
                {nombre}
              </h1>
            </div>

            <div style={styles.weekBadge}>
              <span style={styles.weekDot}></span>
              Semana vigente

              <strong>
                {semanaSeleccionada}
              </strong>
            </div>
          </header>

          <div style={styles.content}>
            {pestañaActiva === "inicio" && (
              <Inicio
                nombre={nombre}
                semana={semanaSeleccionada}
                cambiarPestaña={
                  setPestañaActiva
                }
              />
            )}

            {pestañaActiva === "calidad" && (
              <SeccionSemanal
                titulo="Calidad"
                icon="📊"
                descripcion="Tu desempeño de calidad organizado por semana."
                semana={semanaSeleccionada}
                setSemana={
                  setSemanaSeleccionada
                }
              >
                <CalidadSemana />
              </SeccionSemanal>
            )}

            {pestañaActiva === "productividad" && (
              <SeccionSemanal
                titulo="Productividad"
                icon="📈"
                descripcion="Tu desempeño de productividad organizado por semana."
                semana={semanaSeleccionada}
                setSemana={
                  setSemanaSeleccionada
                }
              >
                <ProductividadSemana />
              </SeccionSemanal>
            )}

            {pestañaActiva === "tipificaciones" && (
              <SeccionSemanal
                titulo="Tipificaciones"
                icon="🏷️"
                descripcion="Resultados y seguimiento de tus tipificaciones."
                semana={semanaSeleccionada}
                setSemana={
                  setSemanaSeleccionada
                }
              >
                <TipificacionesSemana />
              </SeccionSemanal>
            )}

            {pestañaActiva === "no-ventas" && (
              <SeccionSemanal
                titulo="No Ventas"
                icon="🚫"
                descripcion="Seguimiento de tus gestiones de no venta."
                semana={semanaSeleccionada}
                setSemana={
                  setSemanaSeleccionada
                }
              >
                <NoVentasSemana />
              </SeccionSemanal>
            )}

            {pestañaActiva === "felicitaciones" && (
              <SeccionSemanal
                titulo="Mis Felicitaciones"
                icon="🏆"
                descripcion="Reconocimientos recibidos durante cada semana."
                semana={semanaSeleccionada}
                setSemana={
                  setSemanaSeleccionada
                }
              >
                <FelicitacionesSemana />
              </SeccionSemanal>
            )}

            {pestañaActiva === "evolutivo" && (
              <Evolutivo />
            )}

            {pestañaActiva === "feedback" && (
              <Feedback
                semana={semanaSeleccionada}
                setSemana={
                  setSemanaSeleccionada
                }
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function AdministradorPortal({
  perfil,
  cerrarSesion,
}) {
  const [pestañaActiva, setPestañaActiva] =
    useState("admin-inicio");

  const nombre =
    perfil.nombre ||
    perfil.email ||
    "Administrador";

  return (
    <main style={styles.portalPage}>
      <div style={styles.portalLayout}>
        <aside style={styles.sidebar}>
          <div style={styles.brand}>
            <div style={styles.brandIcon}>P</div>

            <div>
              <strong>Portal Integral</strong>

              <span style={styles.sidebarSubtitle}>
                Administración
              </span>
            </div>
          </div>

          <div style={styles.userBox}>
            <div style={styles.avatar}>
              {nombre.charAt(0).toUpperCase()}
            </div>

            <div style={{ minWidth: 0 }}>
              <strong
                style={{
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {nombre}
              </strong>

              <span style={styles.userSmall}>
                Administrador
              </span>
            </div>
          </div>

          <nav style={styles.navigation}>
            {pestañasAdmin.map((item) => {
              const activa =
                pestañaActiva === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    setPestañaActiva(item.id)
                  }
                  style={{
                    ...styles.navButton,
                    ...(activa
                      ? styles.navButtonActive
                      : {}),
                  }}
                >
                  <span style={styles.navIcon}>
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={cerrarSesion}
            style={styles.logoutButton}
          >
            Cerrar sesión
          </button>
        </aside>

        <section style={styles.mainArea}>
          <header style={styles.topbar}>
            <div>
              <div style={styles.topbarKicker}>
                PORTAL INTEGRAL DEL ASESOR
              </div>

              <h1 style={styles.topbarTitle}>
                Administración
              </h1>
            </div>

            <div style={styles.adminBadge}>
              ADMINISTRADOR
            </div>
          </header>

          <div style={styles.content}>
            {pestañaActiva ===
              "admin-inicio" && (
              <AdminInicio
                nombre={nombre}
                cambiarPestaña={
                  setPestañaActiva
                }
              />
            )}

            {pestañaActiva ===
              "admin-asesores" && (
              <AdminAsesores />
            )}

            {pestañaActiva ===
              "admin-reportes" && (
              <AdminReportes />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function AdminInicio({
  nombre,
  cambiarPestaña,
}) {
  return (
    <>
      <div style={styles.hero}>
        <div>
          <span style={styles.heroLabel}>
            PANEL DE ADMINISTRACIÓN
          </span>

          <h2 style={styles.heroTitle}>
            Hola, {nombre}
          </h2>

          <p style={styles.heroText}>
            Desde acá podés administrar los asesores
            y gestionar la información del portal.
          </p>
        </div>

        <div style={styles.heroWeek}>
          <span>Estado</span>
          <strong>Panel activo</strong>
        </div>
      </div>

      <div style={styles.metricsGrid}>
        <MetricCard
          title="Asesores"
          value="—"
          description="Perfiles registrados"
          icon="👥"
        />

        <MetricCard
          title="Reportes"
          value="—"
          description="Reportes cargados"
          icon="📋"
        />

        <MetricCard
          title="Seguimiento"
          value="—"
          description="Gestiones activas"
          icon="📈"
        />

        <MetricCard
          title="Estado"
          value="Activo"
          description="Portal operativo"
          icon="✓"
        />
      </div>

      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          Administración
        </h2>

        <p style={styles.sectionDescription}>
          Gestioná desde acá la información principal
          del portal.
        </p>
      </div>

      <div style={styles.cardsGrid}>
        <QuickCard
          icon="👥"
          title="Asesores"
          text="Crear, consultar y administrar los perfiles de los asesores."
          onClick={() =>
            cambiarPestaña("admin-asesores")
          }
        />

        <QuickCard
          icon="📋"
          title="Reportes"
          text="Gestionar los reportes y la información semanal."
          onClick={() =>
            cambiarPestaña("admin-reportes")
          }
        />
      </div>
    </>
  );
}

function AdminAsesores() {
  const [asesores, setAsesores] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  const [error, setError] =
    useState("");

  const [formulario, setFormulario] =
    useState({
      nombre: "",
      usuario: "",
      email: "",
      password: "",
    });

  useEffect(() => {
    cargarAsesores();
  }, []);

  async function cargarAsesores() {
    if (!supabase) return;

    setCargando(true);
    setError("");

    const { data, error } = await supabase
      .from("perfiles")
      .select("*")
      .eq("rol", "asesor")
      .order("nombre", {
        ascending: true,
      });

    if (error) {
      console.error(error);
      setError(
        "No se pudieron cargar los asesores."
      );
    } else {
      setAsesores(data || []);
    }

    setCargando(false);
  }

  function cambiarCampo(campo, valor) {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  }

  async function crearAsesor(e) {
    e.preventDefault();

    setMensaje("");
    setError("");

    if (
      !formulario.nombre.trim() ||
      !formulario.usuario.trim() ||
      !formulario.email.trim() ||
      !formulario.password.trim()
    ) {
      setError(
        "Completá todos los campos."
      );
      return;
    }

    if (formulario.password.length < 6) {
      setError(
        "La contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    try {
      const {
        data: {
          session,
        },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "La sesión del administrador expiró."
        );
        return;
      }

      const respuesta = await fetch(
        "/api/admin/usuarios",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            nombre:
              formulario.nombre.trim(),
            usuario:
              formulario.usuario.trim(),
            email:
              formulario.email.trim().toLowerCase(),
            password:
              formulario.password,
          }),
        }
      );

      const resultado =
        await respuesta.json();

      if (!respuesta.ok) {
        setError(
          resultado.error ||
            "No se pudo crear el asesor."
        );
        return;
      }

      setMensaje(
        "Asesor creado correctamente."
      );

      setFormulario({
        nombre: "",
        usuario: "",
        email: "",
        password: "",
      });

      setMostrarFormulario(false);

      await cargarAsesores();
    } catch (error) {
      console.error(error);

      setError(
        "Ocurrió un error al crear el asesor."
      );
    }
  }

  return (
    <>
      <div style={styles.pageHeading}>
        <div style={styles.pageHeadingIcon}>
          👥
        </div>

        <h2 style={styles.pageHeadingTitle}>
          Asesores
        </h2>

        <p style={styles.pageHeadingText}>
          Administración de los perfiles de los asesores.
        </p>
      </div>

      {mensaje && (
        <div style={styles.successBox}>
          {mensaje}
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      <div style={styles.adminToolbar}>
        <div>
          <strong>
            Base de asesores
          </strong>

          <p style={styles.muted}>
            Los asesores que aparecen acá
            provienen directamente de Supabase.
          </p>
        </div>

        <button
          onClick={() =>
            setMostrarFormulario(
              !mostrarFormulario
            )
          }
          style={styles.primaryButtonSmall}
        >
          {mostrarFormulario
            ? "Cancelar"
            : "+ Nuevo asesor"}
        </button>
      </div>

      {mostrarFormulario && (
        <form
          onSubmit={crearAsesor}
          style={styles.adminForm}
        >
          <div style={styles.formTitle}>
            Nuevo asesor
          </div>

          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>
                Nombre y apellido
              </label>

              <input
                value={formulario.nombre}
                onChange={(e) =>
                  cambiarCampo(
                    "nombre",
                    e.target.value
                  )
                }
                placeholder="Ej. Carla Gomez"
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>
                Usuario
              </label>

              <input
                value={formulario.usuario}
                onChange={(e) =>
                  cambiarCampo(
                    "usuario",
                    e.target.value
                  )
                }
                placeholder="Ej. 8126"
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>
                Correo electrónico
              </label>

              <input
                type="email"
                value={formulario.email}
                onChange={(e) =>
                  cambiarCampo(
                    "email",
                    e.target.value
                  )
                }
                placeholder="correo@empresa.com"
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>
                Contraseña inicial
              </label>

              <input
                type="password"
                value={formulario.password}
                onChange={(e) =>
                  cambiarCampo(
                    "password",
                    e.target.value
                  )
                }
                placeholder="Mínimo 6 caracteres"
                style={styles.input}
              />
            </div>
          </div>

          <button
            type="submit"
            style={styles.primaryButtonLarge}
          >
            Crear asesor
          </button>
        </form>
      )}

      <div style={styles.adminTableCard}>
        <div style={styles.tableHeader}>
          <strong>
            Asesores registrados
          </strong>

          <span style={styles.tableCount}>
            {asesores.length}
          </span>
        </div>

        {cargando ? (
          <div style={styles.emptyAdmin}>
            Cargando asesores...
          </div>
        ) : asesores.length === 0 ? (
          <div style={styles.emptyAdmin}>
            <div style={styles.emptyIcon}>
              👥
            </div>

            <strong>
              Todavía no hay asesores
            </strong>

            <p style={styles.muted}>
              Usá “+ Nuevo asesor” para
              crear el primero.
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>
                    Nombre
                  </th>

                  <th style={styles.th}>
                    Usuario
                  </th>

                  <th style={styles.th}>
                    Email
                  </th>

                  <th style={styles.th}>
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody>
                {asesores.map((asesor) => (
                  <tr key={asesor.id}>
                    <td style={styles.td}>
                      <strong>
                        {asesor.nombre ||
                          "—"}
                      </strong>
                    </td>

                    <td style={styles.td}>
                      {asesor.usuario ||
                        "—"}
                    </td>

                    <td style={styles.td}>
                      {asesor.email ||
                        "—"}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={
                          asesor.activo
                            ? styles.activeBadge
                            : styles.inactiveBadge
                        }
                      >
                        {asesor.activo
                          ? "Activo"
                          : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function AdminReportes() {
  return (
    <>
      <div style={styles.pageHeading}>
        <div style={styles.pageHeadingIcon}>
          📋
        </div>

        <h2 style={styles.pageHeadingTitle}>
          Reportes
        </h2>

        <p style={styles.pageHeadingText}>
          Gestión de los reportes semanales.
        </p>
      </div>

      <div style={styles.emptyAdmin}>
        <div style={styles.emptyIcon}>
          📋
        </div>

        <h3>
          Gestión de reportes
        </h3>

        <p style={styles.muted}>
          Esta sección queda preparada para
          conectar los reportes semanales que
          carguemos desde el administrador.
        </p>
      </div>
    </>
  );
}

function Inicio({
  nombre,
  semana,
  cambiarPestaña,
}) {
  return (
    <>
      <div style={styles.hero}>
        <div>
          <span style={styles.heroLabel}>
            RESUMEN SEMANAL
          </span>

          <h2 style={styles.heroTitle}>
            Hola, {nombre}
          </h2>

          <p style={styles.heroText}>
            Acá vas a encontrar toda la información
            de tu seguimiento y evolución.
          </p>
        </div>

        <div style={styles.heroWeek}>
          <span>Semana vigente</span>
          <strong>{semana}</strong>
        </div>
      </div>

      <div style={styles.metricsGrid}>
        <MetricCard
          title="Calidad"
          value="—"
          description="Resultado semanal"
          icon="📊"
        />

        <MetricCard
          title="Productividad"
          value="—"
          description="SPH semanal"
          icon="📈"
        />

        <MetricCard
          title="Tipificaciones"
          value="—"
          description="Resultado semanal"
          icon="🏷️"
        />

        <MetricCard
          title="No Ventas"
          value="—"
          description="Seguimiento semanal"
          icon="🚫"
        />
      </div>

      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          Tu semana
        </h2>

        <p style={styles.sectionDescription}>
          Accedé rápidamente a la información
          correspondiente a la semana vigente.
        </p>
      </div>

      <div style={styles.cardsGrid}>
        <QuickCard
          icon="📊"
          title="Calidad"
          text="Consultá tu nota, fortalezas, desvíos y devoluciones."
          onClick={() =>
            cambiarPestaña("calidad")
          }
        />

        <QuickCard
          icon="📈"
          title="Productividad"
          text="Consultá tu SPH, ventas y seguimiento."
          onClick={() =>
            cambiarPestaña("productividad")
          }
        />

        <QuickCard
          icon="🏷️"
          title="Tipificaciones"
          text="Revisá tus resultados y oportunidades de mejora."
          onClick={() =>
            cambiarPestaña("tipificaciones")
          }
        />

        <QuickCard
          icon="🚫"
          title="No Ventas"
          text="Consultá tus gestiones y aspectos trabajados."
          onClick={() =>
            cambiarPestaña("no-ventas")
          }
        />

        <QuickCard
          icon="🏆"
          title="Mis Felicitaciones"
          text="Mirá los reconocimientos que recibiste."
          onClick={() =>
            cambiarPestaña("felicitaciones")
          }
        />

        <QuickCard
          icon="💬"
          title="Feedback"
          text="Dejá tu comentario y realizá el cierre semanal."
          onClick={() =>
            cambiarPestaña("feedback")
          }
        />
      </div>

      <div style={styles.infoBanner}>
        <div style={styles.infoIcon}>
          ℹ️
        </div>

        <div>
          <strong>
            Tu información está organizada por semana
          </strong>

          <p style={styles.muted}>
            Cada sección del portal muestra claramente
            lo correspondiente a cada semana.
          </p>
        </div>
      </div>
    </>
  );
}

function SeccionSemanal({
  titulo,
  icon,
  descripcion,
  semana,
  setSemana,
  children,
}) {
  return (
    <>
      <div style={styles.pageHeading}>
        <div style={styles.pageHeadingIcon}>
          {icon}
        </div>

        <h2 style={styles.pageHeadingTitle}>
          {titulo}
        </h2>

        <p style={styles.pageHeadingText}>
          {descripcion}
        </p>
      </div>

      <div style={styles.weekSelectorCard}>
        <div>
          <span style={styles.selectorLabel}>
            SEMANA
          </span>

          <strong style={styles.selectedWeek}>
            {semana}
          </strong>
        </div>

        <select
          value={semana}
          onChange={(e) =>
            setSemana(e.target.value)
          }
          style={styles.weekSelect}
        >
          {semanas.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.weekContent}>
        <div style={styles.weekHeader}>
          <span style={styles.weekHeaderIcon}>
            📅
          </span>

          <div>
            <span
              style={styles.weekHeaderSmall}
            >
              INFORMACIÓN DE LA SEMANA
            </span>

            <h3
              style={styles.weekHeaderTitle}
            >
              {semana}
            </h3>
          </div>
        </div>

        {children}
      </div>
    </>
  );
}

function CalidadSemana() {
  return (
    <div style={styles.placeholderGrid}>
      <DataCard
        title="Nota de calidad"
        value="—"
      />

      <DataCard
        title="Evolución"
        value="—"
      />

      <DataCard
        title="Desvíos"
        value="—"
      />

      <DataCard
        title="Fortalezas"
        value="—"
      />

      <WideDataCard
        title="Devoluciones"
        text="Las devoluciones correspondientes a esta semana aparecerán acá."
      />

      <WideDataCard
        title="Aspectos trabajados"
        text="Los aspectos registrados durante la semana aparecerán acá."
      />
    </div>
  );
}

function ProductividadSemana() {
  return (
    <div style={styles.placeholderGrid}>
      <DataCard
        title="SPH"
        value="—"
      />

      <DataCard
        title="Ventas"
        value="—"
      />

      <DataCard
        title="Objetivo SPH"
        value="—"
      />

      <DataCard
        title="Objetivo ventas"
        value="—"
      />

      <WideDataCard
        title="Aspectos trabajados"
        text="Los aspectos de productividad registrados durante la semana aparecerán acá."
      />

      <WideDataCard
        title="Acciones"
        text="Las acciones realizadas durante la semana aparecerán acá."
      />
    </div>
  );
}

function TipificacionesSemana() {
  return (
    <div style={styles.placeholderGrid}>
      <DataCard
        title="Resultado"
        value="—"
      />

      <DataCard
        title="Objetivo"
        value="—"
      />

      <DataCard
        title="Desvío"
        value="—"
      />

      <DataCard
        title="Evolución"
        value="—"
      />

      <WideDataCard
        title="Tipificaciones auditadas"
        text="Las tipificaciones trabajadas durante la semana aparecerán acá."
      />

      <WideDataCard
        title="Devoluciones"
        text="Las devoluciones de tipificaciones correspondientes a esta semana aparecerán acá."
      />
    </div>
  );
}

function NoVentasSemana() {
  return (
    <div style={styles.placeholderGrid}>
      <DataCard
        title="Cantidad"
        value="—"
      />

      <DataCard
        title="Coaching"
        value="—"
      />

      <DataCard
        title="Registro en sistema"
        value="—"
      />

      <DataCard
        title="Compromiso"
        value="—"
      />

      <WideDataCard
        title="Principales O.M."
        text="Las oportunidades de mejora registradas durante la semana aparecerán acá."
      />

      <WideDataCard
        title="Fortalezas"
        text="Las fortalezas destacadas durante la semana aparecerán acá."
      />
    </div>
  );
}

function FelicitacionesSemana() {
  return (
    <div style={styles.emptyCard}>
      <div style={styles.emptyIcon}>
        🏆
      </div>

      <h3>
        Felicitaciones de la semana
      </h3>

      <p style={styles.muted}>
        Los reconocimientos que sean cargados
        para esta semana aparecerán acá.
      </p>
    </div>
  );
}

function Evolutivo() {
  return (
    <>
      <div style={styles.pageHeading}>
        <div style={styles.pageHeadingIcon}>
          📈
        </div>

        <h2 style={styles.pageHeadingTitle}>
          Evolutivo
        </h2>

        <p style={styles.pageHeadingText}>
          Comparación de tu desempeño a través
          de las semanas.
        </p>
      </div>

      <EvolutionBlock title="Calidad" />
      <EvolutionBlock title="Productividad" />
    </>
  );
}

function EvolutionBlock({ title }) {
  return (
    <div style={styles.evolutionCard}>
      <span style={styles.selectorLabel}>
        {title.toUpperCase()}
      </span>

      <h3
        style={{
          margin: "5px 0 18px",
        }}
      >
        Evolución semanal
      </h3>

      <div style={styles.evolutionRows}>
        {semanas.map((semana) => (
          <div
            key={semana}
            style={styles.evolutionRow}
          >
            <span>{semana}</span>

            <div style={styles.evolutionLine}>
              <div style={styles.evolutionBar}>
                <div
                  style={
                    styles.evolutionBarFill
                  }
                ></div>
              </div>

              <strong>—</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Feedback({
  semana,
  setSemana,
}) {
  const [feedback, setFeedback] =
    useState("");

  const [firma, setFirma] =
    useState("");

  const [motivo, setMotivo] =
    useState("");

  function guardarFeedback(e) {
    e.preventDefault();

    if (!feedback.trim()) {
      alert(
        "Escribí tu feedback antes de guardar."
      );
      return;
    }

    if (!firma) {
      alert(
        "Seleccioná conformidad o disconformidad."
      );
      return;
    }

    alert(
      "El feedback y el cierre semanal quedaron preparados para guardarse."
    );
  }

  return (
    <>
      <div style={styles.pageHeading}>
        <div style={styles.pageHeadingIcon}>
          💬
        </div>

        <h2 style={styles.pageHeadingTitle}>
          Feedback
        </h2>

        <p style={styles.pageHeadingText}>
          Un feedback correspondiente a cada semana.
        </p>
      </div>

      <div style={styles.weekSelectorCard}>
        <div>
          <span style={styles.selectorLabel}>
            FEEDBACK DE
          </span>

          <strong style={styles.selectedWeek}>
            {semana}
          </strong>
        </div>

        <select
          value={semana}
          onChange={(e) =>
            setSemana(e.target.value)
          }
          style={styles.weekSelect}
        >
          {semanas.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={guardarFeedback}>
        <div style={styles.feedbackCard}>
          <span style={styles.selectorLabel}>
            TU FEEDBACK SEMANAL
          </span>

          <h3
            style={{
              margin: "7px 0 8px",
            }}
          >
            ¿Querés contarnos algo?
          </h3>

          <p style={styles.muted}>
            Podés escribir consultas, pedidos,
            comentarios, aclaraciones, propuestas
            o cualquier cuestión que quieras comunicar.
          </p>

          <textarea
            value={feedback}
            onChange={(e) =>
              setFeedback(e.target.value)
            }
            placeholder="Escribí acá tu feedback de la semana..."
            style={styles.feedbackTextarea}
          />
        </div>

        <div style={styles.signatureCard}>
          <span style={styles.selectorLabel}>
            CIERRE DE LA SEMANA
          </span>

          <h3
            style={{
              margin: "7px 0 8px",
            }}
          >
            ¿Cómo querés cerrar esta semana?
          </h3>

          <p style={styles.muted}>
            La firma corresponde al cierre de todo
            lo ocurrido durante esta semana.
          </p>

          <div style={styles.signatureOptions}>
            <button
              type="button"
              onClick={() =>
                setFirma("conformidad")
              }
              style={{
                ...styles.signatureButton,
                ...(firma ===
                "conformidad"
                  ? styles.signatureButtonGreen
                  : {}),
              }}
            >
              ✓ Firmar en conformidad
            </button>

            <button
              type="button"
              onClick={() =>
                setFirma("disconformidad")
              }
              style={{
                ...styles.signatureButton,
                ...(firma ===
                "disconformidad"
                  ? styles.signatureButtonRed
                  : {}),
              }}
            >
              ✕ Firmar en disconformidad
            </button>
          </div>

          {firma ===
            "disconformidad" && (
            <div style={{ marginTop: 20 }}>
              <label style={styles.label}>
                Motivo de la disconformidad
              </label>

              <textarea
                value={motivo}
                onChange={(e) =>
                  setMotivo(e.target.value)
                }
                placeholder="Escribí el motivo..."
                style={
                  styles.feedbackTextarea
                }
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          style={
            styles.primaryButtonLarge
          }
        >
          Guardar Feedback y cierre semanal
        </button>
      </form>
    </>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricIcon}>
        {icon}
      </div>

      <div>
        <span style={styles.metricTitle}>
          {title}
        </span>

        <strong style={styles.metricValue}>
          {value}
        </strong>

        <span
          style={styles.metricDescription}
        >
          {description}
        </span>
      </div>
    </div>
  );
}

function QuickCard({
  icon,
  title,
  text,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      style={styles.quickCard}
    >
      <div style={styles.quickIcon}>
        {icon}
      </div>

      <div style={{ textAlign: "left" }}>
        <h3
          style={{
            margin: "0 0 7px",
          }}
        >
          {title}
        </h3>

        <p style={styles.quickText}>
          {text}
        </p>
      </div>

      <span style={styles.arrow}>
        →
      </span>
    </button>
  );
}

function DataCard({
  title,
  value,
}) {
  return (
    <div style={styles.dataCard}>
      <span style={styles.dataTitle}>
        {title}
      </span>

      <strong style={styles.dataValue}>
        {value}
      </strong>
    </div>
  );
}

function WideDataCard({
  title,
  text,
}) {
  return (
    <div style={styles.wideDataCard}>
      <span style={styles.dataTitle}>
        {title}
      </span>

      <p style={styles.muted}>
        {text}
      </p>
    </div>
  );
}

const styles = {
  loginPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #f4f6f8 0%, #e9edf2 100%)",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },

  loginCard: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "42px",
    boxShadow:
      "0 12px 40px rgba(0,0,0,0.10)",
    boxSizing: "border-box",
  },

  logoCircle: {
    width: "54px",
    height: "54px",
    borderRadius: "16px",
    background: "#20242a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "22px",
    marginBottom: "22px",
  },

  loginTitle: {
    margin: "0 0 10px",
    fontSize: "27px",
  },

  loginSubtitle: {
    color: "#68707b",
    margin: "0 0 28px",
    lineHeight: 1.5,
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "7px",
    color: "#343941",
  },

  input: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #d9dce3",
    marginBottom: "18px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  },

  primaryButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "11px",
    background: "#20242a",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  primaryButtonSmall: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "11px",
    background: "#20242a",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  primaryButtonLarge: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    background: "#20242a",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "18px",
  },

  errorBox: {
    background: "#fff1f1",
    border: "1px solid #efb5b5",
    color: "#a52b2b",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontSize: "13px",
  },

  successBox: {
    background: "#eaf7ef",
    border: "1px solid #9dd0ad",
    color: "#26733c",
    padding: "13px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontSize: "13px",
    fontWeight: "600",
  },

  portalPage: {
    minHeight: "100vh",
    background: "#f4f6f8",
    fontFamily: "Arial, sans-serif",
    color: "#20242a",
  },

  portalLayout: {
    display: "flex",
    minHeight: "100vh",
  },

  sidebar: {
    width: "260px",
    background: "#ffffff",
    borderRight: "1px solid #e3e6eb",
    padding: "22px 16px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    height: "100vh",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "4px 8px 22px",
  },

  brandIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#20242a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "18px",
  },

  sidebarSubtitle: {
    display: "block",
    color: "#8a919b",
    fontSize: "12px",
  },

  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px",
    background: "#f6f7f9",
    borderRadius: "14px",
    marginBottom: "18px",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    background: "#e3e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    color: "#20242a",
    flexShrink: 0,
  },

  userSmall: {
    display: "block",
    color: "#8a919b",
    fontSize: "11px",
    marginTop: "3px",
  },

  navigation: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    overflowY: "auto",
  },

  navButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "11px 12px",
    border: "none",
    borderRadius: "10px",
    background: "transparent",
    color: "#68707b",
    cursor: "pointer",
    fontSize: "14px",
    textAlign: "left",
  },

  navButtonActive: {
    background: "#20242a",
    color: "#ffffff",
    fontWeight: "700",
  },

  navIcon: {
    width: "24px",
    textAlign: "center",
    fontSize: "16px",
  },

  logoutButton: {
    marginTop: "auto",
    padding: "11px",
    border: "1px solid #e1e4e8",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#68707b",
    cursor: "pointer",
    fontWeight: "600",
  },

  mainArea: {
    flex: 1,
    minWidth: 0,
  },

  topbar: {
    background: "#ffffff",
    borderBottom: "1px solid #e3e6eb",
    padding: "22px 34px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  topbarKicker: {
    color: "#8a919b",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "5px",
  },

  topbarTitle: {
    margin: 0,
    fontSize: "24px",
  },

  weekBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    background: "#f6f7f9",
    borderRadius: "12px",
    fontSize: "12px",
    color: "#68707b",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  adminBadge: {
    padding: "10px 14px",
    background: "#20242a",
    color: "#ffffff",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.6px",
  },

  weekDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#55a36a",
    display: "inline-block",
  },

  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 34px 50px",
  },

  hero: {
    background: "#20242a",
    color: "#ffffff",
    borderRadius: "22px",
    padding: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    marginBottom: "22px",
  },

  heroLabel: {
    fontSize: "11px",
    letterSpacing: "1px",
    opacity: 0.65,
    fontWeight: "700",
  },

  heroTitle: {
    margin: "8px 0",
    fontSize: "29px",
  },

  heroText: {
    margin: 0,
    color: "#d4d8dd",
    maxWidth: "600px",
    lineHeight: 1.5,
  },

  heroWeek: {
    minWidth: "180px",
    background:
      "rgba(255,255,255,0.10)",
    borderRadius: "14px",
    padding: "15px",
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "15px",
    marginBottom: "30px",
  },

  metricCard: {
    background: "#ffffff",
    borderRadius: "17px",
    padding: "19px",
    display: "flex",
    gap: "14px",
    alignItems: "center",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.05)",
  },

  metricIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#f1f3f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },

  metricTitle: {
    display: "block",
    fontSize: "12px",
    color: "#68707b",
  },

  metricValue: {
    display: "block",
    fontSize: "25px",
    margin: "4px 0",
  },

  metricDescription: {
    display: "block",
    fontSize: "11px",
    color: "#9298a0",
  },

  sectionHeader: {
    marginBottom: "16px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "21px",
  },

  sectionDescription: {
    margin: "5px 0 0",
    color: "#68707b",
    fontSize: "13px",
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px",
  },

  quickCard: {
    border: "1px solid #e4e7eb",
    background: "#ffffff",
    borderRadius: "17px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
    position: "relative",
    textAlign: "left",
  },

  quickIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "13px",
    background: "#f1f3f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    flexShrink: 0,
  },

  quickText: {
    margin: 0,
    color: "#68707b",
    fontSize: "12px",
    lineHeight: 1.45,
  },

  arrow: {
    marginLeft: "auto",
    color: "#8a919b",
    fontSize: "20px",
  },

  infoBanner: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    background: "#ffffff",
    border: "1px solid #e3e6eb",
    borderRadius: "15px",
    padding: "16px",
    marginTop: "18px",
  },

  infoIcon: {
    fontSize: "17px",
  },

  pageHeading: {
    marginBottom: "20px",
  },

  pageHeadingIcon: {
    fontSize: "25px",
    marginBottom: "7px",
  },

  pageHeadingTitle: {
    margin: 0,
    fontSize: "27px",
  },

  pageHeadingText: {
    margin: "7px 0 0",
    color: "#68707b",
    fontSize: "14px",
  },

  weekSelectorCard: {
    background: "#ffffff",
    borderRadius: "17px",
    padding: "18px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "18px",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.05)",
  },

  selectorLabel: {
    display: "block",
    fontSize: "10px",
    letterSpacing: "0.8px",
    fontWeight: "700",
    color: "#9298a0",
  },

  selectedWeek: {
    display: "block",
    marginTop: "4px",
    fontSize: "17px",
  },

  weekSelect: {
    padding: "11px 13px",
    borderRadius: "10px",
    border: "1px solid #d9dce3",
    background: "#ffffff",
    minWidth: "190px",
    fontSize: "13px",
    cursor: "pointer",
  },

  weekContent: {
    background: "#ffffff",
    borderRadius: "19px",
    padding: "22px",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.05)",
  },

  weekHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingBottom: "18px",
    borderBottom:
      "1px solid #edf0f2",
    marginBottom: "18px",
  },

  weekHeaderIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#f1f3f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  weekHeaderSmall: {
    fontSize: "10px",
    color: "#9298a0",
    letterSpacing: "0.8px",
    fontWeight: "700",
  },

  weekHeaderTitle: {
    margin: "3px 0 0",
    fontSize: "19px",
  },

  placeholderGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
  },

  dataCard: {
    background: "#f8f9fa",
    borderRadius: "14px",
    padding: "18px",
    minHeight: "90px",
  },

  dataTitle: {
    display: "block",
    fontSize: "11px",
    color: "#68707b",
    fontWeight: "700",
  },

  dataValue: {
    display: "block",
    fontSize: "25px",
    marginTop: "9px",
  },

  wideDataCard: {
    background: "#f8f9fa",
    borderRadius: "14px",
    padding: "18px",
    gridColumn: "span 2",
  },

  emptyCard: {
    background: "#f8f9fa",
    borderRadius: "15px",
    padding: "35px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "34px",
    marginBottom: "10px",
  },

  muted: {
    color: "#68707b",
    lineHeight: 1.5,
    fontSize: "13px",
  },

  evolutionCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "22px",
    marginBottom: "18px",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.05)",
  },

  evolutionRows: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  evolutionRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    fontSize: "13px",
  },

  evolutionLine: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  evolutionBar: {
    flex: 1,
    height: "9px",
    borderRadius: "20px",
    background: "#edf0f2",
    overflow: "hidden",
  },

  evolutionBarFill: {
    width: "0%",
    height: "100%",
    borderRadius: "20px",
    background: "#20242a",
  },

  feedbackCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "23px",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.05)",
    marginBottom: "18px",
  },

  feedbackTextarea: {
    width: "100%",
    minHeight: "150px",
    resize: "vertical",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d9dce3",
    fontFamily:
      "Arial, sans-serif",
    fontSize: "14px",
    marginTop: "15px",
    outline: "none",
  },

  signatureCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "23px",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.05)",
  },

  signatureOptions: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "12px",
    marginTop: "18px",
  },

  signatureButton: {
    padding: "14px",
    borderRadius: "11px",
    border: "1px solid #d9dce3",
    background: "#ffffff",
    color: "#20242a",
    cursor: "pointer",
    fontWeight: "700",
  },

  signatureButtonGreen: {
    background: "#eaf7ef",
    border: "1px solid #9dd0ad",
    color: "#26733c",
  },

  signatureButtonRed: {
    background: "#fff1f1",
    border: "1px solid #e2aaaa",
    color: "#a52b2b",
  },

  adminToolbar: {
    background: "#ffffff",
    borderRadius: "17px",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "18px",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.05)",
  },

  adminForm: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "23px",
    marginBottom: "18px",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.05)",
  },

  formTitle: {
    fontSize: "19px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "15px",
  },

  adminTableCard: {
    background: "#ffffff",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.05)",
  },

  tableHeader: {
    padding: "20px",
    borderBottom:
      "1px solid #edf0f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  tableCount: {
    background: "#f1f3f5",
    borderRadius: "20px",
    padding: "5px 10px",
    fontSize: "12px",
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

  th: {
    textAlign: "left",
    padding: "13px 18px",
    fontSize: "11px",
    color: "#9298a0",
    letterSpacing: "0.5px",
    borderBottom:
      "1px solid #edf0f2",
    background: "#fafbfc",
  },

  td: {
    padding: "15px 18px",
    fontSize: "13px",
    borderBottom:
      "1px solid #f0f2f4",
  },

  activeBadge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "20px",
    background: "#eaf7ef",
    color: "#26733c",
    fontSize: "11px",
    fontWeight: "700",
  },

  inactiveBadge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "20px",
    background: "#fff1f1",
    color: "#a52b2b",
    fontSize: "11px",
    fontWeight: "700",
  },

  emptyAdmin: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "45px",
    textAlign: "center",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.05)",
  },
};
