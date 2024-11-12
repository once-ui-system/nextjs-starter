import React from 'react'
import { Suspense } from 'react'
import "@dsv911/ez"
export default function AuthDefaultPage() {

  return (
    <Suspense fallback={<>AuthDefaultPage</>}><p> @AuthDefaultPage </p></Suspense>
  )
}
