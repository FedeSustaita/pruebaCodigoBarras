// 🔹 "Base de datos" local
const productos = [
  { id: 1, nombre: "Harina 000", precio: 500, cantidad: 20 },
  { id: 2, nombre: "Leche", precio: 800, cantidad: 15 },
  { id: 3, nombre: "Queso", precio: 1200, cantidad: 10 }
]

// 🔹 Generar código automático
function generarCodigo(id) {
  return "P" + id.toString().padStart(6, "0")
}

// 🔹 Asignar código a productos
productos.forEach(p => {
  p.codigo_barras = generarCodigo(p.id)
})

const lista = document.getElementById("lista")
const info = document.getElementById("info")

// 🔹 Mostrar lista con códigos
function renderProductos() {
  lista.innerHTML = ""

  productos.forEach(p => {
    const div = document.createElement("div")
    div.className = "producto"

    div.innerHTML = `
      <strong>${p.nombre}</strong><br>
      Precio: $${p.precio}<br>
      Stock: ${p.cantidad}<br>
      Código: ${p.codigo_barras}
      <br>
      <svg id="barcode-${p.id}"></svg>
    `

    lista.appendChild(div)

    JsBarcode(`#barcode-${p.id}`, p.codigo_barras, {
      format: "CODE128",
      width: 2,
      height: 50,
      displayValue: true
    })
  })
}

// 🔹 Buscar producto
function buscarProducto(codigo) {
  return productos.find(p => p.codigo_barras === codigo)
}

// 🔹 Mostrar producto escaneado
function mostrarProducto(p) {
  if (!p) {
    info.innerHTML = "❌ Producto no encontrado"
    return
  }

  info.innerHTML = `
    <strong>${p.nombre}</strong><br>
    Precio: $${p.precio}<br>
    Stock: ${p.cantidad}
  `
}

// 🔹 Scanner
function iniciarScanner() {
  const scanner = new Html5QrcodeScanner("reader", {
    fps: 10,
    qrbox: 250
  })

  let ultimoCodigo = null

  scanner.render(
    (decodedText) => {
      if (decodedText === ultimoCodigo) return
      ultimoCodigo = decodedText

      console.log("Código:", decodedText)

      const producto = buscarProducto(decodedText)
      mostrarProducto(producto)
    },
    (error) => {}
  )
}

// 🔹 Inicializar
renderProductos()