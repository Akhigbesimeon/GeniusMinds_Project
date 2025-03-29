const questions = [
    { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: 1 },
    { question: "What is the capital of France?", options: ["London", "Berlin", "Madrid", "Paris"], answer: 3 },
    { question: "Who wrote 'Romeo and Juliet'?", options: ["Shakespeare", "Hemingway", "Austen", "Orwell"], answer: 0 },
    { question: "What is the largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 },
    { question: "Which gas do plants absorb?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: 1 },
];

let currentQuestionIndex = 0;
let score = 0;
const questionText = document.getElementById("question-text");
const options = document.querySelectorAll(".option-btn");
const scoreDisplay = document.getElementById("score");
const nextBtn = document.getElementById("next-btn");

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    options.forEach((btn, index) => {
        btn.textContent = currentQuestion.options[index];
        btn.classList.remove("correct", "wrong");
        btn.disabled = false;
    });
    nextBtn.style.display = "none";
}

function checkAnswer(selectedIndex) {
    const correctIndex = questions[currentQuestionIndex].answer;
    if (selectedIndex === correctIndex) {
        options[selectedIndex].classList.add("correct");
        score++;
    } else {
        options[selectedIndex].classList.add("wrong");
        options[correctIndex].classList.add("correct");
    }

    options.forEach(btn => btn.disabled = true);
    scoreDisplay.textContent = score;
    nextBtn.style.display = "block";
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        questionText.textContent = `Game Over! Final Score: ${score}`;
        document.querySelector(".options").style.display = "none";
        nextBtn.style.display = "none";
    }
}

loadQuestion();
