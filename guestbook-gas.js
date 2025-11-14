const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw6c1lmpmznsWdZUTdXe_Wb6QHqVVzlM6JFNh5nefo4l0yL8_QY6M9dnX3ZCx72C5t5ww/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("guestForm");
  const list = document.getElementById("guestList");

  if (!form) {
    console.error("guestForm not found");
    return;
  }
  if (!list) {
    console.error("guestList not found");
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
      await loadGuestbookFromSheets();  // NOTE: new name
    } catch (err) {
      console.error("Error saving entry:", err);
      alert("Problem saving your message.");
    }
  });

  // initial load
  loadGuestbookFromSheets();  // NOTE: new name
});

async function loadGuestbookFromSheets() {
  const out = document.getElementById("guestList");
  if (!out) return;

  out.innerHTML = "<li>Loading guestbook…</li>";

  try {
    const res = await fetch(WEB_APP_URL);
    const data = await res.json();

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
    console.error("Error loading guestbook from Sheets:", err);
    out.innerHTML = "<li>Could not load guestbook.</li>";
  }
}
