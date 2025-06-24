const fs = require('fs');

// Carpetas
const TEMP_DIR = 'temp';
const DATA_DIR = '_data';

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

// Función para procesar cada par
function procesarPar(base) {
  const file0 = `${TEMP_DIR}/${base}_0.json`;
  const file1 = `${TEMP_DIR}/${base}_1.json`;
  let datos0 = {};
  let datos1 = {};

  // Procesar _0.json
  try {
    const raw0 = fs.readFileSync(file0, 'utf-8');
    const json0 = JSON.parse(raw0);

    datos0.badges = json0.badges || [];
    datos0.user = Array.isArray(json0.users) ? json0.users[0] : null;

    // Recortar user_summary
    if (json0.user_summary) {
      const keys_0 = [
        "likes_given",
        "likes_received",
        "topics_entered",
        "posts_read_count",
        "days_visited",
        "topic_count",
        "post_count",
        "time_read",
        "recent_time_read",
        "bookmark_count",
        "solved_count"
      ];
      datos0.user_summary = {};
      keys_0.forEach(k => {
        if (k in json0.user_summary) {
          datos0.user_summary[k] = json0.user_summary[k];
        }
      });
    }
  } catch (e) {
    console.error(`Error procesando ${file0}:`, e);
  }

  // Procesar _1.json
  try {
    const raw1 = fs.readFileSync(file1, 'utf-8');
    const json1 = JSON.parse(raw1);

    // Recortar post_stream.posts[0]
    if (
      json1.post_stream &&
      Array.isArray(json1.post_stream.posts) &&
      json1.post_stream.posts[0]
    ) {
      const post = json1.post_stream.posts[0];
      const keys_1 = [
        "id",
        "title",
        "fancy_title",
        "posts_count",
        "created_at",
        "views",
        "reply_count",
        "like_count",
        "last_posted_at",
        "slug",
        "word_count"
      ];
      datos1.post = {};
      keys_1.forEach(k => {
        if (k in post) {
          datos1.post[k] = post[k];
        }
      });
    }
  } catch (e) {
    console.error(`Error procesando ${file1}:`, e);
  }

  // Combinar resultados
  const resultado = { ...datos0, ...datos1 };

  // Reemplazar {size} en avatar_template en todo el objeto resultado
  replaceAvatarTemplate(resultado);

  if (!fs.existsSync(DATA_DIR)){
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(`${DATA_DIR}/${base}.json`, JSON.stringify(resultado, null, 2), 'utf-8');

  // Borrar originales
  try { fs.unlinkSync(file0); } catch {}
  try { fs.unlinkSync(file1); } catch {}

  console.log(`${base}.json generado en _data/`);
}

// Buscar todos los *_0.json en temp
fs.readdirSync(TEMP_DIR)
  .filter(f => f.endsWith('_0.json'))
  .forEach(f0 => {
    const base = f0.slice(0, -7); // quita "_0.json"
    const f1 = `${base}_1.json`;
    if (fs.existsSync(`${TEMP_DIR}/${f1}`)) {
      procesarPar(base);
    } else {
      console.warn(`No se encontró el par para: ${base} (_1.json faltante)`);
    }
  });
