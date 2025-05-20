import { generateText, LanguageModel } from "ai";
import { createOpenAI } from "@ai-sdk/openai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient()

export const createText = async (model:any, prompt:string) => {
    return await generateText({
        model,
        prompt
    })
}

export const listModels = async ( include:{ directory:boolean}|null = null ) => {
    return await prisma.model.findMany({
        include
    })
}

export const searchModel = async (name:string) => {
    return await prisma.model.findMany({
        where:{
            name
        }
    })
}

export const setModel = async (name:string, provider:string, key:string) => {
    return await prisma.model.create({
        data: {
            name,
            provider,
            key,
            isGlobal:false,
            directory: [] as Prisma.DirectoryUncheckedCreateNestedManyWithoutModelInput | Prisma.DirectoryCreateNestedManyWithoutModelInput | undefined
        }
    })
}


export const getModel = async (model:{ name:string, provider:string, key:string } ) => {
    if( model?.provider === "openai" ) {
        return createOpenAI({
            apiKey: model.key
        })(model.name as string)
    }
    else if( model?.provider === "google" ) {
        return createGoogleGenerativeAI({
            apiKey: model.key
        })(model.name as string)
    }
}