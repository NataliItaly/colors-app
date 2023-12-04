const colorForm = document.getElementById("form");
const colorInput = document.getElementById("color-range");
const mainColorValue = document.getElementById("main-color-value");
const mainColorName = document.getElementById("main-color-name");
const modeSelect = document.getElementById("mode-select");
const mainElement = document.querySelector("main");
const colorSchemesBlock = document.querySelector(".color-schemes");
const colorSchemeTitleInput = document.getElementById("color-scheme-title");
const schemesTitle = document.querySelector(".schemes-title");

let userColorSchemes = JSON.parse(localStorage.getItem("userColorSchemes"));
console.log(userColorSchemes);
if (!userColorSchemes) {
  userColorSchemes = [];
} else {
  userColorSchemes.forEach((scheme) => {
    colorSchemesBlock.prepend(generateColorScheme(scheme));
    //console.log(generateColorScheme(scheme));
  });
}

console.log(userColorSchemes);

colorForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const color = colorInput.value.slice(1);
  const colorsMode = modeSelect.value;
  const newColor = {
    colorValue: colorInput.value,
    mode: colorsMode,
    schemeTitle: colorSchemeTitleInput.value,
    schemeColors: [],
  };

  fetch(`https://www.thecolorapi.com/id?hex=${color}&format=json`)
    .then((response) => response)
    .then((scheme) => {
      fetch(scheme.url)
        .then((response) => response.json())
        .then((scheme) => {
          console.log(scheme);
          mainColorName.textContent = scheme.name.value;
          mainColorValue.textContent = scheme.hex.value;

          newColor.colorName = scheme.name.value;
          newColor.schemeColors.push({
            colorValue: scheme.hex.value,
            colorName: scheme.name.value,
          });

          //console.log(newColor);

          schemesTitle.textContent =
            colorSchemesBlock.childNodes.length === 1
              ? "Your color scheme"
              : "Your color schemes";
          //colorSchemesBlock.prepend(generateColorScheme(scheme));
          fetch(
            `https://www.thecolorapi.com/scheme?hex=${color}&format=json&mode=${colorsMode}&count=5`
          )
            .then((response) => response)
            .then((data) => {
              fetch(data.url)
                .then((response) => response.json())
                .then((data) => {
                  console.log(data);

                  data.colors.forEach((color) => {
                    newColor.schemeColors.push({
                      colorValue: color.hex.value,
                      colorName: color.name.value,
                    });
                  });
                  userColorSchemes.push(newColor);

                  localStorage.setItem(
                    "userColorSchemes",
                    JSON.stringify(userColorSchemes)
                  );

                  // generate color scheme
                  colorSchemesBlock.prepend(generateColorScheme(newColor));
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
    deleteSchemeBtns.forEach((btn, i) => {
      if (e.target === btn) index = i;
    });
    // remove colorBlock from DOM
    colorBlocks[index].remove();

    // remove color from userColorShemes
    userColorSchemes.splice(index, 1);

    localStorage.setItem("userColorSchemes", JSON.stringify(userColorSchemes));

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

function generateColorScheme(scheme) {
  // generate item with choosen color
  const colorsBlock = document.createElement("div");
  colorsBlock.classList.add("colors-block");
  colorsBlock.innerHTML = `
    <h2 class="colors-block-title">${scheme.schemeTitle}</h2>
    <button class="delete-scheme-btn" id="delete-scheme-btn"></button>
    `;
  colorsArrayHTML = "";
  scheme.schemeColors.forEach(
    (color) =>
      (colorsArrayHTML += generateColorItemHTML(
        color.colorValue,
        color.colorName
      ))
  );
  colorsBlock.innerHTML += colorsArrayHTML;
  return colorsBlock;
}

function generateColorItemHTML(value, name) {
  return `
    <div class="color-item">
      <div class="color" style="background: ${value}"></div>
      <h3 class="color-title color-data">${name}</h3>
      <div class="color-subtitle color-data">${value}</div>
    </div>
    `;
}
