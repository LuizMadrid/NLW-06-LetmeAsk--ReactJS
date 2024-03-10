import copyImg from '../assets/images/copy.svg';

type RoomCodeProps = {
  code: string;
}

export function RoomCode({ code }: RoomCodeProps) {

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code);
  }
  
  return (
    <button 
      className='h-10 rounded-lg overflow-hidden bg-white border border-[#835afd] cursor-pointer flex justify-center items-center'
      onClick={copyRoomCodeToClipboard}>
      <div className='bg-[#835afd] px-3 flex justify-center items-center h-full'>
        <img src={copyImg} alt="Copy RoomCode" />
      </div>
      <span className='block pl-3 pr-4 text-sm font-medium w-60'>Sala #{code}</span>
    </button>
  )
}
