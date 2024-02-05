"use server";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-pro-vision",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.9,
});

export const handleImage = async ({
  base64Image,
  mimeType,
}: {
  base64Image: any;
  mimeType: any;
}) => {
  if (!base64Image || !mimeType) {
    return { error: "Please input image" };
  }

  const parser = new StringOutputParser();
  const prompt =
    "You're a professional invoice information extractor. You must read the image given to you and extract the information contained in the invoice in point by point format. Don't entertain unrelated pictures and decline respectfully reiterating you're purpose as invoice extractor. Be extremely accurate in your analysis and avoid unnecessary jargons. If you can't extract information prompt the user to re-upload the image. Use clear markdown as and when needed, and give the answer in clear markdown. Avoid confusion and be detailed in your analysis. Maintain a consistent format";

  const input2 = [
    new HumanMessage({
      content: [
        {
          type: "text",
          text: prompt,
        },
        {
          type: "image_url",
          image_url: `${base64Image}`,
        },
      ],
    }),
  ];

  const res = await model.invoke(input2);

  return res.lc_kwargs?.content;
};
