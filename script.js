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
          behavior: "smooth"
        });

      }

    });

  });

});
