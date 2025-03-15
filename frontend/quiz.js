document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("start-screen");
    const quizContainer = document.getElementById("quiz-container");
    const startButton = document.getElementById("start-btn");
    const submitButton = document.getElementById("submit-btn");
    const resultText = document.getElementById("result");
    const nextButtons = document.querySelectorAll(".next-btn");
    const questions = document.querySelectorAll(".question");

    const correctAnswers = {
        q1: "8",
        q2: "3",
        q3: "30",
        q4: "35",
        q5: "81"
    };

    let currentQuestionIndex = 0;

    startButton.addEventListener("click", () => {
        startScreen.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        questions[currentQuestionIndex].classList.remove("hidden");
    });

    nextButtons.forEach((btn, index) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();
            questions[index].classList.add("hidden");
            questions[index + 1].classList.remove("hidden");
        });
    });

    submitButton.addEventListener("click", (event) => {
        event.preventDefault();
        let score = 0;
        const formData = new FormData(document.getElementById("quiz-form"));

        for (let [question, answer] of Object.entries(correctAnswers)) {
            if (formData.get(question) === answer) {
                score++;
            }
        }

        resultText.textContent = `You scored ${score}/5!`;
    });
});

