const fs = require('fs');

const TEMP_DIR = 'temp';
const DATA_DIR = '_data';

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

function procesarBase(base) {
  const file0 = `${TEMP_DIR}/${base}_0.json`;
  const file1 = `${TEMP_DIR}/${base}_1.json`;
  const dataFile = `${DATA_DIR}/${base}.json`;

  let datosPrevios = {};
  let datos0 = {};
  let datos1 = {};

  // Leer estado previo si existe
  if (fs.existsSync(dataFile)) {
    try {
      datosPrevios = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    } catch {}
  }

  // Procesar _0.json si existe
  if (fs.existsSync(file0)) {
    try {
      const json0 = JSON.parse(fs.readFileSync(file0, 'utf-8'));

      datos0.badges = json0.badges || [];
      datos0.user = Array.isArray(json0.users) ? json0.users[0] : null;

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
  }

  // Procesar _1.json si existe
  if (fs.existsSync(file1)) {
    try {
      const json1 = JSON.parse(fs.readFileSync(file1, 'utf-8'));

      const root_keys = [
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

      datos1.topic = {};
      root_keys.forEach(k => {
        if (k in json1) {
          datos1.topic[k] = json1[k];
        }
      });

      if (
        json1.post_stream &&
        Array.isArray(json1.post_stream.posts) &&
        json1.post_stream.posts[0]
      ) {
        datos1.topic.post = json1.post_stream.posts[0];
      }

    } catch (e) {
      console.error(`Error procesando ${file1}:`, e);
    }
  }

  // 🔀 Merge inteligente
  const resultado = {
    ...datosPrevios,
    ...datos0,
    ...datos1,
    updated_at: new Date().toISOString()
  };

  replaceAvatarTemplate(resultado);

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  fs.writeFileSync(
    dataFile,
    JSON.stringify(resultado, null, 2),
    'utf-8'
  );

  // Borrar temporales existentes
  try { fs.unlinkSync(file0); } catch {}
  try { fs.unlinkSync(file1); } catch {}

  console.log(`${base}.json actualizado en _data/`);
}

// 🔍 Buscar cualquier *_0.json o *_1.json
const bases = new Set();

fs.readdirSync(TEMP_DIR)
  .filter(f => f.match(/_(0|1)\.json$/))
  .forEach(f => {
    bases.add(f.replace(/_(0|1)\.json$/, ''));
  });

bases.forEach(procesarBase);
