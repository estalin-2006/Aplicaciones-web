let productos = [];
let categoriasseleccionadas = "all";

const contenedorProductos = document.getElementById('productos');
const contenedorCategorias = document.getElementById('categorias');
const inputbuscador = document.getElementById('buscador');
const buscarBtn = document.getElementById('buscarBtn');

async function cargarProducto() {
  try {
    mostrarmensaje("Cargando productos...");
    const respuesta = await fetch("https://fakestoreapi.com/products");

    if (!respuesta.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    productos = await respuesta.json();

    if (productos.length === 0) {
      mostrarmensaje("No hay productos disponibles en este momento");
    } else {
      mostrarProductos(productos);

      // Agregar funcionalidad de búsqueda
      buscarBtn.addEventListener("click", () => {
        const texto = inputbuscador.value.toLowerCase();
        if (texto.trim() !== "") {
          const filtrados = productos.filter((p) =>
            p.title.toLowerCase().includes(texto) ||
            p.description.toLowerCase().includes(texto)
          );
          mostrarProductos(filtrados);
        }
      });
    }
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    mostrarmensaje("No se pudieron cargar los productos. Intenta más tarde.");
  }
}
async function cargarCategorias() {
  try {
    const respuesta = await fetch("https://fakestoreapi.com/products/categories");

    if (!respuesta.ok) {
      throw new Error("Error en la respuesta de la API al cragr las categoria ");
    }

    const categorias = await respuesta.json();
    mostrarCategorias(categorias);
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
}

function mostrarCategorias(categorias) {
  // Agregar botón para mostrar todos los productos
  const botonTodos = document.createElement("button");
  botonTodos.className = "bg-blue-300 text-white px-4 py-2 rounded-md hover:bg-blue-700 font";
  botonTodos.textContent = "Todos";
  botonTodos.addEventListener("click", () => {
    // Remover la clase activa de todos los botones
    const botones = contenedorCategorias.querySelectorAll("button");
    botones.forEach(btn => btn.classList.remove("bg-blue-700", "text-white"));

    // Agregar la clase activa al botón "Todos"
    botonTodos.classList.add("bg-blue-700", "text-white");

    // Mostrar todos los productos
    mostrarProductos(productos);
  });
  contenedorCategorias.appendChild(botonTodos);

  // Agregar botones para cada categoría
  categorias.forEach(categoria => {
    const boton = document.createElement("button");
    boton.className = "bg-blue-300 text-white px-4 py-2 rounded-md hover:bg-blue-700 font";
    boton.textContent = categoria;

    // Marcar el botón seleccionado
    boton.addEventListener("click", () => {
      // Remover la clase activa de todos los botones
      const botones = contenedorCategorias.querySelectorAll("button");
      botones.forEach(btn => btn.classList.remove("bg-blue-700", "text-white"));

      // Agregar la clase activa al botón seleccionado
      boton.classList.add("bg-blue-700", "text-white");

      // Filtrar por categoría
      filtrarPorCategoria(categoria);
    });

    contenedorCategorias.appendChild(boton);
  });
}

function filtrarPorCategoria(categoria) {
  const productosFiltrados = productos.filter(producto => producto.category === categoria);
  mostrarProductos(productosFiltrados);
}

// Mostrar mensaje
function mostrarmensaje(mensaje) {
  contenedorProductos.innerHTML = `<p class="text-center col-span-full text-gray-500">${mensaje}</p>`;
}

// Mostrar productos
function mostrarProductos(productos) {
  contenedorProductos.innerHTML = "";
  if (productos.length === 0) {
    mostrarmensaje("No se encontraron productos.");
    return;
  }
  productos.forEach(producto => {
    const productoDiv = document.createElement("div");
    productoDiv.className = "bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-xl transition-shadow duration-300";
    productoDiv.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}" class="w-32 h-32 object-contain mb-4">
      <h3 class="text-lg font-semibold mb-2 text-center">${producto.title}</h3>
      <p class="text-gray-700 font-medium mb-2">$${producto.price}</p>
      <a href="detalle.html?id=${producto.id}" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Detalle</a>
    `;
    contenedorProductos.appendChild(productoDiv);
  });
}

inputbuscador.addEventListener("input", () => {
  const texto = inputbuscador.value.toLowerCase();
  const filtrados = productos.filter((p) =>
    p.title.toLowerCase().includes(texto) ||
    p.description.toLowerCase().includes(texto)
  );
  mostrarProductos(filtrados);
});

// Botón de cierre de sesión en el header
function mostrarLogout() {
  const header = document.querySelector('header');
  if (!header) return;
  let logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) {
    logoutBtn = document.createElement('button');
    logoutBtn.id = 'logoutBtn';
    logoutBtn.textContent = 'Cerrar sesión';
    logoutBtn.className = 'ml-4 bg-fuchsia-700 hover:bg-fuchsia-800 text-white px-6 py-2 rounded-lg font-bold transition';
    logoutBtn.onclick = function () {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    };
    // Insertar al final del header, junto a la navegación
    const nav = header.querySelector('nav');
    if (nav) {
      nav.parentNode.insertBefore(logoutBtn, nav.nextSibling);
    } else {
      header.appendChild(logoutBtn);
    }
  }
}

// Redirección si no hay token
function checkAuth() {
  if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
  } else {
    mostrarLogout();
  }
}

// Llamar las funciones para cargar los productos y las categorías
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  cargarProducto();
  cargarCategorias();
});
