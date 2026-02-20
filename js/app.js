let DATA = null;
let selectedProduct = null;
let selectedSize = null;
let selectedFabric = null;
let selectedComfort = null;

init();

async function init()
{
  const res = await fetch("data/sofa_data.json");
  DATA = await res.json();

  renderProducts(DATA.products);
}

function renderProducts(products)
{
  const grid = document.getElementById("catalogGrid");

  grid.innerHTML = "";

  products.forEach(product =>
  {
    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <button class="btn btn-primary full-width">
        Configure
      </button>
    `;

    card.onclick = () =>
    {
      selectProduct(product);
    };

    grid.appendChild(card);
  });
}

function selectProduct(product)
{
  selectedProduct = product;

  const panel = document.getElementById("configPanel");

  panel.innerHTML = "";

  // Size selector
  product.options.sizes.forEach(size =>
  {
    const btn = document.createElement("button");

    btn.className = "btn btn-ghost full-width";

    btn.innerText = size.name;

    btn.onclick = () =>
    {
      selectedSize = size.id;
      updatePrice();
    };

    panel.appendChild(btn);
  });

  // Fabric selector
  product.available_fabrics.forEach(fabricId =>
  {
    const fabric = DATA.fabric_types.find(f => f.id === fabricId);

    const btn = document.createElement("button");

    btn.className = "btn btn-ghost full-width";

    btn.innerText = fabric.name;

    btn.onclick = () =>
    {
      selectedFabric = fabric;
      updatePrice();
    };

    panel.appendChild(btn);
  });
}

function updatePrice()
{
  if (!selectedProduct || !selectedSize || !selectedFabric)
    return;

  let price =
    selectedProduct.base_prices[selectedSize];

  price +=
    DATA.pricing_rules.fabric_grade_adjustments[selectedFabric.grade];

  document.getElementById("priceDisplay").innerText =
    "£" + price.toLocaleString();
}
