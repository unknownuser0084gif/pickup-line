import { saveData } from "../utils/db";
import { Add, Get } from "../utils/Storage";
import { useAccordion } from "./Accordion";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";


export function AccordionItem({ refresh, eventId, eventKey, children, editing, className = null }) {

       const { activeKeys, toggleItem, alwaysOpen } = useAccordion();

       const isOpen = alwaysOpen ? activeKeys.includes(eventKey) : activeKeys === eventKey;

       const contentRef = useRef(null);
       const wrapperRef = useRef(null);
       const heightRef = useRef(0);

       const handleRemove = (id) => {
              const ok = confirm("حذف رو تایید میکنید؟")
              if (!ok) return;
              const newData = Get("data").filter(item => item.id !== id)
              toast.info("صبر کن یه چن لحظه تا حذف بشه", {
                     position: "top-right",
                     autoClose: 5000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: false,
                     draggable: true,
                     theme: "light"
              });
              saveData((e) => {
                     Add("data", newData)
                     refresh(prev => prev + 1)
                     toast.success("حذف شد", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            theme: "light"
                     });
              }, newData)
       }

       useEffect(() => {
              const contentEl = contentRef.current;
              const wrapperEl = wrapperRef.current;
              if (!contentEl || !wrapperEl) return;

              // :red_circle: بسته شدن
              if (!isOpen) {
                     heightRef.current = 0;
                     wrapperEl.style.height = "0px";
                     return;
              }

              // 🟢 باز شدن
              const updateHeight = () => {
                     const newHeight = contentEl.scrollHeight;
                     if (heightRef.current !== newHeight) {
                            heightRef.current = newHeight;
                            wrapperEl.style.height = `${newHeight}px`;
                     }
              };

              updateHeight();

              const observer = new ResizeObserver(updateHeight);
              observer.observe(contentEl);

              return () => observer.disconnect();
       }, [isOpen]);

       return (
              <>
                     <div className="">
                            {/* Header */}
                            <div
                                   className={`w-full h-fit flex items-center justify-between pe-2 cursor-pointer ${className}`}
                                   onClick={() => toggleItem(eventKey)}
                            >
                                   {children[0]}

                                   <div className="flex items-center gap-x-2" onClick={e => e.stopPropagation()}>
                                          {/* edit */}
                                          <button onClick={() => editing(eventId)} className="size-8 bg-green-200 rounded-lg p-1" >
                                                 <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-green-700" viewBox="0 0 24 24" fill="none"  >
                                                        <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                 </svg>
                                          </button>
                                          {/* delete */}
                                          <button onClick={() => handleRemove(eventId)} className="size-8 bg-red-200 rounded-lg p-1" >
                                                 <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-red-400" viewBox="0 0 24 24" fill="none" >
                                                        <path d="M10 11V17" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M14 11V17" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M4 7H20" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                 </svg>
                                          </button>
                                          {/* arrow */}
                                          <svg
                                                 className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                                 fill="none"
                                                 stroke="currentColor"
                                                 strokeWidth="2"
                                                 viewBox="0 0 24 24"
                                          >
                                                 <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M19 9l-7 7-7-7"
                                                 />
                                          </svg>
                                   </div>

                            </div>

                            {/* Body */}
                            <div
                                   style={{ height: 0 }}
                                   ref={wrapperRef}
                                   className="overflow-hidden transition-[height] duration-200 ease-in-out"
                            >
                                   <div ref={contentRef} className="py-1 space-y-3">
                                          <div className="w-full">
                                                 {children[1]}
                                          </div>
                                   </div>
                            </div >
                     </div>
              </>
       );
} 