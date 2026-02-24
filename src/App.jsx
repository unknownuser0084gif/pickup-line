import { motion } from "framer-motion"
import { useEffect, useState, useRef, useCallback } from "react"
import { Accordion } from "./components/Accordion"
import { AccordionItem } from "./components/AccordionItem"
import Navbar from "./components/Navbar"
import { loadData, saveData } from "./utils/db"
import { Add, Get } from "./utils/Storage"
import { ToastContainer, toast } from "react-toastify";
import BoxInput from "./components/BoxInput"

function App() {

       const frm = useRef()

       const [open, setOpen] = useState(false);
       const [refresh, setRefresh] = useState(0);
       const [totalData, setTotalData] = useState([]);
       const [search, setSearch] = useState({
              title: [],
              text: []
       });
       const [newInput, setNewInput] = useState([1]);
       const [openEditor, setOpenEditor] = useState(false);
       const [editorData, setEditorData] = useState(null);

       const handleSearch = useCallback(e => {
              e.preventDefault()
              const data = Get("data");

              const form = new FormData(e.target)
              const values = Object.fromEntries(form)

              // empty input
              if (values.search === "" || values.search === null) return;

              // by title
              const filtredByTitle = data.filter(item => item.title.includes(values.search))
              setSearch(prev => ({ ...prev, title: filtredByTitle }))

              // by content
              const filtreded = data.map(item => item.messages).flat()
              const filtredByText = filtreded.filter(item => item.text.includes(values.search))
              const uniqeFiltredByText = [];
              const seen = new Set()
              for (const item of filtredByText) {
                     if (!seen.has(item.titleId)) {
                            seen.add(item.titleId)
                            uniqeFiltredByText.push(item)
                     }
              }
              const saveContainerFiltredByText = []
              data.forEach(dataElem => {
                     uniqeFiltredByText.forEach(uElem => {
                            if (dataElem.id === uElem.titleId) saveContainerFiltredByText.push(dataElem)
                     })
              });
              setSearch(prev => ({ ...prev, text: saveContainerFiltredByText }))
              setOpen(false)
       }, [])
       const handleEdit = useCallback((id) => {
              const thisOne = Get("data").filter(item => item.id === id)[0];
              setOpenEditor(true)
              setEditorData(thisOne)
              setNewInput(thisOne.messages.map(item => item.id))
       }, [])
       const handleEditForm = useCallback(e => {
              e.preventDefault()
              const id = Number(frm.current.dataset.id);
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
              // filter this item 
              const totalDataWithoutThisOne = Get("data").filter(item => item.id !== id);
              // main obj
              const mainData = {
                     id: Math.floor(Math.random() * 3546123) * Get("data").length * Math.floor(Math.random() * 123),
                     title: values[0],
                     messages: []
              }

              // seprate data
              for (let i = 1; i < values.length; i++) {
                     mainData.messages.push({
                            id: i,
                            titleId: mainData.id,
                            text: values[i]
                     })
              }

              // create new data
              const newData = [...totalDataWithoutThisOne, mainData];

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
                     frm.current.reset()
                     setOpenEditor(false);
                     setRefresh(prev => prev + 1);
                     setNewInput([1])
              }, newData);
       }, [])

       // mounting
       useEffect(() => {
              // load data
              loadData(data => {
                     setTotalData(data.record)
                     Add("data", data.record)
              })

       }, [])

       // remove last data from form
       useEffect(() => {
              if (openEditor === false) {
                     frm.current.reset();
                     setEditorData(null);
              }
       }, [openEditor])

       // refresh page
       useEffect(() => {
              if (refresh === 0) return;
              // load data
              loadData(data => {
                     setTotalData(data.record)
                     Add("data", data.record)
              })

       }, [refresh])

       return (
              <section className="max-w-md min-h-dvh mx-auto bg-gray-200/60 relative" dir="rtl">
                     {/* toast */}
                     <ToastContainer />

                     {/* main */}
                     <main className="max-w-md min-w-full fixed max-h-8/10 overflow-auto">
                            {/* SEARCH */}
                            {(search.title.length != 0 || search.text.length != 0) ? (
                                   <div className="max-w-md max-h-8/10 overflow-auto px-6 py-4  space-y-8">
                                          {/* TITLE BASE */}
                                          {
                                                 search.title.length ? (
                                                        <>

                                                               <h1 className="w-full py-2 mb-4 border-b border-neutral-400 mx-auto text-amber-600">بر اساس عنوان</h1>
                                                               <Accordion>

                                                                      {
                                                                             search.title.map(item => (
                                                                                    <AccordionItem key={item.id} eventKey={item.id} className="bg-black/5 rounded-lg">
                                                                                           {/* btn */}
                                                                                           <p className="w-fit px-2 py-3">{item.title}</p>
                                                                                           {/* content */}
                                                                                           <div className="w-full space-y-4 p-4 text-gray-800">

                                                                                                  {
                                                                                                         item.messages.map(msg => (
                                                                                                                <div key={msg.id} className={`w-4/5 p-3 rounded-xl ${msg.id % 2 ? "bg-green-200 ms-0 me-auto" : "bg-pink-200 ms-auto me-0"}`}>
                                                                                                                       {msg.text}
                                                                                                                </div>
                                                                                                         ))
                                                                                                  }

                                                                                           </div>
                                                                                    </AccordionItem>
                                                                             ))
                                                                      }

                                                               </Accordion>
                                                        </>
                                                 ) : ""
                                          }

                                          {
                                                 search.text.length ? (
                                                        <>
                                                               {/* CONTENT BASE */}
                                                               <h1 className="w-full py-2 mb-4 border-b border-neutral-400 mx-auto text-pink-600">بر اساس محتوا</h1>
                                                               <Accordion>
                                                                      {
                                                                             search.text.map(item => (
                                                                                    <AccordionItem key={item.id} eventKey={item.id} className="bg-black/5 rounded-lg">
                                                                                           {/* btn */}
                                                                                           <p className="w-fit px-2 py-3">{item.title}</p>
                                                                                           {/* content */}
                                                                                           <div className="w-full space-y-4 p-4 text-gray-800">

                                                                                                  {
                                                                                                         item.messages.map(msg => (
                                                                                                                <div key={msg.id} className={`w-4/5 p-3 rounded-xl ${msg.id % 2 ? "bg-green-200 ms-0 me-auto" : "bg-pink-200 ms-auto me-0"}`}>
                                                                                                                       {msg.text}
                                                                                                                </div>
                                                                                                         ))
                                                                                                  }

                                                                                           </div>
                                                                                    </AccordionItem>
                                                                             ))
                                                                      }
                                                               </Accordion>
                                                        </>
                                                 ) : ""
                                          }

                                   </div>
                            ) : ""}
                            {/* ALL */}
                            <div className="max-w-md max-h-8/10 overflow-auto px-6 py-4">
                                   <h1 className="w-full py-2 mb-4 border-b border-neutral-400 mx-auto text-blue-500">  همه پیکاب ها</h1>
                                   {totalData.length ? (
                                          <Accordion>
                                                 {
                                                        totalData.length ? (
                                                               totalData.map(item => (
                                                                      <AccordionItem editing={handleEdit} refresh={setRefresh} eventId={item.id} key={item.id} eventKey={item.id} className="bg-black/5 rounded-lg">
                                                                             {/* btn */}
                                                                             <p className="w-fit px-2 py-3">{item.title}</p>
                                                                             {/* content */}
                                                                             <div className="w-full space-y-4 p-4 text-gray-800">

                                                                                    {
                                                                                           item.messages.map(msg => (
                                                                                                  <div key={msg.id} className={`w-4/5 p-3 rounded-xl ${msg.id % 2 ? "bg-green-200 ms-0 me-auto" : "bg-pink-200 ms-auto me-0"}`}>
                                                                                                         {msg.text}
                                                                                                  </div>
                                                                                           ))
                                                                                    }

                                                                             </div>
                                                                      </AccordionItem>
                                                               ))
                                                        ) : ""
                                                 }
                                          </Accordion>
                                   ) : "Loading..."}
                            </div>
                     </main>

                     {/* bg black */}
                     <motion.div
                            className="fixed top-0 backdrop-blur-[1px] w-md mx-auto min-h-dvh bg-black/30"
                            initial={{
                                   opacity: 0,
                                   pointerEvents: "none"
                            }}
                            animate={{
                                   opacity: open ? 1 : 0,
                                   pointerEvents: open ? "auto" : "none"
                            }}
                     ></motion.div>

                     {/* search container */}
                     <motion.div
                            className="fixed w-full max-w-md rounded-t-[3rem] bottom-0 bg-neutral-200 px-8 pt-10"
                            initial={{
                                   height: "0%"
                            }}
                            animate={{
                                   height: open ? "75%" : "20%"
                            }}
                            transition={{
                                   duration: 0.4,
                                   ease: "backOut"
                            }}
                     >

                            <div className="relative">
                                   {/* button close */}
                                   <motion.span
                                          onClick={() => setOpen(prev => !prev)}
                                          className="absolute -top-14 left-1/2 -translate-x-1/2 cursor-pointer size-10 text-lg rounded-full flex justify-center items-center bg-neutral-200"
                                          initial={{
                                                 rotate: "90deg"
                                          }}
                                          animate={{
                                                 rotate: open ? "90deg" : "270deg"
                                          }}
                                          transition={{
                                                 duration: 0.8,
                                                 ease: "backOut"
                                          }}
                                   >
                                          &#10170;
                                   </motion.span>
                                   {/* input search */}
                                   <form className="relative w-full" onSubmit={handleSearch}>
                                          <input onFocus={() => setOpen(true)} id="inp" name="search" type="text" className="w-full border border-neutral-400 rounded-md p-3 placeholder:text-md transition-all outline-1 outline-neutral-400 focus:outline-cyan-500 focus:border-cyan-500 duration-400" placeholder="یک کلمه کافیه 😉" />
                                          <button type="submit" className="inline absolute top-[0.8rem] left-2.5 cursor-pointer scale-180 rotate-270 text-neutral-500" >&#10170;</button>
                                   </form>
                                   <div>
                                          <Navbar refresh={setRefresh} />
                                   </div>
                            </div>


                     </motion.div>

                     {/* editor box */}
                     <div
                            className={`${openEditor ? "opacity-100" : "opacity-0 pointer-events-none"} fixed w-full h-dvh transition-all font-main inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-99`}
                            onClick={() => setOpenEditor(false)}
                            dir="rtl"
                     >
                            <div
                                   className={`${openEditor ? "top-0" : "top-4"} w-9/10 max-h-9/10 scrollbar-hidden bg-white transition-all  text-black  rounded-2xl shadow-lg py-8 px-6 max-w-lg relative overflow-auto`}
                                   onClick={(e) => e.stopPropagation()}
                            >
                                   {/* close btn */}
                                   <button className="absolute top-2 right-1 text-black cursor-pointer px-1.5 rounded-full " onClick={() => setOpenEditor(false)}>
                                          <svg xmlns="http://www.w3.org/2000/svg" className="fill-box_primary size-6" viewBox="0 0 32 32" version="1.1">
                                                 <path d="M16 0c-8.836 0-16 7.163-16 16s7.163 16 16 16c8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 30.032c-7.72 0-14-6.312-14-14.032s6.28-14 14-14 14 6.28 14 14-6.28 14.032-14 14.032zM21.657 10.344c-0.39-0.39-1.023-0.39-1.414 0l-4.242 4.242-4.242-4.242c-0.39-0.39-1.024-0.39-1.415 0s-0.39 1.024 0 1.414l4.242 4.242-4.242 4.242c-0.39 0.39-0.39 1.024 0 1.414s1.024 0.39 1.415 0l4.242-4.242 4.242 4.242c0.39 0.39 1.023 0.39 1.414 0s0.39-1.024 0-1.414l-4.242-4.242 4.242-4.242c0.391-0.391 0.391-1.024 0-1.414z" />
                                          </svg>
                                   </button>
                                   {/* container */}
                                   <div className="w-full mt-4 space-y-4">

                                          <form onSubmit={e => handleEditForm(e)} data-id={editorData && editorData.id} className="w-full space-y-4" ref={frm}>
                                                 <div className="flex gap-x-2 items-center">
                                                        <input type="text" placeholder="عنوان" name="title" defaultValue={editorData && editorData.title} className="w-full border border-neutral-400 rounded-md p-3 placeholder:text-md transition-all outline-1 outline-neutral-400 focus:outline-cyan-500 focus:border-cyan-500 duration-400" />
                                                 </div>

                                                 {
                                                        newInput.map(item => (
                                                               <BoxInput key={item} dValue={(editorData && editorData.messages[item - 1]) ? editorData.messages[item - 1].text : null} name={item} boy={(item % 2 !== 0) ? true : false} />
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

              </section>
       )
}

export default App
