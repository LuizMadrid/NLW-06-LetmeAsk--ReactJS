import { useNavigate, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { QuestionComponent } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}

export function AdminRoom() {

  const navigate = useNavigate();
  const params = useParams<RoomParams>();
  const roomId = params.id as any;

  const { title, questions } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    navigate('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    if (window.confirm('Tem certeza que você deseja marcar esta pergunta como respondida?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true
      });
    }
  }

  async function handleHighLightQuestion(questionId: string) {
    const questionRef = database.ref(`rooms/${roomId}/questions/${questionId}`);
    const questionSnapshot = await questionRef.get();
    const isHighlighted = questionSnapshot.val()?.isHighlighted || false;

    await questionRef.update({
      isHighlighted: !isHighlighted
    });
  }

  return (
    <div>
      <header className='p-6 border-b border-[#e2e2e2]'>
        <div className='flex items-center justify-between max-w-6xl mx-auto'>
          <img 
            src={logoImg} 
            alt="let me ask Logo" 
            className='max-h-11'
          />
          <div className='flex gap-2'>
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom} className='bg-transparent h-10 w-fit border m-0 border-[#835afd] text-[#835afd]'>Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main className='max-w-4xl mx-auto'>
        <div className='flex items-center mt-8 mb-6'>
          <h1 className='font-[Poppins] text-2xl text-[#29292e]'>Sala {title}</h1>
          {questions.length > 0 && 
            questions.length === 1 ? (
              <span className='ml-4 bg-[#e559f9] rounded-full py-2 px-4 text-white font-medium text-sm'>{questions.length} pergunta</span>
            ) : (
              <>
                {questions.length >= 99 ? (
                  <span className='ml-4 bg-[#e559f9] rounded-full py-2 px-4 text-white font-medium text-sm'>99+ perguntas</span>
                  ) : (
                  <span className='ml-4 bg-[#e559f9] rounded-full py-2 px-4 text-white font-medium text-sm'>{questions.length} perguntas</span>
                )}
              </>
            )
          }
        </div>

        <div className='mt-8 space-y-2'>
          {questions.map(question => {
            return (
              <QuestionComponent
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}>
                
                {!question.isAnswered && (
                  <div className='space-x-2'>
                    <button
                      type='button'
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                      <img src={checkImg} alt="icon" />
                    </button>

                    <button
                      type='button'
                      onClick={() => handleHighLightQuestion(question.id)}>
                      <img src={answerImg} alt="icon" />
                    </button>

                    <button
                      type='button'
                      onClick={() => handleDeleteQuestion(question.id)}>
                      <img src={deleteImg} alt="icon" />
                    </button>
                  </div>
                )}
              </QuestionComponent>
            )
          })}
        </div>
      </main>
    </div>
  )
}
