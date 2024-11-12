import { MongoServerAPI } from "@dsv911/ez"
import { NextResponse, type NextRequest } from "next/server";




export async function POST(request: NextRequest, props: {
    params: Promise<{ fn: string }>
}) {
    const db = (await props?.params).fn as keyof typeof MongoServerAPI
    try {
        const body = await request?.json()

        if (db) {
            const body = await request.json()

        }

        return new Response(JSON.stringify({ message: 'Subscription set.' }), {})

    } catch (e: any) {

        throw new Error(e).message

    }
}

