import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ className, ...props}: ButtonProps) => {

  const _className = twMerge('flex justify-center items-center mt-4 h-12 w-full rounded-lg font-medium bg-[#835afd] text-white px-8 cursor-pointer border-0 transition-all [&:not(:disabled)]:hover:brightness-90 disabled:opacity-60 disabled:cursor-not-allowed', className);
  
  return (
    <button className={_className} {...props} />
  )
}
