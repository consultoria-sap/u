const fs = require('fs');
const path = require('path');

const TEMP_DIR = path.resolve(process.cwd(), 'temp');
const DATA_DIR = path.resolve(process.cwd(), '_data');

// Llaves a conservar:
const KEYS_TO_KEEP = ["badges", "users", "user_summary"];

// Función recursiva para reemplazar avatar_template
function replaceAvatarTemplate(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(replaceAvatarTemplate);
  } else if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (key === "avatar_template" && typeof obj[key] === "string") {
        obj[key] = obj[key].replace("{size}", "200");
      } else {
        replaceAvatarTemplate(obj[key]);
      }
    }
  }
}

fs.readdirSync(TEMP_DIR).forEach(file => {
  if (file.endsWith('.json')) {
    const tempFilePath = path.join(TEMP_DIR, file);
    const dataFilePath = path.join(DATA_DIR, file);

    // Leer y parsear JSON
    const raw = fs.readFileSync(tempFilePath, 'utf-8');
    let json;
    try {
      json = JSON.parse(raw);
    } catch (e) {
      console.error(`Error parsing ${file}:`, e);
      return;
    }

    // Filtrar llaves
    let filtered = {};
    KEYS_TO_KEEP.forEach(key => {
      if (json[key]) filtered[key] = json[key];
    });

    // Reemplazar {size} en avatar_template
    replaceAvatarTemplate(filtered);

    // Guardar en _data con mismo nombre
    fs.writeFileSync(dataFilePath, JSON.stringify(filtered, null, 2), 'utf-8');

    // Eliminar original de temp
    fs.unlinkSync(tempFilePath);

    console.log(`Procesado y movido: ${file}`);
  }
});
