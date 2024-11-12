'use server'


import { AdminContextProvider, SiteContexProvider, AdminUiContexProvider, BFXContextProvider, LineBotContexProvider, PageHeader, LNav_Menu, UpdateAdminContext, ServerUpdateContext, WebPushProvider } from "@dsv911/ez"
import React from "react"

import type { Metadata  } from 'next'
import { BoMenuLink } from "./bopageData"


type Props = {
   params: Promise<{ slug: string }>
}

export async function generateMetadata(
   { params }: Props,
): Promise<Metadata>
{
   // read route params
   const Params = (await params)
   // fetch data
   // optionally access and extend (rather than replace) parent metadata
   const getTitle = BoMenuLink?.flatMap(n => n?.href).find(f => f == Params.slug)
   return {
      title: getTitle,

   }
}

export default async function LayOutTemplateRoot({
   children
}: {
   children: React.ReactNode,

})
{

   return <AdminUiContexProvider >
         <AdminContextProvider>
            <SiteContexProvider >
               <BFXContextProvider>

                  <LineBotContexProvider>
                     <ServerUpdateContext />

                     <PageHeader />
                     <main className="container-fluid  flex flex-row w-screen h-full bg-none">
                        <LNav_Menu />
                        <div className='max-h-screen border border-blue-500 grow bg-none'>
                           <UpdateAdminContext />
                           <WebPushProvider />


                           {children}


                        </div>
                     </main>

                  </LineBotContexProvider>

               </BFXContextProvider>
            </SiteContexProvider>
         </AdminContextProvider>
      </AdminUiContexProvider>



}
