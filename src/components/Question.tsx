import { ReactNode } from "react";

interface QuestionComponentProps {
  content: string;
  author: {
    name: string;
    avatar: string;
  }
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function QuestionComponent({ content, author, children, isAnswered = false, isHighlighted = false }: QuestionComponentProps) {
  return (
    <div 
      className={
        `
          bg-[#fefefe] rounded-lg shadow-lg p-6 border
          ${isAnswered ? 'bg-[#dbdcdd]' : ''}
          ${isHighlighted && !isAnswered ? 'border-[#835afd] bg-[#f4f0ff]' : ''}
        `
      }
    >
      <p className="text-[#29292e]">{content}</p>

      <footer className="flex items-center justify-between mt-6">
        <div className='flex items-center'>
          <img 
            src={author.avatar} 
            alt={author.name} 
            className='rounded-full size-8'
          />

          <div className='ml-2 text-[#737380] text-sm space-x-1'>
            <span>{author.name.split(' ')[0]}</span>
            <span>{author.name.split(' ')[1]}</span>
          </div>
        </div>

        <div>
          {children}
        </div>
      </footer>
    </div>
  )
}
