"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { projectHmrEvents } from 'next/dist/build/swc/generated-native';

interface UserAnswers {
  [key: number]: string | undefined
}

const TestPage = () => {
  const params = useParams();
  const testId = params.testid as string;
  
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const[fetchedUserAnswers,setFetchedUserAnswers] = useState<any[]>([])
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [skippedAnswers, setSkippedAnswers] = useState(0);
  const[onSubmitClick,setOnSubmitClick] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    setLoading(true);
    let tempTestData = {}
    const fetchTest = async () => {
      try{
        let token = '';
      if(typeof window !== 'undefined'){
        token = localStorage.getItem('authToken')!;
      }
      const test = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tests/get-test/${testId}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTest(test.data.test);
      setLoading(false);
      setIsSubmitted(test.data.test.isCompleted)
      tempTestData=test.data.test
      }catch(err){
        console.error("error while fetcing test",err)
      }

    };    
    const evaluateTest = async()=>{
      try{
        let token = '';
      if(typeof window !== 'undefined'){
        token = localStorage.getItem('authToken')!;
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tests/evaluate-test`,{
        testId,
        userAnswers
      },{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setTest(response.data.test)
      const testResults = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tests/get-test-results/${testId}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if(testResults.data.testResults){
        console.log(testResults.data.testResults)
        setFetchedUserAnswers(testResults.data.testResults.userAnswers)
        
        // Transform the userAnswers array into an object
        const transformedUserAnswers = testResults.data.testResults.userAnswers.reduce((acc: UserAnswers, curr: any, index: number) => {
          acc[index] = curr.answer;
          return acc;
        }, {})
        
        setUserAnswers(transformedUserAnswers)
      }

      setScore(testResults.data?.testResults?.score)
      setCorrectAnswers(testResults.data?.testResults?.correctAnswers)
      setIncorrectAnswers(testResults.data?.testResults?.incorrectAnswers)
      setSkippedAnswers(testResults.data?.testResults?.skippedAnswers)

      }catch(err){
        console.error("error while fetching results",err)
      }
    }
 
     fetchTest();

      setTimeout(()=>{
        //@ts-ignore
        if(tempTestData?.isCompleted){
          console.log("now test come")
          evaluateTest()
        }
      },2000)
      

  }, [testId]);


  const handleSubmitTest = async () => {
    setShowConfirmDialog(true);
  }

  const confirmSubmit = async () => {
    setShowConfirmDialog(false);
    setLoading(false);
    try {
      let token = '';
      if(typeof window !== 'undefined'){
        token = localStorage.getItem('authToken')!;
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tests/evaluate-test`,{
        testId,
        userAnswers
      },{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setTest(response.data.test)
      setIsSubmitted(true)
       const {newScore,newCorrectAnswers,totalQuestions,totalAnsweredQuestions} = await evaluateAnswers(userAnswers,test.questions)
       setScore(newScore)
       setCorrectAnswers(newCorrectAnswers)
       setIncorrectAnswers(totalQuestions-newCorrectAnswers)
       setSkippedAnswers(totalAnsweredQuestions-Object.keys(userAnswers).length)

       console.log(newScore,newCorrectAnswers,totalQuestions,totalAnsweredQuestions)

        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tests/submit-test`,{
          testId,
          userAnswers,
          score:newScore,
          isCompleted:true,
          isSubmitted:true,
          correctAnswers:newCorrectAnswers,
          incorrectAnswers:totalQuestions-newCorrectAnswers,
          skippedAnswers:totalAnsweredQuestions-Object.keys(userAnswers).length
        },{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
         setLoading(false)

         
    }catch(error){
      console.error("error while submitting test: ",error)
    }finally{
      setLoading(false)
    }
         
  }

  const evaluateAnswers = async(userAnswers:UserAnswers,questions:any)=>{
    let newScore = 0;
    let newCorrectAnswers = 0;
    const userAnswersArray = Object.values(userAnswers)
    let totalQuestions = questions.length
    let totalAnsweredQuestions = Object.keys(userAnswers).length
    console.log(userAnswersArray)
     for(let i=0;i<questions.length;i++){
      
        if(userAnswersArray[i]?.trim() === questions[i].correctAnswer?.trim()){
          console.log(userAnswersArray[i].trim(),questions[i].correctAnswer.trim())
            newScore+=10
            newCorrectAnswers+=1
        }
     }
     console.log(newScore)
     setUserAnswers((prev:any)=>({...prev,}))
     setIsSubmitted(true)
     setCorrectAnswers(correctAnswers)
     setIncorrectAnswers(questions.length-correctAnswers)
     setSkippedAnswers(questions.length-Object.keys(userAnswers).length)
     setAnsweredQuestions(Object.keys(userAnswers).length)

    

     return {newScore,newCorrectAnswers,totalQuestions,totalAnsweredQuestions}

     
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Skeleton Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-4"></div>
            <div className="flex gap-3 mb-6">
              <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-32 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-28 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded-full w-full"></div>
          </div>

          {/* Skeleton Questions */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-8 mb-8 animate-pulse">
              <div className="h-6 bg-gray-200 rounded-md w-full mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-12 bg-gray-200 rounded-md"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border-4 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 text-xl">
            <span className="font-black text-2xl border-2 border-black px-3 py-1">
              404
            </span>
            <h1 className="font-bold">Test Not Found</h1>
          </div>
          <p className="mt-4 text-gray-600">
            The test you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Test Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-4 text-[#1B4D3E]">{test.title}</h1>
            <div className="flex flex-wrap gap-3">
              <span className={`px-4 py-2 rounded-full font-medium ${
                test.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                test.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
              </span>
              <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium">
                {test.numQuestions} Questions
              </span>
              <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-800 font-medium">
                {test.topic}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{answeredQuestions} of {test.questions.length} answered</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#1B4D3E] rounded-full transition-all duration-300"
                style={{
                  width: `${answeredQuestions/test.questions.length*100}%`
                }}
              />
            </div>
          </div>

          {/* Enhanced Scorecard */}
          {isSubmitted && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 border-3 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-6">
              {/* Header */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="font-black text-2xl text-black">TEST COMPLETED!</h2>
              </div>

              {/* Score Display */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center">
                    <div className="text-center">
                      <span className="block text-4xl font-black">{score}</span>
                      <span className="text-sm font-bold text-gray-600">POINTS</span>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-sm font-bold px-3 py-1 border-2 border-black transform rotate-6">
                    {Math.round((correctAnswers / test.questions.length) * 100)}%
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border-2 border-black p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="block text-2xl font-black text-green-600">{correctAnswers}</span>
                  <span className="text-sm font-bold text-gray-600">Correct</span>
                </div>
                
                <div className="bg-white border-2 border-black p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="block text-2xl font-black text-red-600">{incorrectAnswers}</span>
                  <span className="text-sm font-bold text-gray-600">Incorrect</span>
                </div>
                
                <div className="bg-white border-2 border-black p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                  <span className="block text-2xl font-black text-gray-600">{skippedAnswers}</span>
                  <span className="text-sm font-bold text-gray-600">Skipped</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {test.questions.map((q: any, idx: number) => (
            <div 
              key={idx} 
              className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
            >
              {/* Question Header */}
              <div className="bg-[#32bd93] border-b-4 border-black p-6">
                <p className="text-xl font-bold text-white flex items-center gap-3">
                  <span className="flex items-center justify-center bg-white text-black border-2 border-black w-10 h-10 rounded-none font-black">
                    {idx + 1}
                  </span>
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="p-6">
                <div className="space-y-4">
                  {q.options.map((option: string, optIdx: number) => {
                    const isCorrect = q.correctAnswer === option;
                    const isSelected = userAnswers[idx] === option;
                    let optionStyle = '';
                    
                    if (isSubmitted) {
                      if (isCorrect) {
                        optionStyle = 'bg-green-100 text-green-800 border-green-500';
                      } else if (isSelected) {
                        optionStyle = 'bg-red-100 text-red-800 border-red-500';
                      } else {
                        optionStyle = 'bg-white';
                      }
                    } else {
                      optionStyle = isSelected ? 'bg-[#1B4D3E] text-white' : 'bg-white hover:bg-gray-50';
                    }

                    return (
                      <div 
                        key={optIdx} 
                        onClick={() => !isSubmitted && setUserAnswers((prev: UserAnswers) => {
                          if(prev[idx] === option){
                            const newAnswer = {...prev};
                            delete newAnswer[idx];
                            setAnsweredQuestions(Object.keys(newAnswer).length);
                            return newAnswer;
                          }
                          const newAnswers = {...prev, [idx]: option};
                          setAnsweredQuestions(Object.keys(newAnswers).length);
                          return newAnswers;
                        })}
                        className={`flex items-center gap-4 p-4 cursor-pointer transition-all
                          border-3 border-black ${optionStyle} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                      >
                        <div className={`w-6 h-6 flex items-center justify-center border-2 border-black transition-all
                          ${isSelected ? 'bg-white' : 'bg-transparent'}`}
                        >
                          {(isSelected || (isSubmitted && isCorrect)) && (
                            <svg 
                              className={`w-4 h-4 ${isSubmitted && isCorrect ? 'text-green-600' : 
                                isSubmitted && isSelected ? 'text-red-600' : 'text-black'}`}
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="square" 
                                strokeLinejoin="round" 
                                strokeWidth={3} 
                                d="M5 13l4 4L19 7" 
                              />
                            </svg>
                          )}
                        </div>
                        <label className="flex-1 cursor-pointer font-bold">
                          {option}
                        </label>
                      </div>
                    );
                  })}
                </div>
              
                {/* Neo-Brutalist Explanation Card */}
                {(fetchedUserAnswers[idx] && test.isCompleted) && (
                  <div className="mt-6">
                    <div className="bg-yellow-100 border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-black text-lg border-2 border-black px-2 bg-white">
                          !
                        </span>
                        <p className="font-black text-black">EXPLANATION</p>
                      </div>
                      <p className="font-medium text-black">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {onSubmitClick && (
        <div>
          
        </div>
      )}

      {/* Submit Button and Confirmation Dialog */}
      <div className="fixed bottom-0 left-0 right-0 px-4">
        <div className="max-w-4xl mx-auto">
          {!isSubmitted && (
            <button 
              className="w-full bg-[#eb4b4b] text-white p-4 font-black text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
              hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
              onClick={handleSubmitTest}
            >
              SUBMIT TEST
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full">
            <h3 className="text-2xl font-black mb-4">Are you sure?</h3>
            <p className="text-gray-600 mb-6">
              Once submitted, you won't be able to change your answers. Make sure you've reviewed all questions.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 bg-gray-200 text-black p-3 font-bold border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
              >
                CANCEL
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 bg-[#eb4b4b] text-white p-3 font-bold border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;