// load data theme from local storage and if not set, set it to light
const theme = localStorage.getItem("theme");
if (theme) {
  document.documentElement.setAttribute("data-theme", theme);
} else {
  document.documentElement.setAttribute("data-theme", "light");
  localStorage.setItem("theme", "light");
}

// toggle data theme
function toggleTheme() {
  const theme = document.documentElement.getAttribute("data-theme");
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
}
