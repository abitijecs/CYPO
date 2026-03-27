import { NextRequest, NextResponse } from 'next/server'
import { anthropic, CHAT_SYSTEM_PROMPT, NOTIFICATION_TOOL } from '@/lib/anthropic'
import { sendPaymentReadyNotification } from '@/lib/email'
import type Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages requis' }, { status: 400 })
    }

    let paymentTriggered = false
    let triggeredServiceId = ''
    let finalText = ''

    // First pass: run Claude with tool support
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: CHAT_SYSTEM_PROMPT,
      tools: [NOTIFICATION_TOOL],
      messages: messages as Anthropic.MessageParam[],
    })

    // Check for tool use
    let toolResult: Anthropic.MessageParam | null = null

    for (const block of response.content) {
      if (block.type === 'tool_use' && block.name === 'notifier_proprietaire') {
        paymentTriggered = true
        const input = block.input as { service_id?: string; resume?: string }
        triggeredServiceId = input.service_id || ''

        // Send notification email (non-blocking)
        const context = messages
          .slice(-6)
          .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Cliente' : 'Maya'}: ${m.content}`)
          .join('\n')
        sendPaymentReadyNotification(context, triggeredServiceId).catch(console.error)

        // Prepare tool result to continue conversation
        toolResult = {
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: block.id,
              content: 'Notification envoyée à Mailess.',
            },
          ],
        }
      }
    }

    // If tool was called, get the final response
    let finalContent: Anthropic.ContentBlock[]

    if (toolResult) {
      const followUp = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: CHAT_SYSTEM_PROMPT,
        tools: [NOTIFICATION_TOOL],
        messages: [
          ...(messages as Anthropic.MessageParam[]),
          { role: 'assistant', content: response.content },
          toolResult,
        ],
      })
      finalContent = followUp.content
    } else {
      finalContent = response.content
    }

    // Extract text
    for (const block of finalContent) {
      if (block.type === 'text') {
        finalText += block.text
      }
    }

    // Stream the text back
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Stream in small chunks for a realistic typing effect
        const chunkSize = 3
        let i = 0
        const interval = setInterval(() => {
          if (i >= finalText.length) {
            clearInterval(interval)
            controller.close()
            return
          }
          controller.enqueue(encoder.encode(finalText.slice(i, i + chunkSize)))
          i += chunkSize
        }, 15)
      },
    })

    const headers: Record<string, string> = {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    }

    if (paymentTriggered) {
      headers['X-Payment-Ready'] = 'true'
      if (triggeredServiceId) headers['X-Service-Id'] = triggeredServiceId
    }

    return new NextResponse(stream, { headers })
  } catch (error) {
    console.error('[Chat API Error]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la communication avec l\'assistant' },
      { status: 500 },
    )
  }
}
