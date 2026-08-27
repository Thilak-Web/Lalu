/* =========================================================
   Laalüee — shared behaviour
   ========================================================= */

/* -----------------------------------------------------------
   1) CONFIG — the only section you need to touch after
      deployment. See the setup notes at the bottom of this
      file / the message from Claude for full instructions.
   ----------------------------------------------------------- */
const CONFIG = {
  // Replace YOUR_FORM_ID with the ID Formspree gives you.
  // Example: "https://formspree.io/f/abcdwxyz"
  FORM_ENDPOINT:" https://formspree.io/f/moeqaypo"
};

/* -----------------------------------------------------------
   2) Watermark — tiles the slogan across the hero background
   ----------------------------------------------------------- */
function renderWatermark(targetId, rows = 7, repeats = 8){
  const el = document.getElementById(targetId);
  if(!el) return;
  const words = "MAKE IT HAPPEN";
  let html = "";
  for(let r = 0; r < rows; r++){
    html += '<div class="watermark-row">';
    for(let i = 0; i < repeats; i++){
      html += `<span>${words}</span>`;
    }
    html += "</div>";
  }
  el.innerHTML = html;
}

/* -----------------------------------------------------------
   3) Marquee — duplicate content once for a seamless loop
   ----------------------------------------------------------- */
function primeMarquee(trackId){
  const track = document.getElementById(trackId);
  if(!track) return;
  track.innerHTML = track.innerHTML + track.innerHTML;
}

/* -----------------------------------------------------------
   4) Loader overlay — shows the "Laä" writing loop
   ----------------------------------------------------------- */
const loaderEl = document.getElementById("pageLoader");

function hideLoader(){
  if(!loaderEl) return;
  loaderEl.classList.add("hidden");
}

function showLoader(){
  if(!loaderEl) return;
  loaderEl.classList.remove("hidden");
}

// Hide the loader once the page has actually rendered.
window.addEventListener("load", () => {
  setTimeout(hideLoader, 550);
});

/* -----------------------------------------------------------
   5) Navigation — intercept internal links so every page
      change plays the loading animation instead of a blank
      browser flash.
   ----------------------------------------------------------- */
function setupNavTransitions(){
  // Keep normal browser navigation.
  // This allows Safari's Back and Forward buttons to work correctly.
  document.querySelectorAll("a[data-nav]").forEach(link => {
    link.addEventListener("click", () => {
      showLoader();
    });
  });
}

/* -----------------------------------------------------------
   6) Active nav link highlight
   ----------------------------------------------------------- */
function highlightActiveNav(){
  const current = (window.location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".site-nav a[data-nav]").forEach(a => {
    const href = a.getAttribute("href");
    if(href === current || (current === "" && href === "index.html")){
      a.classList.add("active");
    }
  });
}

/* -----------------------------------------------------------
   7) Enquiry form — real submission via Formspree, no
      demo/fake handler. Shows "You have made it." on success.
   ----------------------------------------------------------- */
function setupEnquiryForm(){
  const form = document.getElementById("enquiryForm");
  if(!form) return;

  const note = document.getElementById("formNote");
  const successBox = document.getElementById("formSuccess");
  const submitBtn = form.querySelector(".submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if(CONFIG.FORM_ENDPOINT.includes("YOUR_FORM_ID")){
      note.textContent = "Form isn't connected yet — add your Formspree endpoint in script.js (CONFIG.FORM_ENDPOINT).";
      note.classList.add("error");
      return;
    }

    note.classList.remove("error");
    note.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try{
      const formData = new FormData(form);
      const response = await fetch(CONFIG.FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if(response.ok){
        form.style.display = "none";
        successBox.classList.add("show");
      } else {
        const data = await response.json().catch(() => null);
        const msg = (data && data.errors && data.errors[0] && data.errors[0].message)
          ? data.errors[0].message
          : "Something went wrong. Please try again, or reach us directly on WhatsApp.";
        note.textContent = msg;
        note.classList.add("error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
      }
    } catch(err){
      note.textContent = "Couldn't reach the server. Check your connection and try again.";
      note.classList.add("error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
  });
}

/* -----------------------------------------------------------
   Init
   ----------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderWatermark("watermark");
  primeMarquee("marqueeTrack");
  setupNavTransitions();
  highlightActiveNav();
  setupEnquiryForm();
});
