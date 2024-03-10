import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import { useAuth } from '../hooks/useAuth';

import IllustrationImg from '../assets/images/illustration.svg';
import LogoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { database } from '../services/firebase';

export function NewRoom() {

  const { user } = useAuth()
  const navigate = useNavigate();
  const [newRoom, setNewRoom] = useState('');

  async function handleCreateRoom(e: FormEvent) {
    e.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    navigate(`/rooms/${firebaseRoom.key}`)
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

        <h2 className='text-2xl mt-16 mb-6 font-[Poppins]'>Criar uma nova sala</h2>

        <form onSubmit={handleCreateRoom}>
          <input
            type="text"
            placeholder='Nome da sala'
            onChange={e => setNewRoom(e.target.value)}
            value={newRoom}
            className='w-full h-12 rounded-lg px-4 bg-white border border-[#a8a8b3]'
          />

          <Button 
            type='submit'>
            Criar sala
          </Button>
        </form>

        <p className='text-sm text-[#737380] mt-4'>
          Quer entrar em uma sala existente?&nbsp;
          <Link 
            to='/' 
            className='text-[#e559f9]'>
            Clique aqui
          </Link>
        </p>
      </div>
    </main>

  </div>
  )
}
