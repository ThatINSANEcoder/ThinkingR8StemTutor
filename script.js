
// Thinking-R8 - Chatbot interface + v8 AI connection

document.addEventListener("DOMContentLoaded", () => {

  // 1. Model configuration
  const MODEL_HOME = "https://kkmayank1983.github.io/ai-tutor-v8/";

  // 2. Get website elements
  const statusLine = document.getElementById("status");
  const questionBox = document.getElementById("question");
  const askButton = document.getElementById("ask-button");
  const answerBox = document.getElementById("answer");
  const welcome = document.getElementById("welcome");
  const newChatButton = document.getElementById("new-chat");

  // Check that essential elements exist
  if (!questionBox || !askButton || !answerBox) {
    console.error("Thinking-R8: Required HTML elements are missing.");
    return;
  }

  // Prevent asking questions until the model loads
  askButton.disabled = true;

  // 3. Load v8
  if (typeof V8 === "undefined") {
    if (statusLine) {
      statusLine.textContent = "Could not load v8. Check the model script.";
    }
    console.error("V8 is not defined. Check that v8.js loads before script.js.");
    return;
  }

  V8.load({
    base: MODEL_HOME,

    onProgress: function (fraction, words) {
      if (statusLine) {
        statusLine.textContent = words;
      }
    }

  }).then(function (tutor) {

    if (statusLine) {
      statusLine.textContent = "v8 is ready. Ask a science question.";
    }

    askButton.disabled = false;

    // 4. Create a chat message
    function createMessage(role) {
      const message = document.createElement("div");

      message.className = "message " + role;

      const label = document.createElement("div");
      label.className = "message-label";
      label.textContent = role === "user" ? "You" : "Thinking-R8";

      const content = document.createElement("div");
      content.className = "message-content";

      message.appendChild(label);
      message.appendChild(content);

      answerBox.appendChild(message);

      return content;
    }

    // 5. Ask the AI
    async function askV8(event) {
      if (event) {
        event.preventDefault();
      }

      const question = questionBox.value.trim();

      if (!question || askButton.disabled) {
        return;
      }

      // Hide the welcome screen
      if (welcome) {
        welcome.style.display = "none";
      }

      // Display the user's message
      const userMessage = createMessage("user");
      userMessage.textContent = question;

      // Create the AI response area
      const aiMessage = createMessage("assistant");
      aiMessage.textContent = "Thinking...";

      // Clear input and disable button
      questionBox.value = "";
      askButton.disabled = true;

      try {

        // Connect to the original v8 model
        const response = await tutor.ask(question, {
          onToken: function (soFar) {
            aiMessage.textContent = soFar;
          }
        });

        // Display the final response
        aiMessage.textContent = response;

      } catch (error) {

        console.error("Thinking-R8 error:", error);

        aiMessage.textContent =
          "Sorry, something went wrong: " + error.message;

      } finally {

        askButton.disabled = false;
        questionBox.focus();

      }
    }

    // 6. Ask button
    askButton.addEventListener("click", askV8);

    // 7. Press Enter to send.
    // Shift + Enter creates a new line.
    questionBox.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        askV8(event);
      }
    });

    // 8. Suggested questions
    document.querySelectorAll("[data-question]").forEach(function (button) {
      button.addEventListener("click", function () {
        questionBox.value = button.dataset.question;
        askV8();
      });
    });

    // 9. New Chat button
    if (newChatButton) {
      newChatButton.addEventListener("click", function () {

        // Clear visible messages
        answerBox.replaceChildren();

        // Restore welcome screen
        if (welcome) {
          welcome.style.display = "";
        }

        // Reset input
        questionBox.value = "";
        questionBox.focus();

        // Keep the loaded AI model ready
        askButton.disabled = false;

      });
    }

  }).catch(function (error) {

    console.error("Could not load v8:", error);

    if (statusLine) {
      statusLine.textContent = "Could not load v8: " + error.message;
    }

    askButton.disabled = true;

  });

});
