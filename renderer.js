document.getElementById("my-name").addEventListener("click", window.darkMode.toggle)

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

if (window.matchMedia) {
    if(! window.matchMedia('(prefers-color-scheme: dark)').matches){
        window.darkMode.toggle();
    }
}