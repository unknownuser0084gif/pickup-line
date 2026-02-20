import React from 'react'

export default function BoxInput({ boy = false, name }) {
       return (
              <div className={`w-4/5 p-3 rounded-xl ${boy ? "bg-green-200 ms-0 me-auto" : "bg-pink-200 ms-auto me-0"}`}>
                     <textarea name={`name${name}`} className="w-full border border-neutral-400 rounded-md p-3 placeholder:text-md transition-all outline-1 outline-neutral-400 focus:outline-cyan-500 focus:border-cyan-500 duration-400" placeholder="متنو خوب واضح بنویس با علامات نگارشی" ></textarea>
              </div>
       )
}
