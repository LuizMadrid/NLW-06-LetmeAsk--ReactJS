import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { QuestionComponent } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string;
}

export function Room() {

  const { user, signInWithGoogle } = useAuth();

  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  
  const roomId = params.id as any;

  const { title, questions } = useRoom(roomId);

  async function handleSendQuestion(e: FormEvent) {
    e.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id
      });
    }
  }

  async function handleLogin() {
    if (!user) {
      await signInWithGoogle();
    }
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
          <RoomCode code={roomId} />
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

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder='O que você quer perguntar?'
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
            className='w-full border border-gray-200/50 p-4 rounded-lg bg-[#fefefe] shadow-lg resize-y min-h-32 max-h-80 focus:outline-none focus:border-[#835afd] transition-all duration-200'
          />

          <div className='flex items-center justify-between mt-4'>
            {!user ? (
              <span className='text-sm text-[#737388] font-medium'>
                Para enviar uma pergunta,&nbsp;
                <button className='bg-transparent border-none text-[#835afd] underline text-sm cursor-pointer font-medium' onClick={handleLogin}>faça seu login</button>
                .
              </span>
            ) : (
              <div className='flex items-center'>
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className='rounded-full size-8'
                />

                <div className='ml-2 text-[#29292e] font-medium text-sm space-x-1'>
                  <span>{user.name.split(' ')[0]}</span>
                  <span>{user.name.split(' ')[1]}</span>
                </div>
              </div>
            )}
            <Button type='submit' className='m-0 w-fit' disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>

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
                  <button 
                    aria-label='Marcar como gostei'
                    className={`border-none px-3 py-1 rounded-md cursor-pointer flex text-end text-[#737380] gap-2 hover:brightness-75 ${question.likeId ? 'bg-[#835afd] text-white' : ''}`}
                    onClick={() => handleLikeQuestion(question.id, question.likeId)}>
                    {question.likeCount > 0 &&
                      <span>{question.likeCount}</span>
                    }
                    
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`size-6 hover:fill-[#73738050] transition-all duration-200 ${question.likeId ? 'fill-white hover:fill-white' : ''}`}>
                      <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </QuestionComponent>
            )
          })}
        </div>
      </main>
    </div>
  )
}
