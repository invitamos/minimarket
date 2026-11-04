/* =========================================================
   Bonanza · Sistema de caja para Minimarket y Bodega
   Todo se guarda en este navegador (localStorage).
   ========================================================= */
'use strict';

const DB_KEY = 'bonanza_sistema_v1';
const SES_KEY = 'bonanza_sesion';

const PERMISOS = [
  { k: 'inicio', n: 'Inicio y accesos rápidos' },
  { k: 'resumen', n: 'Resumen del día' },
  { k: 'ventas', n: 'Vender (caja)' },
  { k: 'historial', n: 'Ver historial de ventas' },
  { k: 'anular', n: 'Anular ventas' },
  { k: 'productos', n: 'Productos, precios y stock' },
  { k: 'categorias', n: 'Categorías' },
  { k: 'clientes', n: 'Clientes y créditos' },
  { k: 'gastos', n: 'Gastos' },
  { k: 'caja', n: 'Abrir y cerrar caja' },
  { k: 'consumo', n: 'Consumo interno' },
  { k: 'formas', n: 'Formas de pago' },
  { k: 'estadisticas', n: 'Estadísticas y ganancias' },
  { k: 'usuarios', n: 'Usuarios y permisos' },
  { k: 'config', n: 'Configuración y respaldo' },
];

const NAV = [
  { k: 'inicio', n: 'Inicio', i: 'home', key: 'F1' },
  { k: 'resumen', n: 'Resumen del día', i: 'clipboard' },
  { k: 'ventas', n: 'Vender', i: 'cart', key: 'F2' },
  { k: 'historial', n: 'Ventas realizadas', i: 'receipt' },
  { k: 'productos', n: 'Productos', i: 'box' },
  { k: 'categorias', n: 'Categorías', i: 'tag' },
  { k: 'clientes', n: 'Créditos', i: 'users' },
  { k: 'gastos', n: 'Gastos', i: 'wallet' },
  { k: 'caja', n: 'Caja', i: 'cash' },
  { k: 'consumo', n: 'Consumo interno', i: 'package' },
  { k: 'formas', n: 'Formas de pago', i: 'card' },
  { k: 'estadisticas', n: 'Estadísticas', i: 'chart' },
  { k: 'usuarios', n: 'Usuarios', i: 'shield' },
  { k: 'config', n: 'Configuración', i: 'settings' },
];

const CAT_GASTO = ['Mercadería / proveedores', 'Sueldos', 'Servicios (ANDE, agua, internet)', 'Alquiler', 'Mantenimiento', 'Impuestos', 'Otros'];
const BANCOS = ['Itaú', 'Continental', 'Banco Basa', 'ueno bank', 'Visión Banco', 'Banco Familiar', 'Sudameris', 'GNB', 'Atlas', 'Interfisa', 'BNF', 'Billetera Tigo / Personal', 'Otro'];
const MOTIVOS_CONSUMO = ['Consumo del dueño o familia', 'Consumo de empleados', 'Vencido o roto', 'Regalo o degustación', 'Otro'];
const CAJAS = { efectivo: { n: 'Caja Efectivo', d: 'Control de efectivo', i: 'cash', c: 'Efectivo' }, transferencia: { n: 'Caja Transferencia', d: 'Transferencias y tarjetas', i: 'arrows', c: 'Transferencia' } };
const medioDe = (m) => (m === 'efectivo' ? 'efectivo' : m === 'transferencia' || m === 'tarjeta' ? 'transferencia' : null);
const METODOS = { efectivo: 'Efectivo', tarjeta: 'Tarjeta', transferencia: 'Transferencia', credito: 'Crédito' };

/* ---------- Íconos (solo trazo, sin fondo) ---------- */
const ICONS = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.2h11.9L22 7H6.1"/>',
  receipt: '<path d="M6 2.5h12v19l-3-2-3 2-3-2-3 2z"/><path d="M9 7.5h6M9 11.5h6M9 15.5h3.5"/>',
  box: '<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 010 6.8M18 14.8c1.9.7 3.1 2.4 3.5 5.2"/>',
  wallet: '<rect x="3" y="6.5" width="18" height="13.5" rx="2"/><path d="M16 13.2h2"/><path d="M5 6.5l10-3.5 1.2 3.5"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9.5v.01M18 14.5v.01"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7.5 16v-4.5M12 16V7.5M16.5 16V10"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9L7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  logout: '<path d="M15 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4"/><path d="M10 17l-5-5 5-5"/><path d="M5 12h11"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  trash: '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6.5 7l1 13h9l1-13"/><path d="M10 11v6M14 11v6"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  print: '<path d="M7 8V3h10v5"/><rect x="3" y="8" width="18" height="9" rx="2"/><path d="M7 14h10v7H7z"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  check: '<path d="M4.5 12.5l5 5 10-11"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v4.5M12 17.6v.01"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10.5" rx="2"/><path d="M8 10.5V7a4 4 0 018 0v3.5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.2 4.1-6.5 8-6.5s7 2.3 8 6.5"/>',
  download: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 20h16"/>',
  upload: '<path d="M12 15V3"/><path d="M7 8l5-5 5 5"/><path d="M4 20h16"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  coins: '<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7"/><path d="M9 14v3c0 1.7 2.7 3 6 3s6-1.3 6-3v-4c0-1.6-2.4-2.9-5.5-3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M14 9l2 2"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  scale: '<path d="M12 3v18M7 21h10"/><path d="M4 7h16"/><path d="M4 7l-2.5 6a3 3 0 005 0z M20 7l-2.5 6a3 3 0 005 0z"/>',
  chat: '<path d="M4 20l1.4-4.2A8 8 0 1112 20a8 8 0 01-3.9-1z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.6-2-1-1 .8a3.6 3.6 0 01-1.7-1.7l.8-1-1-2z"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/>',
  chevL: '<path d="M15 5l-7 7 7 7"/>',
  chevR: '<path d="M9 5l7 7-7 7"/>',
  bell: '<path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 004 0"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M8.5 10h7M8.5 14h7M8.5 18h4"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19"/><path d="M6.5 15h4"/>',
  eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 6.1A10 10 0 0112 6c6.4 0 10 6 10 6a17 17 0 01-3.2 3.9M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.4 4.5-1.1"/><path d="M9.9 9.9a3 3 0 004.2 4.2"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  unlock: '<rect x="4.5" y="10.5" width="15" height="10.5" rx="2"/><path d="M8 10.5V7a4 4 0 017.7-1.5"/>',
  arrows: '<path d="M4 8h15l-4-4"/><path d="M20 16H5l4 4"/>',
  package: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/><path d="M7.5 5.5l9 5"/>',
  door: '<path d="M14 3H6v18h8"/><path d="M14 3l5 2v14l-5 2z"/><path d="M11.5 12v.01"/>',
};
const ic = (n) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ---------- Utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const miles = (n) => Math.round(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const gs = (n) => (n < 0 ? '-' : '') + 'Gs. ' + miles(Math.abs(n || 0));
const parseMonto = (v) => Number(String(v ?? '').replace(/[^\d-]/g, '')) || 0;
const parseCant = (v) => { const n = Number(String(v ?? '').replace(',', '.')); return isFinite(n) ? n : 0; };
const fmtCant = (n) => (Math.round(n * 1000) / 1000).toString().replace('.', ',');
const pad = (n) => String(n).padStart(2, '0');
const dkey = (d) => { d = new Date(d); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const fFecha = (d) => { d = new Date(d); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`; };
const fHora = (d) => { d = new Date(d); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const fFH = (d) => `${fFecha(d)} ${fHora(d)}`;
const sumBy = (arr, f) => arr.reduce((a, x) => a + (f(x) || 0), 0);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

function hash(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
const passHash = (usuario, pass) => hash('bnz|' + String(usuario).toLowerCase().trim() + '|' + pass);

/* ---------- Base de datos ---------- */
let db;

function defaultDB() {
  const sectores = [
    { id: 's-beb', nombre: 'Bebidas', unidad: 'market' },
    { id: 's-lac', nombre: 'Lácteos', unidad: 'market' },
    { id: 's-ali', nombre: 'Alimentos', unidad: 'market' },
    { id: 's-car', nombre: 'Carnicería', unidad: 'market' },
    { id: 's-pan', nombre: 'Panadería', unidad: 'market' },
    { id: 's-cer', nombre: 'Cervezas', unidad: 'bodega' },
    { id: 's-tra', nombre: 'Tragos', unidad: 'bodega' },
    { id: 's-hie', nombre: 'Hielos', unidad: 'bodega' },
    { id: 's-can', nombre: 'Cantina', unidad: 'bodega' },
  ];
  let c = 1000;
  const P = (sectorId, nombre, precio, costo, stock, medida = 'un', min = 5) => ({
    id: uid() + (c), codigo: String(++c), nombre, sectorId, precio, costo, medida,
    controlStock: stock !== null, stock: stock ?? 0, stockMin: min, activo: true, iva: 10,
  });
  const productos = [
    P('s-beb', 'Coca-Cola 2 L', 13000, 10000, 36), P('s-beb', 'Agua mineral 500 ml', 4000, 2500, 48),
    P('s-beb', 'Jugo de naranja 1 L', 9000, 6500, 20), P('s-beb', 'Gaseosa 500 ml', 6000, 4200, 40),
    P('s-lac', 'Leche entera 1 L', 7500, 6000, 30), P('s-lac', 'Yogur bebible 1 L', 12000, 9000, 14),
    P('s-lac', 'Queso Paraguay', 45000, 36000, 8, 'kg', 2), P('s-lac', 'Manteca 200 g', 11000, 8200, 10),
    P('s-ali', 'Arroz 1 kg', 8500, 6500, 40), P('s-ali', 'Fideo 500 g', 5000, 3500, 50),
    P('s-ali', 'Aceite 900 ml', 16000, 12500, 18), P('s-ali', 'Yerba mate 500 g', 14000, 10500, 25),
    P('s-ali', 'Azúcar 1 kg', 7000, 5400, 30), P('s-ali', 'Harina 1 kg', 6000, 4300, 22),
    P('s-car', 'Carne molida', 42000, 33000, 15, 'kg', 3), P('s-car', 'Costilla', 38000, 30000, 12, 'kg', 3),
    P('s-car', 'Pollo entero', 22000, 17000, 20, 'kg', 4), P('s-car', 'Chorizo parrillero', 30000, 22000, 10, 'kg', 2),
    P('s-pan', 'Pan felipe', 12000, 7000, null, 'kg'), P('s-pan', 'Chipa', 3000, 1500, null),
    P('s-pan', 'Galletas surtidas', 6000, 4000, 30), P('s-pan', 'Torta (porción)', 8000, 4500, null),
    P('s-cer', 'Pilsen 1 L', 12000, 8500, 60), P('s-cer', 'Munich 1 L', 13000, 9000, 48),
    P('s-cer', 'Lata 473 ml', 8000, 5500, 72), P('s-cer', 'Balde 6 latas', 45000, 31000, null),
    P('s-tra', 'Caña 1 L', 25000, 17000, 12), P('s-tra', 'Fernet 750 ml', 70000, 52000, 6, 'un', 2),
    P('s-tra', 'Vino tinto 1 L', 20000, 14000, 10), P('s-tra', 'Trago preparado', 18000, 7000, null),
    P('s-hie', 'Hielo bolsa 2 kg', 6000, 3000, 40, 'un', 10), P('s-hie', 'Hielo bolsa 5 kg', 12000, 6000, 30, 'un', 8),
    P('s-can', 'Empanada', 5000, 2500, null), P('s-can', 'Picada para 2', 35000, 20000, null),
    P('s-can', 'Sándwich de milanesa', 18000, 10000, null), P('s-can', 'Mandioca frita', 10000, 4000, null),
  ];
  const ahora = new Date().toISOString();
  return {
    version: 4,
    config: {
      nombreMarket: 'Minimarket Bonanza', nombreBodega: 'Bodega Barley',
      direccion: '', telefono: '', ruc: '', mensajeTicket: '¡Gracias por tu compra!',
      nroVenta: 0, ciudad: '', razonSocial: '', actividad: '', timbrado: '', timbradoDesde: '', timbradoHasta: '', establecimiento: '001', puntoExp: '001', nroFactura: 0,
      leyendaTicket: 'Comprobante interno, no válido como factura.', firma: 'SPYcomers · Tel (0983) 411 544 · www.spynetpy.com',
    },
    usuarios: [
      { id: 'u-admin', nombre: 'Administrador', usuario: 'admin', pass: passHash('admin', 'admin123'), rol: 'admin', permisos: PERMISOS.map((p) => p.k), activo: true, creado: ahora },
      { id: 'u-caja', nombre: 'Cajero', usuario: 'caja', pass: passHash('caja', '1234'), rol: 'usuario', permisos: ['inicio', 'ventas', 'historial', 'clientes', 'caja'], activo: true, creado: ahora },
    ],
    sectores, productos,
    clientes: [], movimientos: [], ventas: [], gastos: [], cajas: [], consumos: [],
  };
}

function demoData() {
  // Movimientos de ejemplo de los últimos 14 días para ver las estadísticas
  const prods = db.productos;
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const cli = [
    { id: uid(), nombre: 'Juan Benítez', ci: '3.456.789', telefono: '0981 123 456', limite: 500000, notas: '', creado: new Date().toISOString() },
    { id: uid(), nombre: 'María González', ci: '4.120.335', telefono: '0972 555 010', limite: 300000, notas: '', creado: new Date().toISOString() },
    { id: uid(), nombre: 'Carlos Ramírez', ci: '2.901.448', telefono: '0961 220 880', limite: 0, notas: 'Paga los viernes', creado: new Date().toISOString() },
  ];
  db.clientes.push(...cli);
  for (let d = 13; d >= 0; d--) {
    const n = 6 + Math.floor(rnd() * 9);
    const minutos = Array.from({ length: n }, () => 420 + Math.floor(rnd() * 840)).sort((a, b) => a - b);
    for (let i = 0; i < n; i++) {
      const f = addDays(new Date(), -d);
      f.setHours(Math.floor(minutos[i] / 60), minutos[i] % 60, 0, 0);
      if (f > new Date()) continue;
      const items = [];
      const k = 1 + Math.floor(rnd() * 4);
      for (let j = 0; j < k; j++) {
        const p = prods[Math.floor(rnd() * prods.length)];
        if (items.some((x) => x.pid === p.id)) continue;
        const cant = p.medida === 'kg' ? Math.round((0.5 + rnd() * 1.5) * 4) / 4 : 1 + Math.floor(rnd() * 3);
        items.push(snapItem(p, cant));
      }
      const metodoR = rnd();
      const metodo = metodoR < 0.62 ? 'efectivo' : metodoR < 0.78 ? 'transferencia' : metodoR < 0.9 ? 'tarjeta' : 'credito';
      const cliente = metodo === 'credito' ? cli[Math.floor(rnd() * cli.length)] : null;
      const v = armarVenta(items, { metodo, clienteId: cliente?.id || null, recibido: 0, fecha: f.toISOString(), cajaId: null, usuario: db.usuarios[1] });
      if (medioDe(metodo) === 'transferencia') { v.banco = BANCOS[Math.floor(rnd() * 6)]; v.comprobante = String(100000 + Math.floor(rnd() * 899999)); }
      db.ventas.push(v);
      if (cliente) cargarCredito(v);
    }
    if (d % 5 === 0) {
      db.gastos.push({ id: uid(), fecha: addDays(new Date(), -d).toISOString(), unidad: 'market', categoria: CAT_GASTO[0], descripcion: 'Reposición de mercadería', monto: 120000 + Math.floor(rnd() * 6) * 20000, usuario: 'Administrador', medio: 'efectivo', deCaja: false, cajaId: null });
    }
    if (d % 6 === 1) {
      db.gastos.push({ id: uid(), fecha: addDays(new Date(), -d).toISOString(), unidad: 'bodega', categoria: CAT_GASTO[0], descripcion: 'Cajones de cerveza', monto: 180000 + Math.floor(rnd() * 5) * 30000, usuario: 'Administrador', medio: 'efectivo', deCaja: false, cajaId: null });
    }
  }
  db.gastos.push({ id: uid(), fecha: addDays(new Date(), -5).toISOString(), unidad: 'market', categoria: CAT_GASTO[2], descripcion: 'Factura ANDE', monto: 260000, usuario: 'Administrador', medio: 'efectivo', deCaja: false, cajaId: null });
  db.movimientos.push({ id: uid(), clienteId: cli[0].id, fecha: addDays(new Date(), -2).toISOString(), tipo: 'pago', unidad: 'market', monto: 30000, metodo: 'efectivo', ventaId: null, cajaId: null, nota: 'Entrega parcial', usuario: 'Cajero' });
}

function load() {
  try { db = JSON.parse(localStorage.getItem(DB_KEY)); } catch (e) { db = null; }
  if (!db || !db.version) {
    db = defaultDB();
    demoData();
    db.config.demo = true;
    save();
  }
  migrar();
}
function migrar() {
  if (db.version < 2) {
    db.cajas.forEach((c) => (c.tipo = c.tipo || 'efectivo'));
    db.gastos.forEach((g) => { if (!g.medio) g.medio = g.deCaja || db.config.demo ? 'efectivo' : 'externo'; });
    db.consumos = db.consumos || [];
    db.version = 2;
    save();
  }
  if (db.version < 3) {
    db.productos.forEach((p) => { if (p.iva === undefined) p.iva = 10; });
    db.config = { ciudad: '', razonSocial: '', actividad: '', timbrado: '', timbradoDesde: '', timbradoHasta: '', establecimiento: '001', puntoExp: '001', nroFactura: 0,
      leyendaTicket: 'Comprobante interno, no válido como factura.', firma: '', ...db.config };
    db.version = 3;
    save();
  }
  if (db.version < 4) {
    if (!db.config.firma) db.config.firma = 'SPYcomers · Tel (0983) 411 544 · www.spynetpy.com';
    if (db.config.mensajeTicket === '¡Gracias por su compra!') db.config.mensajeTicket = '¡Gracias por tu compra!';
    db.version = 4;
    save();
  }
}
function guardarLocal() {
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)); return true; }
  catch (e) { toast('No se pudo guardar. El almacenamiento del navegador está lleno.', 'err'); return false; }
}
function save() {
  guardarLocal();
  if (typeof renderNoti === 'function') renderNoti();
  syncMarcar();
}

/* =========================================================
   SINCRONIZACIÓN: mismos usuarios, productos y ventas en todos los equipos.
   Si el sistema se abre desde el hosting (https://...), usa api.php del mismo lugar.
   Si se abre como archivo, usa la dirección cargada en "Conectar con servidor".
   Sin internet sigue funcionando y sube los cambios cuando vuelve la conexión.
   ========================================================= */
const SK = { url: 'bnz_api', tok: 'bnz_tok', ver: 'bnz_ver', base: 'bnz_base', pend: 'bnz_pend' };
const COLS = ['usuarios', 'sectores', 'productos', 'clientes', 'movimientos', 'ventas', 'gastos', 'cajas', 'consumos'];
// Servidor donde está api.php (hosting con PHP). Todos los equipos se conectan solos a esta dirección.
// El dominio principal apunta a GitHub Pages (no ejecuta PHP); por eso los datos van en un subdominio del cPanel.
const SERVIDORES = ['https://api-minimarket.spynetpy.com/api.php', 'https://api-minimarket.spynetpy.com/minimarket-api/api.php'];
const SERVIDOR = SERVIDORES[0];
const urlGuardada = localStorage.getItem(SK.url);
const SYNC = {
  url: urlGuardada && SERVIDORES.includes(urlGuardada) ? urlGuardada : SERVIDOR,
  token: localStorage.getItem(SK.tok) || '',
  version: +localStorage.getItem(SK.ver) || 0,
  pend: localStorage.getItem(SK.pend) === '1',
  sucio: 0, ocupado: false, estado: 'local', timer: null, lazo: null,
};
const clonar = (x) => JSON.parse(JSON.stringify(x));
function syncBase() { try { return JSON.parse(localStorage.getItem(SK.base) || 'null'); } catch { return null; } }
function syncGuardarEstado() {
  localStorage.setItem(SK.ver, String(SYNC.version));
  localStorage.setItem(SK.pend, SYNC.pend ? '1' : '0');
  if (SYNC.token) localStorage.setItem(SK.tok, SYNC.token); else localStorage.removeItem(SK.tok);
}
function syncFijarBase() { try { localStorage.setItem(SK.base, JSON.stringify(db)); } catch { /* sin espacio: se hará la mezcla sin base */ } }

async function api(action, body = {}, url = SYNC.url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 12000);
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action, ...body }), cache: 'no-store', signal: ctl.signal });
    const txt = await r.text();
    try { return JSON.parse(txt); } catch { throw new Error(r.status === 404 ? 'no se encontró api.php en la carpeta minimarket-api del hosting.' : 'el hosting respondió algo distinto a lo esperado (' + r.status + '). Revise que api.php esté subido y que tenga PHP.'); }
  } finally { clearTimeout(t); }
}

function syncEstado(e) {
  SYNC.estado = e;
  const el = $('#syncPill'); if (!el) return;
  if (!SYNC.token) { el.innerHTML = ''; return; }
  const T = { ok: ['ok', 'check', 'Sincronizado'], guardando: ['wait', 'clock', 'Guardando…'], offline: ['off', 'alert', 'Sin internet'], auth: ['off', 'lock', 'Vuelva a ingresar'] };
  const [cls, i, n] = T[e] || T.ok;
  el.innerHTML = `<span class="pill sync-${cls}" title="${e === 'offline' ? 'Los cambios quedan guardados en este equipo y se suben solos cuando vuelva internet.' : 'Los datos son los mismos en todos los equipos.'}">${ic(i)}${n}</span>`;
}

function syncMarcar() {
  if (!SYNC.token) return;
  SYNC.pend = true; SYNC.sucio++;
  syncGuardarEstado();
  clearTimeout(SYNC.timer);
  SYNC.timer = setTimeout(syncSubir, 700);
}

function camposDistintos(a, b) { const out = {}; Object.keys(b).forEach((k) => { if (JSON.stringify(a?.[k]) !== JSON.stringify(b[k])) out[k] = b[k]; }); return out; }

// Mezcla de 3 vías: lo que cambió en este equipo se aplica sobre lo último del servidor
function mezclar(base, local, server) {
  const out = clonar(server);
  COLS.forEach((col) => {
    out[col] = out[col] || [];
    const B = new Map((base?.[col] || []).map((x) => [x.id, x]));
    const L = new Map((local[col] || []).map((x) => [x.id, x]));
    const idx = new Map(out[col].map((x, i) => [x.id, i]));
    L.forEach((rec, id) => {
      const b = B.get(id);
      if (!b) { if (!idx.has(id)) { out[col].push(clonar(rec)); idx.set(id, out[col].length - 1); } return; }
      if (JSON.stringify(b) === JSON.stringify(rec)) return;
      if (!idx.has(id)) return; // lo borraron en otro equipo
      const sv = out[col][idx.get(id)];
      const cambios = camposDistintos(b, rec);
      if (col === 'productos' && 'stock' in cambios) { cambios.stock = Math.round(((sv.stock || 0) + (rec.stock - b.stock)) * 1000) / 1000; }
      out[col][idx.get(id)] = { ...sv, ...clonar(cambios) };
    });
    if (base) B.forEach((_, id) => { if (!L.has(id) && idx.has(id)) out[col] = out[col].filter((x) => x.id !== id); });
  });
  const cl = camposDistintos(base?.config || {}, local.config || {});
  out.config = { ...server.config, ...cl };
  out.config.nroVenta = Math.max(local.config?.nroVenta || 0, server.config?.nroVenta || 0);
  out.config.nroFactura = Math.max(local.config?.nroFactura || 0, server.config?.nroFactura || 0);
  // Tickets nuevos de este equipo que chocan con números del servidor: se renumeran
  const usados = new Set((server.ventas || []).map((v) => v.nro));
  const nuevos = new Set((local.ventas || []).filter((v) => !(base?.ventas || []).some((b) => b.id === v.id)).map((v) => v.id));
  out.ventas.forEach((v) => { if (nuevos.has(v.id) && usados.has(v.nro)) { out.config.nroVenta++; v.nro = out.config.nroVenta; } });
  ['version'].forEach((k) => (out[k] = Math.max(local[k] || 0, server[k] || 0)));
  return out;
}

function adoptar(data, version) {
  db = data;
  SYNC.version = version;
  SYNC.pend = false;
  guardarLocal(); syncFijarBase(); syncGuardarEstado();
  migrar();
}

function refrescarTrasSync() {
  if (S.user) {
    const u = db.usuarios.find((x) => x.id === S.user.id);
    if (!u || !u.activo) { toast('Su usuario fue desactivado o eliminado desde otro equipo.', 'warn'); S.user = null; S.cart = []; sessionStorage.removeItem(SES_KEY); render(); return; }
    S.user = u;
  }
  if (!$('.shell')) { if (!S.user) renderLogin(); return; }
  renderNav(); renderTopPill(); renderYo(); renderNoti();
  const tecleando = document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
  if (!tecleando) renderView();
}

async function syncSubir() {
  if (!SYNC.token || !SYNC.url) return;
  if (SYNC.ocupado) { clearTimeout(SYNC.timer); SYNC.timer = setTimeout(syncSubir, 800); return; }
  SYNC.ocupado = true; syncEstado('guardando');
  const marca = SYNC.sucio;
  try {
    let r = await api('push', { token: SYNC.token, base: SYNC.version, data: db });
    for (let intento = 0; r.conflict && intento < 4; intento++) {
      const mezcla = mezclar(syncBase(), db, r.data);
      db = mezcla; guardarLocal();
      const v = r.version;
      r = await api('push', { token: SYNC.token, base: v, data: db });
      if (r.ok) setTimeout(refrescarTrasSync, 0);
    }
    if (r.auth) { SYNC.token = ''; syncGuardarEstado(); syncEstado('auth'); toast('La sesión con el servidor venció. Salga y vuelva a ingresar para seguir sincronizando.', 'warn'); return; }
    if (!r.ok) throw new Error(r.error || 'No se pudo guardar en el servidor');
    SYNC.version = r.version; syncFijarBase();
    if (SYNC.sucio === marca) SYNC.pend = false;
    syncGuardarEstado(); syncEstado('ok');
  } catch (e) {
    syncEstado('offline');
    clearTimeout(SYNC.timer); SYNC.timer = setTimeout(syncSubir, 10000);
  } finally {
    SYNC.ocupado = false;
    if (SYNC.pend && SYNC.sucio !== marca) { clearTimeout(SYNC.timer); SYNC.timer = setTimeout(syncSubir, 300); }
  }
}

async function syncBajar() {
  if (!SYNC.token || !SYNC.url || SYNC.ocupado) return;
  if (SYNC.pend) return syncSubir();
  if ($('#modal-root .modal-wrap')) return; // no cambiar datos mientras hay una ventana abierta
  SYNC.ocupado = true;
  try {
    const r = await api('pull', { token: SYNC.token, version: SYNC.version });
    if (r.auth) { SYNC.token = ''; syncGuardarEstado(); S.user = null; S.cart = []; sessionStorage.removeItem(SES_KEY); render(); toast('Vuelva a ingresar con su usuario.', 'warn', 'Sesión vencida'); return; }
    if (r.ok && !r.same && !SYNC.pend) { adoptar(r.data, r.version); refrescarTrasSync(); }
    syncEstado('ok');
  } catch { syncEstado('offline'); }
  finally { SYNC.ocupado = false; }
}

function syncIniciar() {
  syncEstado(SYNC.pend ? 'guardando' : 'ok');
  clearInterval(SYNC.lazo);
  SYNC.lazo = setInterval(syncBajar, 12000);
  if (SYNC.pend) syncSubir(); else syncBajar();
}
window.addEventListener('online', () => { if (SYNC.token) { SYNC.pend ? syncSubir() : syncBajar(); } });
document.addEventListener('visibilitychange', () => { if (!document.hidden && SYNC.token) syncBajar(); });

// Ingreso contra el servidor. Devuelve: 'ok' | 'mal' | 'inactivo' | 'local' (sin servidor o sin internet)
async function loginServidor(usuario, hash) {
  if (!SYNC.url) return 'local';
  let r;
  try { r = await api('login', { usuario, hash }); }
  catch (e) {
    let ok = false;
    for (const alt of SERVIDORES.filter((x) => x !== SYNC.url)) {
      try { r = await api('login', { usuario, hash }, alt); SYNC.url = alt; localStorage.setItem(SK.url, alt); ok = true; break; } catch { /* sigue probando */ }
    }
    if (!ok) { SYNC.ultimoError = e.message; return 'local'; }
  }
  if (r.ok) {
    SYNC.token = r.token;
    if (SYNC.pend && syncBase()) { adoptar(mezclar(syncBase(), db, r.data), r.version); SYNC.pend = true; syncGuardarEstado(); }
    else adoptar(r.data, r.version);
    return 'ok';
  }
  if (r.inactivo) return 'inactivo';
  if (r.empty) {
    // Servidor nuevo y vacío: se suben los datos de este equipo
    const loc = db.usuarios.find((x) => x.usuario.toLowerCase() === usuario);
    if (!loc || loc.pass !== hash) return 'mal';
    try {
      const i = await api('init', { usuario, hash, data: db });
      if (i.ok) { SYNC.token = i.token; adoptar(db, i.version); toast('Los datos de este equipo se subieron al servidor. Ahora todos los equipos ven lo mismo.', 'ok', 'Servidor listo'); return 'ok'; }
    } catch { return 'local'; }
  }
  return 'mal';
}

function conectarServidor() {
  modal({
    title: 'Conectar con el servidor',
    body: `<p class="muted" style="margin-bottom:14px">Escriba la dirección donde subió el sistema. Así este equipo usa los mismos usuarios, productos y ventas que los demás.</p>
      <div class="field"><label>Dirección del sistema en internet</label><input class="input" id="svU" placeholder="https://api-minimarket.spynetpy.com/" value="${esc((SYNC.url || '').replace(/api\.php$/, ''))}" autocapitalize="none" autocorrect="off" spellcheck="false" autofocus></div>
      <p class="muted" id="svM" style="font-size:13.5px"></p>`,
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: 'Probar y guardar', cls: 'btn-primary', icon: 'check', primary: true, onClick: async (w) => {
        let u = $('#svU', w).value.trim();
        if (!u) { toast('Escriba la dirección.', 'err'); return false; }
        if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
        if (!/api\.php$/i.test(u)) u = u.replace(/\/?(index\.html)?$/i, '/') + 'api.php';
        $('#svM', w).textContent = 'Probando conexión…';
        try {
          const r = await api('ping', {}, u);
          if (!r.ok) throw new Error(r.error || 'Respuesta inválida');
          localStorage.setItem(SK.url, u); SYNC.url = u;
          toast(r.empty ? 'Conectado. El servidor está vacío: al ingresar se suben los datos de este equipo.' : 'Conectado al servidor. Ingrese con su usuario.', 'ok', 'Servidor');
          if (!S.user) renderLogin();
        } catch (e) { $('#svM', w).textContent = 'No se pudo conectar: ' + (e.message === 'Failed to fetch' ? 'revise la dirección y que haya internet.' : e.message); return false; }
      } },
    ],
  });
}

/* ---------- Ayudantes de negocio ---------- */
const unidadNombre = (u) => (u === 'bodega' ? db.config.nombreBodega : db.config.nombreMarket);
const unidadCorta = (u) => (u === 'bodega' ? 'Bodega' : 'Minimarket');
const sectorDe = (id) => db.sectores.find((s) => s.id === id);
const prodDe = (id) => db.productos.find((p) => p.id === id);
const clienteDe = (id) => db.clientes.find((c) => c.id === id);
const cajaAbierta = (tipo = 'efectivo') => db.cajas.find((c) => c.abierta && (c.tipo || 'efectivo') === tipo);
const algunaCaja = () => cajaAbierta('efectivo') || cajaAbierta('transferencia');

function snapItem(p, cant) {
  const s = sectorDe(p.sectorId);
  return { pid: p.id, codigo: p.codigo, nombre: p.nombre, sectorId: p.sectorId, sector: s?.nombre || '', unidad: s?.unidad || 'market', medida: p.medida, cant, precio: p.precio, costo: p.costo, iva: p.iva ?? 10 };
}

function armarVenta(items, { metodo, clienteId, recibido, fecha, cajaId, usuario }) {
  const tot = { market: 0, bodega: 0 }, cost = { market: 0, bodega: 0 };
  items.forEach((it) => {
    it.subtotal = Math.round(it.cant * it.precio);
    tot[it.unidad] += it.subtotal;
    cost[it.unidad] += Math.round(it.cant * it.costo);
  });
  const total = tot.market + tot.bodega;
  db.config.nroVenta = (db.config.nroVenta || 0) + 1;
  return {
    id: uid(), nro: db.config.nroVenta, fecha: fecha || new Date().toISOString(),
    usuarioId: usuario?.id, usuario: usuario?.nombre, cajaId: cajaId ?? null,
    items, totales: tot, costos: cost, total, metodo, clienteId: clienteId || null,
    recibido: metodo === 'efectivo' ? (recibido || total) : 0,
    vuelto: metodo === 'efectivo' ? Math.max(0, (recibido || total) - total) : 0,
    anulada: false,
  };
}

function cargarCredito(v) {
  ['market', 'bodega'].forEach((u) => {
    if (v.totales[u] > 0) db.movimientos.push({ id: uid(), clienteId: v.clienteId, fecha: v.fecha, tipo: 'cargo', unidad: u, monto: v.totales[u], ventaId: v.id, cajaId: v.cajaId, nota: `Venta Nº ${v.nro}`, usuario: v.usuario });
  });
}

function saldo(clienteId, unidad) {
  return sumBy(db.movimientos.filter((m) => m.clienteId === clienteId && (!unidad || m.unidad === unidad)), (m) => (m.tipo === 'cargo' ? m.monto : -m.monto));
}

const enRango = (f, desde, hasta) => { const k = dkey(f); return k >= desde && k <= hasta; };
const ventasRango = (desde, hasta) => db.ventas.filter((v) => !v.anulada && enRango(v.fecha, desde, hasta));
const gastosRango = (desde, hasta) => db.gastos.filter((g) => enRango(g.fecha, desde, hasta));

function resumen(ventas, gastos, consumos = []) {
  const r = {};
  ['market', 'bodega'].forEach((u) => {
    const vts = sumBy(ventas, (v) => v.totales[u]);
    const cst = sumBy(ventas, (v) => v.costos[u]);
    const gst = sumBy(gastos.filter((g) => g.unidad === u), (g) => g.monto);
    const con = sumBy(consumos.filter((c) => c.unidad === u), (c) => Math.round(c.cant * c.costo));
    r[u] = { ventas: vts, costo: cst, bruta: vts - cst, gastos: gst, consumo: con, neta: vts - cst - gst - con, tickets: ventas.filter((v) => v.totales[u] > 0).length };
  });
  r.total = {
    ventas: r.market.ventas + r.bodega.ventas, costo: r.market.costo + r.bodega.costo,
    bruta: r.market.bruta + r.bodega.bruta, gastos: r.market.gastos + r.bodega.gastos, consumo: r.market.consumo + r.bodega.consumo,
    neta: r.market.neta + r.bodega.neta, tickets: ventas.length,
  };
  return r;
}

function resumenCaja(c) {
  const tipo = c.tipo || 'efectivo';
  const vs = db.ventas.filter((v) => v.cajaId === c.id && !v.anulada && medioDe(v.metodo) === tipo);
  const ventas = sumBy(vs, (v) => v.total);
  const cobros = sumBy(db.movimientos.filter((m) => m.tipo === 'pago' && m.cajaId === c.id && medioDe(m.metodo) === tipo), (m) => m.monto);
  const egresos = sumBy(db.gastos.filter((g) => g.cajaId === c.id && g.medio === tipo), (g) => g.monto);
  return { ventas, cobros, ingresos: ventas + cobros, egresos, esperado: c.montoInicial + ventas + cobros - egresos,
    totalMarket: sumBy(vs, (v) => v.totales.market), totalBodega: sumBy(vs, (v) => v.totales.bodega) };
}

function recaudado(desde, hasta) {
  const r = { efectivo: { ing: 0, egr: 0 }, transferencia: { ing: 0, egr: 0 } };
  ventasRango(desde, hasta).forEach((v) => { const m = medioDe(v.metodo); if (m) r[m].ing += v.total; });
  db.movimientos.filter((m) => m.tipo === 'pago' && enRango(m.fecha, desde, hasta)).forEach((m) => { const k = medioDe(m.metodo); if (k) r[k].ing += m.monto; });
  gastosRango(desde, hasta).forEach((g) => { if (r[g.medio]) r[g.medio].egr += g.monto; });
  return r;
}
const consumosRango = (desde, hasta) => (db.consumos || []).filter((c) => enRango(c.fecha, desde, hasta));

/* ---------- Estado de la interfaz ---------- */
const S = {
  user: null, view: 'inicio',
  cart: [], sector: 'todos', q: '',
  prod: { q: '', unidad: 'todas', sector: 'todos' },
  hist: { desde: dkey(new Date()), hasta: dkey(new Date()), metodo: 'todos', q: '' },
  gas: { desde: dkey(addDays(new Date(), -29)), hasta: dkey(new Date()), unidad: 'todas' },
  cli: { q: '', soloDeuda: false },
  stats: { rango: '7', desde: '', hasta: '' },
};

/* ---------- Paginación para todas las tablas ---------- */
S.pag = {}; S.pagTam = {};
const PAG_RENDER = {};
function paginar(key, lista, render, tam = 15) {
  PAG_RENDER[key] = render;
  const porPag = S.pagTam[key] || tam;
  const total = lista.length, paginas = Math.max(1, Math.ceil(total / porPag));
  const p = Math.min(Math.max(1, S.pag[key] || 1), paginas); S.pag[key] = p;
  const ini = (p - 1) * porPag, fin = Math.min(ini + porPag, total);
  return { items: lista.slice(ini, fin), html: total ? pagerHTML(key, p, paginas, ini, fin, total, porPag) : '' };
}
function pagerHTML(key, p, paginas, ini, fin, total, porPag) {
  const nums = [];
  for (let i = 1; i <= paginas; i++) { if (i === 1 || i === paginas || Math.abs(i - p) <= 1 || (p <= 3 && i <= 4) || (p >= paginas - 2 && i >= paginas - 3)) nums.push(i); else if (nums[nums.length - 1] !== '…') nums.push('…'); }
  return `<div class="pager" data-pagbox="${key}">
    <span class="muted">Mostrando <b>${ini + 1}–${fin}</b> de <b>${total}</b></span>
    ${paginas > 1 ? `<div class="pager-nav">
      <button class="pg-btn" data-pag="${key}" data-p="${p - 1}" ${p === 1 ? 'disabled' : ''} aria-label="Página anterior" title="Anterior">${ic('chevL')}</button>
      ${nums.map((n) => (n === '…' ? '<span class="pg-dots">…</span>' : `<button class="pg-btn ${n === p ? 'on' : ''}" data-pag="${key}" data-p="${n}" ${n === p ? 'aria-current="page"' : ''}>${n}</button>`)).join('')}
      <button class="pg-btn" data-pag="${key}" data-p="${p + 1}" ${p === paginas ? 'disabled' : ''} aria-label="Página siguiente" title="Siguiente">${ic('chevR')}</button>
    </div>` : ''}
    <label class="pager-tam">Ver <select class="input" data-pagtam="${key}">${[10, 15, 25, 50, 100].map((n) => `<option value="${n}" ${n === porPag ? 'selected' : ''}>${n}</option>`).join('')}</select> por página</label>
  </div>`;
}
function irPag(key) {
  const f = PAG_RENDER[key]; if (!f) return;
  f();
  const box = $(`[data-pagbox="${key}"]`);
  const tabla = box && box.previousElementSibling;
  if (tabla && tabla.getBoundingClientRect().top < 70) tabla.scrollIntoView({ block: 'start', behavior: 'smooth' });
}
document.addEventListener('click', (e) => { const b = e.target.closest('[data-pag]'); if (!b || b.disabled) return; S.pag[b.dataset.pag] = +b.dataset.p; irPag(b.dataset.pag); });
document.addEventListener('change', (e) => { const sel = e.target.closest('[data-pagtam]'); if (!sel) return; S.pagTam[sel.dataset.pagtam] = +sel.value; S.pag[sel.dataset.pagtam] = 1; irPag(sel.dataset.pagtam); });
const pagReset = (k) => (S.pag[k] = 1);

const puede = (k) => !!S.user && (S.user.rol === 'admin' || (S.user.permisos || []).includes(k));

/* ---------- Toast y modales ---------- */
const TOAST = { ok: ['¡Éxito!', 'check'], err: ['No se pudo', 'ban'], warn: ['Atención', 'alert'], stock: ['Producto por terminarse', 'bell'] };
function toast(msg, tipo = 'ok', titulo) {
  const [tt, icono] = TOAST[tipo] || TOAST.ok;
  const t = document.createElement('div');
  t.className = 'toast ' + tipo;
  t.setAttribute('role', tipo === 'err' ? 'alert' : 'status');
  t.innerHTML = `<span class="t-ic">${ic(icono)}</span><div class="t-txt"><b>${esc(titulo || tt)}</b><span>${esc(msg)}</span></div><button class="t-x" aria-label="Cerrar aviso">${ic('x')}</button>`;
  const quitar = () => { t.classList.add('out'); setTimeout(() => t.remove(), 180); };
  $('.t-x', t).onclick = quitar;
  const root = $('#toast-root');
  while (root.children.length >= 3) root.firstElementChild.remove();
  root.appendChild(t);
  setTimeout(quitar, tipo === 'err' || tipo === 'stock' ? 6000 : 3500);
}

function modal({ title, body, actions = [], size = '', onOpen, onClose }) {
  const wrap = document.createElement('div');
  wrap.className = 'modal-wrap';
  wrap.innerHTML = `<div class="modal ${size}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="modal-head"><h3>${title}</h3><button class="icon-btn" data-x aria-label="Cerrar">${ic('x')}</button></div>
    <div class="modal-body">${body}</div><div class="modal-foot"></div></div>`;
  const foot = $('.modal-foot', wrap);
  let cerrado = false;
  const close = (porBoton) => {
    if (cerrado) return; cerrado = true; wrap.remove();
    if (!porBoton && onClose) onClose();
  };
  actions.forEach((a) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn ' + (a.cls || '');
    if (a.primary) b.dataset.primary = '1';
    b.innerHTML = (a.icon ? ic(a.icon) : '') + esc(a.label);
    b.onclick = async () => {
      const r = a.onClick ? await a.onClick(wrap) : true;
      if (r !== false) close(true);
    };
    foot.appendChild(b);
  });
  $('[data-x]', wrap).onclick = () => close(false);
  wrap.close = close;
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
      const p = $('[data-primary]', wrap); if (p) { e.preventDefault(); p.click(); }
    }
  });
  $('#modal-root').appendChild(wrap);
  if (onOpen) onOpen(wrap);
  const f = $('[autofocus]', wrap) || $('.modal-body input:not([type=checkbox]):not([type=radio]), .modal-body select', wrap);
  setTimeout(() => (f ? f.focus() : $('[data-primary]', wrap)?.focus()), 40);
  return wrap;
}

function confirmar(msg, { title = 'Confirmar', ok = 'Confirmar', danger = false, cancel = 'Cancelar' } = {}) {
  return new Promise((res) => {
    modal({
      title, size: 'sm',
      body: `<div class="confirm-icon ${danger ? 'danger' : ''}">${ic(danger ? 'alert' : 'check')}</div><p class="confirm-msg">${msg}</p>`,
      actions: [
        { label: cancel, cls: 'btn-red', onClick: () => res(false) },
        { label: ok, cls: danger ? 'btn-orange' : 'btn-primary', primary: true, onClick: () => res(true) },
      ],
      onClose: () => res(false),
    });
  });
}

function cerrarModalSuperior() {
  const m = $$('#modal-root .modal-wrap').pop();
  if (m) { m.close(false); return true; }
  return false;
}

/* ---------- Login ---------- */
const pwField = (id, label, extra = '') => `<div class="field"><label for="${id}">${label}</label><div class="pw"><input class="input ${extra}" id="${id}" type="password" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false"><button type="button" class="pw-eye" data-eye="${id}" aria-label="Mostrar contraseña" title="Mostrar contraseña">${ic('eyeOff')}</button></div></div>`;

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-eye]'); if (!b) return;
  const i = document.getElementById(b.dataset.eye); if (!i) return;
  const ver = i.type === 'password';
  i.type = ver ? 'text' : 'password';
  b.innerHTML = ic(ver ? 'eye' : 'eyeOff');
  b.setAttribute('aria-label', ver ? 'Ocultar contraseña' : 'Mostrar contraseña');
  b.title = ver ? 'Ocultar contraseña' : 'Mostrar contraseña';
  i.focus();
});

function renderLogin() {
  $('#app').innerHTML = `
  <div class="login">
    <div class="login-bg" aria-hidden="true"></div>
    <form class="login-card" id="fLogin" autocomplete="off">
      <img class="login-logo" src="img/logo.png" alt="Logo Minimarket Bodega Bonanza">
      <h2>Ingresar al sistema</h2>
      <p class="muted">${esc(db.config.nombreMarket)} y ${esc(db.config.nombreBodega)}</p>
      <div class="field"><label for="lu">Usuario</label><input class="input input-lg" id="lu" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" required></div>
      ${pwField('lp', 'Contraseña', 'input-lg')}
      <div class="login-error" id="lErr"></div>
      <button class="btn btn-primary btn-lg btn-block" type="submit">${ic('lock')}Ingresar</button>
    </form>
  </div>`;
  $('#lu').focus();
  $('#fLogin').onsubmit = async (e) => {
    e.preventDefault();
    const u = $('#lu').value.trim().toLowerCase();
    const p = $('#lp').value.replace(/^\s+|\s+$/g, '');
    const hash = passHash(u, p);
    const btn = $('#fLogin button[type=submit]'); btn.disabled = true; btn.innerHTML = `${ic('clock')}Ingresando…`;
    const res = await loginServidor(u, hash);
    btn.disabled = false; btn.innerHTML = `${ic('lock')}Ingresar`;
    if (res === 'inactivo') { $('#lErr').textContent = 'Este usuario está desactivado. Consulte al administrador.'; return; }
    if (res === 'mal') { $('#lErr').textContent = 'Usuario o contraseña incorrectos.'; $('#lp').select(); return; }
    if (res !== 'ok') {
      const motivo = SYNC.ultimoError && SYNC.ultimoError !== 'Failed to fetch' && SYNC.ultimoError !== 'Load failed' ? SYNC.ultimoError : (navigator.onLine ? 'el servidor no responde.' : 'no hay internet en este equipo.');
      $('#lErr').innerHTML = `No se pudo conectar con el servidor: ${esc(motivo)}<br><small>Avise al encargado del sistema. Los datos se guardan solo en el servidor, para que sean iguales en todos los equipos.</small>`;
      return;
    }
    const user = db.usuarios.find((x) => x.usuario.toLowerCase() === u);
    if (!user || !user.activo) { $('#lErr').textContent = 'Usuario o contraseña incorrectos.'; return; }
    syncIniciar();
    S.user = user;
    sessionStorage.setItem(SES_KEY, user.id);
    S.view = primeraVista();
    render();
    toast(`Bienvenido, ${user.nombre}`, 'ok', 'Hola');
    const nb = productosBajos().length;
    if (nb) setTimeout(() => toast(`Hay ${nb} ${nb === 1 ? 'producto que se está' : 'productos que se están'} terminando. Toque la campanita para verlos.`, 'stock', 'Revise el stock'), 600);
  };
}

function primeraVista() {
  const v = NAV.find((n) => puede(n.k));
  return v ? v.k : null;
}

async function salir() {
  const ok = await confirmar(S.cart.length ? 'Hay productos en el ticket actual. Si sale, se perderán. ¿Desea cerrar sesión?' : '¿Desea cerrar sesión?', { title: 'Salir', ok: 'Cerrar sesión', danger: true });
  if (!ok) return;
  S.user = null; S.cart = [];
  sessionStorage.removeItem(SES_KEY);
  clearInterval(SYNC.lazo);
  if (SYNC.pend) await syncSubir();
  SYNC.token = ''; syncGuardarEstado();
  render();
}

/* ---------- Estructura principal ---------- */
function render() {
  if (!S.user) { renderLogin(); return; }
  if (!$('.shell')) {
    $('#app').innerHTML = `
    <div class="shell">
      <aside class="side" id="side">
        <div class="brand"><img src="img/logo.png" alt=""><div><b>Bonanza</b><span>Minimarket y bodega</span></div></div>
        <nav class="nav" id="nav"></nav>
        <div class="side-foot"><button class="btn btn-red btn-block" id="btnSalir">${ic('logout')}Salir</button></div>
      </aside>
      <div class="main">
        <header class="top">
          <button class="icon-btn menu-btn" id="btnMenu" aria-label="Menú">${ic('menu')}</button>
          <div class="title" id="topTitle"></div>
          <div class="spacer"></div>
          <span id="syncPill" class="hide-sm"></span><span id="cajaPill" class="pills hide-sm"></span>
          <div class="noti-wrap"><button class="icon-btn noti-btn" id="btnNoti" aria-label="Avisos de stock" title="Avisos de stock">${ic('bell')}<span class="noti-count hidden" id="notiN"></span></button><div class="noti-panel hidden" id="notiPanel"></div></div>
          <span class="pill hide-sm" id="reloj">${ic('clock')}<span></span></span>
          <button class="who" id="btnYo" title="Mi perfil"></button>
        </header>
        <main class="content" id="view"></main>
      </div>
    </div>`;
    $('#btnSalir').onclick = salir;
    $('#btnMenu').onclick = () => $('#side').classList.toggle('open');
    $('#btnYo').onclick = miPerfil;
    $('#btnNoti').onclick = (e) => { e.stopPropagation(); $('#notiPanel').classList.toggle('hidden'); };
    document.addEventListener('click', (e) => { const pnl = $('#notiPanel'); if (pnl && !pnl.contains(e.target)) pnl.classList.add('hidden'); });
    tickReloj();
  }
  renderNav();
  renderTopPill();
  renderYo();
  renderNoti();
  syncEstado(SYNC.estado);
  renderView();
}

function renderNav() {
  $('#nav').innerHTML = NAV.filter((n) => puede(n.k)).map((n) =>
    `<button class="${S.view === n.k ? 'on' : ''}" data-v="${n.k}">${ic(n.i)}<span>${n.n}</span></button>`).join('');
  $$('#nav button').forEach((b) => (b.onclick = () => ir(b.dataset.v)));
}

function renderTopPill() {
  const el = $('#cajaPill');
  if (!el) return;
  el.innerHTML = ['efectivo', 'transferencia'].map((t) => {
    const c = cajaAbierta(t);
    return `<button class="pill ${c ? 'ok' : 'off'}" data-go="caja" title="${CAJAS[t].n}">${ic(c ? 'unlock' : 'lock')}${CAJAS[t].c}</button>`;
  }).join('');
  $$('button', el).forEach((b) => (b.onclick = () => { if (puede('caja')) ir('caja'); }));
}

const productosBajos = () => db.productos.filter((p) => p.activo && p.controlStock && p.stock <= p.stockMin).sort((a, b) => a.stock / (a.stockMin || 1) - b.stock / (b.stockMin || 1));

function renderNoti() {
  const btn = $('#btnNoti'); if (!btn) return;
  const bajos = productosBajos();
  const n = $('#notiN');
  n.textContent = bajos.length > 99 ? '99+' : bajos.length;
  n.classList.toggle('hidden', !bajos.length);
  $('#notiPanel').innerHTML = `<div class="noti-head"><b>Productos por terminarse</b><span class="muted">${bajos.length}</span></div>
    <div class="noti-list">${bajos.length ? bajos.map((p) => { const s = sectorDe(p.sectorId); return `<div class="noti-item u-${s?.unidad}">
      <div class="grow"><b>${esc(p.nombre)}</b><div><span class="tag">${esc(s?.nombre || '')}</span> <span class="badge ${p.stock <= 0 ? 'red' : 'orange'}">${p.stock <= 0 ? 'Agotado' : `Quedan ${fmtCant(p.stock)} ${p.medida}`}</span></div></div>
      ${puede('productos') ? `<button class="btn btn-sm" data-cargar="${p.id}">${ic('plus')}Cargar</button>` : ''}</div>`; }).join('')
      : `<div class="empty">${ic('check')}<p>Todo el stock está bien.</p></div>`}</div>`;
  $$('[data-cargar]', $('#notiPanel')).forEach((b) => (b.onclick = () => { $('#notiPanel').classList.add('hidden'); ajustarStock(prodDe(b.dataset.cargar)); }));
}

const iniciales = (n) => String(n || '?').trim().split(/\s+/).slice(0, 2).map((x) => x[0]).join('').toUpperCase();
const avatar = (u, cls = '') => `<span class="avatar ${cls}">${u.foto ? `<img src="${u.foto}" alt="">` : esc(iniciales(u.nombre))}</span>`;

function renderYo() {
  const b = $('#btnYo'); if (!b) return;
  b.innerHTML = `${avatar(S.user)}<span class="who-txt">${esc(S.user.nombre)}<small>${S.user.rol === 'admin' ? 'Administrador' : 'Usuario'}</small></span>`;
}

function tickReloj() {
  const el = $('#reloj span');
  if (!el) return;
  const d = new Date();
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  el.textContent = `${dias[d.getDay()]} ${fFecha(d)} · ${fHora(d)}`;
}
setInterval(tickReloj, 20000);

function ir(v) {
  if (!puede(v)) { toast('No tiene permiso para entrar a esta sección. Pídaselo al administrador.', 'warn'); return; }
  S.view = v;
  $('#side')?.classList.remove('open');
  renderNav();
  renderView();
}

const VIEWS = {};
function renderView() {
  const v = S.view && puede(S.view) ? S.view : primeraVista();
  S.view = v;
  const titulo = NAV.find((n) => n.k === v);
  $('#topTitle').textContent = titulo ? titulo.n : '';
  const el = $('#view');
  if (!v) { el.innerHTML = `<div class="panel empty">${ic('lock')}<p>Su usuario no tiene secciones habilitadas. Pida permisos al administrador.</p></div>`; return; }
  VIEWS[v](el);
  window.scrollTo(0, 0);
}

function achicarFoto(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onerror = rej;
    r.onload = () => {
      const img = new Image();
      img.onerror = rej;
      img.onload = () => {
        const t = 220, cv = document.createElement('canvas'); cv.width = cv.height = t;
        const lado = Math.min(img.width, img.height);
        cv.getContext('2d').drawImage(img, (img.width - lado) / 2, (img.height - lado) / 2, lado, lado, 0, 0, t, t);
        res(cv.toDataURL('image/jpeg', 0.85));
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

function miPerfil() {
  const u = db.usuarios.find((x) => x.id === S.user.id);
  let foto = u.foto || '';
  modal({
    title: 'Mi perfil',
    body: `<div class="perfil-top"><span id="pfAv">${avatar({ ...u, foto }, 'xl')}</span>
        <div><div style="display:flex;gap:8px;flex-wrap:wrap"><label class="btn btn-sm">${ic('camera')}Cambiar foto<input type="file" id="pfF" accept="image/*" hidden></label><button type="button" class="btn btn-sm" id="pfQ">Quitar foto</button></div>
        <p class="muted" style="font-size:13.5px;margin-top:8px">Usuario: <b>${esc(u.usuario)}</b> · ${u.rol === 'admin' ? 'Administrador' : 'Usuario'}</p></div></div>
      <div class="grid2"><div class="field"><label>Nombre</label><input class="input" id="pfN" value="${esc(u.nombre)}"></div>
      <div class="field"><label>Teléfono</label><input class="input" id="pfT" value="${esc(u.telefono || '')}"></div></div>
      <div class="section-title">Cambiar contraseña (opcional)</div>
      ${pwField('c0', 'Contraseña actual')}
      <div class="grid2">${pwField('c1', 'Nueva contraseña')}${pwField('c2', 'Repetir nueva contraseña')}</div>`,
    onOpen: (w) => {
      const pinta = () => ($('#pfAv', w).innerHTML = avatar({ ...u, nombre: $('#pfN', w).value || u.nombre, foto }, 'xl'));
      $('#pfF', w).onchange = async (e) => { const f = e.target.files[0]; if (!f) return; try { foto = await achicarFoto(f); pinta(); } catch { toast('No se pudo leer esa imagen. Pruebe con otra foto.', 'err'); } };
      $('#pfQ', w).onclick = () => { foto = ''; pinta(); };
      $('#pfN', w).oninput = pinta;
    },
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: 'Guardar perfil', cls: 'btn-primary', icon: 'check', primary: true, onClick: (w) => {
        const nombre = $('#pfN', w).value.trim();
        if (!nombre) { toast('Escriba su nombre.', 'err'); return false; }
        const n = $('#c1', w).value;
        if (n || $('#c0', w).value) {
          if (u.pass !== passHash(u.usuario, $('#c0', w).value)) { toast('La contraseña actual no es correcta.', 'err'); return false; }
          if (n.length < 4) { toast('La nueva contraseña debe tener al menos 4 caracteres.', 'err'); return false; }
          if (n !== $('#c2', w).value) { toast('Las contraseñas nuevas no coinciden.', 'err'); return false; }
          u.pass = passHash(u.usuario, n);
        }
        Object.assign(u, { nombre, telefono: $('#pfT', w).value.trim(), foto });
        S.user = u; save(); renderYo(); toast('Perfil actualizado');
        if (S.view === 'usuarios') renderView();
      } },
    ],
  });
}

/* =========================================================
   INICIO
   ========================================================= */
VIEWS.inicio = (el) => {
  const h = new Date().getHours();
  const saludo = h < 12 ? 'Buen día' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
  const ce = cajaAbierta('efectivo'), ct = cajaAbierta('transferencia');
  const bajos = productosBajos();
  const ultima = db.ventas.filter((v) => !v.anulada).slice(-1)[0];
  const deudores = db.clientes.filter((c) => saldo(c.id) > 0).length;
  const grupos = [
    { n: 'Vender y cobrar', items: [
      { k: 'ventas', go: 'ventas', i: 'cart', n: 'Nueva venta', d: 'Cobrar productos en la caja', hot: true },
      { k: 'ventas', act: 'precio', i: 'search', n: 'Consultar precio', d: 'Ver precio y stock de un producto' },
      { k: 'historial', act: 'ultima', i: 'receipt', n: 'Último ticket', d: ultima ? `Reimprimir, PDF o WhatsApp · ${nroTicket(ultima)}` : 'Todavía no hay ventas', off: !ultima },
      { k: 'clientes', act: 'cobrar', i: 'coins', n: 'Cobrar crédito', d: 'Un cliente viene a pagar lo que debe' },
    ] },
    { n: 'Caja y dinero', items: [
      { k: 'caja', act: 'caja-efectivo', i: ce ? 'lock' : 'unlock', n: ce ? 'Cerrar caja efectivo' : 'Abrir caja efectivo', d: ce ? `Abierta desde las ${fHora(ce.apertura)}` : 'Toque para empezar el turno', est: ce ? 'ok' : 'off' },
      { k: 'caja', act: 'caja-transferencia', i: ct ? 'lock' : 'unlock', n: ct ? 'Cerrar caja transferencia' : 'Abrir caja transferencia', d: ct ? `Abierta desde las ${fHora(ct.apertura)}` : 'Para transferencias y tarjetas', est: ct ? 'ok' : 'off' },
      { k: 'gastos', act: 'gasto', i: 'wallet', n: 'Registrar gasto', d: 'Proveedores, ANDE, sueldos…' },
      { k: 'formas', go: 'formas', i: 'card', n: 'Formas de pago', d: 'Cuánto entró en efectivo y transferencia' },
    ] },
    { n: 'Mercadería', items: [
      { k: 'productos', act: 'cargar', i: 'plus', n: 'Cargar mercadería', d: 'Sumar stock cuando llega un pedido' },
      { k: 'productos', act: 'bajos', i: 'bell', n: 'Por terminarse', d: bajos.length ? `${bajos.length} ${bajos.length === 1 ? 'producto con' : 'productos con'} poco stock` : 'Todo el stock está bien', alerta: bajos.length > 0 },
      { k: 'productos', act: 'producto', i: 'box', n: 'Nuevo producto', d: 'Precio, categoría y stock' },
      { k: 'consumo', go: 'consumo', i: 'package', n: 'Consumo interno', d: 'Lo que se usó sin venderse' },
    ] },
    { n: 'Clientes e informes', items: [
      { k: 'clientes', act: 'cliente', i: 'user', n: 'Nuevo cliente', d: 'Para vender a crédito' },
      { k: 'clientes', go: 'clientes', i: 'users', n: 'Clientes que deben', d: deudores ? `${deudores} con deuda pendiente` : 'Nadie debe por ahora' },
      { k: 'resumen', go: 'resumen', i: 'clipboard', n: 'Resumen del día', d: 'Lo vendido en cada negocio' },
      { k: 'caja', act: 'informe', i: 'download', n: 'Informe de hoy en PDF', d: 'Recaudado, ventas y gastos del día' },
    ] },
  ];
  el.innerHTML = `
    <div class="hello"><div><h1>${saludo}, ${esc(S.user.nombre.split(' ')[0])}</h1>
      <p class="muted">${ce || ct ? `Caja abierta: ${[ce && 'efectivo', ct && 'transferencia'].filter(Boolean).join(' y ')}.` : 'Las cajas están cerradas. Toque "Abrir caja efectivo" para empezar.'}</p></div></div>
    ${grupos.map((g) => { const its = g.items.filter((q) => puede(q.k)); return its.length ? `<h2 class="sec-title">${g.n}</h2>
      <div class="quick">${its.map((q) => `<button class="${q.hot ? 'hot' : ''} ${q.alerta ? 'alerta' : ''} ${q.est ? 'est-' + q.est : ''}" ${q.off ? 'disabled' : ''} ${q.go ? `data-go="${q.go}"` : `data-act="${q.act}"`}>${ic(q.i)}<span><b>${q.n}</b><small>${q.d}</small></span></button>`).join('')}</div>` : ''; }).join('')}`;
  bindGo(el);
  $$('[data-act]', el).forEach((b) => (b.onclick = (e) => {
    const a = b.dataset.act;
    if (a === 'precio') consultarPrecio();
    if (a === 'ultima') verComprobante(db.ventas.filter((v) => !v.anulada).slice(-1)[0]);
    if (a === 'cobrar') elegirClienteParaPago();
    if (a === 'caja-efectivo' || a === 'caja-transferencia') { const t = a.split('-')[1]; const c = cajaAbierta(t); if (c) cerrarCaja(c); else abrirCaja(t, () => renderView()); }
    if (a === 'gasto') formGasto(null, () => renderView());
    if (a === 'cargar') cargarMercaderia();
    if (a === 'bajos') { e.stopPropagation(); $('#notiPanel').classList.remove('hidden'); }
    if (a === 'producto') formProducto(null, () => renderView());
    if (a === 'cliente') formCliente(null, () => renderView());
    if (a === 'informe') informeCaja(datosCaja(dkey(new Date())));
  }));
};

function consultarPrecio() {
  const w = modal({
    title: 'Consultar precio',
    body: `<div class="search">${ic('search')}<input class="input input-lg" id="cpQ" placeholder="Nombre o código de barras" autofocus></div><div class="cp-list" id="cpL"></div>`,
    actions: [{ label: 'Cerrar', cls: 'btn-primary' }],
  });
  const pintar = () => {
    const t = $('#cpQ', w).value.trim().toLowerCase();
    const l = db.productos.filter((p) => p.activo && (!t || p.nombre.toLowerCase().includes(t) || p.codigo.toLowerCase().includes(t))).slice(0, 8);
    $('#cpL', w).innerHTML = l.length ? l.map((p) => { const s = sectorDe(p.sectorId); return `<div class="cp-item u-${s?.unidad}"><div class="grow"><b>${esc(p.nombre)}</b><div><span class="tag">${esc(s?.nombre || '')}</span> <span class="muted">Cód. ${esc(p.codigo)}</span></div></div>
      <div class="right"><b class="cp-precio num">${gs(p.precio)}${p.medida === 'kg' ? '<small>/kg</small>' : ''}</b><div class="muted" style="font-size:13px">${p.controlStock ? `Stock: ${fmtCant(p.stock)} ${p.medida}` : 'Sin control de stock'}</div></div>
      ${puede('ventas') ? `<button class="btn btn-sm btn-orange" data-add="${p.id}">${ic('cart')}Vender</button>` : ''}</div>`; }).join('') : `<div class="empty">${ic('search')}<p>No se encontró ningún producto.</p></div>`;
    $$('[data-add]', w).forEach((b) => (b.onclick = () => { w.close(true); if (S.view !== 'ventas') ir('ventas'); agregar(prodDe(b.dataset.add)); }));
  };
  $('#cpQ', w).oninput = pintar; pintar();
}

function cargarMercaderia() {
  const grupos = db.sectores.map((s) => {
    const ps = db.productos.filter((p) => p.activo && p.controlStock && p.sectorId === s.id).sort((a, b) => a.nombre.localeCompare(b.nombre));
    return ps.length ? `<optgroup label="${esc(unidadCorta(s.unidad))} · ${esc(s.nombre)}">${ps.map((p) => `<option value="${p.id}">${esc(p.nombre)} (hay ${fmtCant(p.stock)} ${p.medida})</option>`).join('')}</optgroup>` : '';
  }).join('');
  modal({
    title: 'Cargar mercadería',
    body: `<p class="muted" style="margin-bottom:14px">Sume al stock lo que llegó del proveedor.</p>
      <div class="field"><label>Producto</label><select class="input" id="cmP">${grupos}</select></div>
      <div class="grid2"><div class="field"><label>Cantidad que llegó</label><input class="input input-lg" id="cmC" inputmode="decimal" autofocus></div>
      <div class="field"><label>Nuevo costo (si cambió)</label><input class="input input-lg num" id="cmCo" inputmode="numeric" placeholder="Igual que antes"></div></div>`,
    onOpen: (w) => { const i = $('#cmCo', w); i.oninput = () => { const d = parseMonto(i.value); i.value = d ? miles(d) : ''; }; },
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: 'Sumar al stock', cls: 'btn-primary', icon: 'check', primary: true, onClick: (w) => {
        const p = prodDe($('#cmP', w).value); const n = parseCant($('#cmC', w).value);
        if (!p) { toast('Elija un producto.', 'err'); return false; }
        if (n <= 0) { toast('Escriba la cantidad que llegó.', 'err'); return false; }
        p.stock = Math.round((p.stock + n) * 1000) / 1000;
        const co = parseMonto($('#cmCo', w).value); if (co > 0) p.costo = co;
        save(); toast(`${p.nombre}: ahora hay ${fmtCant(p.stock)} ${p.medida}`);
        if (S.view === 'inicio') renderView();
      } },
    ],
  });
}

VIEWS.resumen = (el) => {
  const hoy = dkey(new Date());
  const r = resumen(ventasRango(hoy, hoy), gastosRango(hoy, hoy), consumosRango(hoy, hoy));
  const bajos = productosBajos().slice(0, 8);
  const ultimas = db.ventas.filter((v) => !v.anulada).slice(-8).reverse();
  const verPlata = puede('estadisticas');
  const unitCard = (u) => `
    <div class="panel unit-card u-${u}">
      <h3>${esc(unidadNombre(u))}</h3>
      <span class="muted">Vendido hoy</span>
      <div class="big num">${gs(r[u].ventas)}</div>
      <div style="margin-top:10px">
        <div class="row"><span>Tickets</span><b class="num">${r[u].tickets}</b></div>
        ${verPlata ? `<div class="row"><span>Ganancia bruta</span><b class="num">${gs(r[u].bruta)}</b></div>
        <div class="row"><span>Gastos de hoy</span><b class="num">${gs(r[u].gastos)}</b></div>` : ''}
        <div class="row"><span>Créditos pendientes</span><b class="num">${gs(sumBy(db.clientes, (cl) => Math.max(0, saldo(cl.id, u))))}</b></div>
      </div>
    </div>`;
  el.innerHTML = `
    <div class="cols cols-3">
      ${unitCard('market')}
      ${unitCard('bodega')}
      <div class="panel unit-card">
        <h3>Total del día</h3>
        <span class="muted">Entre los dos negocios</span>
        <div class="big num">${gs(r.total.ventas)}</div>
        <div style="margin-top:10px">
          <div class="row"><span>Tickets</span><b>${r.total.tickets}</b></div>
          ${verPlata ? `<div class="row"><span>Ganancia neta</span><b class="num">${gs(r.total.neta)}</b></div>` : ''}
          <div class="row"><span>Ticket promedio</span><b class="num">${gs(r.total.tickets ? r.total.ventas / r.total.tickets : 0)}</b></div>
        </div>
      </div>
    </div>
    <div class="cols cols-2" style="margin-top:16px">
      <div class="panel">
        <div class="panel-head"><h3>Últimas ventas</h3>${puede('historial') ? `<button class="btn btn-sm" data-go="historial">Ver todas</button>` : ''}</div>
        <div class="list">${ultimas.length ? ultimas.map((v) => `
          <div class="li"><span class="badge">Nº ${v.nro}</span><div class="grow"><b>${gs(v.total)}</b> <span class="muted">· ${METODOS[v.metodo]}${v.clienteId ? ' · ' + esc(clienteDe(v.clienteId)?.nombre || '') : ''}</span></div><span class="muted">${dkey(v.fecha) === hoy ? fHora(v.fecha) : fFH(v.fecha)}</span></div>`).join('')
          : `<div class="empty">${ic('receipt')}<p>Todavía no hay ventas.</p></div>`}</div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>Productos por terminarse</h3>${puede('productos') ? `<button class="btn btn-sm" data-go="productos">Ir a productos</button>` : ''}</div>
        <div class="list">${bajos.length ? bajos.map((p) => { const s = sectorDe(p.sectorId); return `
          <div class="li u-${s?.unidad}"><div class="grow">${esc(p.nombre)} <span class="tag">${esc(s?.nombre)}</span></div><span class="badge ${p.stock <= 0 ? 'red' : 'orange'}">${p.stock <= 0 ? 'Agotado' : `${fmtCant(p.stock)} ${p.medida}`}</span></div>`; }).join('')
          : `<div class="empty">${ic('check')}<p>Todo el stock está por encima del mínimo.</p></div>`}</div>
      </div>
    </div>`;
  bindGo(el);
};

function bindGo(el) { $$('[data-go]', el).forEach((b) => (b.onclick = () => ir(b.dataset.go))); }

/* =========================================================
   VENDER (POS) — una sola caja para minimarket y bodega
   ========================================================= */
VIEWS.ventas = (el) => {
  const c = algunaCaja();
  const secMk = db.sectores.filter((s) => s.unidad === 'market');
  const secBd = db.sectores.filter((s) => s.unidad === 'bodega');
  const chip = (id, nombre, u) => `<button class="chip ${u ? 'u-' + u : ''} ${S.sector === id ? 'on' : ''}" data-sec="${id}">${esc(nombre)}</button>`;
  el.innerHTML = `
    <div class="pos">
      <div class="pos-left">
        ${!c ? `<div class="caja-off">${ic('alert')}<span class="grow">La caja está cerrada. Ábrala para poder cobrar.</span>${puede('caja') ? `<button class="btn btn-orange btn-sm" id="abrirAqui">Abrir caja</button>` : ''}</div>` : ''}
        <div class="pos-search">
          <div class="search">${ic('search')}<input class="input" id="posQ" placeholder="Buscar por nombre o código de barras (F3)" value="${esc(S.q)}" autocomplete="off"></div>
        </div>
        <div class="chips">
          ${chip('todos', 'Todos')}
          ${chip('u-market', unidadCorta('market'), 'market')}${secMk.map((s) => chip(s.id, s.nombre, 'market')).join('')}
          ${chip('u-bodega', unidadCorta('bodega'), 'bodega')}${secBd.map((s) => chip(s.id, s.nombre, 'bodega')).join('')}
        </div>
        <div class="grid-prod" id="gridProd"></div>
      </div>
      <aside class="ticket" id="ticket"></aside>
    </div>`;
  $$('.chip', el).forEach((b) => (b.onclick = () => { S.sector = b.dataset.sec; $$('.chip', el).forEach((x) => x.classList.toggle('on', x === b)); renderGrid(); }));
  const q = $('#posQ');
  q.oninput = () => { S.q = q.value; renderGrid(); };
  q.onkeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const t = q.value.trim().toLowerCase();
      if (!t) { if (S.cart.length) cobrar(); return; }
      const exact = db.productos.find((p) => p.activo && p.codigo.toLowerCase() === t);
      const lista = filtrarPos();
      const p = exact || (lista.length === 1 ? lista[0] : null);
      if (p) { agregar(p); q.value = ''; S.q = ''; renderGrid(); }
      else toast(lista.length ? 'Hay varios productos. Elija uno de la lista.' : 'No se encontró ningún producto con ese código o nombre.', 'warn');
    }
  };
  $('#abrirAqui') && ($('#abrirAqui').onclick = () => abrirCaja('efectivo', () => renderView()));
  renderGrid(); renderTicket();
  setTimeout(() => q.focus(), 30);
};

function filtrarPos() {
  const t = S.q.trim().toLowerCase();
  return db.productos.filter((p) => {
    if (!p.activo) return false;
    const s = sectorDe(p.sectorId);
    if (S.sector === 'u-market' && s?.unidad !== 'market') return false;
    if (S.sector === 'u-bodega' && s?.unidad !== 'bodega') return false;
    if (S.sector.startsWith('s-') || (S.sector !== 'todos' && !S.sector.startsWith('u-'))) { if (p.sectorId !== S.sector) return false; }
    if (t && !(p.nombre.toLowerCase().includes(t) || p.codigo.toLowerCase().includes(t))) return false;
    return true;
  });
}

function renderGrid() {
  const g = $('#gridProd'); if (!g) return;
  const lista = filtrarPos();
  g.innerHTML = lista.length ? lista.map((p) => {
    const s = sectorDe(p.sectorId);
    const low = p.controlStock && p.stock <= p.stockMin;
    return `<button class="prod u-${s?.unidad}" data-pid="${p.id}">
      <span class="cd">${esc(p.codigo)}</span>
      <span class="sec">${esc(s?.nombre)}</span>
      <span class="nm">${esc(p.nombre)}</span>
      <span class="pr num">${gs(p.precio)}${p.medida === 'kg' ? '<small class="muted" style="font-size:13px"> /kg</small>' : ''}</span>
      <span class="st ${low ? 'low' : ''}">${p.controlStock ? `Stock: ${fmtCant(p.stock)} ${p.medida}` : 'Sin control de stock'}</span>
    </button>`;
  }).join('') : `<div class="empty" style="grid-column:1/-1">${ic('search')}<p>No hay productos con esa búsqueda.</p></div>`;
  $$('.prod', g).forEach((b) => (b.onclick = () => agregar(prodDe(b.dataset.pid))));
}

function agregar(p) {
  if (!p) return;
  if (p.medida === 'kg') {
    modal({
      title: `Peso de ${esc(p.nombre)}`, size: 'sm',
      body: `<div class="field"><label>Cantidad en kilos (ej.: 0,5 · 1,25)</label><input class="input input-lg" id="kg" value="1" inputmode="decimal" autofocus></div>
        <p class="muted">Precio por kilo: ${gs(p.precio)} · Total: <b id="kgT">${gs(p.precio)}</b></p>`,
      onOpen: (w) => { const i = $('#kg', w); i.select(); i.oninput = () => ($('#kgT', w).textContent = gs(parseCant(i.value) * p.precio)); },
      actions: [
        { label: 'Cancelar', cls: 'btn-red' },
        { label: 'Agregar al ticket', cls: 'btn-primary', primary: true, onClick: (w) => {
          const k = parseCant($('#kg', w).value);
          if (k <= 0) { toast('Ingrese un peso mayor a cero.', 'err'); return false; }
          sumarAlCarrito(p, k);
          setTimeout(() => $('#posQ')?.focus(), 50);
        } },
      ],
    });
    return;
  }
  sumarAlCarrito(p, 1);
}

function sumarAlCarrito(p, cant) {
  const ex = S.cart.find((x) => x.pid === p.id);
  if (ex && p.medida !== 'kg') ex.cant += cant; else if (ex) ex.cant = Math.round((ex.cant + cant) * 1000) / 1000; else S.cart.push({ pid: p.id, cant });
  const it = S.cart.find((x) => x.pid === p.id);
  if (p.controlStock && it.cant > p.stock) toast(`Atención: solo hay ${fmtCant(p.stock)} ${p.medida} de ${p.nombre} en stock.`, 'warn');
  renderTicket();
}

function totalesCarrito() {
  const t = { market: 0, bodega: 0 };
  S.cart.forEach((it) => { const p = prodDe(it.pid); if (!p) return; const u = sectorDe(p.sectorId)?.unidad || 'market'; t[u] += Math.round(it.cant * p.precio); });
  return { ...t, total: t.market + t.bodega };
}

function renderTicket() {
  const el = $('#ticket'); if (!el) return;
  S.cart = S.cart.filter((it) => prodDe(it.pid));
  const t = totalesCarrito();
  const n = S.cart.length;
  el.innerHTML = `
    <div class="ticket-head"><img src="img/logo.png" alt=""><h3>Ticket actual</h3><span class="badge">${n} ${n === 1 ? 'producto' : 'productos'}</span></div>
    <div class="ticket-lines">${n ? S.cart.map((it, i) => {
      const p = prodDe(it.pid); const s = sectorDe(p.sectorId);
      return `<div class="tl u-${s?.unidad}">
        <div><div class="nm">${esc(p.nombre)}</div><div class="sub">${esc(s?.nombre)} · ${gs(p.precio)}${p.medida === 'kg' ? '/kg' : ''}</div></div>
        <div class="tot num">${gs(it.cant * p.precio)}</div>
        <div class="ctrl">
          <div class="qty"><button data-m="${i}" aria-label="Restar">${ic('minus')}</button><input data-q="${i}" value="${fmtCant(it.cant)}" inputmode="decimal" aria-label="Cantidad"><button data-p="${i}" aria-label="Sumar">${ic('plus')}</button></div>
          <span class="muted" style="font-size:13px">${p.medida}</span>
          <span style="flex:1"></span>
          <button class="icon-btn danger" data-r="${i}" aria-label="Quitar">${ic('trash')}</button>
        </div></div>`;
    }).join('') : `<div class="empty">${ic('cart')}<p>Toque un producto o escanee el código para empezar.</p></div>`}</div>
    <div class="ticket-sum">
      <div class="row u-market"><span>${esc(unidadNombre('market'))}</span><b class="num">${gs(t.market)}</b></div>
      <div class="row u-bodega"><span>${esc(unidadNombre('bodega'))}</span><b class="num">${gs(t.bodega)}</b></div>
      <div class="total"><span>Total a cobrar</span><b class="num">${gs(t.total)}</b></div>
    </div>
    <div class="ticket-actions">
      <button class="btn btn-red btn-lg" id="btnVaciar" title="Cancelar venta (F8)" ${n ? '' : 'disabled'}>${ic('x')}Cancelar</button>
      <button class="btn btn-orange btn-lg" id="btnCobrar" title="Cobrar (F4)" ${n ? '' : 'disabled'}>${ic('cash')}Cobrar</button>
    </div>
    <div class="ticket-keys"><span><kbd>F3</kbd> buscar</span><span><kbd>F4</kbd> cobrar</span><span><kbd>F8</kbd> cancelar</span><span><kbd>Enter</kbd> agregar</span></div>`;
  const lines = $('.ticket-lines', el); lines.scrollTop = lines.scrollHeight;
  $$('[data-m]', el).forEach((b) => (b.onclick = () => { const it = S.cart[b.dataset.m]; const p = prodDe(it.pid); it.cant = Math.round((it.cant - (p.medida === 'kg' ? 0.25 : 1)) * 1000) / 1000; if (it.cant <= 0) S.cart.splice(b.dataset.m, 1); renderTicket(); }));
  $$('[data-p]', el).forEach((b) => (b.onclick = () => { const it = S.cart[b.dataset.p]; const p = prodDe(it.pid); sumarAlCarrito(p, p.medida === 'kg' ? 0.25 : 1); }));
  $$('[data-q]', el).forEach((inp) => (inp.onchange = () => { const v = parseCant(inp.value); if (v <= 0) S.cart.splice(inp.dataset.q, 1); else S.cart[inp.dataset.q].cant = v; renderTicket(); }));
  $$('[data-r]', el).forEach((b) => (b.onclick = () => { S.cart.splice(b.dataset.r, 1); renderTicket(); }));
  $('#btnVaciar').onclick = vaciarTicket;
  $('#btnCobrar').onclick = cobrar;
}

async function vaciarTicket() {
  if (!S.cart.length) return;
  if (await confirmar('¿Cancelar esta venta y vaciar el ticket?', { title: 'Cancelar venta', ok: 'Sí, vaciar ticket', danger: true, cancel: 'Volver' })) {
    S.cart = []; renderTicket(); toast('Ticket vaciado'); $('#posQ')?.focus();
  }
}

function opcionesClientes(sel) {
  return db.clientes.slice().sort((a, b) => a.nombre.localeCompare(b.nombre)).map((c) => `<option value="${c.id}" ${sel === c.id ? 'selected' : ''}>${esc(c.nombre)} — debe ${gs(saldo(c.id))}</option>`).join('');
}

function cobrar() {
  if (!S.cart.length) return;
  if (!algunaCaja()) { toast('Abra la caja antes de cobrar.', 'warn'); if (puede('caja')) abrirCaja('efectivo', () => renderView()); return; }
  const t = totalesCarrito();
  let metodo = 'efectivo';
  const billetes = [t.total, Math.ceil(t.total / 10000) * 10000, Math.ceil(t.total / 50000) * 50000, Math.ceil(t.total / 100000) * 100000]
    .filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
  modal({
    title: 'Cobrar venta',
    body: `
      <div class="cobro-total"><span>Total a cobrar</span><b class="num">${gs(t.total)}</b>
        <div class="cobro-split"><span class="u-market">${unidadCorta('market')}: ${gs(t.market)}</span><span class="u-bodega">${unidadCorta('bodega')}: ${gs(t.bodega)}</span></div></div>
      <div class="field"><label>Forma de pago</label>
        <div class="seg" id="segM">${Object.entries(METODOS).map(([k, n]) => `<button type="button" data-k="${k}" class="${k === 'efectivo' ? 'on' : ''}">${n}</button>`).join('')}</div></div>
      <div id="boxEf">
        <div class="field"><label>Recibido</label><input class="input input-lg num" id="recib" inputmode="numeric" placeholder="${miles(t.total)}"></div>
        <div class="quick-cash">${billetes.map((b, i) => `<button type="button" class="btn btn-sm" data-b="${b}">${i === 0 ? 'Exacto' : gs(b)}</button>`).join('')}</div>
        <div class="vuelto" id="vuelto"><span>Vuelto</span><b class="num">Gs. 0</b></div>
      </div>
      <div id="boxTr" class="hidden"><div class="grid2">
        <div class="field"><label>Banco o billetera</label><select class="input" id="banco">${BANCOS.map((b) => `<option>${b}</option>`).join('')}</select></div>
        <div class="field"><label>Nº de comprobante</label><input class="input" id="comp" placeholder="Opcional"></div></div>
        <div class="field"><label>Nombre y apellido de quien envió</label><input class="input" id="envio" placeholder="Ej.: Lourdes Cabrera"></div></div>
      <div id="boxCr" class="hidden">
        <div class="field"><label>Cliente</label>
          ${db.clientes.length ? `<select class="input" id="cliSel"><option value="">Elegir cliente…</option>${opcionesClientes()}</select>` : '<p class="muted">No hay clientes cargados.</p>'}
        </div>
        <button type="button" class="btn btn-sm" id="nuevoCli">${ic('plus')}Nuevo cliente</button>
        <p class="muted" style="margin-top:10px;font-size:13.5px">Se carga la deuda separada: ${unidadCorta('market')} ${gs(t.market)} y ${unidadCorta('bodega')} ${gs(t.bodega)}.</p>
      </div>
      <div class="field" style="margin-top:6px"><label>Comprobante</label><div class="seg" id="segD"><button type="button" data-k="ticket" class="on">${ic('receipt')}Ticket</button><button type="button" data-k="factura">${ic('file')}Factura</button></div></div>
      <div id="boxFac" class="hidden">
        <div class="grid2"><div class="field"><label>RUC o CI del cliente</label><input class="input" id="fRuc" placeholder="Ej.: 3974119-2"></div>
        <div class="field"><label>Nombre o razón social</label><input class="input" id="fNom"></div></div>
        <button type="button" class="btn btn-sm" id="fSinNombre">Sin nombre (44444401-7)</button>
        ${!db.config.timbrado ? '<p class="fac-warn">Falta cargar el timbrado en Configuración. La factura saldrá sin número de timbrado.</p>' : ''}
      </div>`,
    onOpen: (w) => {
      const rec = $('#recib', w);
      const calc = () => { const r = parseMonto(rec.value) || t.total; const v = r - t.total; const box = $('#vuelto', w); box.classList.toggle('neg', v < 0); box.innerHTML = `<span>${v < 0 ? 'Falta' : 'Vuelto'}</span><b class="num">${gs(Math.abs(v))}</b>`; };
      rec.oninput = () => { const d = parseMonto(rec.value); rec.value = d ? miles(d) : ''; calc(); };
      $$('[data-b]', w).forEach((b) => (b.onclick = () => { rec.value = miles(+b.dataset.b); calc(); }));
      $$('#segM button', w).forEach((b) => (b.onclick = () => {
        metodo = b.dataset.k;
        $$('#segM button', w).forEach((x) => x.classList.toggle('on', x === b));
        $('#boxEf', w).classList.toggle('hidden', metodo !== 'efectivo');
        $('#boxCr', w).classList.toggle('hidden', metodo !== 'credito');
        $('#boxTr', w).classList.toggle('hidden', medioDe(metodo) !== 'transferencia');
        if (metodo === 'efectivo') rec.focus();
      }));
      let doc = 'ticket';
      $$('#segD button', w).forEach((b) => (b.onclick = () => { doc = b.dataset.k; w.dataset.doc = doc; $$('#segD button', w).forEach((x) => x.classList.toggle('on', x === b)); $('#boxFac', w).classList.toggle('hidden', doc !== 'factura'); if (doc === 'factura') { const cli = clienteDe($('#cliSel', w)?.value); if (cli && !$('#fNom', w).value) { $('#fNom', w).value = cli.nombre; $('#fRuc', w).value = cli.ci || ''; } $('#fRuc', w).focus(); } }));
      $('#fSinNombre', w).onclick = () => { $('#fRuc', w).value = '44444401-7'; $('#fNom', w).value = 'Sin nombre'; };
      const nc = $('#nuevoCli', w);
      nc.onclick = () => formCliente(null, (cli) => {
        const box = $('#boxCr .field', w);
        box.innerHTML = `<label>Cliente</label><select class="input" id="cliSel"><option value="">Elegir cliente…</option>${opcionesClientes(cli.id)}</select>`;
      });
    },
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: 'Confirmar cobro', cls: 'btn-orange', icon: 'check', primary: true, onClick: async (w) => {
        let recibido = 0, clienteId = null;
        if (metodo === 'efectivo') {
          recibido = parseMonto($('#recib', w).value) || t.total;
          if (recibido < t.total) { toast('El monto recibido es menor que el total.', 'err'); return false; }
        }
        if (metodo === 'credito') {
          clienteId = $('#cliSel', w)?.value;
          if (!clienteId) { toast('Elija el cliente que lleva a crédito.', 'err'); return false; }
          const cli = clienteDe(clienteId);
          const nuevo = saldo(clienteId) + t.total;
          if (cli.limite > 0 && nuevo > cli.limite) {
            const ok = await confirmar(`${esc(cli.nombre)} superaría su límite de crédito (${gs(cli.limite)}). Quedaría debiendo ${gs(nuevo)}. ¿Continuar igual?`, { title: 'Límite de crédito', ok: 'Continuar', danger: true });
            if (!ok) return false;
          }
        }
        const medio = medioDe(metodo);
        let caja = medio ? cajaAbierta(medio) : algunaCaja();
        if (medio && !caja) {
          if (!(await confirmar(`La ${CAJAS[medio].n.toLowerCase()} está cerrada. ¿Abrirla ahora para registrar este cobro?`, { title: `Abrir ${CAJAS[medio].n.toLowerCase()}`, ok: 'Abrir y cobrar' }))) return false;
          caja = abrirCaja(medio);
        }
        const doc = w.dataset.doc || 'ticket';
        let fac = null;
        if (doc === 'factura') {
          const ruc = $('#fRuc', w).value.trim(), nom = $('#fNom', w).value.trim();
          if (!ruc || !nom) { toast('Para la factura escriba el RUC o CI y el nombre del cliente. Si no tiene, use "Sin nombre".', 'err'); return false; }
          fac = { ruc, nombre: nom };
        }
        const items = S.cart.map((it) => snapItem(prodDe(it.pid), it.cant));
        const v = armarVenta(items, { metodo, clienteId, recibido, cajaId: caja?.id || null, usuario: S.user });
        if (medio === 'transferencia') { v.banco = $('#banco', w).value; v.comprobante = $('#comp', w).value.trim(); v.envio = $('#envio', w).value.trim(); }
        if (fac) {
          const cf = db.config; cf.nroFactura = (cf.nroFactura || 0) + 1;
          v.doc = 'factura';
          v.factura = { ...fac, numero: `${cf.establecimiento || '001'}-${cf.puntoExp || '001'}-${String(cf.nroFactura).padStart(7, '0')}`, timbrado: cf.timbrado, condicion: metodo === 'credito' ? 'Crédito' : 'Contado', cdc: null, estadoSifen: 'pendiente' };
        } else v.doc = 'ticket';
        db.ventas.push(v);
        const avisos = [];
        items.forEach((it) => { const p = prodDe(it.pid); if (!p.controlStock) return; const antes = p.stock; p.stock = Math.round((p.stock - it.cant) * 1000) / 1000; if (p.stock <= p.stockMin && antes > p.stockMin - 0.0001) avisos.push(p); });
        setTimeout(() => avisos.forEach((p) => toast(p.stock <= 0 ? `${p.nombre} se agotó.` : `${p.nombre}: quedan ${fmtCant(p.stock)} ${p.medida}.`, 'stock')), 400);
        if (metodo === 'credito') cargarCredito(v);
        save();
        S.cart = []; S.q = '';
        renderView();
        toast(`Venta Nº ${v.nro} cobrada${v.vuelto ? ` · vuelto ${gs(v.vuelto)}` : ''}`);
        setTimeout(() => despuesDeCobrar(v), 60);
      } },
    ],
  });
}

const nroTicket = (v) => (v.doc === 'factura' && v.factura ? v.factura.numero : 'T-' + String(v.nro).padStart(6, '0'));
const nombreCliente = (v) => (v.factura ? v.factura.nombre : v.clienteId ? clienteDe(v.clienteId)?.nombre || 'Cliente' : 'Consumidor final');

function liquidacionIva(v) {
  const g = { 10: 0, 5: 0, 0: 0 };
  v.items.forEach((i) => (g[i.iva ?? 10] += i.subtotal));
  return { g10: g[10], g5: g[5], ex: g[0], iva10: Math.round(g[10] / 11), iva5: Math.round(g[5] / 21) };
}

function modeloComprobante(v) {
  const c = db.config;
  const esFac = v.doc === 'factura' && v.factura;
  const M = [];
  const T = (s, o = {}) => M.push({ t: 'text', s: String(s ?? ''), align: 'center', size: 'md', bold: true, ...o });
  const R = (l, r, o = {}) => M.push({ t: 'row', l: String(l ?? ''), r: String(r ?? ''), size: 'md', bold: false, ...o });
  const HR = () => M.push({ t: 'hr' });
  const cli = v.clienteId ? clienteDe(v.clienteId) : null;
  T(esFac && c.razonSocial ? c.razonSocial : c.nombreMarket, { size: 'xl' });
  if (esFac) T(`${c.nombreMarket} y ${c.nombreBodega}`, { bold: false, size: 'sm' }); else T(c.nombreBodega);
  if (c.ruc) T(`RUC ${c.ruc}`);
  if (esFac && c.actividad) T(c.actividad, { bold: false, size: 'sm' });
  if (c.direccion) T(c.direccion);
  if (c.ciudad) T(c.ciudad);
  if (c.telefono) T(c.telefono);
  HR();
  if (esFac) {
    T(v.factura.cdc ? 'FACTURA ELECTRÓNICA' : 'FACTURA', { size: 'lg' });
    if (c.timbrado) R('Timbrado', c.timbrado);
    if (c.timbradoDesde) R('Vigencia', `${fFecha(c.timbradoDesde + 'T12:00')}${c.timbradoHasta ? ' al ' + fFecha(c.timbradoHasta + 'T12:00') : ''}`);
    R('Nº', v.factura.numero, { bold: true }); R('Fecha', fFH(v.fecha), { bold: true }); R('Condición', v.factura.condicion);
    R('RUC/CI', v.factura.ruc, { bold: true }); R('Cliente', v.factura.nombre, { bold: true });
  } else {
    T('TICKET', { size: 'lg' });
    R('Nº', nroTicket(v), { bold: true }); R('Fecha', fFH(v.fecha), { bold: true }); R('Cliente', nombreCliente(v), { bold: true });
  }
  HR();
  v.items.forEach((i) => {
    T(i.nombre.toUpperCase() + (esFac ? `  (${i.iva ? 'IVA ' + i.iva + '%' : 'Exenta'})` : ''), { align: 'left' });
    R(`${fmtCant(i.cant)} x ${miles(i.precio)}`, miles(i.subtotal), { bold: true });
  });
  HR();
  if (v.totales.market > 0 && v.totales.bodega > 0) { R(unidadNombre('market'), miles(v.totales.market)); R(unidadNombre('bodega'), miles(v.totales.bodega)); }
  R('TOTAL', `Gs. ${miles(v.total)}`, { bold: true, size: 'tot' });
  if (esFac) {
    const l = liquidacionIva(v);
    HR(); T('Liquidación del IVA', { align: 'left' });
    if (l.g10) R('Gravada 10%', miles(l.g10)); if (l.g5) R('Gravada 5%', miles(l.g5)); if (l.ex) R('Exenta', miles(l.ex));
    R('IVA 10%', miles(l.iva10)); R('IVA 5%', miles(l.iva5)); R('Total IVA', miles(l.iva10 + l.iva5), { bold: true });
  }
  HR();
  R('Pago', METODOS[v.metodo], { bold: true });
  if (v.banco) R('Banco', v.banco, { bold: true });
  if (v.comprobante) R('Comprobante', v.comprobante, { bold: true });
  if (v.envio) R('Envió', v.envio.toUpperCase(), { bold: true });
  if (v.metodo === 'efectivo') { R('Recibido', miles(v.recibido)); R('Vuelto', miles(v.vuelto)); }
  R('Atendió', v.usuario || '');
  if (v.anulada) T('*** VENTA ANULADA ***');
  if (v.metodo === 'credito') M.push({ t: 'firma', s: `Firma del cliente${cli ? ': ' + cli.nombre : ''}` });
  HR();
  T(c.mensajeTicket || '¡Gracias por tu compra!', { size: 'lg' });
  if (esFac) T(v.factura.cdc ? 'CDC: ' + v.factura.cdc : 'Documento preparado para SIFEN. Pendiente de envío a la SET.', { bold: false, size: 'sm' });
  else if (c.leyendaTicket) T(c.leyendaTicket, { bold: false });
  if (c.firma) { HR(); c.firma.split('\n').forEach((x) => T(x, { bold: false, size: 'sm', gris: true })); }
  return M;
}

function htmlComprobante(v) {
  return '<div class="pt">' + modeloComprobante(v).map((m) => {
    if (m.t === 'hr') return '<div class="pt-hr"></div>';
    if (m.t === 'firma') return `<div class="pt-firma"><div></div><span>${esc(m.s)}</span></div>`;
    if (m.t === 'row') return `<div class="pt-row pt-${m.size} ${m.bold ? 'pt-b' : ''}"><span>${esc(m.l)}</span><span>${esc(m.r)}</span></div>`;
    return `<div class="pt-l pt-${m.align} pt-${m.size} ${m.bold ? 'pt-b' : ''} ${m.gris ? 'pt-gris' : ''}">${esc(m.s)}</div>`;
  }).join('') + '</div>';
}

/* ---------- PDF propio (sin internet ni librerías) ---------- */
const HELV = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
const PDF_MAP = { '–': 150, '—': 151, '…': 133, '“': 147, '”': 148, '‘': 145, '’': 146, '•': 149, '€': 128 };
const pdfChars = (str) => Array.from(String(str)).map((ch) => { const c = ch.charCodeAt(0); return c < 256 ? c : PDF_MAP[ch] || 63; });
function anchoTexto(str, size, bold) {
  let w = 0;
  pdfChars(str).forEach((c) => { w += c >= 32 && c <= 126 ? HELV[c - 32] : c >= 192 ? (c >= 224 ? 556 : 700) : 556; });
  return (w / 1000) * size * (bold ? 1.1 : 1);
}
function partirTexto(str, size, bold, max) {
  const out = []; let linea = '';
  String(str).split(' ').forEach((p) => { const prueba = linea ? linea + ' ' + p : p; if (anchoTexto(prueba, size, bold) > max && linea) { out.push(linea); linea = p; } else linea = prueba; });
  if (linea || !out.length) out.push(linea);
  return out;
}

function pdfComprobante(v) {
  const W = 226.77, MX = 12, util = W - MX * 2;
  const TAM = { xl: 13, lg: 11, tot: 12, md: 8.5, sm: 7.2 };
  const ops = []; let y = 0;
  const esc2 = (t) => pdfChars(t).map((c) => (c === 40 || c === 41 || c === 92 ? '\\' + String.fromCharCode(c) : String.fromCharCode(c))).join('');
  const txt = (t, x, yy, size, bold, gris) => ops.push(`${gris ? '0.35 g ' : '0 g '}BT /${bold ? 'F2' : 'F1'} ${size} Tf ${x.toFixed(2)} ${yy.toFixed(2)} Td (${esc2(t)}) Tj ET`);
  const lineas = [];
  modeloComprobante(v).forEach((m) => {
    if (m.t === 'hr') { y += 5; lineas.push({ hr: y }); y += 6; return; }
    if (m.t === 'firma') { y += 30; lineas.push({ firma: y }); y += 10; const s = TAM.sm; lineas.push({ t: m.s, y, size: s, center: true }); y += 4; return; }
    const size = TAM[m.size] || TAM.md;
    if (m.t === 'row') {
      y += size * 1.35;
      const rw = anchoTexto(m.r, size, m.bold);
      const izq = partirTexto(m.l, size, m.bold, util - rw - 8);
      lineas.push({ t: izq[0], y, size, bold: m.bold, x: MX }); lineas.push({ t: m.r, y, size, bold: m.bold, x: W - MX - rw });
      izq.slice(1).forEach((x) => { y += size * 1.3; lineas.push({ t: x, y, size, bold: m.bold, x: MX }); });
      return;
    }
    partirTexto(m.s, size, m.bold, util).forEach((x) => { y += size * 1.35; lineas.push({ t: x, y, size, bold: m.bold, center: m.align === 'center', gris: m.gris, x: MX }); });
  });
  const H = Math.max(200, y + 26);
  lineas.forEach((l) => {
    const yy = H - 14 - (l.y ?? l.hr ?? l.firma);
    if (l.hr !== undefined) { ops.push(`0 g [2.5 2] 0 d 0.9 w ${MX} ${yy.toFixed(2)} m ${W - MX} ${yy.toFixed(2)} l S [] 0 d`); return; }
    if (l.firma !== undefined) { ops.push(`0 g 0.7 w ${MX + 20} ${yy.toFixed(2)} m ${W - MX - 20} ${yy.toFixed(2)} l S`); return; }
    const x = l.center ? (W - anchoTexto(l.t, l.size, l.bold)) / 2 : l.x;
    txt(l.t, x, yy, l.size, l.bold, l.gris);
  });
  const stream = ops.join('\n');
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H.toFixed(2)}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let out = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'; const off = [];
  objs.forEach((o, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + off.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('');
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const bytes = new Uint8Array(out.length);
  for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 255;
  return new Blob([bytes], { type: 'application/pdf' });
}

function descargarPDF(v) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(pdfComprobante(v));
  a.download = `${v.doc === 'factura' ? 'factura' : 'ticket'}-${nroTicket(v)}.pdf`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  toast('PDF descargado. Lo encuentra en la carpeta Descargas.');
}

function hacerFactura(v, done) {
  if (v.anulada) { toast('No se puede facturar una venta anulada.', 'err'); return; }
  const cli = v.clienteId ? clienteDe(v.clienteId) : null;
  modal({
    title: `Hacer factura de la venta ${nroTicket(v)}`, size: 'sm',
    body: `<div class="field"><label>RUC o CI del cliente</label><input class="input" id="hfR" value="${esc(cli?.ci || '')}" autofocus></div>
      <div class="field"><label>Nombre o razón social</label><input class="input" id="hfN" value="${esc(cli?.nombre || '')}"></div>
      <button type="button" class="btn btn-sm" id="hfS">Sin nombre (44444401-7)</button>
      ${!db.config.timbrado ? '<p class="fac-warn">Falta cargar el timbrado en Configuración.</p>' : ''}`,
    onOpen: (w) => ($('#hfS', w).onclick = () => { $('#hfR', w).value = '44444401-7'; $('#hfN', w).value = 'Sin nombre'; }),
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: 'Hacer factura', cls: 'btn-orange', icon: 'file', primary: true, onClick: (w) => {
        const ruc = $('#hfR', w).value.trim(), nombre = $('#hfN', w).value.trim();
        if (!ruc || !nombre) { toast('Escriba el RUC o CI y el nombre. Si no tiene, use "Sin nombre".', 'err'); return false; }
        const cf = db.config; cf.nroFactura = (cf.nroFactura || 0) + 1;
        v.doc = 'factura';
        v.factura = { ruc, nombre, numero: `${cf.establecimiento || '001'}-${cf.puntoExp || '001'}-${String(cf.nroFactura).padStart(7, '0')}`, timbrado: cf.timbrado, condicion: v.metodo === 'credito' ? 'Crédito' : 'Contado', cdc: null, estadoSifen: 'pendiente' };
        save(); toast(`Factura ${v.factura.numero} lista`);
        setTimeout(() => (done ? done(v) : verComprobante(v)), 60);
      } },
    ],
  });
}

function textoComprobante(v) {
  const c = db.config; const esFac = v.doc === 'factura' && v.factura;
  const L = [`*${esFac && c.razonSocial ? c.razonSocial : c.nombreMarket}*`];
  if (!esFac) L.push(c.nombreBodega);
  if (c.ruc) L.push(`RUC ${c.ruc}`);
  if (c.direccion) L.push(c.direccion + (c.ciudad ? ', ' + c.ciudad : ''));
  if (c.telefono) L.push(c.telefono);
  L.push('', `*${esFac ? 'FACTURA' : 'TICKET'} Nº ${nroTicket(v)}*`);
  if (esFac && c.timbrado) L.push(`Timbrado: ${c.timbrado}`);
  L.push(`Fecha: ${fFH(v.fecha)}`, `Cliente: ${nombreCliente(v)}${esFac ? ` (RUC/CI ${v.factura.ruc})` : ''}`, '');
  v.items.forEach((i) => L.push(`${i.nombre}`, `   ${fmtCant(i.cant)} x ${miles(i.precio)} = ${miles(i.subtotal)}`));
  L.push('', `*TOTAL: Gs. ${miles(v.total)}*`);
  if (esFac) { const l = liquidacionIva(v); L.push(`IVA 10%: ${miles(l.iva10)} · IVA 5%: ${miles(l.iva5)}`); }
  L.push(`Pago: ${METODOS[v.metodo]}${v.banco ? ' · ' + v.banco : ''}`);
  if (v.comprobante) L.push(`Comprobante: ${v.comprobante}`);
  if (v.envio) L.push(`Envió: ${v.envio}`);
  L.push('', c.mensajeTicket || '¡Gracias por tu compra!');
  if (!esFac && c.leyendaTicket) L.push(`_${c.leyendaTicket}_`);
  if (c.firma) L.push('', c.firma);
  return L.join('\n');
}

const normTel = (t) => { let d = String(t || '').replace(/\D/g, ''); if (d.startsWith('00')) d = d.slice(2); if (d.startsWith('0')) d = '595' + d.slice(1); else if (d.length === 9 && d.startsWith('9')) d = '595' + d; return d; };

function enviarWhatsApp(v) {
  const cli = v.clienteId ? clienteDe(v.clienteId) : null;
  modal({
    title: 'Enviar por WhatsApp', size: 'sm',
    body: `<div class="field"><label>Número de WhatsApp del cliente</label><input class="input input-lg" id="waN" inputmode="tel" placeholder="0981 123 456" value="${esc(cli?.telefono || '')}" autofocus></div>
      <p class="muted" style="font-size:13.5px">Se abre WhatsApp con el ${v.doc === 'factura' ? 'detalle de la factura' : 'ticket'} escrito, listo para enviar. Necesita internet.</p>`,
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: 'Abrir WhatsApp', cls: 'btn-green', icon: 'chat', primary: true, onClick: (w) => {
        const n = normTel($('#waN', w).value);
        if (n.length < 10) { toast('Escriba un número de WhatsApp válido, por ejemplo 0981 123 456.', 'err'); return false; }
        window.open(`https://wa.me/${n}?text=${encodeURIComponent(textoComprobante(v))}`, '_blank');
      } },
    ],
  });
}

function imprimirTicket(v) { imprimir(htmlComprobante(v), 'ticket'); }

function verComprobante(v, titulo) {
  const esFac = v.doc === 'factura';
  const w = modal({
    title: titulo || `${esFac ? 'Factura' : 'Ticket'} ${nroTicket(v)}`,
    body: `<div class="pt-preview">${htmlComprobante(v)}</div>
      <div class="comp-acc">
        <button class="comp-btn" data-c="imp">${ic('print')}<b>Imprimir ${esFac ? 'factura' : 'ticket'}</b></button>
        ${!esFac && !v.anulada ? `<button class="comp-btn" data-c="fac">${ic('file')}<b>Hacer factura</b></button>` : ''}
        <button class="comp-btn" data-c="pdf">${ic('download')}<b>Descargar PDF</b></button>
        <button class="comp-btn wa" data-c="wa">${ic('chat')}<b>WhatsApp</b></button>
      </div>`,
    size: 'md',
    actions: [{ label: titulo ? 'Nueva venta' : 'Cerrar', cls: 'btn-primary', primary: true, onClick: () => { setTimeout(() => $('#posQ')?.focus(), 50); } }],
  });
  $$('[data-c]', w).forEach((b) => (b.onclick = () => {
    const a = b.dataset.c;
    if (a === 'imp') imprimirTicket(v);
    if (a === 'pdf') descargarPDF(v);
    if (a === 'wa') enviarWhatsApp(v);
    if (a === 'fac') { w.close(true); hacerFactura(v, (x) => { verComprobante(x, titulo); if (S.view === 'historial') tablaHist(); }); }
  }));
}

function despuesDeCobrar(v) { verComprobante(v, `Venta cobrada · ${v.doc === 'factura' ? 'Factura' : 'Ticket'} ${nroTicket(v)}`); }

function imprimir(html, tipo) {
  const pa = $('#print-area');
  pa.className = tipo; pa.innerHTML = html;
  let st = $('#pageStyle');
  if (!st) { st = document.createElement('style'); st.id = 'pageStyle'; document.head.appendChild(st); }
  st.textContent = tipo === 'a4' ? '@page{size:A4;margin:14mm}' : '@page{size:80mm auto;margin:4mm}';
  const imgs = $$('img', pa).filter((i) => !i.complete);
  let falta = imgs.length;
  const go = () => setTimeout(() => window.print(), 80);
  if (!falta) go(); else imgs.forEach((i) => (i.onload = i.onerror = () => { if (--falta === 0) go(); }));
}

/* =========================================================
   VENTAS REALIZADAS
   ========================================================= */
VIEWS.historial = (el) => {
  const f = S.hist;
  el.innerHTML = `
    <div class="toolbar">
      <div class="search grow">${ic('search')}<input class="input" id="hq" placeholder="Buscar Nº de ticket, cliente o producto" value="${esc(f.q)}"></div>
      <input class="input" type="date" id="hd" value="${f.desde}" aria-label="Desde">
      <input class="input" type="date" id="hh" value="${f.hasta}" aria-label="Hasta">
      <select class="input" id="hm"><option value="todos">Todas las formas de pago</option>${Object.entries(METODOS).map(([k, n]) => `<option value="${k}" ${f.metodo === k ? 'selected' : ''}>${n}</option>`).join('')}</select>
    </div>
    <div id="histTabla"></div>`;
  const upd = () => { f.q = $('#hq').value; f.desde = $('#hd').value || f.desde; f.hasta = $('#hh').value || f.hasta; f.metodo = $('#hm').value; pagReset('hist'); tablaHist(); };
  $('#hq').oninput = upd; $('#hd').onchange = upd; $('#hh').onchange = upd; $('#hm').onchange = upd;
  tablaHist();
};

function tablaHist() {
  const f = S.hist; const t = f.q.trim().toLowerCase();
  const lista = db.ventas.filter((v) => enRango(v.fecha, f.desde, f.hasta) && (f.metodo === 'todos' || v.metodo === f.metodo) &&
    (!t || String(v.nro) === t.replace('#', '') || (v.clienteId && clienteDe(v.clienteId)?.nombre.toLowerCase().includes(t)) || v.items.some((i) => i.nombre.toLowerCase().includes(t)))).reverse();
  const val = lista.filter((v) => !v.anulada);
  const pg = paginar('hist', lista, tablaHist);
  $('#histTabla').innerHTML = lista.length ? `
    <div class="table-wrap"><table>
      <thead><tr><th>Nº</th><th>Fecha</th><th>Atendió</th><th class="right">${unidadCorta('market')}</th><th class="right">${unidadCorta('bodega')}</th><th class="right">Total</th><th>Pago</th><th>Estado</th><th></th></tr></thead>
      <tbody>${pg.items.map((v) => `<tr class="${v.anulada ? 'anulada' : ''}">
        <td><b>${nroTicket(v)}</b>${v.doc === 'factura' ? '<br><span class="badge orange">Factura</span>' : ''}</td><td>${fFH(v.fecha)}</td><td>${esc(v.usuario || '')}</td>
        <td class="right num">${gs(v.totales.market)}</td><td class="right num">${gs(v.totales.bodega)}</td><td class="right num"><b>${gs(v.total)}</b></td>
        <td>${METODOS[v.metodo]}${v.clienteId ? `<br><small class="muted">${esc(clienteDe(v.clienteId)?.nombre || 'Cliente eliminado')}</small>` : ''}</td>
        <td>${v.anulada ? '<span class="badge red">Anulada</span>' : '<span class="badge green">Cobrada</span>'}</td>
        <td class="actions">
          <button class="icon-btn" data-ver="${v.id}" title="Ver detalle">${ic('eye')}</button>
          <button class="icon-btn" data-imp="${v.id}" title="Ver e imprimir comprobante">${ic('print')}</button>
          <button class="icon-btn wa" data-wa="${v.id}" title="Enviar por WhatsApp">${ic('chat')}</button>
          ${puede('anular') && !v.anulada ? `<button class="icon-btn danger" data-anu="${v.id}" title="Anular venta">${ic('ban')}</button>` : ''}
        </td></tr>`).join('')}</tbody>
      <tfoot><tr><td colspan="3">${val.length} ventas válidas</td><td class="right num">${gs(sumBy(val, (v) => v.totales.market))}</td><td class="right num">${gs(sumBy(val, (v) => v.totales.bodega))}</td><td class="right num">${gs(sumBy(val, (v) => v.total))}</td><td colspan="3"></td></tr></tfoot>
    </table></div>${pg.html}` : `<div class="panel empty">${ic('receipt')}<p>No hay ventas en ese período.</p></div>`;
  $$('[data-ver]').forEach((b) => (b.onclick = () => verVenta(db.ventas.find((v) => v.id === b.dataset.ver))));
  $$('[data-imp]').forEach((b) => (b.onclick = () => verComprobante(db.ventas.find((v) => v.id === b.dataset.imp))));
  $$('[data-wa]').forEach((b) => (b.onclick = () => enviarWhatsApp(db.ventas.find((v) => v.id === b.dataset.wa))));
  $$('[data-anu]').forEach((b) => (b.onclick = () => anularVenta(db.ventas.find((v) => v.id === b.dataset.anu))));
}

function verVenta(v) {
  modal({
    title: `Venta Nº ${v.nro}`, size: 'lg',
    body: `<p class="muted" style="margin-bottom:12px">${fFH(v.fecha)} · Atendió ${esc(v.usuario || '')} · ${METODOS[v.metodo]}${v.clienteId ? ' · ' + esc(clienteDe(v.clienteId)?.nombre || '') : ''}${v.anulada ? ` · <span class="badge red">Anulada por ${esc(v.anuladaPor || '')}</span>` : ''}</p>
    <div class="table-wrap"><table><thead><tr><th>Producto</th><th>Categoría</th><th class="right">Cant.</th><th class="right">Precio</th><th class="right">Subtotal</th></tr></thead>
    <tbody>${v.items.map((i) => `<tr class="u-${i.unidad}"><td>${esc(i.nombre)}</td><td><span class="tag">${esc(i.sector)}</span></td><td class="right">${fmtCant(i.cant)} ${i.medida}</td><td class="right num">${gs(i.precio)}</td><td class="right num">${gs(i.subtotal)}</td></tr>`).join('')}</tbody>
    <tfoot><tr class="u-market"><td colspan="4">${esc(unidadNombre('market'))}</td><td class="right num">${gs(v.totales.market)}</td></tr>
    <tr class="u-bodega"><td colspan="4">${esc(unidadNombre('bodega'))}</td><td class="right num">${gs(v.totales.bodega)}</td></tr>
    <tr><td colspan="4">Total</td><td class="right num">${gs(v.total)}</td></tr></tfoot></table></div>`,
    actions: [{ label: 'WhatsApp', cls: 'btn-green', icon: 'chat', onClick: () => { enviarWhatsApp(v); return false; } }, { label: 'Ver comprobante', icon: 'print', onClick: () => { verComprobante(v); return false; } }, { label: 'Cerrar', cls: 'btn-primary', primary: true }],
  });
}

async function anularVenta(v) {
  const ok = await confirmar(`¿Anular la venta Nº ${v.nro} por ${gs(v.total)}? El stock se devuelve${v.metodo === 'credito' ? ' y se borra la deuda del cliente' : ''}. Esta acción no se puede deshacer.`, { title: 'Anular venta', ok: 'Sí, anular', danger: true, cancel: 'No anular' });
  if (!ok) return;
  v.anulada = true; v.anuladaPor = S.user.nombre; v.anuladaFecha = new Date().toISOString();
  v.items.forEach((i) => { const p = prodDe(i.pid); if (p && p.controlStock) p.stock = Math.round((p.stock + i.cant) * 1000) / 1000; });
  db.movimientos = db.movimientos.filter((m) => m.ventaId !== v.id);
  save(); tablaHist(); toast(`Venta Nº ${v.nro} anulada`);
}

/* =========================================================
   PRODUCTOS Y SECTORES
   ========================================================= */
function opcionesSectores(sel) {
  return ['market', 'bodega'].map((u) => `<optgroup label="${esc(unidadNombre(u))}">${db.sectores.filter((s) => s.unidad === u).map((s) => `<option value="${s.id}" ${sel === s.id ? 'selected' : ''}>${esc(s.nombre)}</option>`).join('')}</optgroup>`).join('');
}

VIEWS.productos = (el) => {
  const f = S.prod;
  el.innerHTML = `
    <div class="toolbar">
      <div class="search grow">${ic('search')}<input class="input" id="pq" placeholder="Buscar por nombre o código" value="${esc(f.q)}"></div>
      <select class="input" id="pu"><option value="todas">Minimarket y bodega</option><option value="market" ${f.unidad === 'market' ? 'selected' : ''}>${esc(unidadNombre('market'))}</option><option value="bodega" ${f.unidad === 'bodega' ? 'selected' : ''}>${esc(unidadNombre('bodega'))}</option></select>
      <select class="input" id="ps"><option value="todos">Todas las categorías</option>${opcionesSectores(f.sector)}</select>
      ${puede('categorias') ? `<button class="btn" data-go="categorias">${ic('tag')}Categorías</button>` : ''}
      <button class="btn btn-primary" id="btnNP">${ic('plus')}Nuevo producto</button>
    </div>
    <div id="prodTabla"></div>`;
  const upd = () => { f.q = $('#pq').value; f.unidad = $('#pu').value; f.sector = $('#ps').value; pagReset('prod'); tablaProd(); };
  $('#pq').oninput = upd; $('#pu').onchange = upd; $('#ps').onchange = upd;
  $('#btnNP').onclick = () => formProducto(null, tablaProd);
  bindGo(el);
  tablaProd();
};

function tablaProd() {
  const f = S.prod; const t = f.q.trim().toLowerCase();
  const lista = db.productos.filter((p) => {
    const s = sectorDe(p.sectorId);
    return (f.unidad === 'todas' || s?.unidad === f.unidad) && (f.sector === 'todos' || p.sectorId === f.sector) && (!t || p.nombre.toLowerCase().includes(t) || p.codigo.toLowerCase().includes(t));
  }).sort((a, b) => (sectorDe(a.sectorId)?.unidad || '').localeCompare(sectorDe(b.sectorId)?.unidad || '') || a.nombre.localeCompare(b.nombre));
  const box = $('#prodTabla'); if (!box) return;
  const pg = paginar('prod', lista, tablaProd);
  box.innerHTML = lista.length ? `<div class="table-wrap"><table>
    <thead><tr><th>Código</th><th>Producto</th><th>Categoría</th><th class="right">Costo</th><th class="right">Precio</th><th class="right">Margen</th><th class="right">Stock</th><th></th></tr></thead>
    <tbody>${pg.items.map((p) => { const s = sectorDe(p.sectorId); const m = p.precio ? Math.round(((p.precio - p.costo) / p.precio) * 100) : 0; const low = p.controlStock && p.stock <= p.stockMin; return `
      <tr class="u-${s?.unidad}" style="${p.activo ? '' : 'opacity:.55'}">
        <td class="muted">${esc(p.codigo)}</td><td><b>${esc(p.nombre)}</b>${p.activo ? '' : ' <span class="badge red">Inactivo</span>'}</td>
        <td><span class="tag">${esc(s?.nombre || 'Sin categoría')}</span></td>
        <td class="right num">${gs(p.costo)}</td><td class="right num"><b>${gs(p.precio)}</b>${p.medida === 'kg' ? '<small class="muted">/kg</small>' : ''}</td>
        <td class="right"><span class="badge ${m < 15 ? 'orange' : ''}">${m}%</span></td>
        <td class="right">${p.controlStock ? `<span class="badge ${low ? 'red' : 'green'}">${fmtCant(p.stock)} ${p.medida}</span>` : '<span class="muted">—</span>'}</td>
        <td class="actions">
          ${p.controlStock ? `<button class="icon-btn" data-stk="${p.id}" title="Cargar o ajustar stock">${ic('plus')}</button>` : ''}
          <button class="icon-btn" data-ed="${p.id}" title="Editar">${ic('edit')}</button>
          <button class="icon-btn danger" data-del="${p.id}" title="Eliminar">${ic('trash')}</button>
        </td></tr>`; }).join('')}</tbody></table></div>${pg.html}`
    : `<div class="panel empty">${ic('box')}<p>No hay productos con ese filtro.</p><br><button class="btn btn-primary" id="np2">${ic('plus')}Cargar producto</button></div>`;
  $('#np2') && ($('#np2').onclick = () => formProducto(null, tablaProd));
  $$('[data-ed]', box).forEach((b) => (b.onclick = () => formProducto(prodDe(b.dataset.ed), tablaProd)));
  $$('[data-stk]', box).forEach((b) => (b.onclick = () => ajustarStock(prodDe(b.dataset.stk))));
  $$('[data-del]', box).forEach((b) => (b.onclick = async () => {
    const p = prodDe(b.dataset.del);
    if (await confirmar(`¿Eliminar el producto <b>${esc(p.nombre)}</b>? Las ventas anteriores se conservan.`, { title: 'Eliminar producto', ok: 'Eliminar', danger: true })) {
      db.productos = db.productos.filter((x) => x.id !== p.id); S.cart = S.cart.filter((x) => x.pid !== p.id); save(); tablaProd(); toast('Producto eliminado');
    }
  }));
}

function formProducto(p, done) {
  const nuevo = !p;
  const sugCod = String(Math.max(1000, ...db.productos.map((x) => parseInt(x.codigo, 10) || 0)) + 1);
  p = p || { codigo: sugCod, nombre: '', sectorId: db.sectores[0]?.id, precio: 0, costo: 0, medida: 'un', controlStock: true, stock: 0, stockMin: 5, activo: true, iva: 10 };
  modal({
    title: nuevo ? 'Nuevo producto' : 'Editar producto',
    body: `
      <div class="grid2">
        <div class="field"><label>Código o código de barras</label><input class="input" id="fc" value="${esc(p.codigo)}"></div>
        <div class="field"><label>Categoría</label><select class="input" id="fs">${opcionesSectores(p.sectorId)}</select></div>
      </div>
      <div class="field"><label>Nombre</label><input class="input" id="fn" value="${esc(p.nombre)}" autofocus></div>
      <div class="grid3">
        <div class="field"><label>Costo (Gs.)</label><input class="input num" id="fco" value="${miles(p.costo)}" inputmode="numeric"></div>
        <div class="field"><label>Precio de venta (Gs.)</label><input class="input num" id="fpr" value="${miles(p.precio)}" inputmode="numeric"></div>
        <div class="field"><label>Se vende por</label><select class="input" id="fm"><option value="un">Unidad</option><option value="kg" ${p.medida === 'kg' ? 'selected' : ''}>Kilo</option></select></div>
      </div>
      <p class="muted" id="fMargen" style="margin:-4px 0 12px;font-size:13.5px"></p>
      <div class="field"><label>IVA (para la factura)</label><select class="input" id="fiva"><option value="10">IVA 10%</option><option value="5" ${p.iva === 5 ? 'selected' : ''}>IVA 5%</option><option value="0" ${p.iva === 0 ? 'selected' : ''}>Exenta</option></select></div>
      <label class="check" style="margin-bottom:12px"><input type="checkbox" id="fcs" ${p.controlStock ? 'checked' : ''}>Controlar stock de este producto</label>
      <div class="grid2" id="fStock">
        <div class="field"><label>Stock actual</label><input class="input" id="fst" value="${fmtCant(p.stock)}" inputmode="decimal"></div>
        <div class="field"><label>Avisar cuando quede</label><input class="input" id="fsm" value="${fmtCant(p.stockMin)}" inputmode="decimal"></div>
      </div>
      <label class="check"><input type="checkbox" id="fac" ${p.activo ? 'checked' : ''}>Disponible para vender</label>`,
    onOpen: (w) => {
      const mg = () => { const c = parseMonto($('#fco', w).value), pr = parseMonto($('#fpr', w).value); $('#fMargen', w).textContent = pr ? `Ganancia por ${$('#fm', w).value === 'kg' ? 'kilo' : 'unidad'}: ${gs(pr - c)} (${Math.round(((pr - c) / pr) * 100)}%)` : ''; };
      ['#fco', '#fpr'].forEach((id) => { const i = $(id, w); i.oninput = () => { const d = parseMonto(i.value); i.value = d ? miles(d) : ''; mg(); }; });
      $('#fm', w).onchange = mg; mg();
      const cs = () => $('#fStock', w).classList.toggle('hidden', !$('#fcs', w).checked);
      $('#fcs', w).onchange = cs; cs();
    },
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: nuevo ? 'Guardar producto' : 'Guardar cambios', cls: 'btn-primary', icon: 'check', primary: true, onClick: (w) => {
        const d = {
          codigo: $('#fc', w).value.trim(), nombre: $('#fn', w).value.trim(), sectorId: $('#fs', w).value,
          costo: parseMonto($('#fco', w).value), precio: parseMonto($('#fpr', w).value), medida: $('#fm', w).value, iva: +$('#fiva', w).value,
          controlStock: $('#fcs', w).checked, stock: parseCant($('#fst', w).value), stockMin: parseCant($('#fsm', w).value), activo: $('#fac', w).checked,
        };
        if (!d.nombre) { toast('Escriba el nombre del producto.', 'err'); return false; }
        if (!d.codigo) { toast('Escriba un código para el producto.', 'err'); return false; }
        if (db.productos.some((x) => x.codigo === d.codigo && x.id !== p.id)) { toast('Ya existe otro producto con ese código.', 'err'); return false; }
        if (d.precio <= 0) { toast('El precio de venta debe ser mayor a cero.', 'err'); return false; }
        if (!d.sectorId) { toast('Cree al menos una categoría antes de cargar productos.', 'err'); return false; }
        if (nuevo) db.productos.push({ id: uid(), ...d }); else Object.assign(p, d);
        save(); toast(nuevo ? 'Producto guardado' : 'Cambios guardados'); done && done();
      } },
    ],
  });
}

function ajustarStock(p) {
  let modo = 'sumar';
  modal({
    title: `Stock de ${esc(p.nombre)}`, size: 'sm',
    body: `<p class="muted" style="margin-bottom:12px">Stock actual: <b>${fmtCant(p.stock)} ${p.medida}</b></p>
      <div class="field"><div class="seg" id="sgS"><button type="button" class="on" data-k="sumar">Ingresó mercadería</button><button type="button" data-k="fijar">Corregir conteo</button></div></div>
      <div class="field"><label id="lbS">Cantidad que ingresó</label><input class="input input-lg" id="cS" inputmode="decimal" autofocus></div>`,
    onOpen: (w) => $$('#sgS button', w).forEach((b) => (b.onclick = () => { modo = b.dataset.k; $$('#sgS button', w).forEach((x) => x.classList.toggle('on', x === b)); $('#lbS', w).textContent = modo === 'sumar' ? 'Cantidad que ingresó' : 'Stock real contado'; $('#cS', w).focus(); })),
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: 'Guardar stock', cls: 'btn-primary', primary: true, onClick: (w) => {
        const n = parseCant($('#cS', w).value);
        if (modo === 'sumar' && n <= 0) { toast('Ingrese una cantidad mayor a cero.', 'err'); return false; }
        if (modo === 'fijar' && n < 0) { toast('El stock no puede ser negativo.', 'err'); return false; }
        p.stock = modo === 'sumar' ? Math.round((p.stock + n) * 1000) / 1000 : n;
        save(); tablaProd(); toast(`Stock actualizado: ${fmtCant(p.stock)} ${p.medida}`);
      } },
    ],
  });
}

VIEWS.categorias = (el) => {
  const desde = dkey(addDays(new Date(), -29)), hasta = dkey(new Date());
  const vend = {};
  ventasRango(desde, hasta).forEach((v) => v.items.forEach((i) => (vend[i.sectorId] = (vend[i.sectorId] || 0) + i.subtotal)));
  const grupo = (u) => {
    const cats = db.sectores.filter((s) => s.unidad === u);
    return `<div class="cat-group u-${u}"><div class="cat-group-head"><h2>${esc(unidadNombre(u))}</h2><span class="tag">${cats.length} ${cats.length === 1 ? 'categoría' : 'categorías'}</span></div>
      <div class="cat-grid">${cats.map((s) => {
        const ps = db.productos.filter((p) => p.sectorId === s.id);
        const bajos = ps.filter((p) => p.activo && p.controlStock && p.stock <= p.stockMin).length;
        return `<div class="cat-card">
          <div class="cat-top">${ic('tag')}<h3>${esc(s.nombre)}</h3>
            <button class="icon-btn" data-ced="${s.id}" title="Editar">${ic('edit')}</button><button class="icon-btn danger" data-cdel="${s.id}" title="Eliminar">${ic('trash')}</button></div>
          <div class="cat-stats"><div><span>Productos</span><b>${ps.length}</b></div><div><span>Vendido en 30 días</span><b class="num">${gs(vend[s.id] || 0)}</b></div></div>
          <div class="cat-foot">${bajos ? `<span class="badge orange">${bajos} por terminarse</span>` : '<span class="badge green">Stock bien</span>'}
            <button class="btn btn-sm" data-cver="${s.id}">Ver productos</button></div></div>`;
      }).join('')}
      <button class="cat-card cat-new" data-cnew="${u}">${ic('plus')}<b>Nueva categoría</b><span class="muted">en ${esc(unidadCorta(u))}</span></button></div></div>`;
  };
  el.innerHTML = `<div class="toolbar"><p class="muted grow">Cada categoría pertenece al minimarket o a la bodega. Así las ventas y ganancias se separan solas, aunque todo pase por la misma caja.</p>
    <button class="btn btn-primary" id="catNueva">${ic('plus')}Nueva categoría</button></div>
    ${grupo('market')}${grupo('bodega')}`;
  $('#catNueva').onclick = () => formCategoria(null, 'market');
  $$('[data-cnew]', el).forEach((b) => (b.onclick = () => formCategoria(null, b.dataset.cnew)));
  $$('[data-ced]', el).forEach((b) => (b.onclick = () => formCategoria(sectorDe(b.dataset.ced))));
  $$('[data-cver]', el).forEach((b) => (b.onclick = () => { S.prod = { q: '', unidad: 'todas', sector: b.dataset.cver }; ir('productos'); }));
  $$('[data-cdel]', el).forEach((b) => (b.onclick = async () => {
    const s = sectorDe(b.dataset.cdel);
    if (db.productos.some((p) => p.sectorId === s.id)) { toast('Esta categoría tiene productos. Muévalos a otra categoría antes de eliminarla.', 'warn'); return; }
    if (await confirmar(`¿Eliminar la categoría <b>${esc(s.nombre)}</b>?`, { title: 'Eliminar categoría', ok: 'Eliminar', danger: true })) { db.sectores = db.sectores.filter((x) => x.id !== s.id); save(); renderView(); toast('Categoría eliminada'); }
  }));
};

function formCategoria(s, unidadInicial) {
  const nuevo = !s;
  let unidad = s ? s.unidad : unidadInicial || 'market';
  modal({
    title: nuevo ? 'Nueva categoría' : 'Editar categoría', size: 'sm',
    body: `<div class="field"><label>Nombre</label><input class="input" id="caN" value="${esc(s?.nombre || '')}" placeholder="Ej.: Limpieza, Snacks, Vinos" autofocus></div>
      <div class="field"><label>Pertenece a</label><div class="seg" id="caU"><button type="button" data-k="market" class="${unidad === 'market' ? 'on' : ''}">${esc(unidadNombre('market'))}</button><button type="button" data-k="bodega" class="${unidad === 'bodega' ? 'on' : ''}">${esc(unidadNombre('bodega'))}</button></div></div>`,
    onOpen: (w) => $$('#caU button', w).forEach((b) => (b.onclick = () => { unidad = b.dataset.k; $$('#caU button', w).forEach((x) => x.classList.toggle('on', x === b)); })),
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: nuevo ? 'Crear categoría' : 'Guardar cambios', cls: 'btn-primary', icon: 'check', primary: true, onClick: (w) => {
        const n = $('#caN', w).value.trim();
        if (!n) { toast('Escriba el nombre de la categoría.', 'err'); return false; }
        if (db.sectores.some((x) => x.nombre.toLowerCase() === n.toLowerCase() && x.unidad === unidad && x.id !== s?.id)) { toast('Ya existe una categoría con ese nombre.', 'err'); return false; }
        if (nuevo) db.sectores.push({ id: 's-' + uid(), nombre: n, unidad }); else Object.assign(s, { nombre: n, unidad });
        save(); renderView(); toast(nuevo ? 'Categoría creada' : 'Cambios guardados');
      } },
    ],
  });
}

/* =========================================================
   CLIENTES Y CRÉDITOS (separados por minimarket y bodega)
   ========================================================= */
VIEWS.clientes = (el) => {
  const tm = sumBy(db.clientes, (c) => Math.max(0, saldo(c.id, 'market')));
  const tb = sumBy(db.clientes, (c) => Math.max(0, saldo(c.id, 'bodega')));
  el.innerHTML = `
    <div class="kpis">
      <div class="kpi u-market"><span>Fiado en ${esc(unidadNombre('market'))}</span><b class="num">${gs(tm)}</b></div>
      <div class="kpi u-bodega"><span>Fiado en ${esc(unidadNombre('bodega'))}</span><b class="num">${gs(tb)}</b></div>
      <div class="kpi"><span>Total por cobrar</span><b class="num">${gs(tm + tb)}</b></div>
      <div class="kpi"><span>Clientes con deuda</span><b>${db.clientes.filter((c) => saldo(c.id) > 0).length} de ${db.clientes.length}</b></div>
    </div>
    <div class="toolbar">
      <div class="search grow">${ic('search')}<input class="input" id="cq" placeholder="Buscar cliente por nombre, CI o teléfono" value="${esc(S.cli.q)}"></div>
      <label class="check"><input type="checkbox" id="cd" ${S.cli.soloDeuda ? 'checked' : ''}>Solo con deuda</label>
      <button class="btn btn-primary" id="btnNC">${ic('plus')}Nuevo cliente</button>
    </div>
    <div id="cliTabla"></div>`;
  $('#cq').oninput = () => { S.cli.q = $('#cq').value; pagReset('cli'); tablaCli(); };
  $('#cd').onchange = () => { S.cli.soloDeuda = $('#cd').checked; pagReset('cli'); tablaCli(); };
  $('#btnNC').onclick = () => formCliente(null, () => renderView());
  tablaCli();
};

function tablaCli() {
  const t = S.cli.q.trim().toLowerCase();
  const lista = db.clientes.filter((c) => (!t || [c.nombre, c.ci, c.telefono].some((x) => String(x || '').toLowerCase().includes(t))) && (!S.cli.soloDeuda || saldo(c.id) > 0))
    .sort((a, b) => saldo(b.id) - saldo(a.id));
  const box = $('#cliTabla');
  const pg = paginar('cli', lista, tablaCli);
  box.innerHTML = lista.length ? `<div class="table-wrap"><table>
    <thead><tr><th>Cliente</th><th>CI</th><th>Teléfono</th><th class="right">${unidadCorta('market')}</th><th class="right">${unidadCorta('bodega')}</th><th class="right">Total</th><th class="right">Límite</th><th></th></tr></thead>
    <tbody>${pg.items.map((c) => { const sm = saldo(c.id, 'market'), sb = saldo(c.id, 'bodega'), st = sm + sb; const exc = c.limite > 0 && st > c.limite; return `<tr>
      <td><b>${esc(c.nombre)}</b>${c.notas ? `<br><small class="muted">${esc(c.notas)}</small>` : ''}</td><td>${esc(c.ci || '')}</td><td>${esc(c.telefono || '')}</td>
      <td class="right num">${gs(sm)}</td><td class="right num">${gs(sb)}</td><td class="right num"><b>${gs(st)}</b></td>
      <td class="right">${c.limite ? `<span class="badge ${exc ? 'red' : ''}">${gs(c.limite)}</span>` : '<span class="muted">Sin límite</span>'}</td>
      <td class="actions">
        <button class="btn btn-sm btn-orange" data-pay="${c.id}" ${st > 0 ? '' : 'disabled'}>${ic('coins')}Cobrar</button>
        <button class="icon-btn" data-cta="${c.id}" title="Ver cuenta">${ic('eye')}</button>
        <button class="icon-btn" data-ed="${c.id}" title="Editar">${ic('edit')}</button>
        <button class="icon-btn danger" data-del="${c.id}" title="Eliminar">${ic('trash')}</button>
      </td></tr>`; }).join('')}</tbody></table></div>${pg.html}`
    : `<div class="panel empty">${ic('users')}<p>${db.clientes.length ? 'No hay clientes con ese filtro.' : 'Todavía no hay clientes de crédito.'}</p></div>`;
  $$('[data-pay]', box).forEach((b) => (b.onclick = () => registrarPago(clienteDe(b.dataset.pay), () => renderView())));
  $$('[data-cta]', box).forEach((b) => (b.onclick = () => verCuenta(clienteDe(b.dataset.cta))));
  $$('[data-ed]', box).forEach((b) => (b.onclick = () => formCliente(clienteDe(b.dataset.ed), () => renderView())));
  $$('[data-del]', box).forEach((b) => (b.onclick = async () => {
    const c = clienteDe(b.dataset.del);
    if (saldo(c.id) > 0) { toast('Este cliente todavía tiene deuda. Cobre el saldo antes de eliminarlo.', 'warn'); return; }
    if (await confirmar(`¿Eliminar al cliente <b>${esc(c.nombre)}</b> y su historial de cuenta?`, { title: 'Eliminar cliente', ok: 'Eliminar', danger: true })) {
      db.clientes = db.clientes.filter((x) => x.id !== c.id); db.movimientos = db.movimientos.filter((m) => m.clienteId !== c.id); save(); renderView(); toast('Cliente eliminado');
    }
  }));
}

function formCliente(c, done) {
  const nuevo = !c;
  c = c || { nombre: '', ci: '', telefono: '', limite: 0, notas: '' };
  modal({
    title: nuevo ? 'Nuevo cliente' : 'Editar cliente',
    body: `<div class="field"><label>Nombre y apellido</label><input class="input" id="kn" value="${esc(c.nombre)}" autofocus></div>
      <div class="grid2"><div class="field"><label>CI / RUC</label><input class="input" id="kc" value="${esc(c.ci)}"></div>
      <div class="field"><label>Teléfono</label><input class="input" id="kt" value="${esc(c.telefono)}"></div></div>
      <div class="field"><label>Límite de crédito (0 = sin límite)</label><input class="input num" id="kl" value="${miles(c.limite)}" inputmode="numeric"></div>
      <div class="field"><label>Notas</label><textarea class="input" id="kno">${esc(c.notas)}</textarea></div>`,
    onOpen: (w) => { const i = $('#kl', w); i.oninput = () => { const d = parseMonto(i.value); i.value = d ? miles(d) : ''; }; },
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: nuevo ? 'Guardar cliente' : 'Guardar cambios', cls: 'btn-primary', icon: 'check', primary: true, onClick: (w) => {
        const d = { nombre: $('#kn', w).value.trim(), ci: $('#kc', w).value.trim(), telefono: $('#kt', w).value.trim(), limite: parseMonto($('#kl', w).value), notas: $('#kno', w).value.trim() };
        if (!d.nombre) { toast('Escriba el nombre del cliente.', 'err'); return false; }
        let obj = c;
        if (nuevo) { obj = { id: uid(), creado: new Date().toISOString(), ...d }; db.clientes.push(obj); } else Object.assign(c, d);
        save(); toast(nuevo ? 'Cliente guardado' : 'Cambios guardados'); done && done(obj);
      } },
    ],
  });
}

function elegirClienteParaPago() {
  const conDeuda = db.clientes.filter((c) => saldo(c.id) > 0);
  if (!conDeuda.length) { toast('Ningún cliente tiene deuda pendiente.'); return; }
  modal({
    title: 'Cobrar crédito', size: 'sm',
    body: `<div class="field"><label>Cliente</label><select class="input" id="pc">${conDeuda.map((c) => `<option value="${c.id}">${esc(c.nombre)} — debe ${gs(saldo(c.id))}</option>`).join('')}</select></div>`,
    actions: [{ label: 'Cancelar', cls: 'btn-red' }, { label: 'Continuar', cls: 'btn-primary', primary: true, onClick: (w) => { const id = $('#pc', w).value; setTimeout(() => registrarPago(clienteDe(id), () => renderView()), 10); } }],
  });
}

function registrarPago(c, done) {
  const sm = Math.max(0, saldo(c.id, 'market')), sb = Math.max(0, saldo(c.id, 'bodega'));
  let metodo = 'efectivo';
  modal({
    title: `Cobrar a ${esc(c.nombre)}`,
    body: `<p class="muted" style="margin-bottom:14px">Cada negocio lleva su propia cuenta. Escriba cuánto paga de cada una.</p>
      <div class="grid2">
        <div class="field u-market"><label>${esc(unidadNombre('market'))} · debe ${gs(sm)}</label><input class="input input-lg num" id="pm" inputmode="numeric" ${sm ? '' : 'disabled'} placeholder="0"></div>
        <div class="field u-bodega"><label>${esc(unidadNombre('bodega'))} · debe ${gs(sb)}</label><input class="input input-lg num" id="pb" inputmode="numeric" ${sb ? '' : 'disabled'} placeholder="0"></div>
      </div>
      <button type="button" class="btn btn-sm" id="pTodo">Paga todo (${gs(sm + sb)})</button>
      <div class="field" style="margin-top:14px"><label>Forma de pago</label><div class="seg" id="pmS"><button type="button" class="on" data-k="efectivo">Efectivo</button><button type="button" data-k="transferencia">Transferencia</button><button type="button" data-k="tarjeta">Tarjeta</button></div></div>
      <div class="field"><label>Nota (opcional)</label><input class="input" id="pn"></div>
      <div id="pTr" class="grid2 hidden"><div class="field"><label>Banco o billetera</label><select class="input" id="pBan">${BANCOS.map((b) => `<option>${b}</option>`).join('')}</select></div><div class="field"><label>Nº de comprobante</label><input class="input" id="pComp" placeholder="Opcional"></div><div class="field" style="grid-column:1/-1"><label>Nombre y apellido de quien envió</label><input class="input" id="pEnv"></div></div>`,
    onOpen: (w) => {
      ['#pm', '#pb'].forEach((id) => { const i = $(id, w); i.oninput = () => { const d = parseMonto(i.value); i.value = d ? miles(d) : ''; }; });
      $('#pTodo', w).onclick = () => { if (sm) $('#pm', w).value = miles(sm); if (sb) $('#pb', w).value = miles(sb); };
      $$('#pmS button', w).forEach((b) => (b.onclick = () => { metodo = b.dataset.k; $$('#pmS button', w).forEach((x) => x.classList.toggle('on', x === b)); $('#pTr', w).classList.toggle('hidden', metodo === 'efectivo'); }));
    },
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: 'Registrar pago', cls: 'btn-orange', icon: 'check', primary: true, onClick: async (w) => {
        const m = parseMonto($('#pm', w).value), b = parseMonto($('#pb', w).value);
        if (m + b <= 0) { toast('Escriba el monto que paga el cliente.', 'err'); return false; }
        if (m > sm || b > sb) { toast('El pago no puede ser mayor que la deuda de ese negocio.', 'err'); return false; }
        const ok = await confirmar(`¿Registrar pago de <b>${gs(m + b)}</b> de ${esc(c.nombre)}?`, { title: 'Confirmar pago', ok: 'Registrar pago' });
        if (!ok) return false;
        const caja = cajaAbierta(medioDe(metodo)); const nota = $('#pn', w).value.trim();
        const extra = metodo === 'efectivo' ? {} : { banco: $('#pBan', w).value, comprobante: $('#pComp', w).value.trim(), envio: $('#pEnv', w).value.trim() };
        [['market', m], ['bodega', b]].forEach(([u, monto]) => { if (monto > 0) db.movimientos.push({ id: uid(), clienteId: c.id, fecha: new Date().toISOString(), tipo: 'pago', unidad: u, monto, metodo, ventaId: null, cajaId: caja?.id || null, nota: nota || 'Pago', usuario: S.user.nombre, ...extra }); });
        if (!caja) toast(`La caja ${CAJAS[medioDe(metodo)].c.toLowerCase()} está cerrada: el pago queda registrado fuera del turno.`, 'warn');
        save(); toast(`Pago de ${gs(m + b)} registrado`); done && done();
      } },
    ],
  });
}

function verCuenta(c) {
  const movs = db.movimientos.filter((m) => m.clienteId === c.id).sort((a, b) => a.fecha.localeCompare(b.fecha));
  let run = { market: 0, bodega: 0 };
  const filas = movs.map((m) => { run[m.unidad] += m.tipo === 'cargo' ? m.monto : -m.monto; return { ...m, sm: run.market, sb: run.bodega }; }).reverse();
  pagReset('cuenta');
  const w = modal({
    title: `Cuenta de ${esc(c.nombre)}`, size: 'lg',
    body: `<div class="kpis" style="grid-template-columns:repeat(3,1fr)">
        <div class="kpi u-market"><span>${esc(unidadNombre('market'))}</span><b class="num">${gs(saldo(c.id, 'market'))}</b></div>
        <div class="kpi u-bodega"><span>${esc(unidadNombre('bodega'))}</span><b class="num">${gs(saldo(c.id, 'bodega'))}</b></div>
        <div class="kpi"><span>Total</span><b class="num">${gs(saldo(c.id))}</b></div></div>
      <div id="ctaT"></div>`,
    actions: [{ label: 'Cerrar', cls: 'btn-primary', primary: true }],
  });
  const pintar = () => {
    const box = $('#ctaT', w); if (!box) return;
    const pg = paginar('cuenta', filas, pintar, 10);
    box.innerHTML = filas.length ? `<div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Detalle</th><th>Negocio</th><th class="right">Fiado</th><th class="right">Pagó</th><th class="right">Saldo ${unidadCorta('market')}</th><th class="right">Saldo ${unidadCorta('bodega')}</th></tr></thead>
      <tbody>${pg.items.map((m) => `<tr class="u-${m.unidad}"><td>${fFH(m.fecha)}</td><td>${esc(m.nota || '')}${m.metodo ? ` <small class="muted">(${METODOS[m.metodo]})</small>` : ''}</td><td><span class="tag">${unidadCorta(m.unidad)}</span></td>
        <td class="right num">${m.tipo === 'cargo' ? gs(m.monto) : ''}</td><td class="right num">${m.tipo === 'pago' ? gs(m.monto) : ''}</td><td class="right num">${gs(m.sm)}</td><td class="right num">${gs(m.sb)}</td></tr>`).join('')}</tbody></table></div>${pg.html}`
      : `<div class="empty">${ic('receipt')}<p>Sin movimientos.</p></div>`;
  };
  pintar();
}

/* =========================================================
   GASTOS (separados por negocio)
   ========================================================= */
VIEWS.gastos = (el) => {
  const f = S.gas;
  el.innerHTML = `
    <div class="toolbar">
      <input class="input" type="date" id="gd" value="${f.desde}" aria-label="Desde">
      <input class="input" type="date" id="gh" value="${f.hasta}" aria-label="Hasta">
      <select class="input" id="gu"><option value="todas">Minimarket y bodega</option><option value="market" ${f.unidad === 'market' ? 'selected' : ''}>${esc(unidadNombre('market'))}</option><option value="bodega" ${f.unidad === 'bodega' ? 'selected' : ''}>${esc(unidadNombre('bodega'))}</option></select>
      <span class="grow"></span>
      <button class="btn btn-primary" id="btnNG">${ic('plus')}Registrar gasto</button>
    </div>
    <div id="gasTabla"></div>`;
  const upd = () => { f.desde = $('#gd').value || f.desde; f.hasta = $('#gh').value || f.hasta; f.unidad = $('#gu').value; pagReset('gas'); tablaGas(); };
  $('#gd').onchange = upd; $('#gh').onchange = upd; $('#gu').onchange = upd;
  $('#btnNG').onclick = () => formGasto(null, tablaGas);
  tablaGas();
};

function tablaGas() {
  const f = S.gas;
  const lista = gastosRango(f.desde, f.hasta).filter((g) => f.unidad === 'todas' || g.unidad === f.unidad).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const box = $('#gasTabla'); if (!box) return;
  const pg = paginar('gas', lista, tablaGas);
  const tm = sumBy(lista.filter((g) => g.unidad === 'market'), (g) => g.monto), tb = sumBy(lista.filter((g) => g.unidad === 'bodega'), (g) => g.monto);
  box.innerHTML = `<div class="kpis" style="grid-template-columns:repeat(3,1fr)">
      <div class="kpi u-market"><span>Gastos ${esc(unidadNombre('market'))}</span><b class="num">${gs(tm)}</b></div>
      <div class="kpi u-bodega"><span>Gastos ${esc(unidadNombre('bodega'))}</span><b class="num">${gs(tb)}</b></div>
      <div class="kpi"><span>Total del período</span><b class="num">${gs(tm + tb)}</b></div></div>
    ${lista.length ? `<div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Negocio</th><th>Categoría</th><th>Detalle</th><th>Registró</th><th class="right">Monto</th><th></th></tr></thead>
    <tbody>${pg.items.map((g) => `<tr class="u-${g.unidad}"><td>${fFH(g.fecha)}</td><td><span class="tag">${unidadCorta(g.unidad)}</span></td><td>${esc(g.categoria)}</td><td>${esc(g.descripcion)}${g.medio === 'efectivo' ? ' <span class="badge orange">Efectivo de caja</span>' : g.medio === 'transferencia' ? ' <span class="badge">Transferencia</span>' : ''}</td><td>${esc(g.usuario || '')}</td><td class="right num"><b>${gs(g.monto)}</b></td>
      <td class="actions"><button class="icon-btn" data-ed="${g.id}" title="Editar">${ic('edit')}</button><button class="icon-btn danger" data-del="${g.id}" title="Eliminar">${ic('trash')}</button></td></tr>`).join('')}</tbody></table></div>${pg.html}`
    : `<div class="panel empty">${ic('wallet')}<p>No hay gastos en ese período.</p></div>`}`;
  $$('[data-ed]', box).forEach((b) => (b.onclick = () => formGasto(db.gastos.find((g) => g.id === b.dataset.ed), tablaGas)));
  $$('[data-del]', box).forEach((b) => (b.onclick = async () => {
    const g = db.gastos.find((x) => x.id === b.dataset.del);
    if (await confirmar(`¿Eliminar el gasto "${esc(g.descripcion)}" de ${gs(g.monto)}?`, { title: 'Eliminar gasto', ok: 'Eliminar', danger: true })) { db.gastos = db.gastos.filter((x) => x.id !== g.id); save(); tablaGas(); toast('Gasto eliminado'); }
  }));
}

function formGasto(g, done) {
  const nuevo = !g;
  g = g || { unidad: 'market', categoria: CAT_GASTO[0], descripcion: '', monto: 0, medio: 'efectivo', fecha: new Date().toISOString() };
  let unidad = g.unidad, medio = g.medio || 'externo';
  const seg = (id, opts, sel) => `<div class="seg" id="${id}">${opts.map(([k, n]) => `<button type="button" data-k="${k}" class="${sel === k ? 'on' : ''}">${n}</button>`).join('')}</div>`;
  modal({
    title: nuevo ? 'Registrar gasto' : 'Editar gasto',
    body: `<div class="field"><label>¿De qué negocio es el gasto?</label>${seg('gU', [['market', esc(unidadNombre('market'))], ['bodega', esc(unidadNombre('bodega'))]], unidad)}</div>
      <div class="field"><label>¿Con qué se pagó?</label>${seg('gMe', [['efectivo', 'Efectivo de caja'], ['transferencia', 'Transferencia'], ['externo', 'Fuera de caja']], medio)}</div>
      <div class="grid2"><div class="field"><label>Categoría</label><select class="input" id="gc">${CAT_GASTO.map((c) => `<option ${c === g.categoria ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
      <div class="field"><label>Fecha</label><input class="input" type="date" id="gf" value="${dkey(g.fecha)}"></div></div>
      <div class="field"><label>Detalle</label><input class="input" id="gde" value="${esc(g.descripcion)}" placeholder="Ej.: Pago a proveedor de bebidas" autofocus></div>
      <div class="field"><label>Monto (Gs.)</label><input class="input input-lg num" id="gm" value="${g.monto ? miles(g.monto) : ''}" inputmode="numeric"></div>`,
    onOpen: (w) => {
      const i = $('#gm', w); i.oninput = () => { const d = parseMonto(i.value); i.value = d ? miles(d) : ''; };
      $$('#gU button', w).forEach((b) => (b.onclick = () => { unidad = b.dataset.k; $$('#gU button', w).forEach((x) => x.classList.toggle('on', x === b)); }));
      $$('#gMe button', w).forEach((b) => (b.onclick = () => { medio = b.dataset.k; $$('#gMe button', w).forEach((x) => x.classList.toggle('on', x === b)); }));
    },
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: nuevo ? 'Guardar gasto' : 'Guardar cambios', cls: 'btn-primary', icon: 'check', primary: true, onClick: (w) => {
        const monto = parseMonto($('#gm', w).value); const desc = $('#gde', w).value.trim();
        if (!desc) { toast('Escriba el detalle del gasto.', 'err'); return false; }
        if (monto <= 0) { toast('El monto debe ser mayor a cero.', 'err'); return false; }
        const fk = $('#gf', w).value; const fecha = fk === dkey(g.fecha) ? g.fecha : new Date(fk + 'T12:00:00').toISOString();
        const caja = medio === 'externo' ? null : cajaAbierta(medio);
        const d = { unidad, medio, categoria: $('#gc', w).value, descripcion: desc, monto, fecha, deCaja: medio === 'efectivo' };
        if (nuevo) db.gastos.push({ id: uid(), ...d, usuario: S.user.nombre, cajaId: caja?.id || null });
        else { if (g.medio !== medio) d.cajaId = caja?.id || null; Object.assign(g, d); }
        save(); toast(nuevo ? 'Gasto guardado' : 'Cambios guardados'); done && done();
      } },
    ],
  });
}

/* =========================================================
   CAJA: efectivo y transferencia, recaudado y consumo interno
   ========================================================= */
function abrirCaja(tipo, done) {
  if (cajaAbierta(tipo)) { toast(`La ${CAJAS[tipo].n.toLowerCase()} ya está abierta.`, 'warn'); return null; }
  const c = { id: uid(), tipo, abierta: true, apertura: new Date().toISOString(), abreUsuario: S.user.nombre, montoInicial: 0 };
  db.cajas.push(c);
  save(); renderTopPill(); toast(`${CAJAS[tipo].n} abierta`);
  done && done();
  return c;
}

function editarInicial(c) {
  modal({
    title: 'Dinero inicial', size: 'sm',
    body: `<div class="field"><label>${(c.tipo || 'efectivo') === 'efectivo' ? 'Dinero de cambio con el que empezó la caja' : 'Saldo inicial'}</label><input class="input input-lg num" id="ai" inputmode="numeric" value="${c.montoInicial ? miles(c.montoInicial) : ''}" placeholder="0" autofocus></div>`,
    onOpen: (w) => { const i = $('#ai', w); i.oninput = () => { const d = parseMonto(i.value); i.value = d ? miles(d) : ''; }; },
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: 'Guardar', cls: 'btn-primary', icon: 'check', primary: true, onClick: (w) => { c.montoInicial = parseMonto($('#ai', w).value); save(); renderView(); toast('Dinero inicial guardado'); } },
    ],
  });
}

function cerrarCaja(c) {
  if (!c) return;
  const tipo = c.tipo || 'efectivo';
  const r = resumenCaja(c);
  Object.assign(c, { abierta: false, cierre: new Date().toISOString(), cierraUsuario: S.user.nombre, ingresos: r.ingresos, egresos: r.egresos, saldo: r.esperado, esperado: r.esperado, totalMarket: r.totalMarket, totalBodega: r.totalBodega });
  save(); renderTopPill(); renderView(); toast(`${CAJAS[tipo].n} cerrada · saldo ${gs(r.esperado)}`);
}
const saldoCierre = (x) => x.saldo ?? x.esperado ?? 0;

function datosCaja(fecha) {
  const mesDesde = fecha.slice(0, 8) + '01';
  return { fecha, mesDesde, dia: recaudado(fecha, fecha), mes: recaudado(mesDesde, fecha), coDia: consumosRango(fecha, fecha), coMes: consumosRango(mesDesde, fecha) };
}
const saldoRec = (d) => d.efectivo.ing - d.efectivo.egr + d.transferencia.ing - d.transferencia.egr;
const valorConsumo = (l) => sumBy(l, (c) => Math.round(c.cant * c.costo));

VIEWS.caja = (el) => {
  const hoy = dkey(new Date());
  const D = datosCaja(S.cajaFecha || hoy);
  const esHoy = D.fecha === hoy;
  const cajaBox = (t) => {
    const c = cajaAbierta(t); const info = CAJAS[t];
    let estado = '<p class="caja-estado">Caja <b class="c-red">CERRADA</b></p>';
    const ult = db.cajas.filter((x) => !x.abierta && (x.tipo || 'efectivo') === t).slice(-1)[0];
    if (!c && ult) {
      estado += `<div class="cierre-res"><div class="cierre-head"><b>Resumen del último cierre</b><span class="muted">${fFH(ult.apertura)} a ${fHora(ult.cierre)}</span></div>
        <div class="mini-rows"><div><span>Inicial</span><b class="num">${gs(ult.montoInicial)}</b></div><div><span>Ingresos</span><b class="num c-green">${ult.ingresos !== undefined ? gs(ult.ingresos) : '—'}</b></div>
        <div><span>Egresos</span><b class="num c-red">${ult.egresos !== undefined ? gs(ult.egresos) : '—'}</b></div><div><span>Saldo</span><b class="num c-blue">${gs(saldoCierre(ult))}</b></div>
        <div><span>${esc(unidadCorta('market'))}</span><b class="num">${gs(ult.totalMarket)}</b></div><div><span>${esc(unidadCorta('bodega'))}</span><b class="num">${gs(ult.totalBodega)}</b></div></div>
        <p class="muted" style="font-size:13px;margin-top:8px">Cerró ${esc(ult.cierraUsuario || '')}</p></div>`;
    }
    if (c) {
      const r = resumenCaja(c);
      estado = `<p class="caja-estado"><b>Caja <span class="c-green">ABIERTA</span> (${info.c})</b><br><span class="muted">Desde ${fFH(c.apertura)} · ${esc(c.abreUsuario)}</span></p>
        <div class="mini-rows"><div><span>Inicial <button class="link-btn" data-ini="${c.id}">Cambiar</button></span><b class="num">${gs(c.montoInicial)}</b></div><div><span>Ingresos</span><b class="num c-green">${gs(r.ingresos)}</b></div>
        <div><span>Egresos</span><b class="num c-red">${gs(r.egresos)}</b></div><div><span>Saldo</span><b class="num c-blue">${gs(r.esperado)}</b></div></div>`;
    }
    return `<div class="panel caja-box">
      <div class="caja-title">${ic(info.i)}<div><h3>${info.n}</h3><span class="muted">${info.d}</span></div></div>
      <div class="caja-btns"><button class="btn btn-green" data-abrir="${t}" ${c ? 'disabled' : ''}>${ic('unlock')}Abrir caja</button><button class="btn btn-red" data-cerrar="${t}" ${c ? '' : 'disabled'}>${ic('lock')}Cerrar caja</button></div>
      ${estado}</div>`;
  };
  const medioBox = (t, d) => `<div class="rec-box"><div class="rec-title">${ic(CAJAS[t].i)}${CAJAS[t].c}</div>
    <div class="rec-row"><span>Ingreso</span><b class="num c-green">${gs(d.ing)}</b></div>
    <div class="rec-row"><span>Egreso</span><b class="num c-red">${gs(d.egr)}</b></div>
    <div class="rec-row"><span>Saldo</span><b class="num c-blue">${gs(d.ing - d.egr)}</b></div></div>`;
  const recPanel = (titulo, chip, d, total) => `<div class="panel"><div class="panel-head"><h2>${titulo}</h2><span class="badge">${chip}</span></div>
    <div class="rec-grid">${medioBox('efectivo', d.efectivo)}${medioBox('transferencia', d.transferencia)}</div>
    <div class="rec-total"><span>${total}</span><b class="num">${gs(saldoRec(d))}</b></div></div>`;
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const hist = db.cajas.filter((x) => !x.abierta).reverse();
  const pgC = paginar('cierres', hist, renderView, 10);
  el.innerHTML = `
    <div class="toolbar"><label class="muted" for="cjF" style="font-weight:600">Fecha</label><input class="input" type="date" id="cjF" value="${D.fecha}" max="${hoy}">
      ${!esHoy ? `<button class="btn btn-sm" id="cjHoy">Volver a hoy</button>` : ''}<span class="grow"></span>
      <button class="btn btn-primary" id="cjPdf">${ic('download')}Descargar informe PDF</button></div>
    <div class="cols cols-2">${cajaBox('efectivo')}${cajaBox('transferencia')}</div>
    <div class="cols cols-2" style="margin-top:16px">
      ${recPanel('Recaudado del día', esHoy ? 'Hoy' : fFecha(D.fecha + 'T12:00'), D.dia, 'Total sobrante del día')}
      ${recPanel('Recaudado del mes', meses[+D.fecha.slice(5, 7) - 1], D.mes, 'Total sobrante del mes')}
    </div>
    <h3 style="margin:22px 0 10px">Cierres anteriores</h3>
    ${hist.length ? `<div class="table-wrap"><table><thead><tr><th>Caja</th><th>Apertura</th><th>Cierre</th><th>Usuario</th><th class="right">${unidadCorta('market')}</th><th class="right">${unidadCorta('bodega')}</th><th class="right">Ingresos</th><th class="right">Egresos</th><th class="right">Saldo</th></tr></thead>
    <tbody>${pgC.items.map((x) => `<tr><td><b>${CAJAS[x.tipo || 'efectivo'].c}</b></td><td>${fFH(x.apertura)}</td><td>${fFH(x.cierre)}</td><td>${esc(x.abreUsuario)}${x.cierraUsuario !== x.abreUsuario ? ' / ' + esc(x.cierraUsuario) : ''}</td>
      <td class="right num">${gs(x.totalMarket)}</td><td class="right num">${gs(x.totalBodega)}</td><td class="right num c-green">${x.ingresos !== undefined ? gs(x.ingresos) : '—'}</td><td class="right num c-red">${x.egresos !== undefined ? gs(x.egresos) : '—'}</td><td class="right num"><b class="c-blue">${gs(saldoCierre(x))}</b></td></tr>`).join('')}</tbody></table></div>${pgC.html}`
      : `<div class="panel empty">${ic('clock')}<p>Todavía no hay cierres de caja.</p></div>`}`;
  $('#cjF').onchange = () => { if ($('#cjF').value) { S.cajaFecha = $('#cjF').value; pagReset('cierres'); renderView(); } };
  $('#cjHoy') && ($('#cjHoy').onclick = () => { S.cajaFecha = null; renderView(); });
  $$('[data-abrir]', el).forEach((b) => (b.onclick = () => abrirCaja(b.dataset.abrir, () => renderView())));
  $$('[data-cerrar]', el).forEach((b) => (b.onclick = () => cerrarCaja(cajaAbierta(b.dataset.cerrar))));
  $$('[data-ini]', el).forEach((b) => (b.onclick = () => editarInicial(db.cajas.find((x) => x.id === b.dataset.ini))));
  $('#cjPdf').onclick = () => informeCaja(D);
};

VIEWS.consumo = (el) => {
  const hoy = dkey(new Date());
  const D = datosCaja(S.coFecha || hoy);
  const pgCo = paginar('consumo', D.coDia.slice().reverse(), renderView);
  el.innerHTML = `
    <div class="toolbar"><label class="muted" for="coF" style="font-weight:600">Fecha</label><input class="input" type="date" id="coF" value="${D.fecha}" max="${hoy}">
      <span class="badge orange">No suma ni resta en caja</span><span class="grow"></span>
      <button class="btn btn-orange" id="coNuevo">${ic('plus')}Registrar consumo</button></div>
    <p class="muted" style="margin-bottom:14px">Productos que salieron del stock sin venderse. Explica por qué falta mercadería sin que haya entrado dinero.</p>
    <div class="cols cols-2">
      <div class="co-box"><span>${D.fecha === hoy ? 'Hoy' : fFecha(D.fecha + 'T12:00')}</span><p><b>${D.coDia.length}</b> ${D.coDia.length === 1 ? 'producto' : 'productos'}</p><b class="c-orange num">${gs(valorConsumo(D.coDia))}</b></div>
      <div class="co-box"><span>Mes</span><p><b>${D.coMes.length}</b> ${D.coMes.length === 1 ? 'producto' : 'productos'}</p><b class="c-orange num">${gs(valorConsumo(D.coMes))}</b></div>
    </div>
    ${D.coDia.length ? `<div class="table-wrap" style="margin-top:16px"><table><thead><tr><th>Hora</th><th>Producto</th><th>Categoría</th><th class="right">Cantidad</th><th>Motivo</th><th>Registró</th><th class="right">Valor a costo</th><th></th></tr></thead>
      <tbody>${pgCo.items.map((c) => `<tr class="u-${c.unidad}"><td>${fHora(c.fecha)}</td><td><b>${esc(c.nombre)}</b>${c.nota ? `<br><small class="muted">${esc(c.nota)}</small>` : ''}</td><td><span class="tag">${esc(c.sector)}</span></td><td class="right">${fmtCant(c.cant)} ${c.medida}</td><td>${esc(c.motivo)}</td><td>${esc(c.usuario)}</td><td class="right num">${gs(c.cant * c.costo)}</td>
        <td class="actions"><button class="icon-btn danger" data-codel="${c.id}" title="Eliminar">${ic('trash')}</button></td></tr>`).join('')}</tbody></table></div>${pgCo.html}`
      : `<div class="panel empty" style="margin-top:16px">${ic('package')}<p>Este día no se usó ningún producto del negocio.</p></div>`}`;
  $('#coF').onchange = () => { if ($('#coF').value) { S.coFecha = $('#coF').value; pagReset('consumo'); renderView(); } };
  $('#coNuevo').onclick = () => formConsumo(() => renderView());
  $$('[data-codel]', el).forEach((b) => (b.onclick = async () => {
    const c = db.consumos.find((x) => x.id === b.dataset.codel);
    if (!(await confirmar(`¿Eliminar el consumo de ${fmtCant(c.cant)} ${c.medida} de <b>${esc(c.nombre)}</b>? Se devuelve al stock.`, { title: 'Eliminar consumo', ok: 'Eliminar', danger: true }))) return;
    const p = prodDe(c.pid); if (p && p.controlStock) p.stock = Math.round((p.stock + c.cant) * 1000) / 1000;
    db.consumos = db.consumos.filter((x) => x.id !== c.id); save(); renderView(); toast('Consumo eliminado');
  }));
};

function formConsumo(done) {
  const grupos = db.sectores.map((s) => {
    const ps = db.productos.filter((p) => p.activo && p.sectorId === s.id).sort((a, b) => a.nombre.localeCompare(b.nombre));
    return ps.length ? `<optgroup label="${esc(unidadCorta(s.unidad))} · ${esc(s.nombre)}">${ps.map((p) => `<option value="${p.id}">${esc(p.nombre)}${p.controlStock ? ` (stock ${fmtCant(p.stock)} ${p.medida})` : ''}</option>`).join('')}</optgroup>` : '';
  }).join('');
  modal({
    title: 'Registrar consumo interno',
    body: `<p class="muted" style="margin-bottom:14px">La mercadería sale del stock sin cobrarse. No suma ni resta en caja, pero se descuenta de la ganancia a precio de costo.</p>
      <div class="field"><label>Producto</label><select class="input" id="coP">${grupos}</select></div>
      <div class="grid2"><div class="field"><label>Cantidad</label><input class="input" id="coC" value="1" inputmode="decimal"></div>
      <div class="field"><label>Motivo</label><select class="input" id="coM">${MOTIVOS_CONSUMO.map((m) => `<option>${m}</option>`).join('')}</select></div></div>
      <div class="field"><label>Nota (opcional)</label><input class="input" id="coN" placeholder="Ej.: se rompió al descargar"></div>
      <p class="muted" id="coV"></p>`,
    onOpen: (w) => { const v = () => { const p = prodDe($('#coP', w).value); if (p) $('#coV', w).textContent = `Valor a costo: ${gs(parseCant($('#coC', w).value) * p.costo)}`; }; $('#coP', w).onchange = v; $('#coC', w).oninput = v; v(); },
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: 'Registrar consumo', cls: 'btn-orange', icon: 'check', primary: true, onClick: (w) => {
        const p = prodDe($('#coP', w).value); const cant = parseCant($('#coC', w).value);
        if (!p) { toast('Elija un producto.', 'err'); return false; }
        if (cant <= 0) { toast('La cantidad debe ser mayor a cero.', 'err'); return false; }
        const s = sectorDe(p.sectorId);
        db.consumos.push({ id: uid(), fecha: new Date().toISOString(), pid: p.id, nombre: p.nombre, sectorId: p.sectorId, sector: s?.nombre || '', unidad: s?.unidad || 'market', medida: p.medida, cant, costo: p.costo, precio: p.precio, motivo: $('#coM', w).value, nota: $('#coN', w).value.trim(), usuario: S.user.nombre });
        if (p.controlStock) p.stock = Math.round((p.stock - cant) * 1000) / 1000;
        save(); toast('Consumo interno registrado'); done && done();
      } },
    ],
  });
}

function informeCaja(D) {
  const c = db.config;
  const vs = ventasRango(D.fecha, D.fecha);
  const r = resumen(vs, gastosRango(D.fecha, D.fecha), D.coDia);
  const fila = (a, b) => `<tr><td>${a}</td><td class="r">${b}</td></tr>`;
  const tabla = (t, d) => `<table class="inf"><thead><tr><th>${t}</th><th class="r">Efectivo</th><th class="r">Transferencia</th></tr></thead><tbody>
    <tr><td>Ingreso</td><td class="r">${gs(d.efectivo.ing)}</td><td class="r">${gs(d.transferencia.ing)}</td></tr>
    <tr><td>Egreso</td><td class="r">${gs(d.efectivo.egr)}</td><td class="r">${gs(d.transferencia.egr)}</td></tr>
    <tr><td><b>Saldo</b></td><td class="r"><b>${gs(d.efectivo.ing - d.efectivo.egr)}</b></td><td class="r"><b>${gs(d.transferencia.ing - d.transferencia.egr)}</b></td></tr>
    <tr><td colspan="2"><b>Total sobrante</b></td><td class="r"><b>${gs(saldoRec(d))}</b></td></tr></tbody></table>`;
  imprimir(`<div class="inf-head"><img src="img/logo.png" alt=""><div><h1>Informe de caja</h1><p>${esc(c.nombreMarket)} y ${esc(c.nombreBodega)}</p><p>Fecha: <b>${fFecha(D.fecha + 'T12:00')}</b> · Generado por ${esc(S.user.nombre)} el ${fFH(new Date())}</p></div></div>
    <h2>Recaudado</h2>${tabla('Del día', D.dia)}${tabla('Del mes', D.mes)}
    <h2>Ventas del día por negocio</h2><table class="inf"><thead><tr><th></th><th class="r">${esc(unidadNombre('market'))}</th><th class="r">${esc(unidadNombre('bodega'))}</th></tr></thead><tbody>
    ${[['Ventas', 'ventas'], ['Costo de lo vendido', 'costo'], ['Ganancia bruta', 'bruta'], ['Gastos', 'gastos'], ['Consumo interno', 'consumo'], ['Ganancia neta', 'neta']].map(([n, k]) => `<tr><td>${n}</td><td class="r">${gs(r.market[k])}</td><td class="r">${gs(r.bodega[k])}</td></tr>`).join('')}
    <tr><td>Tickets</td><td class="r">${r.market.tickets}</td><td class="r">${r.bodega.tickets}</td></tr></tbody></table>
    <h2>Formas de pago del día</h2><table class="inf"><tbody>${Object.entries(METODOS).map(([k, n]) => fila(`${n} (${vs.filter((v) => v.metodo === k).length})`, gs(sumBy(vs.filter((v) => v.metodo === k), (v) => v.total)))).join('')}</tbody></table>
    <h2>Consumo interno del día</h2>${D.coDia.length ? `<table class="inf"><thead><tr><th>Producto</th><th>Motivo</th><th class="r">Cantidad</th><th class="r">Valor a costo</th></tr></thead><tbody>${D.coDia.map((x) => `<tr><td>${esc(x.nombre)}</td><td>${esc(x.motivo)}</td><td class="r">${fmtCant(x.cant)} ${x.medida}</td><td class="r">${gs(x.cant * x.costo)}</td></tr>`).join('')}</tbody></table>` : '<p>Sin consumo interno.</p>'}
    <p class="inf-foot">Para guardar como PDF, elija “Guardar como PDF” en la ventana de impresión.</p>`, 'a4');
}

/* =========================================================
   FORMAS DE PAGO
   ========================================================= */
VIEWS.formas = (el) => {
  const hoy = dkey(new Date());
  const fecha = S.formasFecha || hoy; const mesDesde = fecha.slice(0, 8) + '01';
  const cobrado = (desde, hasta, met) => sumBy(ventasRango(desde, hasta).filter((v) => v.metodo === met), (v) => v.total) + sumBy(db.movimientos.filter((m) => m.tipo === 'pago' && m.metodo === met && enRango(m.fecha, desde, hasta)), (m) => m.monto);
  const tarjeta = (n, i, k) => {
    const dia = k ? cobrado(fecha, fecha, k) : ['efectivo', 'transferencia', 'tarjeta'].reduce((a, m) => a + cobrado(fecha, fecha, m), 0);
    const mes = k ? cobrado(mesDesde, fecha, k) : ['efectivo', 'transferencia', 'tarjeta'].reduce((a, m) => a + cobrado(mesDesde, fecha, m), 0);
    return `<div class="panel fp-card"><h3>${ic(i)}${n}</h3><div class="rec-row"><span>${fecha === hoy ? 'Hoy' : fFecha(fecha + 'T12:00')}</span><b class="num">${gs(dia)}</b></div><div class="rec-row"><span>Mes</span><b class="num">${gs(mes)}</b></div></div>`;
  };
  const movs = [
    ...db.ventas.filter((v) => !v.anulada && v.metodo !== 'credito').map((v) => ({ id: nroTicket(v), fecha: v.fecha, cliente: v.clienteId ? clienteDe(v.clienteId)?.nombre : 'Consumidor final', metodo: v.metodo, banco: v.banco, comp: v.comprobante, envio: v.envio, total: v.total })),
    ...db.movimientos.filter((m) => m.tipo === 'pago').map((m) => ({ id: 'Cobro crédito', fecha: m.fecha, cliente: clienteDe(m.clienteId)?.nombre || '', metodo: m.metodo, banco: m.banco, comp: m.comprobante, envio: m.envio, total: m.monto })),
  ].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const delDia = movs.filter((m) => dkey(m.fecha) === fecha);
  const conComp = movs.filter((m) => medioDe(m.metodo) === 'transferencia');
  const tabla = (key, todo, vacio) => { const pg = paginar(key, todo, renderView, 10); const lista = pg.items; return todo.length ? `<div class="table-wrap"><table><thead><tr><th>ID</th><th>Fecha</th><th>Cliente</th><th>Forma / banco</th><th>Nº comprobante</th><th>Envió</th><th class="right">Total</th></tr></thead>
    <tbody>${lista.map((m) => `<tr><td><b>${esc(m.id)}</b></td><td>${fFH(m.fecha)}</td><td>${esc(m.cliente || '')}</td><td>${METODOS[m.metodo]}${m.banco ? ' · ' + esc(m.banco) : ''}</td><td>${m.comp ? esc(m.comp) : '<span class="muted">—</span>'}</td><td>${m.envio ? esc(m.envio) : '<span class="muted">—</span>'}</td><td class="right num"><b>${gs(m.total)}</b></td></tr>`).join('')}</tbody></table></div>${pg.html}`
    : `<div class="panel empty">${ic('receipt')}<p>${vacio}</p></div>`; };
  el.innerHTML = `
    <div class="toolbar"><label class="muted" for="fpF" style="font-weight:600">Fecha</label><input class="input" type="date" id="fpF" value="${fecha}" max="${hoy}"></div>
    <div class="cols fp-grid">${tarjeta('Efectivo', 'cash', 'efectivo')}${tarjeta('Transferencia', 'arrows', 'transferencia')}${tarjeta('Tarjeta', 'card', 'tarjeta')}${tarjeta('Total', 'scale', null)}</div>
    <h3 style="margin:22px 0 10px">Cobros del día</h3>${tabla('fpDia', delDia, 'Sin ventas pagadas para esta fecha.')}
    <h3 style="margin:22px 0 10px">Últimos movimientos con comprobante</h3>${tabla('fpComp', conComp, 'No hay movimientos con comprobante.')}`;
  $('#fpF').onchange = () => { if ($('#fpF').value) { S.formasFecha = $('#fpF').value; pagReset('fpDia'); renderView(); } };
};

/* =========================================================
   ESTADÍSTICAS
   ========================================================= */
function rangoStats() {
  const hoy = new Date(); const r = S.stats.rango;
  if (r === 'hoy') return [dkey(hoy), dkey(hoy)];
  if (r === '7') return [dkey(addDays(hoy, -6)), dkey(hoy)];
  if (r === '30') return [dkey(addDays(hoy, -29)), dkey(hoy)];
  if (r === 'mes') return [dkey(new Date(hoy.getFullYear(), hoy.getMonth(), 1)), dkey(hoy)];
  if (r === 'mesant') { const a = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1); return [dkey(a), dkey(new Date(hoy.getFullYear(), hoy.getMonth(), 0))]; }
  return [S.stats.desde || dkey(addDays(hoy, -6)), S.stats.hasta || dkey(hoy)];
}

function chartDias(desde, hasta, ventas) {
  const dias = [];
  for (let d = new Date(desde + 'T12:00:00'); dkey(d) <= hasta; d = addDays(d, 1)) dias.push(dkey(d));
  if (dias.length > 62) dias.splice(0, dias.length - 62);
  const data = dias.map((k) => { const vs = ventas.filter((v) => dkey(v.fecha) === k); return { k, m: sumBy(vs, (v) => v.totales.market), b: sumBy(vs, (v) => v.totales.bodega) }; });
  const max = Math.max(1, ...data.map((x) => Math.max(x.m, x.b)));
  const W = 760, H = 240, pl = 56, pb = 26, pt = 10, cw = (W - pl - 8) / data.length, bw = Math.max(2, Math.min(18, cw / 2 - 3));
  const y = (v) => pt + (H - pt - pb) * (1 - v / max);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => max * t);
  const corto = (v) => (v >= 1e6 ? (v / 1e6).toFixed(1).replace('.', ',') + ' M' : v >= 1e3 ? Math.round(v / 1e3) + ' mil' : Math.round(v));
  const paso = Math.ceil(data.length / 12);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Ventas por día">
    ${ticks.map((t) => `<line x1="${pl}" x2="${W - 4}" y1="${y(t)}" y2="${y(t)}" stroke="#D8E7F0" stroke-dasharray="${t ? '3 4' : ''}"/><text x="${pl - 8}" y="${y(t) + 4}" text-anchor="end">${corto(t)}</text>`).join('')}
    ${data.map((d, i) => { const x = pl + i * cw + cw / 2; return `
      <rect x="${x - bw - 1}" y="${y(d.m)}" width="${bw}" height="${H - pb - y(d.m)}" rx="2" fill="var(--celeste)"><title>${fFecha(d.k + 'T12:00')} · Minimarket ${gs(d.m)}</title></rect>
      <rect x="${x + 1}" y="${y(d.b)}" width="${bw}" height="${H - pb - y(d.b)}" rx="2" fill="var(--naranja)"><title>${fFecha(d.k + 'T12:00')} · Bodega ${gs(d.b)}</title></rect>
      ${i % paso === 0 ? `<text x="${x}" y="${H - 8}" text-anchor="middle">${d.k.slice(8)}/${d.k.slice(5, 7)}</text>` : ''}`; }).join('')}
  </svg>`;
}

VIEWS.estadisticas = (el) => {
  const [desde, hasta] = rangoStats();
  const vs = ventasRango(desde, hasta); const gsT = gastosRango(desde, hasta);
  const r = resumen(vs, gsT, consumosRango(desde, hasta));
  // por sector
  const sec = {};
  vs.forEach((v) => v.items.forEach((i) => { const k = i.sectorId; sec[k] = sec[k] || { n: i.sector, u: i.unidad, t: 0, g: 0 }; sec[k].t += i.subtotal; sec[k].g += i.subtotal - Math.round(i.cant * i.costo); }));
  const secArr = Object.values(sec).sort((a, b) => b.t - a.t); const secMax = Math.max(1, ...secArr.map((s) => s.t));
  // top productos
  const top = {};
  vs.forEach((v) => v.items.forEach((i) => { top[i.pid] = top[i.pid] || { n: i.nombre, u: i.unidad, c: 0, t: 0, med: i.medida }; top[i.pid].c += i.cant; top[i.pid].t += i.subtotal; }));
  const topArr = Object.values(top).sort((a, b) => b.t - a.t).slice(0, 10);
  // métodos
  const met = Object.entries(METODOS).map(([k, n]) => ({ n, t: sumBy(vs.filter((v) => v.metodo === k), (v) => v.total), c: vs.filter((v) => v.metodo === k).length }));
  const metMax = Math.max(1, ...met.map((m) => m.t));
  // horas
  const horas = Array.from({ length: 24 }, (_, h) => sumBy(vs.filter((v) => new Date(v.fecha).getHours() === h), (v) => v.total));
  const hMax = Math.max(1, ...horas); const pico = horas.indexOf(Math.max(...horas));

  const unidad = (u) => `<div class="panel unit-card u-${u}">
      <h3>${esc(unidadNombre(u))}</h3>
      <span class="muted">Ganancia neta</span><div class="big num" style="color:${r[u].neta < 0 ? 'var(--rojo)' : 'var(--tinta)'}">${gs(r[u].neta)}</div>
      <div style="margin-top:10px">
        <div class="row"><span>Ventas</span><b class="num">${gs(r[u].ventas)}</b></div>
        <div class="row"><span>Costo de lo vendido</span><b class="num">- ${gs(r[u].costo)}</b></div>
        <div class="row"><span>Ganancia bruta</span><b class="num">${gs(r[u].bruta)}</b></div>
        <div class="row"><span>Gastos</span><b class="num">- ${gs(r[u].gastos)}</b></div>
        <div class="row"><span>Consumo interno (a costo)</span><b class="num">- ${gs(r[u].consumo)}</b></div>
        <div class="row"><span>Tickets con productos de aquí</span><b>${r[u].tickets}</b></div>
        <div class="row"><span>Margen</span><b>${r[u].ventas ? Math.round((r[u].bruta / r[u].ventas) * 100) : 0}%</b></div>
      </div></div>`;
  const rb = (k, n) => `<button class="chip ${S.stats.rango === k ? 'on' : ''}" data-r="${k}">${n}</button>`;
  el.innerHTML = `
    <div class="toolbar">
      <div class="range">${rb('hoy', 'Hoy')}${rb('7', '7 días')}${rb('30', '30 días')}${rb('mes', 'Este mes')}${rb('mesant', 'Mes anterior')}${rb('custom', 'Elegir fechas')}</div>
      <span class="grow"></span>
      <span id="custom" class="${S.stats.rango === 'custom' ? '' : 'hidden'}" style="display:flex;gap:8px"><input class="input" type="date" id="sd" value="${desde}"><input class="input" type="date" id="sh" value="${hasta}"></span>
      <span class="muted">${fFecha(desde + 'T12:00')} al ${fFecha(hasta + 'T12:00')}</span>
    </div>
    <div class="kpis">
      <div class="kpi"><span>Ventas totales</span><b class="num">${gs(r.total.ventas)}</b></div>
      <div class="kpi"><span>Ganancia neta total</span><b class="num">${gs(r.total.neta)}</b></div>
      <div class="kpi"><span>Tickets</span><b>${r.total.tickets}</b></div>
      <div class="kpi"><span>Ticket promedio</span><b class="num">${gs(r.total.tickets ? r.total.ventas / r.total.tickets : 0)}</b></div>
    </div>
    <div class="cols cols-2">${unidad('market')}${unidad('bodega')}</div>
    <div class="panel" style="margin-top:16px">
      <div class="panel-head"><h3>Ventas por día</h3><div class="legend"><span class="u-market">${esc(unidadNombre('market'))}</span><span class="u-bodega">${esc(unidadNombre('bodega'))}</span></div></div>
      <div class="chart">${chartDias(desde, hasta, vs)}</div>
    </div>
    <div class="cols cols-2" style="margin-top:16px">
      <div class="panel"><div class="panel-head"><h3>Ventas por categoría</h3></div>
        ${secArr.length ? secArr.map((s) => `<div class="hbar u-${s.u}"><span>${esc(s.n)}</span><div class="track"><div class="fill" style="width:${(s.t / secMax) * 100}%"></div></div><b class="right num" title="Ganancia ${gs(s.g)}">${gs(s.t)}</b></div>`).join('') : `<div class="empty">${ic('chart')}<p>Sin ventas en el período.</p></div>`}
      </div>
      <div class="panel"><div class="panel-head"><h3>Productos más vendidos</h3></div>
        ${topArr.length ? `<div class="list">${topArr.map((p, i) => `<div class="li u-${p.u}"><b style="width:22px" class="muted">${i + 1}</b><div class="grow">${esc(p.n)} <span class="muted">· ${fmtCant(p.c)} ${p.med}</span></div><b class="num">${gs(p.t)}</b></div>`).join('')}</div>` : `<div class="empty">${ic('box')}<p>Sin ventas en el período.</p></div>`}
      </div>
    </div>
    <div class="cols cols-2" style="margin-top:16px">
      <div class="panel"><div class="panel-head"><h3>Formas de pago</h3></div>
        ${met.map((m) => `<div class="hbar u-market"><span>${m.n} <small class="muted">(${m.c})</small></span><div class="track"><div class="fill" style="width:${(m.t / metMax) * 100}%"></div></div><b class="right num">${gs(m.t)}</b></div>`).join('')}
      </div>
      <div class="panel"><div class="panel-head"><h3>Horarios de más venta</h3>${vs.length ? `<span class="badge orange">Pico: ${pad(pico)}:00 a ${pad(pico + 1)}:00</span>` : ''}</div>
        <div class="chart"><svg viewBox="0 0 480 150" role="img" aria-label="Ventas por hora">
          ${horas.map((v, h) => `<rect x="${h * 20 + 2}" y="${120 - (v / hMax) * 110}" width="16" height="${(v / hMax) * 110}" rx="2" fill="${h === pico && v ? 'var(--naranja)' : 'var(--celeste)'}"><title>${pad(h)}:00 · ${gs(v)}</title></rect>${h % 3 === 0 ? `<text x="${h * 20 + 10}" y="140" text-anchor="middle">${pad(h)}h</text>` : ''}`).join('')}
          <line x1="0" x2="480" y1="120.5" y2="120.5" stroke="#D8E7F0"/></svg></div>
      </div>
    </div>`;
  $$('[data-r]', el).forEach((b) => (b.onclick = () => {
    if (b.dataset.r === 'custom') { const [d, h] = rangoStats(); S.stats.desde = d; S.stats.hasta = h; }
    S.stats.rango = b.dataset.r; renderView();
  }));
  const cu = () => { S.stats.desde = $('#sd').value; S.stats.hasta = $('#sh').value; if (S.stats.desde && S.stats.hasta) renderView(); };
  $('#sd').onchange = cu; $('#sh').onchange = cu;
};

/* =========================================================
   USUARIOS Y PERMISOS
   ========================================================= */
VIEWS.usuarios = (el) => {
  const pgU = paginar('usuarios', db.usuarios, renderView, 10);
  el.innerHTML = `
    <div class="toolbar"><p class="muted grow">Los administradores entran a todo. A cada usuario se le eligen las secciones que puede usar.</p>
      <button class="btn btn-primary" id="btnNU">${ic('plus')}Nuevo usuario</button></div>
    <div class="table-wrap"><table><thead><tr><th>Nombre</th><th>Usuario</th><th>Rol</th><th>Permisos</th><th>Estado</th><th></th></tr></thead>
    <tbody>${pgU.items.map((u) => `<tr>
      <td><div class="user-cell">${avatar(u)}<b>${esc(u.nombre)}</b>${u.id === S.user.id ? ' <span class="badge">Usted</span>' : ''}</div></td><td>${esc(u.usuario)}</td>
      <td>${u.rol === 'admin' ? '<span class="badge orange">Administrador</span>' : '<span class="badge">Usuario</span>'}</td>
      <td style="max-width:380px"><small class="muted">${u.rol === 'admin' ? 'Acceso total' : PERMISOS.filter((p) => u.permisos.includes(p.k)).map((p) => p.n).join(', ') || 'Sin permisos'}</small></td>
      <td>${u.activo ? '<span class="badge green">Activo</span>' : '<span class="badge red">Desactivado</span>'}</td>
      <td class="actions"><button class="icon-btn" data-ed="${u.id}" title="Editar y permisos">${ic('key')}</button><button class="icon-btn danger" data-del="${u.id}" title="Eliminar">${ic('trash')}</button></td></tr>`).join('')}</tbody></table></div>${pgU.html}`;
  $('#btnNU').onclick = () => formUsuario(null);
  $$('[data-ed]', el).forEach((b) => (b.onclick = () => formUsuario(db.usuarios.find((u) => u.id === b.dataset.ed))));
  $$('[data-del]', el).forEach((b) => (b.onclick = async () => {
    const u = db.usuarios.find((x) => x.id === b.dataset.del);
    if (u.id === S.user.id) { toast('No puede eliminar su propio usuario mientras está conectado.', 'warn'); return; }
    if (u.rol === 'admin' && db.usuarios.filter((x) => x.rol === 'admin' && x.activo).length <= 1) { toast('Debe quedar al menos un administrador activo.', 'warn'); return; }
    if (await confirmar(`¿Eliminar al usuario <b>${esc(u.nombre)}</b>? Las ventas que hizo se conservan.`, { title: 'Eliminar usuario', ok: 'Eliminar', danger: true })) { db.usuarios = db.usuarios.filter((x) => x.id !== u.id); save(); renderView(); toast('Usuario eliminado'); }
  }));
};

function formUsuario(u) {
  const nuevo = !u;
  u = u || { nombre: '', usuario: '', rol: 'usuario', permisos: ['inicio', 'ventas', 'historial'], activo: true };
  let rol = u.rol;
  modal({
    title: nuevo ? 'Nuevo usuario' : `Editar a ${esc(u.nombre)}`, size: 'lg',
    body: `<div class="grid2">
        <div class="field"><label>Nombre</label><input class="input" id="un" value="${esc(u.nombre)}" autofocus></div>
        <div class="field"><label>Usuario para ingresar</label><input class="input" id="uu" value="${esc(u.usuario)}" autocomplete="off"></div>
        ${pwField('up', nuevo ? 'Contraseña' : 'Nueva contraseña (vacío = no cambiar)')}
        <div class="field"><label>Rol</label><div class="seg" id="uR"><button type="button" data-k="usuario" class="${rol === 'usuario' ? 'on' : ''}">Usuario</button><button type="button" data-k="admin" class="${rol === 'admin' ? 'on' : ''}">Administrador</button></div></div>
      </div>
      <div class="section-title">Secciones a las que puede entrar</div>
      <div class="perm-grid" id="uP">${PERMISOS.map((p) => `<label class="check"><input type="checkbox" value="${p.k}" ${rol === 'admin' || u.permisos.includes(p.k) ? 'checked' : ''} ${rol === 'admin' ? 'disabled' : ''}>${p.n}</label>`).join('')}</div>
      <div style="display:flex;gap:8px;margin-top:10px"><button type="button" class="btn btn-sm" id="uTodo">Marcar todo</button><button type="button" class="btn btn-sm" id="uNada">Quitar todo</button></div>
      <label class="check" style="margin-top:14px"><input type="checkbox" id="ua" ${u.activo ? 'checked' : ''}>Usuario activo (puede ingresar)</label>`,
    onOpen: (w) => {
      const sync = () => { const g = $('#uP', w); g.classList.toggle('disabled', rol === 'admin'); $$('input', g).forEach((i) => { i.disabled = rol === 'admin'; if (rol === 'admin') i.checked = true; }); };
      $$('#uR button', w).forEach((b) => (b.onclick = () => { rol = b.dataset.k; $$('#uR button', w).forEach((x) => x.classList.toggle('on', x === b)); sync(); }));
      $('#uTodo', w).onclick = () => $$('#uP input', w).forEach((i) => (i.checked = true));
      $('#uNada', w).onclick = () => { if (rol !== 'admin') $$('#uP input', w).forEach((i) => (i.checked = false)); };
      sync();
    },
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: nuevo ? 'Crear usuario' : 'Guardar cambios', cls: 'btn-primary', icon: 'check', primary: true, onClick: async (w) => {
        const nombre = $('#un', w).value.trim(), usuario = $('#uu', w).value.trim().toLowerCase(), pass = $('#up', w).value, activo = $('#ua', w).checked;
        if (!nombre || !usuario) { toast('Complete el nombre y el usuario.', 'err'); return false; }
        if (/\s/.test(usuario)) { toast('El usuario no puede tener espacios.', 'err'); return false; }
        if (db.usuarios.some((x) => x.usuario.toLowerCase() === usuario && x.id !== u.id)) { toast('Ese nombre de usuario ya existe.', 'err'); return false; }
        if (nuevo && pass.length < 4) { toast('La contraseña debe tener al menos 4 caracteres.', 'err'); return false; }
        if (!nuevo && pass && pass.length < 4) { toast('La contraseña debe tener al menos 4 caracteres.', 'err'); return false; }
        const permisos = rol === 'admin' ? PERMISOS.map((p) => p.k) : $$('#uP input:checked', w).map((i) => i.value);
        const admins = db.usuarios.filter((x) => x.rol === 'admin' && x.activo && x.id !== u.id).length;
        if (!nuevo && u.rol === 'admin' && (rol !== 'admin' || !activo) && admins === 0) { toast('Debe quedar al menos un administrador activo.', 'warn'); return false; }
        if (!nuevo && u.id === S.user.id && rol !== 'admin' && u.rol === 'admin') {
          if (!(await confirmar('Se va a quitar a usted mismo el rol de administrador. ¿Continuar?', { title: 'Quitar administrador', ok: 'Continuar', danger: true }))) return false;
        }
        if (nuevo) db.usuarios.push({ id: uid(), nombre, usuario, pass: passHash(usuario, pass), rol, permisos, activo, creado: new Date().toISOString() });
        else {
          const cambioUsuario = usuario !== u.usuario;
          if (cambioUsuario && !pass) { toast('Si cambia el nombre de usuario, escriba también una contraseña nueva.', 'err'); return false; }
          Object.assign(u, { nombre, usuario, rol, permisos, activo });
          if (pass) u.pass = passHash(usuario, pass);
          if (u.id === S.user.id) { S.user = u; renderYo(); }
        }
        save(); renderNav(); renderView(); toast(nuevo ? 'Usuario creado' : 'Cambios guardados');
      } },
    ],
  });
}

/* =========================================================
   CONFIGURACIÓN Y RESPALDO
   ========================================================= */
VIEWS.config = (el) => {
  const c = db.config;
  el.innerHTML = `<div class="cols cols-2">
    <div class="panel">
      <div class="panel-head"><h3>Datos del negocio</h3></div>
      <div class="grid2">
        <div class="field u-market"><label>Nombre del minimarket</label><input class="input" id="cm" value="${esc(c.nombreMarket)}"></div>
        <div class="field u-bodega"><label>Nombre de la bodega</label><input class="input" id="cb" value="${esc(c.nombreBodega)}"></div>
      </div>
      <div class="field"><label>Dirección (sale en el ticket)</label><input class="input" id="cdir" value="${esc(c.direccion)}"></div>
      <div class="grid2"><div class="field"><label>Ciudad</label><input class="input" id="cciu" value="${esc(c.ciudad)}"></div><div class="field"><label>Teléfono</label><input class="input" id="ctel" value="${esc(c.telefono)}"></div></div>
      <div class="field"><label>RUC</label><input class="input" id="cruc" value="${esc(c.ruc)}" placeholder="Ej.: 3974119-2"></div>
      <div class="field"><label>Mensaje al pie del ticket</label><input class="input" id="cmsg" value="${esc(c.mensajeTicket)}"></div>
      <div class="field"><label>Leyenda del ticket</label><input class="input" id="cley" value="${esc(c.leyendaTicket)}"></div>
      <div class="field"><label>Firma al pie (nombre del sistema o de quien lo hizo, teléfono, web)</label><textarea class="input" id="cfir" placeholder="Ej.: SPYcomers · Tel (0983) 411 544 · www.spynetpy.com">${esc(c.firma)}</textarea></div>
      <button class="btn btn-primary" id="cGuardar">${ic('check')}Guardar datos</button>
    </div>
    <div class="stack">
      <div class="panel">
        <div class="panel-head">${ic('file')}<h3>Facturación electrónica (SIFEN)</h3></div>
        <p class="muted" style="margin-bottom:14px">Datos que salen en la factura. Se guardan listos para conectarse con la SET cuando tenga el certificado y el proveedor de facturación electrónica.</p>
        <div class="field"><label>Razón social (titular del RUC)</label><input class="input" id="frs" value="${esc(c.razonSocial)}"></div>
        <div class="field"><label>Actividad económica</label><input class="input" id="fact" value="${esc(c.actividad)}" placeholder="Ej.: Comercio al por menor de alimentos y bebidas"></div>
        <div class="grid3"><div class="field"><label>Nº de timbrado</label><input class="input" id="ftim" value="${esc(c.timbrado)}"></div>
          <div class="field"><label>Vigencia desde</label><input class="input" type="date" id="ftd" value="${esc(c.timbradoDesde)}"></div>
          <div class="field"><label>Vigencia hasta</label><input class="input" type="date" id="fth" value="${esc(c.timbradoHasta)}"></div></div>
        <div class="grid3"><div class="field"><label>Establecimiento</label><input class="input" id="fest" value="${esc(c.establecimiento)}" maxlength="3"></div>
          <div class="field"><label>Punto de expedición</label><input class="input" id="fpun" value="${esc(c.puntoExp)}" maxlength="3"></div>
          <div class="field"><label>Última factura emitida</label><input class="input" id="fnro" value="${c.nroFactura || 0}" inputmode="numeric"></div></div>
        <button class="btn btn-primary" id="fGuardar">${ic('check')}Guardar facturación</button>
      </div>
      <div class="panel">
        <div class="panel-head">${ic('arrows')}<h3>Todos los equipos con los mismos datos</h3></div>
        ${SYNC.token ? `<p style="margin-bottom:12px"><span class="badge green">Conectado</span> Este equipo está sincronizado con el servidor. Usuarios, productos y ventas son los mismos en la compu y en el celular.</p>`
          : `<p class="muted" style="margin-bottom:12px">Este equipo trabaja solo con sus datos. Para compartirlos, suba el sistema a su hosting y conecte este equipo.</p>`}
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn" id="svCfg">${ic('arrows')}${SYNC.url ? 'Cambiar servidor' : 'Conectar con servidor'}</button>
          ${SYNC.url && S.user.rol === 'admin' ? `<button class="btn btn-orange" id="svSubir">${ic('upload')}Subir los datos de este equipo</button>` : ''}
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>Limpiar datos</h3></div>
        ${c.demo ? '<p style="margin-bottom:10px">El sistema tiene <b>ventas, gastos y clientes de ejemplo</b> para que pueda probar las estadísticas.</p>' : ''}
        <p class="muted" style="margin-bottom:12px">Borra ventas, gastos, créditos, clientes, consumo interno y cierres de caja. Se conservan productos, categorías y usuarios.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-red" id="cLimpiar">${ic('trash')}Borrar movimientos</button>
        <button class="btn btn-red" id="cReset">${ic('alert')}Restaurar de fábrica</button></div>
      </div>
    </div></div>`;
  $('#cGuardar').onclick = () => {
    const nm = $('#cm').value.trim(), nb = $('#cb').value.trim();
    if (!nm || !nb) { toast('Los nombres de los negocios no pueden quedar vacíos.', 'err'); return; }
    Object.assign(c, { nombreMarket: nm, nombreBodega: nb, direccion: $('#cdir').value.trim(), telefono: $('#ctel').value.trim(), ruc: $('#cruc').value.trim(), mensajeTicket: $('#cmsg').value.trim(), ciudad: $('#cciu').value.trim(), leyendaTicket: $('#cley').value.trim(), firma: $('#cfir').value.trim() });
    save(); toast('Datos guardados');
  };
  $('#svCfg').onclick = conectarServidor;
  $('#svSubir') && ($('#svSubir').onclick = () => modal({
    title: 'Subir los datos de este equipo', size: 'sm',
    body: `<p style="margin-bottom:12px">Los productos, usuarios y ventas de <b>este equipo</b> reemplazan a los del servidor. Úselo una sola vez, desde la compu que tiene los datos buenos.</p>
      <p class="muted" style="margin-bottom:12px;font-size:13.5px">Confirme con un administrador <b>del servidor</b> (si el servidor es nuevo, use el de este equipo).</p>
      <div class="field"><label>Usuario administrador</label><input class="input" id="suU" autocapitalize="none" autocorrect="off" spellcheck="false" value="${esc(S.user.usuario)}"></div>
      ${pwField('suP', 'Contraseña')}`,
    actions: [
      { label: 'Cancelar', cls: 'btn-red' },
      { label: 'Subir y reemplazar', cls: 'btn-orange', icon: 'upload', primary: true, onClick: async (w) => {
        const us = $('#suU', w).value.trim().toLowerCase(), hash = passHash(us, $('#suP', w).value.trim());
        try {
          const ping = await api('ping');
          const r = await api(ping.empty ? 'init' : 'replace', { usuario: us, hash, usuarioLocal: S.user.usuario, data: db });
          if (!r.ok) { toast(r.error || 'Usuario o contraseña incorrectos.', 'err'); return false; }
          SYNC.token = r.token; adoptar(db, r.version); syncIniciar(); renderView();
          toast('Listo: ahora todos los equipos usan estos datos.', 'ok', 'Datos subidos');
        } catch (e) { toast('No se pudo conectar con el servidor. Revise internet y la dirección.', 'err'); return false; }
      } },
    ],
  }));
  $('#fGuardar').onclick = () => {
    const p3 = (x) => (x.replace(/\D/g, '') || '1').padStart(3, '0').slice(-3);
    Object.assign(c, { razonSocial: $('#frs').value.trim(), actividad: $('#fact').value.trim(), timbrado: $('#ftim').value.trim(), timbradoDesde: $('#ftd').value, timbradoHasta: $('#fth').value,
      establecimiento: p3($('#fest').value), puntoExp: p3($('#fpun').value), nroFactura: parseMonto($('#fnro').value) });
    save(); renderView(); toast('Datos de facturación guardados');
  };
  $('#cLimpiar').onclick = async () => {
    if (algunaCaja()) { toast('Cierre las cajas antes de borrar los movimientos.', 'warn'); return; }
    if (await confirmar('¿Borrar todas las ventas, gastos, clientes, créditos y cierres de caja? Se recomienda descargar un respaldo antes.', { title: 'Borrar movimientos', ok: 'Sí, borrar todo', danger: true })) {
      Object.assign(db, { ventas: [], gastos: [], clientes: [], movimientos: [], cajas: [], consumos: [] }); db.config.nroVenta = 0; db.config.demo = false; save(); renderView(); renderTopPill(); toast('Movimientos borrados');
    }
  };
  $('#cReset').onclick = async () => {
    if (await confirmar('Se borra todo: productos, usuarios, ventas y configuración. El sistema vuelve a como vino. ¿Continuar?', { title: 'Restaurar de fábrica', ok: 'Restaurar de fábrica', danger: true })) {
      localStorage.removeItem(DB_KEY); sessionStorage.removeItem(SES_KEY); location.reload();
    }
  };
};

/* =========================================================
   ATAJOS DE TECLADO E INICIO
   ========================================================= */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { if (cerrarModalSuperior()) e.preventDefault(); return; }
  if (!S.user) return;
  const hayModal = !!$('#modal-root .modal-wrap');
  if (['F1', 'F2', 'F3', 'F4', 'F8'].includes(e.key)) e.preventDefault(); else return;
  if (hayModal) return;
  if (e.key === 'F1') ir('inicio');
  if (e.key === 'F2') { if (S.view !== 'ventas') ir('ventas'); else $('#posQ')?.focus(); }
  if (e.key === 'F3') { if (S.view !== 'ventas') ir('ventas'); setTimeout(() => $('#posQ')?.select(), 40); }
  if (e.key === 'F4' && S.view === 'ventas') cobrar();
  if (e.key === 'F8' && S.view === 'ventas') vaciarTicket();
});

window.addEventListener('beforeunload', (e) => { if (S.cart.length) { e.preventDefault(); e.returnValue = ''; } });

load();
(() => {
  const id = sessionStorage.getItem(SES_KEY);
  const u = id && SYNC.token && db.usuarios.find((x) => x.id === id && x.activo);
  if (u) { S.user = u; S.view = primeraVista(); }
  render();
  if (u && SYNC.token) syncIniciar();
})();