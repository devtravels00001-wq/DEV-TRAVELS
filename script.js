import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";


import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";



/* =========================================
   FIREBASE CONFIG
========================================= */

const firebaseConfig = {

  apiKey:
    "AIzaSyAN4BmdDP3yhIgLbgPXPnqV0nnwQI-PaY",

  authDomain:
    "devtravels-f2847.firebaseapp.com",

  projectId:
    "devtravels-f2847",

  storageBucket:
    "devtravels-f2847.firebasestorage.app",

  messagingSenderId:
    "473178941241",

  appId:
    "1:473178941241:web:9fce26fc904eec4c9a2ae8"

};



/* =========================================
   INITIALIZE FIREBASE
========================================= */

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);



/* =========================================
   SMOOTH NAVIGATION
========================================= */

document.querySelectorAll("nav a").forEach(function (link) {

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



/* =========================================
   WHATSAPP BOOKING
========================================= */

window.sendWhatsApp = function (service) {

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

};



/* =========================================
   REVIEW SYSTEM
========================================= */

let selectedRating = 0;



const starButtons =
  document.querySelectorAll(".star-btn");


const reviewForm =
  document.getElementById("reviewForm");


const reviewGrid =
  document.getElementById("reviewGrid");


const reviewMessage =
  document.getElementById("reviewMessage");



/* =========================================
   STAR SELECTION
========================================= */

starButtons.forEach(function (star) {

  star.addEventListener("click", function () {

    selectedRating =
      Number(this.dataset.rating);


    updateStarSelection();

  });

});



function updateStarSelection() {

  starButtons.forEach(function (star) {

    const rating =
      Number(star.dataset.rating);


    if (rating <= selectedRating) {

      star.textContent = "★";

      star.classList.add("active");

    }

    else {

      star.textContent = "☆";

      star.classList.remove("active");

    }

  });

}



/* =========================================
   SUBMIT REVIEW
========================================= */

reviewForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    const customerName =
      document
        .getElementById("customerName")
        .value
        .trim();


    const customerEmail =
      document
        .getElementById("customerEmail")
        .value
        .trim();


    const customerReview =
      document
        .getElementById("customerReview")
        .value
        .trim();


    if (selectedRating === 0) {

      reviewMessage.textContent =
        "Please select a star rating.";

      reviewMessage.style.color =
        "#ff6b6b";

      return;

    }


    if (
      customerName.length < 2 ||
      !customerEmail ||
      customerReview.length < 3
    ) {

      reviewMessage.textContent =
        "Please enter your name, email and review.";

      reviewMessage.style.color =
        "#ff6b6b";

      return;

    }


    const submitButton =
      reviewForm.querySelector(
        ".submit-review"
      );


    submitButton.disabled = true;

    submitButton.textContent =
      "SUBMITTING...";


    reviewMessage.textContent =
      "";



    try {

      await addDoc(

        collection(
          db,
          "reviews"
        ),

        {

          name:
            customerName,

          email:
            customerEmail,

          rating:
            selectedRating,

          review:
            customerReview,

          createdAt:
            serverTimestamp()

        }

      );


      reviewMessage.textContent =
        "Thank you! Your review has been submitted successfully.";

      reviewMessage.style.color =
        "#25d366";


      reviewForm.reset();


      selectedRating = 0;


      updateStarSelection();


      loadReviews();

    }


    catch (error) {

      console.error(
        "Review error:",
        error
      );


      reviewMessage.textContent =
        "Something went wrong. Please try again.";

      reviewMessage.style.color =
        "#ff6b6b";

    }


    finally {

      submitButton.disabled = false;

      submitButton.textContent =
        "SUBMIT REVIEW";

    }

  }
);



/* =========================================
   LOAD REVIEWS
========================================= */

async function loadReviews() {

  reviewGrid.innerHTML =
    `
      <p class="loading-reviews">
        Loading customer reviews...
      </p>
    `;


  try {

    const reviewsQuery =
      query(

        collection(
          db,
          "reviews"
        ),

        orderBy(
          "createdAt",
          "desc"
        )

      );


    const querySnapshot =
      await getDocs(
        reviewsQuery
      );


    const reviews = [];


    querySnapshot.forEach(
      function (doc) {

        reviews.push({

          id:
            doc.id,

          ...doc.data()

        });

      }
    );


    updateOverallRating(
      reviews
    );


    displayReviews(
      reviews
    );

  }


  catch (error) {

    console.error(
      "Loading reviews error:",
      error
    );


    reviewGrid.innerHTML =
      `
        <p class="loading-reviews">
          No reviews available yet.
        </p>
      `;


    updateOverallRating([]);

  }

}



/* =========================================
   DISPLAY REVIEWS
========================================= */

function displayReviews(reviews) {

  reviewGrid.innerHTML = "";


  if (reviews.length === 0) {

    reviewGrid.innerHTML =
      `
        <p class="loading-reviews">
          No customer reviews yet.
          Be the first to share your experience!
        </p>
      `;

    return;

  }



  reviews.forEach(
    function (review) {

      const article =
        document.createElement(
          "article"
        );


      article.className =
        "review-card";


      const stars =
        createStars(
          review.rating
        );


      const name =
        escapeHTML(
          review.name
        );


      const text =
        escapeHTML(
          review.review
        );


      const email =
        escapeHTML(
          review.email || ""
        );


      article.innerHTML =
        `

        <div class="stars">

          ${stars}

        </div>


        <p>
          "${text}"
        </p>


        <h4>
          ${name}
        </h4>


        ${
          email
            ? `<a class="review-email" href="mailto:${email}">${email}</a>`
            : ""
        }

        `;


      reviewGrid.appendChild(
        article
      );

    }
  );

}



/* =========================================
   CALCULATE OVERALL RATING
========================================= */

function updateOverallRating(reviews) {

  const averageRatingElement =
    document.getElementById(
      "averageRating"
    );


  const bigAverageRating =
    document.getElementById(
      "bigAverageRating"
    );


  const reviewCount =
    document.getElementById(
      "reviewCount"
    );


  const summaryReviewCount =
    document.getElementById(
      "summaryReviewCount"
    );


  const heroStars =
    document.getElementById(
      "heroStars"
    );


  const summaryStars =
    document.getElementById(
      "summaryStars"
    );



  if (reviews.length === 0) {

    averageRatingElement.textContent =
      "New";

    bigAverageRating.textContent =
      "--";

    reviewCount.textContent =
      "No reviews yet";

    summaryReviewCount.textContent =
      "No customer reviews yet";

    heroStars.textContent =
      "☆☆☆☆☆";

    summaryStars.textContent =
      "☆☆☆☆☆";

    return;

  }



  const total =
    reviews.reduce(
      function (sum, review) {

        return (
          sum +
          Number(review.rating)
        );

      },
      0
    );


  const average =
    total /
    reviews.length;


  const roundedAverage =
    average.toFixed(1);


  averageRatingElement.textContent =
    roundedAverage +
    " / 5";


  bigAverageRating.textContent =
    roundedAverage;


  const countText =
    reviews.length +
    (
      reviews.length === 1
        ? " customer review"
        : " customer reviews"
    );


  reviewCount.textContent =
    countText;


  summaryReviewCount.textContent =
    countText;


  const stars =
    createStars(
      Math.round(average)
    );


  heroStars.textContent =
    stars;


  summaryStars.textContent =
    stars;

}



/* =========================================
   CREATE STARS
========================================= */

function createStars(rating) {

  let stars = "";


  for (
    let i = 1;
    i <= 5;
    i++
  ) {

    if (i <= rating) {

      stars += "★";

    }

    else {

      stars += "☆";

    }

  }


  return stars;

}



/* =========================================
   SECURITY FOR REVIEW TEXT
========================================= */

function escapeHTML(text) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    text;


  return div.innerHTML;

}



/* =========================================
   INITIAL LOAD
========================================= */

loadReviews();