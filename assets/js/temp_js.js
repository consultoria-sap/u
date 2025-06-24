const fs = require('fs');

// Carpetas
const TEMP_DIR = 'temp';
const DATA_DIR = '_data';

// Llaves que conservamos
const KEYS_TO_KEEP = ["badges", "users", "user_summary"];

// Función recursiva para reemplazar {size} en avatar_template
function replaceAvatarTemplate(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(replaceAvatarTemplate);
  } else if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (key === "avatar_template" && typeof obj[key] === "string") {
        obj[key] = obj[key].replace("{size}", "144");
      } else {
        replaceAvatarTemplate(obj[key]);
      }
    }
  }
}

// Procesar todos los .json de /temp/
fs.readdirSync(TEMP_DIR).forEach(file => {
  if (file.endsWith('.json')) {
    const tempPath = `${TEMP_DIR}/${file}`;
    const dataPath = `${DATA_DIR}/${file}`;

    // Leer archivo JSON
    const raw = fs.readFileSync(tempPath, 'utf-8');
    let json;
    try {
      json = JSON.parse(raw);
    } catch (e) {
      console.error(`Error al parsear ${file}:`, e);
      return;
    }

    // Filtrar llaves
    let filtered = {};
    KEYS_TO_KEEP.forEach(key => {
      if (json[key]) filtered[key] = json[key];
    });

    // Reemplazar avatar_template
    replaceAvatarTemplate(filtered);

    // Guardar en _data/
    fs.writeFileSync(dataPath, JSON.stringify(filtered, null, 2), 'utf-8');

    // Borrar original
    fs.unlinkSync(tempPath);

    console.log(`Procesado: ${file}`);
  }
});
