const colorForm = document.getElementById("color-form");
const colorInput = document.getElementById("color-input");
const mainColorValue = document.querySelector(".main-color-value");
const mainColorName = document.querySelector(".main-color-name");
const colorselect = document.getElementById("color-select");
const colorsBlock = document.getElementById("colors-block");

colorForm.addEventListener("submit", function (event) {
  event.preventDefault();
  mainColorValue.textContent = colorInput.value.toUpperCase();
  colorsBlock.innerHTML = "";
  const color = colorInput.value.slice(1);
  const colorsMode = colorselect.value;

  fetch(`https://www.thecolorapi.com/id?hex=${color}&format=json`)
    .then((response) => response)
    .then((data) => {
      fetch(data.url)
        .then((response) => response.json())
        .then((data) => {
          mainColorName.textContent = data.name.value;

          fetch(
            `https://www.thecolorapi.com/scheme?hex=${color}&format=json&mode=${colorsMode}&count=5`
          )
            .then((response) => response)
            .then((data) => {
              fetch(data.url)
                .then((response) => response.json())
                .then((data) => {
                  let complementColorsHTML = "";
                  const complementColors = data.colors.forEach((color) => {
                    complementColorsHTML += `
                      <div class="color-item">
                        <div class="color" style="background: ${color.hex.value}"></div>
                        <h3 class="color-title color-data">${color.name.value}</h3>
                        <div class="color-subtitle color-data">${color.hex.value}</div>
                      </div>
                    `;
                  });
                  colorsBlock.innerHTML += complementColorsHTML;
                });
            });
        });
    });
});

window.addEventListener("click", function (e) {
  if (e.target.classList.contains("color-data")) {
    navigator.clipboard.writeText(e.target.textContent);
  } else {
    return;
  }
});
