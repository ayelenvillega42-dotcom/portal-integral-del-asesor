import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id,nombre,usuario,email,rol,activo,created_at")
      .eq("activo", true)
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error cargando usuarios:", error);

      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      usuarios: data || [],
    });
  } catch (error) {
    console.error("Error inesperado:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Error interno al cargar los usuarios",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const { nombre, usuario, email, rol, activo = true } = body;

    if (!nombre || !email || !rol) {
      return NextResponse.json(
        {
          ok: false,
          error: "Faltan datos obligatorios.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("usuarios")
      .insert([
        {
          nombre,
          usuario: usuario || null,
          email,
          rol,
          activo,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creando usuario:", error);

      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      usuario: data,
    });
  } catch (error) {
    console.error("Error inesperado:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Error interno al crear el usuario.",
      },
      { status: 500 }
    );
  }
}
