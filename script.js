const colorForm = document.getElementById("color-form");
const colorInput = document.getElementById("color-input");
const mainColorValue = document.querySelector(".main-color-value");
const mainColorName = document.querySelector(".main-color-name");
const colorselect = document.getElementById("color-select");
const mainElement = document.querySelector("main");
const colorSchemesBlock = document.querySelector(".color-schemes");
const colorSchemeTitleInput = document.getElementById("color-scheme-title");
const schemesTitle = document.querySelector(".schemes-title");
const colorSchemesObj = [];

colorForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const color = colorInput.value.slice(1);
  const colorsMode = colorselect.value;

  fetch(`https://www.thecolorapi.com/id?hex=${color}&format=json`)
    .then((response) => response)
    .then((data) => {
      fetch(data.url)
        .then((response) => response.json())
        .then((data) => {
          mainColorName.textContent = data.name.value;
          mainColorValue.textContent = data.hex.value;

          // generate first item with choosen color
          const colorsBlock = document.createElement("div");
          colorsBlock.classList.add("colors-block");
          colorsBlock.innerHTML =
            `
                      <h2 class="colors-block-title">${colorSchemeTitleInput.value}</h2>
                      <button class="delete-scheme-btn" id="delete-scheme-btn"></button>
                      ` +
            generateColorItemHTML(data.hex.value, data.name.value);

          /* <div class="color-item">
                        <div class="color" style="background: ${data.hex.value}"></div>
                        <h3 class="color-title color-data">${data.name.value}</h3>
                        <div class="color-subtitle color-data">${data.hex.value}</div>
                      </div> */
          colorSchemesBlock.prepend(colorsBlock);

          schemesTitle.textContent =
            colorSchemesBlock.childNodes.length === 1
              ? "Your color scheme"
              : "Your color schemes";
          fetch(
            `https://www.thecolorapi.com/scheme?hex=${color}&format=json&mode=${colorsMode}&count=5`
          )
            .then((response) => response)
            .then((data) => {
              fetch(data.url)
                .then((response) => response.json())
                .then((data) => {
                  let complementColorsHTML = "";
                  // generate color scheme
                  data.colors.forEach((color) => {
                    complementColorsHTML += generateColorItemHTML(
                      color.hex.value,
                      color.name.value
                    );
                    /* `
                      <div class="color-item">
                        <div class="color" style="background: ${color.hex.value}"></div>
                        <h3 class="color-title color-data">${color.name.value}</h3>
                        <div class="color-subtitle color-data">${color.hex.value}</div>
                      </div>
                    `; */
                  });
                  colorsBlock.innerHTML += complementColorsHTML;
                });
            });
        });
    });
});

window.addEventListener("click", function (e) {
  // copy text from color name and value
  if (e.target.classList.contains("color-data")) {
    navigator.clipboard.writeText(e.target.textContent);
  }
  // delete color scheme
  else if (e.target.classList.contains("delete-scheme-btn")) {
    const deleteSchemeBtns = document.querySelectorAll(".delete-scheme-btn");
    const colorBlocks = this.document.querySelectorAll(".colors-block");
    let index;
    console.log(deleteSchemeBtns);
    deleteSchemeBtns.forEach((btn, i) => {
      if (e.target === btn) index = i;
    });
    colorBlocks[index].remove();
    console.log(colorBlocks.length);
    if (colorBlocks.length === 1) {
      mainColorName.textContent = "";
      mainColorValue.textContent = "";
      colorInput.value = "#000000";
    }
    schemesTitle.textContent =
      colorSchemesBlock.childNodes.length === 0
        ? "You don't have any color scheme yet..."
        : colorSchemesBlock.childNodes.length === 1
        ? "Your color scheme"
        : "Your color schemes";
  }
});

function generateColorItemHTML(value, name) {
  return `
                      <div class="color-item">
                        <div class="color" style="background: ${value}"></div>
                        <h3 class="color-title color-data">${name}</h3>
                        <div class="color-subtitle color-data">${value}</div>
                      </div>
                    `;
}
