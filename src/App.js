import React from "react"
import './App.css';
import Question from "./components/Question";
import shapeTop from "./assets/images/shape-1.png";
import shapeBottom from "./assets/images/shape-2.png";

function App() {
  
    const [gameStart ,  setGameStart] = React.useState(false)
    const [questionData, setQuestionData] =React.useState([])
    const [allComplete, setAllComplete] = React.useState(false)
    const [showAnswers, setShowAnswers] = React.useState(false)
    const [scoreCount, setScoreCount] = React.useState(0)
    
    

    React.useEffect(() => {
        async function question(){
            const response = await fetch (`https://opentdb.com/api.php?amount=5&category=31&difficulty=medium&type=multiple`)
            const data = await response.json()
            setQuestionData(data.results.map(function(question) {
                return({question:question.question,
                        options:question.incorrect_answers.concat([question.correct_answer]).map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value),
                        selected_answer: undefined,
                        correct_answer:question.correct_answer})}))

        }
        question()
    }, [])
       
    
   React.useEffect(() => {
    var count = 0;
    for(var i = 0; i < questionData.length; i++)
    {
      if (typeof questionData[i].selected_answer !== 'undefined')
      {
        if(questionData[i].options[questionData[i].selected_answer] === questionData[i].correct_answer)
        {
          count++;
        }
      }
    }
    setScoreCount(count)
},[ questionData])

    React.useEffect(() => {
        const done = questionData.every(question => question.selected_answer !== undefined)
        if (done){
            setAllComplete(true)
        }
    }, [questionData])

    function startGame(){
        setGameStart(true)
    }
    function selectAnswer(event,quest_id,option_id)
    {
        setQuestionData(function(prev) {
            return(questionData.map(function(quest,qid) {
                if(quest_id===qid){
                    return({...quest, selected_answer:option_id})
                }else{
                    return(quest)
                }
                
            }))
        })
    }
    function checkAnswers()
    {
        setShowAnswers(true)
    }
     
    function playAgain(){
        setGameStart(false)
        setAllComplete(false)
        setShowAnswers(false)
    }
  

    const renderQuestion = questionData.map(function(question,index){
        return (
            <Question 
                
            key={index}
            question={question}
            showAnswers={showAnswers}
            selectAnswer={selectAnswer}
            id={index}
            checkAnswer ={checkAnswers}

            
            
            />
        )
    })
    return(
        <main>
            <img className="shape-top" src={shapeTop} alt="Shape Top" />
            {!gameStart ? 
            <section className="start-container">
						<h1 className="start-container-title">AniManga Quizzical</h1>
						<p className='start-container-subtitle'>Answer the questions and test your AniManga knowledge!</p>
                       
                            <button className="start-container-button" onClick={startGame}>Start Quiz</button>
					</section>
        :  <div className="quiz-container">
            {renderQuestion}
            {showAnswers ? 
                    <div className='button-container'>
                        <h3 className='button-container-score'>You scored {scoreCount}/5 correct answers</h3>
                        <button className='button' onClick={playAgain}>Play Again</button>
                    </div> 
                    :
                    <button className='button' disabled={!allComplete} onClick={checkAnswers}>Check Answers</button>}
            
            </div>}
            <img className="shape-bottom" src={shapeBottom} alt="Shape Bottom" />
        </main>
    )
}

export default App;
