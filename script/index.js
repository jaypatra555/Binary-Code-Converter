
emailjs.init("JRt0OMULPMXjHlW2L");

function sendComment() {
  emailjs.send(
    "service_j01zjkr",
    "template_nfylgwh",
    {
      name: document.getElementById("name").value,
      comment: document.getElementById("comment").value
    }
  )
  .then(() => {
    alert("Comment sent!");
  })
  .catch((err) => {
    console.log(err);
    alert("Error sending comment");
  });
}