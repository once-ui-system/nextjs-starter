
import { GoldBorder, TxtImgRes, IconsGenerate, BtnRegister, ButtonLine, OGImage } from "@dsv911/ez"
import { NextRequest } from "next/server";


export async function GET(
    request: NextRequest,
    props:{
        params: Promise<{img:string}>
    }
) {
    const params = await props.params;
    const { searchParams } = new URL(request.url)
    const text = searchParams.get('text')?.split(/_/)
    const Width = searchParams.get('w')
    const Height = searchParams?.get('h')
    if(params?.img=='goldborder'){
        return  GoldBorder({Text:text||['www','DARIN','bet'],Width:Width??150,Height:Height??Width??150})
    }else if (params?.img=='txtimg'){
        return TxtImgRes(text||['www','DARIN','bet'],Width??150,Height??Width??150)
    }else if (params?.img=='icon'){
        return IconsGenerate({width:Number(Width),height:Number(Height??Width)})
    }else if (params?.img=='BtnRegister'){
        return BtnRegister({Text:text||['DARIN','bet'],Width:Width??275*2,Height:Height??Width??55*2})
    }else if (params?.img=='ButtonLine'){
        return ButtonLine({Text:text||['@DarinBet'],Width:Width??275,Height:Height??Width??55})
    
    }else if (params?.img=='OGImage'){
        return OGImage(request)
    }
    return new Response('Image generating...',{status:200})
}
