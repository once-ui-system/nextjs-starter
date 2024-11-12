'use client'

import "@dsv911/ez"
import Link from "next/link"
import React from "react"


export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  return (
    <div className='size-full bg-black-2 text-white text-center align-middle items-center justify-center content-center'>


      <h2>เกิดข้อผิดพลาดบางอย่าง!</h2>
      <h4>โปรดแคปภาพหน้าจอนี้ ส่งให้แอดมิน</h4>
      <Link href="/line"><h2>แจ้งปัญหานี้กับแอดมินทางไลน์ได้เลยนะคะ คลิก!</h2></Link>
      {error.digest}
      {error.message}

      <button onClick={() => reset()}>หรือลองโหลดซ้ำอีกครั้ง คลิก!</button>
    </div>


  )
}
