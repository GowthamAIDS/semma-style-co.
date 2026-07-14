const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'semma.db');
let db;

const loadDb = async () => {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buf = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }
  db.run('PRAGMA foreign_keys = ON');
  return db;
};

const saveDb = () => {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
};

const seed = () => {
  const result = db.exec('SELECT COUNT(*) as count FROM products');
  if (result[0].values[0][0] === 0) {
    const items = [
      ['Classic Logo Tee Mockup', 'Premium PSD mockup of our signature logo tee.', 499, '/uploads/mockup1.svg', 'T-Shirts', '/uploads/files/logo-tee-mockup.psd', '/uploads/mockup1.svg,/uploads/tshirt1.svg,/uploads/tshirt2.svg,/uploads/mockup4.svg,/uploads/tshirt4.svg'],
      ['Minimalist Mockup Pack', '10 high-resolution mockup templates.', 1299, '/uploads/mockup2.svg', 'Mockups', '/uploads/files/minimalist-pack.zip', '/uploads/mockup2.svg,/uploads/mockup3.svg,/uploads/tshirt3.svg,/uploads/mockup5.svg,/uploads/tshirt5.svg'],
      ['Vintage Wash Tee Design', 'Distressed vintage-style t-shirt design.', 599, '/uploads/mockup3.svg', 'T-Shirts', '/uploads/files/vintage-tee.psd', '/uploads/mockup3.svg,/uploads/tshirt2.svg,/uploads/tshirt1.svg,/uploads/tshirt4.svg,/uploads/mockup6.svg'],
      ['Brand Identity Mockup Kit', 'Complete brand identity mockup kit.', 1999, '/uploads/tshirt1.svg', 'Mockups', '/uploads/files/brand-kit.zip', '/uploads/tshirt1.svg,/uploads/mockup1.svg,/uploads/mockup3.svg,/uploads/tshirt5.svg,/uploads/mockup4.svg'],
      ['Graphic Print Template', 'Bold geometric graphic print template.', 799, '/uploads/tshirt2.svg', 'T-Shirts', '/uploads/files/graphic-print.ai', '/uploads/tshirt2.svg,/uploads/mockup2.svg,/uploads/tshirt3.svg,/uploads/mockup5.svg,/uploads/tshirt6.svg'],
      ['Apparel Design Template', 'Editable technical flat sketch template.', 599, '/uploads/tshirt3.svg', 'Mockups', '/uploads/files/apparel-template.psd', '/uploads/tshirt3.svg,/uploads/mockup1.svg,/uploads/mockup2.svg,/uploads/tshirt4.svg,/uploads/mockup6.svg'],
    ];
    for (const item of items) {
      db.run('INSERT INTO products (name, description, price, image, category, file_url, gallery) VALUES (?, ?, ?, ?, ?, ?, ?)', item);
    }
    saveDb();
  }

  const adminCheck = db.exec("SELECT * FROM users WHERE email = 'admin@semma.com'");
  if (!adminCheck.length || !adminCheck[0].values.length) {
    const bcrypt = require('bcryptjs');
    const hash = bcrypt.hashSync('admin123', 10);
    db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Admin', 'admin@semma.com', hash, 'admin']);
    saveDb();
  }
};

const initDb = async () => {
  await loadDb();
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    category TEXT DEFAULT 'general',
    file_url TEXT DEFAULT '',
    gallery TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  try { db.run('ALTER TABLE products ADD COLUMN gallery TEXT DEFAULT ""'); saveDb(); } catch (e) {}
  db.run(`CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'completed',
    email TEXT,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    email TEXT,
    phone TEXT,
    downloaded_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )`);
  seed();
};

const queryAll = (sql, params = []) => {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
};

const queryOne = (sql, params = []) => {
  const rows = queryAll(sql, params);
  return rows.length ? rows[0] : null;
};

const execute = (sql, params = []) => {
  db.run(sql, params);
  const id = db.exec('SELECT last_insert_rowid() as id');
  saveDb();
  return id[0].values[0][0];
};

const lastInsertId = () => db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];

module.exports = { initDb, queryAll, queryOne, execute, lastInsertId, saveDb };
