import { useState } from 'react'
import {useRef} from 'react'
import './App.css'
import type {Ketcher} from 'ketcher-core'

import Editor from "./ketcher";

interface Problem{
  id: number;
  title:string;
  instruction:string;
  initialSmiles: string;
  expectedSmiles: string;
}

const PROBLEMS:Problem[]=[
  {
    id:1,
    title:"Bimolecular Nucleophilic substitution",
    instruction:"draw the product",
    initialSmiles:"C[Cl].[OH-]",
    expectedSmiles:"CO.[Cl-]"
  },
  {
    id:2,
    title:"Unimolecular Nucleophilic substitution",
    instruction:"what is the product",
    initialSmiles:"C[Cl].[OH-]",
    expectedSmiles:"CO.[CL-]"
  }
]

export default function App(){
  const[currIndex,setCurrIndex]=useState(0)
  const ketcherRef=useRef<Ketcher | null>(null);
  const currProb =PROBLEMS[currIndex];

  const handleKetcherInit=(ketcher: Ketcher)=>{
    ketcherRef.current=ketcher;
    ketcher.setMolecule(currProb.initialSmiles)
  }

  const handleCheckAns= async () =>{
    if (!ketcherRef.current) return;
  

    const userSmiles= await ketcherRef.current.getSmiles()
  
    const formattedUser= userSmiles.trim();
    const formattedExpected=currProb.expectedSmiles.trim();

    if(formattedUser === formattedExpected){
      alert("correct mechanism")
    }
    else{
      alert("not quite, expected "+ formattedExpected + "was actaully" + formattedUser )
    }
  }


  const handleNextQuestion=() => {
    if(currIndex<PROBLEMS.length){
      const nextIdx=currIndex+1;
      setCurrIndex(nextIdx);

      if(ketcherRef.current){
        ketcherRef.current.setMolecule(PROBLEMS[nextIdx].initialSmiles);
      }
      else{
        alert("all questions done")
      }
    }
  }
return (
  <div className="app-container">
    <header className="problem-header">
      <h1>{currProb.title} (Question {currIndex + 1} of {PROBLEMS.length})</h1>
      {currProb.instruction && <p className="instruction">{currProb.instruction}</p>}
    </header>

    <main className="editor-workspace">
      {/* 1. Pass handleKetcherInit to the Editor component */}
      <Editor onInit={handleKetcherInit} />
    </main>

    <footer className="controls-footer">
      {/* 2. Attach handleCheckAns to the Check Answer button */}
      <button className="btn btn-secondary" onClick={handleCheckAns}>
        Check Answer
      </button>

      {/* 3. Attach handleNextQuestion to the Next Question button */}
      <button className="btn btn-primary" onClick={handleNextQuestion}>
        Next Question
      </button>
    </footer>
  </div>
);
}