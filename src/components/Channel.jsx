import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { loadData, saveData } from "../utils/db_Channel";
import { Add, Get } from "../utils/Storage";
import { toast  , ToastContainer} from "react-toastify";

export default function Channel({ open, onClose }) {


     const [totalData, setTotalData] = useState([])
     // scroll to end
     const scrollToLastMessage = useRef(null)
     useEffect(() => {
          scrollToLastMessage.current.scrollIntoView()
     }, [open])

     // load again from db
     const gettingFromDB = () => {
          loadData(data => {
               setTotalData(data.record)
               Add("data_channel", data.record)
          })
     }

     // mounting
     useEffect(gettingFromDB, [])

     // submiting form
     const handleForm = e => {
          e.preventDefault()
          // form serialize
          const form = new FormData(e.target)
          const formValues = Object.fromEntries(form)
          const values = Object.values(formValues);
          // main obj
          const mainData = {
               id: Math.floor(Math.random() * 3546123),
               body: values[0]
          }
          // create new data
          const newData = [...Get("data_channel"), mainData];
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
                    pauseOnFocusLoss: false,
                    draggable: true,
                    theme: "light"
               });
               e.target.reset()
               gettingFromDB()
          }, newData);

     }

     return createPortal(
          <>
               <section className="fixed w-full sm:w-md h-dvh bg-gray-200 top-0 left-1/2 -translate-x-1/2 " style={{ display: open ? "block" : "none" }} dir="rtl">
                    {/* toast */}
                    <ToastContainer />
                    {/* header */}
                    <div className="w-full py-4 px-6 flex justify-between" dir="ltr">
                         {/* icon back */}
                         <span className="rounded-full size-8 flex justify-center items-center cursor-pointer" onClick={() => onClose(false)} >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                              </svg>
                         </span>
                         {/* title */}
                         <h1 className="text-xl">
                              کانال رشد
                         </h1>
                    </div>
                    {/* content */}
                    <div className="w-full bg-chat">
                         {/* items */}
                         <div className="w-full space-y-4 overflow-y-auto h-[calc(100dvh-7.5rem)] scb">
                              {/* space */}
                              <div className="mt-1"> </div>
                              {/* items */}
                              {
                                   totalData.length ? (
                                        totalData.map(item => (
                                             <div key={item.id} dir="rtl" className="relative max-w-xs p-4 bg-neutral-50 rounded-xl rounded-bl-none ms-auto me-2 mt-0 ">
                                                  {/* title */}
                                                  <span className="absolute top-1.5 text-neutral-400 left-2 text-xs">کانال رشد</span>
                                                  {/* content */}
                                                  <p className="mt-2.5">
                                                       {item.body}
                                                  </p>
                                             </div>
                                        ))
                                   ) : "Loading..."
                              }
                              {/*space  */}
                              <div className="w-full py-0.5" ref={scrollToLastMessage}></div>
                         </div>
                         {/* input */}
                         <form className="w-full py-2 px-1 absolute bottom-0 left-0" onSubmit={handleForm}>
                              <textarea type="text" required placeholder="متن بنویسید" rows={1} className="w-full bg-neutral-100 rounded-full py-2 px-4 border-none focus:outline-2 focus:outline-neutral-400 " name="body" id="" ></textarea>
                              <button type="submit" className="absolute bottom-6 left-4 cursor-pointer">
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                   </svg>
                              </button>
                         </form>
                    </div>
               </section>
          </>
          ,
          document.body
     )
}