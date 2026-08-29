import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      nombre,
      usuario,
      email,
      password,
    } = body;

    if (!nombre || !usuario || !email || !password) {
      return NextResponse.json(
        {
          error:
            "Nombre, usuario, email y contraseña son obligatorios.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error:
            "La contraseña debe tener al menos 6 caracteres.",
        },
        { status: 400 }
      );
    }

    const {
      data: usuarioCreado,
      error: errorAuth,
    } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
    });

    if (errorAuth) {
      return NextResponse.json(
        {
          error: errorAuth.message,
        },
        { status: 400 }
      );
    }

    const { data: perfilCreado, error: errorPerfil } =
      await supabaseAdmin
        .from("perfiles")
        .insert({
          id: usuarioCreado.user.id,
          nombre: nombre.trim(),
          usuario: usuario.trim(),
          email: email.trim().toLowerCase(),
          rol: "asesor",
          activo: true,
        })
        .select()
        .single();

    if (errorPerfil) {
      await supabaseAdmin.auth.admin.deleteUser(
        usuarioCreado.user.id
      );

      return NextResponse.json(
        {
          error: errorPerfil.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        mensaje: "Asesor creado correctamente.",
        perfil: perfilCreado,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Ocurrió un error al crear el asesor.",
      },
      { status: 500 }
    );
  }
}
