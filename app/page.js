"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "ayelenvillega42@gmail.com";

export default function Page() {
  const [session, setSession] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [modo, setModo] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [entrando, setEntrando] = useState(false);

  const [usuarioActual, setUsuarioActual] = useState(null);
  const [reportes, setReportes] = useState([]);
  const [cargandoReportes, setCargandoReportes] = useState(false);

  useEffect(() => {
    let activo = true;

    async function verificarSesion() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!activo) return;

        setSession(session);

        if (session?.user?.email) {
          await identificarUsuario(session.user.email);
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        if (activo) {
          setModo("login");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    verificarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!activo) return;

      setSession(session);

      if (!session?.user?.email) {
        setUsuarioActual(null);
        setReportes([]);
        setModo("login");
        return;
      }

      /*
       * Evitamos volver a consultar innecesariamente durante
       * cada cambio interno de estado de Supabase.
       */
      if (_event === "SIGNED_IN") {
        await identificarUsuario(session.user.email);
      }
    });

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, []);

  async function identificarUsuario(correo) {
    const emailNormalizado = correo?.trim().toLowerCase();

    if (!emailNormalizado) {
      await supabase.auth.signOut();
      setModo("login");
      return;
    }

    /*
     * Primero reconocemos al administrador por su email.
     * La tabla usuarios también contiene su registro.
     */
    if (emailNormalizado === ADMIN_EMAIL.toLowerCase()) {
      setUsuarioActual({
        email: emailNormalizado,
        nombre: "Ayelen Villega",
        rol: "administrador",
        activo: true,
      });

      setModo("admin");
      return;
    }

    /*
     * Para los asesores usamos la tabla usuarios.
     */
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("id,nombre,usuario,email,rol,activo,created_at")
      .eq("email", emailNormalizado)
      .maybeSingle();

    if (error) {
      console.error("Error consultando usuarios:", error);

      await supabase.auth.signOut();

      setUsuarioActual(null);
      setModo("login");
      setLoginError(
        "No se pudo verificar tu usuario. Intentá nuevamente."
      );

      return;
    }

    if (!usuario) {
      await supabase.auth.signOut();

      setUsuarioActual(null);
      setModo("login");
      setLoginError(
        "Tu cuenta no está asociada a un usuario registrado."
      );

      return;
    }

    if (usuario.activo !== true) {
      await supabase.auth.signOut();

      setUsuarioActual(null);
      setModo("login");
      setLoginError(
        "Tu usuario se encuentra inactivo. Contactá a Calidad."
      );

      return;
    }

    if (usuario.rol !== "asesor") {
      await supabase.auth.signOut();

      setUsuarioActual(null);
      setModo("login");
      setLoginError(
        "El rol de tu cuenta no permite ingresar al portal."
      );

      return;
    }

    setUsuarioActual(usuario);
    setModo("asesor");

    await cargarReportes(usuario);
  }

  async function cargarReportes(usuario) {
    if (!usuario) return;

    setCargandoReportes(true);

    try {
      /*
       * Primero buscamos por email.
       *
       * También contemplamos:
       * - usuario, por si reportes guarda el identificador
       * - nombre, porque los reportes anteriores pueden tener
       *   "Gomez, Carla", "Mercado, Chiara", etc.
       */
      const emailUsuario = usuario.email?.trim().toLowerCase();
      const nombreUsuario = usuario.nombre?.trim();

      let resultados = [];

      if (emailUsuario) {
        const { data, error } = await supabase
          .from("reportes")
          .select("*")
          .eq("usuario", emailUsuario)
          .order("id", { ascending: false });

        if (!error && data) {
          resultados = data;
        }
      }

      /*
       * Si todavía no encontramos reportes, buscamos por nombre.
       * Esto permite que los reportes históricos sigan apareciendo
       * aunque hayan sido guardados con el nombre del asesor.
       */
      if (resultados.length === 0 && nombreUsuario) {
        const { data, error } = await supabase
          .from("reportes")
          .select("*")
          .eq("asesor", nombreUsuario)
          .order("id", { ascending: false });

        if (!error && data) {
          resultados = data;
        }
      }

      /*
       * Si la columna usuario contiene el UUID del registro
       * de usuarios, también lo contemplamos.
       */
      if (resultados.length === 0 && usuario.id) {
        const { data, error } = await supabase
          .from("reportes")
          .select("*")
          .eq("usuario", usuario.id)
          .order("id", { ascending: false });

        if (!error && data) {
          resultados = data;
        }
      }

      setReportes(resultados || []);
    } catch (error) {
      console.error("Error cargando reportes:", error);
      setReportes([]);
    } finally {
      setCargandoReportes(false);
    }
  }

  async function iniciarSesion(e) {
    e.preventDefault();

    if (!email || !password) {
      setLoginError("Ingresá tu email y contraseña.");
      return;
    }

    setEntrando(true);
    setLoginError("");

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (error) {
        console.error(error);

        setLoginError(
          "El email o la contraseña no son correctos."
        );

        setEntrando(false);
        return;
      }

      const usuarioEmail = data.user?.email?.toLowerCase();

      if (!usuarioEmail) {
        setLoginError(
          "No se pudo identificar el email de la cuenta."
        );

        setEntrando(false);
        return;
      }

      await identificarUsuario(usuarioEmail);
    } catch (error) {
      console.error("Error de inicio de sesión:", error);

      setLoginError(
        "Ocurrió un error al ingresar. Intentá nuevamente."
      );
    }

    setEntrando(false);
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();

    setSession(null);
    setUsuarioActual(null);
    setReportes([]);
    setEmail("");
    setPassword("");
    setLoginError("");
    setModo("login");
  }

  if (cargando) {
    return (
      <main style={styles.page}>
        <div style={styles.centerBox}>
          <div style={styles.card}>
            <div style={styles.logo}>✓</div>

            <h2 style={{ marginBottom: "8px" }}>
              Portal de Calidad
            </h2>

            <p style={styles.muted}>
              Verificando acceso...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ADMINISTRADOR
   *
   * La pantalla de administración está en:
   * /admin
   *
   * No mostramos información administrativa dentro del
   * portal del asesor.
   */
  if (modo === "admin") {
    return (
      <main style={styles.page}>
        <div style={styles.centerBox}>
          <div style={styles.card}>
            <div style={styles.logo}>✓</div>

            <h2>Portal de Calidad</h2>

            <p style={styles.muted}>
              Bienvenida, Administradora
            </p>

            <p style={styles.muted}>
              Cargando panel de administración...
            </p>

            <button
              onClick={() => {
                window.location.href = "/admin";
              }}
              style={styles.primaryButton}
            >
              IR AL PANEL DE ADMINISTRACIÓN
            </button>

            <button
              onClick={cerrarSesion}
              style={{
                ...styles.secondaryButton,
                width: "100%",
                marginTop: "10px",
              }}
            >
              CERRAR SESIÓN
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (modo === "login") {
    return (
      <main style={styles.page}>
        <div style={styles.loginContainer}>
          <div style={styles.loginCard}>
            <div style={styles.logo}>✓</div>

            <h1 style={{ marginBottom: "8px" }}>
              Portal de Calidad
            </h1>

            <p style={styles.muted}>
              Ingresá con tu usuario y contraseña
            </p>

            {loginError && (
              <div style={styles.error}>
                {loginError}
              </div>
            )}

            <form onSubmit={iniciarSesion}>
              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Ingresá tu email"
                style={styles.input}
                autoComplete="email"
              />

              <label>Contraseña</label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Ingresá tu contraseña"
                style={styles.input}
                autoComplete="current-password"
              />

              <button
                type="submit"
                disabled={entrando}
                style={{
                  ...styles.primaryButton,
                  opacity: entrando ? 0.6 : 1,
                }}
              >
                {entrando
                  ? "INGRESANDO..."
                  : "INGRESAR"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (modo === "asesor") {
    const reporteActual = reportes[0];

    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.header}>
            <div>
              <h1 style={{ margin: 0 }}>
                Portal de Calidad
              </h1>

              <p style={styles.muted}>
                Bienvenido/a,{" "}
                {usuarioActual?.nombre || "Asesor/a"}
              </p>
            </div>

            <button
              onClick={cerrarSesion}
              style={styles.secondaryButton}
            >
              Cerrar sesión
            </button>
          </header>

          {cargandoReportes ? (
            <div style={styles.card}>
              <h2>Cargando información...</h2>

              <p style={styles.muted}>
                Estamos buscando tus reportes semanales.
              </p>
            </div>
          ) : reportes.length === 0 ? (
            <div style={styles.card}>
              <h2>
                Todavía no hay reportes
              </h2>

              <p style={styles.muted}>
                Cuando Calidad cargue tu primer
                reporte semanal, vas a poder verlo
                desde acá.
              </p>
            </div>
          ) : (
            <>
              <section style={styles.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p style={styles.muted}>
                      Último reporte
                    </p>

                    <h2 style={{ margin: 0 }}>
                      {reporteActual?.semana ||
                        "Semana"}
                    </h2>
                  </div>

                  <div style={styles.score}>
                    {reporteActual?.nota ?? "-"}
                  </div>
                </div>
              </section>

              <section style={styles.card}>
                <h2>Mi calidad</h2>

                <div style={styles.grid}>
                  <Metric
                    title="Nota de calidad"
                    value={
                      reporteActual?.nota ?? "-"
                    }
                  />

                  <Metric
                    title="Producto"
                    value={
                      reporteActual?.producto ?? "-"
                    }
                  />

                  <Metric
                    title="Auditoría"
                    value={
                      reporteActual?.auditoria || "-"
                    }
                  />
                </div>
              </section>

              <section style={styles.card}>
                <h2>Evolución</h2>

                <p>
                  {reporteActual?.evolucion ||
                    "No hay información cargada."}
                </p>
              </section>

              <section style={styles.card}>
                <h2>Objetivo de trabajo</h2>

                <p>
                  {reporteActual?.objetivo ||
                    "No hay información cargada."}
                </p>
              </section>

              <section style={styles.card}>
                <h2>Desvío principal</h2>

                <div style={styles.warning}>
                  <strong>
                    {reporteActual?.desvio ||
                      "No hay desvíos cargados."}
                  </strong>
                </div>
              </section>

              <section style={styles.card}>
                <h2>Recomendación</h2>

                <p>
                  {reporteActual?.recomendacion ||
                    "No hay recomendaciones cargadas."}
                </p>
              </section>

              <section style={styles.card}>
                <h2>Auditoría</h2>

                <p>
                  {reporteActual?.auditoria ||
                    "No hay información de auditoría."}
                </p>

                {reporteActual?.observaciones && (
                  <>
                    <h3>Observaciones</h3>

                    <p>
                      {reporteActual.observaciones}
                    </p>
                  </>
                )}
              </section>

              <section style={styles.card}>
                <h2>Mi productividad</h2>

                <div style={styles.grid}>
                  <Metric
                    title="SPH"
                    value={
                      reporteActual?.sph ?? "-"
                    }
                    extra={`Objetivo: ${
                      reporteActual?.objetivo_sph ??
                      "-"
                    }`}
                  />

                  <Metric
                    title="Ventas"
                    value={
                      reporteActual?.ventas ?? "-"
                    }
                    extra={`Objetivo: ${
                      reporteActual?.objetivo_ventas ??
                      "-"
                    }`}
                  />

                  <Metric
                    title="Estado SPH"
                    value={
                      reporteActual?.estado_sph ||
                      "-"
                    }
                  />

                  <Metric
                    title="Estado ventas"
                    value={
                      reporteActual?.estado_ventas ||
                      "-"
                    }
                  />
                </div>

                {reporteActual?.objetivo_campania && (
                  <div
                    style={{
                      marginTop: "25px",
                    }}
                  >
                    <h3>
                      Objetivo de campaña
                    </h3>

                    <p>
                      {
                        reporteActual.objetivo_campania
                      }
                    </p>

                    {reporteActual?.descripcion_campania && (
                      <p style={styles.muted}>
                        {
                          reporteActual.descripcion_campania
                        }
                      </p>
                    )}

                    <strong>
                      Estado:{" "}
                      {reporteActual?.estado_campania ||
                        "-"}
                    </strong>
                  </div>
                )}

                {reporteActual?.gestion && (
                  <div
                    style={{
                      marginTop: "25px",
                    }}
                  >
                    <h3>
                      ¿Qué se realizó durante la
                      semana?
                    </h3>

                    <p>
                      {reporteActual.gestion}
                    </p>
                  </div>
                )}
              </section>

              <section style={styles.card}>
                <h2>Historial semanal</h2>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {reportes.map((reporte) => (
                    <div
                      key={reporte.id}
                      style={styles.history}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          gap: "15px",
                          flexWrap: "wrap",
                        }}
                      >
                        <strong>
                          {reporte.semana}
                        </strong>

                        <strong>
                          Nota:{" "}
                          {reporte.nota ?? "-"}
                        </strong>
                      </div>

                      {reporte.desvio && (
                        <p
                          style={{
                            marginBottom: 0,
                            color: "#68707b",
                          }}
                        >
                          Desvío:{" "}
                          {reporte.desvio}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    );
  }

  return null;
}

function Metric({ title, value, extra }) {
  return (
    <div style={styles.metric}>
      <small>{title}</small>

      <strong
        style={{
          display: "block",
          fontSize: "24px",
          marginTop: "8px",
        }}
      >
        {value}
      </strong>

      {extra && (
        <small
          style={{
            display: "block",
            marginTop: "6px",
            color: "#68707b",
          }}
        >
          {extra}
        </small>
      )}
    </div>
  );
}

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
    maxWidth: "1100px",
    margin: "auto",
  },

  centerBox: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  loginContainer: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  loginCard: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "35px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
    boxSizing: "border-box",
  },

  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
  },

  header: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "22px 24px",
    marginBottom: "20px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  logo: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#111827",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    fontWeight: "bold",
    marginBottom: "18px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d9dce3",
    marginTop: "6px",
    marginBottom: "16px",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "#ffffff",
  },

  primaryButton: {
    width: "100%",
    padding: "13px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#20242a",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },

  secondaryButton: {
    padding: "11px 18px",
    border: "1px solid #d9dce3",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#20242a",
    cursor: "pointer",
    fontSize: "14px",
  },

  muted: {
    color: "#68707b",
  },

  error: {
    background: "#fff1f1",
    border: "1px solid #f0b5b5",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "18px",
    color: "#991b1b",
  },

  warning: {
    padding: "18px",
    borderRadius: "12px",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
  },

  metric: {
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },

  score: {
    width: "80px",
    height: "80px",
    borderRadius: "20px",
    background: "#111827",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "bold",
  },

  history: {
    padding: "18px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    background: "#fafafa",
  },
};
