const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw6c1lmpmznsWdZUTdXe_Wb6QHqVVzlM6JFNh5nefo4l0yL8_QY6M9dnX3ZCx72C5t5ww/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("guestForm");
  const list = document.getElementById("guestList");

  // safety checks
  if (!form) {
    console.error("guestForm not found in DOM");
    return;
  }
  if (!list) {
    console.error("guestList not found in DOM");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("guestName").value;
    const msg = document.getElementById("guestMessage").value;

    try {
      const ip = await fetch("https://api.ipify.org?format=json")
        .then(r => r.json())
        .then(j => j.ip);

      await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, msg, ip })
      });

      e.target.reset();
      await loadGuestbook();
    } catch (err) {
      console.error("Error saving guestbook entry:", err);
      alert("There was a problem saving your message.");
    }
  });

  loadGuestbook();
});

async function loadGuestbook() {
  const out = document.getElementById("guestList");
  if (!out) return;

  out.innerHTML = "<li>Loading guestbook…</li>";

  try {
    const res = await fetch(WEB_APP_URL);
    const data = await res.json(); // expects JSON array

    out.innerHTML = "";

    data.slice().reverse().forEach(row => {
      const item = document.createElement("li");
      item.innerHTML = `
        <strong>${row.name || "Anonymous"}</strong><br>
        <small>${new Date(row.timestamp).toLocaleString()}</small><br>
        ${row.msg || ""}
      `;
      out.appendChild(item);
    });

    if (!data.length) {
      out.innerHTML = "<li>No messages yet. Be the first.</li>";
    }
  } catch (err) {
    console.error("Error loading guestbook:", err);
    out.innerHTML = "<li>Could not load guestbook.</li>";
  }
}
