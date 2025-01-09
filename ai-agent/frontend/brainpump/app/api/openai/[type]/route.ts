import { NextRequest, NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set')
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ type: string }> }
) {
    const { type } = await params
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const threadId = searchParams.get('threadId')

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    let url = ''
    switch (type) {
        case 'thread':
            url = `https://api.openai.com/v1/threads/${id}/messages`
            break
        case 'message':
            if (!threadId) {
                return NextResponse.json({ error: 'Thread ID is required for messages' }, { status: 400 })
            }
            url = `https://api.openai.com/v1/threads/${threadId}/messages/${id}`
            break
        case 'run':
            if (!threadId) {
                return NextResponse.json({ error: 'Thread ID is required for runs' }, { status: 400 })
            }
            url = `https://api.openai.com/v1/threads/${threadId}/runs/${id}`
            break
        case 'assistant':
            url = `https://api.openai.com/v1/assistants/${id}`
            break
        default:
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'OpenAI-Beta': 'assistants=v2'
            }
        })

        if (!response.ok) {
            throw new Error(`OpenAI API responded with ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching from OpenAI API:', error)
        return NextResponse.json({ error: 'Failed to fetch data from OpenAI API' }, { status: 500 })
    }
}

