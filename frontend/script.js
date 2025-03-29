const questions = [
    { 
        question: "What is the capital of France?", 
        options: ["Berlin", "Madrid", "Paris", "Rome"], 
        answer: "Paris" 
    },
    { 
        question: "What is 2 + 2?", 
        options: ["3", "4", "5", "6"], 
        answer: "4" 
    },
    { 
        question: "What is the color of the sky?", 
        options: ["Red", "Green", "Blue", "Yellow"], 
        answer: "Blue" 
    }
];

let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const scoreElement = document.getElementById("score");
const nextButton = document.getElementById("next-btn");

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option");
        button.addEventListener("click", () => checkAnswer(option, button));
        optionsContainer.appendChild(button);
    });

    nextButton.style.display = "none";
}

function checkAnswer(selectedAnswer, button) {
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (selectedAnswer === correctAnswer) {
        button.classList.add("correct");
        score++;
        scoreElement.textContent = score;
    } else {
        button.classList.add("wrong");
    }

    document.querySelectorAll(".option").forEach(btn => btn.disabled = true);
    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        alert("Quiz finished! Final Score: " + score);
        location.reload();
    }
});

loadQuestion();

