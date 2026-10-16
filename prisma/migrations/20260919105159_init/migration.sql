-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fotoPerfil" TEXT,
    "proveedorAuth" TEXT NOT NULL,
    "proveedorId" TEXT NOT NULL,
    "rol" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PerfilAsesor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "estadoVerificacion" TEXT NOT NULL DEFAULT 'NO_VERIFICADO',
    "documentoIdentidadFrontal" TEXT,
    "documentoIdentidadSello" TEXT,
    "fechaSolicitudVerificacion" DATETIME,
    "fechaVerificacion" DATETIME,
    "motivoRechazo" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL,
    CONSTRAINT "PerfilAsesor_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PerfilCliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL,
    CONSTRAINT "PerfilCliente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Publicacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "autorId" TEXT NOT NULL,
    "autorRol" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVA',
    "totalComentarios" INTEGER NOT NULL DEFAULT 0,
    "totalReacciones" INTEGER NOT NULL DEFAULT 0,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL,
    CONSTRAINT "Publicacion_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicacionId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL,
    CONSTRAINT "Comentario_publicacionId_fkey" FOREIGN KEY ("publicacionId") REFERENCES "Publicacion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comentario_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reaccion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicacionId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'ME_INTERESA',
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reaccion_publicacionId_fkey" FOREIGN KEY ("publicacionId") REFERENCES "Publicacion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reaccion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EvaluacionAsesor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "asesorId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "confiabilidad" INTEGER NOT NULL,
    "compromiso" INTEGER NOT NULL,
    "eficiencia" INTEGER NOT NULL,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL,
    CONSTRAINT "EvaluacionAsesor_asesorId_fkey" FOREIGN KEY ("asesorId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EvaluacionAsesor_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EvaluacionCliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clienteId" TEXT NOT NULL,
    "asesorId" TEXT NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL,
    CONSTRAINT "EvaluacionCliente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EvaluacionCliente_asesorId_fkey" FOREIGN KEY ("asesorId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiraEn" DATETIME NOT NULL,
    "revocado" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_rol_idx" ON "Usuario"("rol");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_proveedorAuth_proveedorId_key" ON "Usuario"("proveedorAuth", "proveedorId");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilAsesor_usuarioId_key" ON "PerfilAsesor"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilCliente_usuarioId_key" ON "PerfilCliente"("usuarioId");

-- CreateIndex
CREATE INDEX "Publicacion_autorRol_estado_idx" ON "Publicacion"("autorRol", "estado");

-- CreateIndex
CREATE INDEX "Publicacion_autorId_idx" ON "Publicacion"("autorId");

-- CreateIndex
CREATE INDEX "Comentario_publicacionId_idx" ON "Comentario"("publicacionId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaccion_publicacionId_usuarioId_key" ON "Reaccion"("publicacionId", "usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluacionAsesor_asesorId_clienteId_key" ON "EvaluacionAsesor"("asesorId", "clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluacionCliente_clienteId_asesorId_key" ON "EvaluacionCliente"("clienteId", "asesorId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_usuarioId_idx" ON "RefreshToken"("usuarioId");
