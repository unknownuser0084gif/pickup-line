import { useRef, useState } from "react";
import BoxInput from "./BoxInput";
import { Get } from "../utils/Storage";
import { saveData } from "../utils/db";
import { toast } from "react-toastify";

export default function Navbar({ refresh }) {

       const [open, setOpen] = useState(false);
       const [newInput, setNewInput] = useState([1]);
       const frm = useRef()

       const handleForm = e => {
              e.preventDefault()
              // form serialize
              const form = new FormData(e.target)
              const formValues = Object.fromEntries(form)
              const values = Object.values(formValues);
              if (formValues.title === "" || formValues.name1 === "") {
                     toast.error("خالی نفرس!", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            theme: "light"
                     });
                     return
              }
              // main obj
              const mainData = {
                     id: Get("data").length + 1,
                     title: values[0],
                     messages: []
              }
              // seprate data
              for (let i = 1; i < values.length; i++) {
                     mainData.messages.push({
                            id: i,
                            titleId: Get("data").length + 1,
                            text: values[i]
                     })
              }
              // create new data
              const newData = [...Get("data"), mainData];
              toast.info("صبر کن یه چن لحظه تا اد بشه", {
                     position: "top-right",
                     autoClose: 5000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: false,
                     draggable: true,
                     theme: "light"
              });
              // save in DB
              saveData(r => {
                     toast.success("دیتا اد شد 👍", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            theme: "light"
                     });
                     frm.current.reset()
                     setOpen(false);
                     refresh(prev => prev + 1)
              }, newData);

       }

       return (
              <>
                     <div
                            onClick={() => setOpen(true)}
                            className="w-full mt-2 rounded-lg p-2 cursor-pointer bg-blue-300 text-center"
                     >
                            ایجاد پیکاب جدید
                     </div>
                     {/* ///////------nav modal------///// */}
                     <div
                            className={`${open ? "opacity-100" : "opacity-0 pointer-events-none"} fixed w-full h-dvh transition-all font-main inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-99999`}
                            onClick={() => setOpen(false)}
                            dir="rtl"
                     >
                            <div
                                   className={`${open ? "top-0" : "top-4"} w-9/10 max-h-9/10 scrollbar-hidden bg-white transition-all  text-black  rounded-2xl shadow-lg py-8 px-6 max-w-lg relative overflow-auto`}
                                   onClick={(e) => e.stopPropagation()}
                            >
                                   {/* close btn */}
                                   <button className="absolute top-2 right-1 text-black cursor-pointer px-1.5 rounded-full " onClick={() => setOpen(false)}>
                                          <svg xmlns="http://www.w3.org/2000/svg" className="fill-box_primary size-6" viewBox="0 0 32 32" version="1.1">
                                                 <path d="M16 0c-8.836 0-16 7.163-16 16s7.163 16 16 16c8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 30.032c-7.72 0-14-6.312-14-14.032s6.28-14 14-14 14 6.28 14 14-6.28 14.032-14 14.032zM21.657 10.344c-0.39-0.39-1.023-0.39-1.414 0l-4.242 4.242-4.242-4.242c-0.39-0.39-1.024-0.39-1.415 0s-0.39 1.024 0 1.414l4.242 4.242-4.242 4.242c-0.39 0.39-0.39 1.024 0 1.414s1.024 0.39 1.415 0l4.242-4.242 4.242 4.242c0.39 0.39 1.023 0.39 1.414 0s0.39-1.024 0-1.414l-4.242-4.242 4.242-4.242c0.391-0.391 0.391-1.024 0-1.414z" />
                                          </svg>
                                   </button>
                                   {/* container */}
                                   <div className="w-full mt-4 space-y-4">

                                          <form onSubmit={e => handleForm(e)} className="w-full space-y-4" ref={frm}>
                                                 <div className="flex gap-x-2 items-center">
                                                        <input type="text" placeholder="عنوان" name="title" className="w-full border border-neutral-400 rounded-md p-3 placeholder:text-md transition-all outline-1 outline-neutral-400 focus:outline-cyan-500 focus:border-cyan-500 duration-400" />
                                                 </div>

                                                 {
                                                        newInput.map(item => (
                                                               <BoxInput key={item} name={item} boy={(item % 2 !== 0) ? true : false} />
                                                        ))
                                                 }

                                                 <div className="w-full flex gap-x-1">
                                                        <button type="submit" className="w-8/10 py-2 rounded-lg mt-6 cursor-pointer bg-blue-300">ثبت</button>
                                                        <button type="button" className="w-2/10 py-2 rounded-lg mt-6 cursor-pointer bg-red-300" onClick={() => setNewInput(prev => [...prev, prev.length + 1])}>ادامه!</button>
                                                 </div>
                                          </form>

                                   </div>
                            </div>
                     </div>
              </>
       )
}