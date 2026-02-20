import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Accordion } from "./components/Accordion"
import { AccordionItem } from "./components/AccordionItem"
import Navbar from "./components/Navbar"
import { loadData } from "./utils/db"
import { Add, Get } from "./utils/Storage"
import { ToastContainer } from "react-toastify"

function App() {

       const [open, setOpen] = useState(false);
       const [refresh, setRefresh] = useState(0);
       const [totalData, setTotalData] = useState([]);
       const [search, setSearch] = useState({
              title: [],
              text: []
       });

       const handleSearch = e => {
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
              // console.log(saveContainerFiltredByText)
              // console.log(data)
              // console.log(uniqeFiltredByText)
              setSearch(prev => ({ ...prev, text: saveContainerFiltredByText }))
              // console.log(filtredByText)
              // console.log(saveContainerThat)

              setOpen(false)
       }

       // mounting
       useEffect(() => {
              // load data
              loadData(data => {
                     setTotalData(data.record)
                     Add("data", data.record)
              })

       }, [])

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
                     <div className="max-w-md fixed max-h-8/10 overflow-auto">
                            {/* SEARCH */}
                            {(search.title.length != 0 || search.text.length != 0) ? (
                                   <div className="max-w-md max-h-8/10 overflow-auto px-6 py-4  space-y-8">
                                          {/* TITLE BASE */}
                                          {
                                                 search.title.length ? (
                                                        <>
                                                               {console.log(search.title)}

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
                                                        ) : ""
                                                 }
                                          </Accordion>
                                   ) : "Loading..."}
                            </div>
                     </div>

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

              </section>
       )
}

export default App
