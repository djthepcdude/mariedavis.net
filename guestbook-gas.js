<script>
async function saveGuestbook() {
  const name = document.getElementById("name").value;
  const msg = document.getElementById("msg").value;

  const ip = await fetch("https://api.ipify.org?format=json")
    .then(r => r.json())
    .then(j => j.ip);

  await fetch("https://script.google.com/macros/s/AKfycbw6c1lmpmznsWdZUTdXe_Wb6QHqVVzlM6JFNh5nefo4l0yL8_QY6M9dnX3ZCx72C5t5ww/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, msg, ip })
  });

  alert("Saved");
}
</script>
