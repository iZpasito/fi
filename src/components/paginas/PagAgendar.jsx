import React from "react"
import Tabla from "../tabla"
import Naver from "./nav.jsx"


function Agendar() {
  return (
      <div class='h-screen min-w-375 min-h-667'>
        <Naver></Naver>
        <Tabla/>
      </div>
  )
}

export default Agendar;
