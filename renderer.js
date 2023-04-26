const information = document.getElementById("info")
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`
window.darkMode.toggle();

document.getElementById("toggle-dark-mode").addEventListener("click", async () => {
    const isDarkMode = await window.darkMode.toggle()
    document.getElementById("theme-source").innerHTML = isDarkMode ? "Dark" : "Light"
})

document.getElementById("reset-to-system").addEventListener("click", async () => {
    await window.darkMode.system()
    document.getElementById("theme-source").innerHTML = "System"
})

const navLinks = document.querySelectorAll("nav a")

navLinks.forEach((link) => {
    link.addEventListener("click", handleNavClick);
});

function handleNavClick(event) {
    event.preventDefault();
    const sectionId = event.target.getAttribute("data-section");
    const sectionElement = document.getElementById(sectionId);

    if (sectionElement) {
        // Hide all other sections
        const allSections = document.querySelectorAll("[class=dynamic-section]");
        allSections.forEach((section) => {
            section.style.display = "none";
        });

        // Make the clicked section visible
        sectionElement.style.display = "";
    }
}