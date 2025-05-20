import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const createText = async (model, prompt) => {
    return await generateText({
        model,
        prompt
    });
};
export const listModels = async (include = null) => {
    return await prisma.model.findMany({
        include
    });
};
export const searchModel = async (name) => {
    return await prisma.model.findMany({
        where: {
            name
        }
    });
};
export const setModel = async (name, provider, key) => {
    return await prisma.model.create({
        data: {
            name,
            provider,
            key,
            isGlobal: false,
            directory: []
        }
    });
};
export const getModel = async (model) => {
    if (model?.provider === "openai") {
        return createOpenAI({
            apiKey: model.key
        })(model.name);
    }
    else if (model?.provider === "google") {
        return createGoogleGenerativeAI({
            apiKey: model.key
        })(model.name);
    }
};
