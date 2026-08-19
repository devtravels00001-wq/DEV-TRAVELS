function sendWhatsApp(service) {

  const phoneNumber = "919813130135";

  const message =
    "Hello Dev Travels, I am interested in " +
    service +
    ".";

  const whatsappLink =
    "https://wa.me/" +
    phoneNumber +
    "?text=" +
    encodeURIComponent(message);

  window.open(
    whatsappLink,
    "_blank"
  );
}


/* Smooth scrolling */

document
  .querySelectorAll('a[href^="#"]')
  .forEach(function(link) {

    link.addEventListener(
      "click",
      function(event) {

        const target =
          document.querySelector(
            this.getAttribute("href")
          );

        if (target) {

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth"
          });

        }

      }
    );

  });