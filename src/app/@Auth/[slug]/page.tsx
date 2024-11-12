'use client'

import { use } from "react";

type props = {
  params: Promise<{
    slug: string
  }>
}

export default function SlugPages(prop: props) {
  const params = use(prop.params);


  const { slug } = params
  /*  plog("param=",params.slug) */

  return <section className="size-full gap-2 p-1 pb-4 overflow-y-auto">   <Breadcrumb pageName={slug || ""} /> <BoTableBase slug={slug} />     </section>
}


