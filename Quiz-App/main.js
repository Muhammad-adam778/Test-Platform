// Select Elements
let countSpan = document.querySelector(".count span");
let bulletSpanContainer = document.querySelector(".bullets .spans");

let currentIndex = 0;
let changebtn = 0;
let rightAnswers = 0;
let countDownInterval;

let quizInfo = document.querySelector(".quiz-info");
let  quizArea  = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let submitButton = document.querySelector(".submit-btn");
let bullets = document.querySelector(".bullets");
let results = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");


function getQuestions() {

    let myRequest  = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let qCount =
             questionsObject.length;

            creatBullets(qCount);
            
            addQuestionData(questionsObject[currentIndex], qCount);

            countDown(20, qCount);

            if(changebtn === 0){
                let t = document.getElementById("submit-btn");
                let y = document.createTextNode("التالي");
                t.appendChild(y);
            }
        
            submitButton.onclick = () =>{

                let theRightAnswer = questionsObject[currentIndex].right_answer;
                console.log(theRightAnswer);

                currentIndex++;
                changebtn++;
                

                checkAnswer(theRightAnswer, qCount);

                quizArea.innerHTML = "";
                answerArea.innerHTML = "";

                addQuestionData(questionsObject[currentIndex], qCount)

                handleBullets();

                clearInterval(countDownInterval);
                countDown(20, qCount);

                showResult(qCount);

                if(changebtn === 4){
                    submitButton.innerHTML = submitButton.innerHTML.replace("التالي", "إنهاء الاختبار");
                }
            }
        }
    }

    myRequest.open("GET", "html-questions.json", true);
    myRequest.send();
}

getQuestions();

function creatBullets(num) {
    countSpan.innerHTML  = num;

    for (let i = 0; i < num; i++) {
        let theBullet = document.createElement("span");

        if (i === 0) {
            theBullet.className = "on";
        }
        bulletSpanContainer.appendChild(theBullet);       
    }   
    
}

function addQuestionData(obj, count) {

    if (currentIndex < count) {
        let questionTitle = document.createElement("h2");

    let questionText = document.createTextNode(obj['title']);

    questionTitle.appendChild(questionText);

    quizArea.appendChild(questionTitle);

    for(let i = 1; i <= 4; i++){

        let mainDiv = document.createElement("div");

        mainDiv.className = "answer";

        let radioInput = document.createElement("input");

        radioInput.name = "question";
        radioInput.type = "radio";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];

        let theLabel = document.createElement("label");
        
        theLabel.htmlFor = `answer_${i}`;

        let theLabelText = document.createTextNode(obj[`answer_${i}`]);

        theLabel.appendChild(theLabelText);

        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);

        answerArea.appendChild(mainDiv);
    }
    }
}

function checkAnswer(rAnswer, count){
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    console.log(`Right Answer : ${rAnswer}`);
    console.log(`Choosen Answer : ${theChoosenAnswer}`);

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
        console.log("Good!");
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) =>{
    if (currentIndex === index) {
        span.className = "on";
    }
  });
}

function showResult(count) {
    if(currentIndex === count) {

        quizInfo.remove();
        quizArea.remove();
        answerArea.remove();
        bullets.remove();
        submitButton.remove();

        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class = "good">جيد !</span> <span class = "mark">الدرجة : ${rightAnswers} من ${count}</span>`;
        } else if (rightAnswers === count){
            theResults = `<span class = "perfect">رائع !</span> <span class = "mark">الدرجة : ${rightAnswers} من ${count}</span>`;
        } else {
            theResults = `<span class = "bad">سيء !</span> <span class = "mark">الدرجة : ${rightAnswers} من ${count}</span>`;
        }

        results.innerHTML = theResults;
    }
}

function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countDownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitButton.click();
            }
        }, 1000);
    }
}