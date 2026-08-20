document.addEventListener("DOMContentLoaded", function () {

  const links = document.querySelectorAll("nav a");

  links.forEach(function (link) {

    link.addEventListener("click", function (event) {

      event.preventDefault();

      const target = document.querySelector(
        this.getAttribute("href")
      );

      if (target) {

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  });

});


function sendWhatsApp(service) {

  const phoneNumber = "919813130135";

  const message =
    "Hi Dev Travels, I am interested in " +
    service +
    ".";

  const whatsappURL =
    "https://wa.me/" +
    phoneNumber +
    "?text=" +
    encodeURIComponent(message);

  window.open(
    whatsappURL,
    "_blank",
    "noopener"
  );

}