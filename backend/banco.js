import Database from "better-sqlite3";

const db = new Database("juntos.db");

//Criar tabelas
db.exec(`
CREATE TABLE IF NOT EXISTS Grupos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    codigo_convite TEXT NOT NULL UNIQUE
  )
`);

db.exec(`
CREATE TABLE IF NOT EXISTS Usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    grupo_id INTEGER REFERENCES Grupos(id) 
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS Categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        icone TEXT NOT NULL,
        cor TEXT NOT NULL,
        grupo_id INTEGER NOT NULL REFERENCES Grupos(id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS Metas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        valor_alvo REAL NOT NULL,
        valor_atual INTEGER NOT NULL,
        grupo_id INTEGER NOT NULL REFERENCES Grupos(id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS Orcamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoria_id INTEGER NOT NULL REFERENCES Categorias(id),
        valor_limite REAL NOT NULL,
        mes INTEGER NOT NULL,
        grupo_id INTEGER NOT NULL REFERENCES Grupos(id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS Transacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      valor REAL NOT NULL,
      tipo TEXT NOT NULL,
      categoria_id INTEGER NOT NULL REFERENCES Categorias(id),
      descricao TEXT,
      data TEXT NOT NULL,
      grupo_id INTEGER NOT NULL,
      criado_por INTEGER NOT NULL REFERENCES Usuarios(id)
    )
`);
 console.log("Tabelas criadas com sucesso!");

export default db;