import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}>

type Question = {
  id: string;
} & FirebaseQuestions

type RoomParams = {
  id: string;
}

export function Room() {

  const { user, signInWithGoogle } = useAuth();

  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');
  
  const roomId = params.id as any;

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered
        }
      })

      setQuestions(parsedQuestions as any);
      setTitle(databaseRoom.title);
    })
  }, [roomId])

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
      </main>
    </div>
  )
}
