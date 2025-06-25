const fs = require('fs');
const path = require('path');

// Directorios
const DATA_DIR = '_data';
const USUARIOS_DIR = '_usuarios';

// 1. Listar los nombres base de cada archivo .json en _data
const dataFiles = fs.readdirSync(DATA_DIR)
  .filter(f => f.endsWith('.json'))
  .map(f => path.basename(f, '.json'));

// 2. Listar los nombres base de cada archivo .md en _usuarios
const usuarioFiles = fs.existsSync(USUARIOS_DIR)
  ? fs.readdirSync(USUARIOS_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => path.basename(f, '.md'))
  : [];

// 3. Detectar los nombres de data que no tienen su .md en _usuarios
const faltantes = dataFiles.filter(name => !usuarioFiles.includes(name));

if (faltantes.length === 0) {
  console.log("Todos los usuarios de _data tienen su .md correspondiente en _usuarios.");
  process.exit(0);
}

// 4. Crear los archivos faltantes con el formato pedido
faltantes.forEach(name => {
  const mdContent = 
`---
title: ${name}
tags: perfil
linkedin: null
permalink: /${name}/
layout: usuario
username: ${name}
datafile: ${name}
---

.  
`;
  const filePath = path.join(USUARIOS_DIR, `${name}.md`);
  fs.writeFileSync(filePath, mdContent, 'utf-8');
  console.log(`Archivo creado: ${filePath}`);
});
