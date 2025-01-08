import {NextRequest, NextResponse} from 'next/server'

const AgentHost = 'http://localhost:8080'

export async function GET(
    request: NextRequest,
    {params}: { params: { promptId: string } }
) {
    const promptId = params.promptId

    if (!promptId) {
        return NextResponse.json({error: 'Prompt ID is required'}, {status: 400})
    }

    try {
        const response = await fetch(AgentHost + '/get-answer/' + promptId);
        const data = await response.json();
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching AI answer:', error)
        return NextResponse.json({error: 'Failed to fetch AI answer'}, {status: 500})
    }
}

