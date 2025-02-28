import { generateText, tool } from 'ai'
import z from 'zod'
import { openai } from '../ai/openai'
import { db, pg } from '../drizzle/client'
import { subscriptions } from '../drizzle/schema/subscriptions'
import { postgresTool } from '../ai/tools/postgres-tool'
import { redisTool } from '../ai/tools/redis-tool'

interface AnswerUserMessageParams {
    message: string
}

export async function answerUserMessage({ message }: AnswerUserMessageParams) {
    const answer = await generateText({
        model: openai,
        prompt: message,
        tools: {
            postgresTool,
            redisTool
        },
        system: `
            Você é um assistência de I.A. responsável por responder dúvidas sobre um evento de programação.

            Inclua na resposta somente o que o usuário pediu, sem nenhum texto adicional.

            O retorno deve ser sempre em markdown (sem incluir \`\'\`\ no início ou no fim).
        `.trim(),
        maxSteps: 5,
    })

    return { response: answer.text }
}
