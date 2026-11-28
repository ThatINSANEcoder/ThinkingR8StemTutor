
document.addEventListener("DOMContentLoaded", () => {
  const questionInput = document.getElementById("question");
  const askButton = document.getElementById("ask-button");
  const welcome = document.getElementById("welcome");
  const answer = document.getElementById("answer");
  const newChatButton = document.getElementById("new-chat");

  // Hide the welcome screen after the first question is submitted.
  function hideWelcome() {
    if (welcome) {
      welcome.style.display = "none";
    }
  }

  // Suggested questions.
  document.querySelectorAll("[data-question]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!questionInput) return;

      questionInput.value = button.dataset.question;
      questionInput.focus();
      questionInput.dispatchEvent(new Event("input", { bubbles: true }));

      // Use the existing AI button.
      if (askButton) {
        askButton.click();
      }
    });
  });

  // Hide welcome when the existing Ask button is clicked.
  if (askButton) {
    askButton.addEventListener("click", hideWelcome);
  }

  // Start a new chat.
  if (newChatButton) {
    newChatButton.addEventListener("click", () => {
      if (questionInput) {
        questionInput.value = "";
        questionInput.focus();
      }

      if (answer) {
        answer.innerHTML = "";
      }

      if (welcome) {
        welcome.style.display = "";
      }
    });
  }
});
