import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

import { database } from '../services/firebase';

import LogoImg from '../assets/images/logo.svg';
import googleIconImage from '../assets/images/google-icon.svg';
import IllustrationImg from '../assets/images/illustration.svg';

import { Button } from '../components/Button';

export function Home() {

  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    navigate('/rooms/new')
  }

  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    if (roomRef.val().endedAt) {
      alert('Room already closed.');
      return;
    }

    navigate(`/rooms/${roomCode}`)
  }

  return (
    <div className='flex items-stretch h-screen'>

      <aside className='flex flex-[6] flex-col justify-center py-32 px-20 bg-[#835afd] text-white'>
        <img 
          src={IllustrationImg} 
          alt="Background" 
          className='max-w-80' 
        />
        <strong className='font-normal text-4xl font-[Poppins] mt-4'>Crie salas de Q&amp;A ao-vivo.</strong>
        <p className='text-2xl mt-4 text-[#f8f8f8]'>Tire dúvidas de sua audiência ao-vivo</p>
      </aside>

      <main className='flex flex-[8] items-center justify-center px-8'>
        <div className='flex flex-col items-stretch w-full text-center max-w-80'>
          <img 
            src={LogoImg} 
            alt="let me ask Logo" 
            className='self-center'
          />

          <button 
            onClick={handleCreateRoom}
            className='flex justify-center items-center mt-16 h-12 rounded-lg font-medium bg-[#ea4335] text-white cursor-pointer border-0 transition-all hover:brightness-90'>
            <img 
              src={googleIconImage} 
              alt="google icon" 
              className='mr-2'
            />
            <span>Crie sua sala com o Google</span>
          </button>

          <div className='flex items-center text-sm text-[#a8a8b3] my-8 before:flex-[1] before:h-px before:bg-[#a8a8b3] before:mr-4 after:flex-[1] after:h-px after:bg-[#a8a8b3] after:ml-4'>ou entre em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder='Digite o código da sala'
              onChange={e => setRoomCode(e.target.value)}
              value={roomCode}
              className='w-full h-12 rounded-lg px-4 bg-white border border-[#a8a8b3]'
            />

            <Button
              type='submit'>
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>

    </div>
  )
}
