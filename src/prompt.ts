import * as fs from "fs";

export type reqType = {
  role: string;
  content: string;
};

export interface GPTutorPromptType {
  languageId: string;
  selectedCode: string;
  codeContext?: string;
  auditContext?: string;
}

export const getPrompt = (
  context: any,
  current_mode: string,
  current_config_provider: any,
  languageId: string,
  selectedCode: string,
  codeContext: string,
  sourceCodeContext: string
): reqType[] => {
  let src = context.workspaceState.get("src");
  let promptProfile = JSON.parse(
    fs.readFileSync(
      context.extensionPath + "/" + src + "/media/prompt_config.json",
      "utf8"
    )
  );
  if (
    promptProfile[promptProfile.currentProfile].specificLanguages.languageId
      .length
  ) {
  }
  let prompt;
  try {
    let provider = promptProfile.currentProvider;
    prompt = promptProfile[languageId][provider][current_mode];
  } catch (e) {
    prompt = prompt.default[current_mode];
  }
  prompt = JSON.stringify(prompt);
  prompt = prompt.replace("${languageId}", languageId);
  prompt = prompt.replace("${selectedCode}", selectedCode);
  prompt = prompt.replace("${codeContext}", codeContext);
  prompt = prompt.replace("${sourceCodeContext}", sourceCodeContext);
  prompt = Array(JSON.parse(prompt));
  return prompt;
};

let TaiwaneseWordsNote =
  "請盡量使用繁體中文與臺灣地區用語，避免簡體字與中國大陸地區的用詞。比方請用「程式碼」而不是「代码」。";
export const getExplainRequestMsg = (
  languageId: string,
  codeContext: string,
  selectedCode: string,
  outputLanguage: string = "English"
): reqType[] => {
  let noteForLanguage = "";
  if (outputLanguage && outputLanguage != "English") {
    {
      noteForLanguage = ` Output in ${outputLanguage}.`;
    }
  }
  if (outputLanguage == "Chinese (Traditional)") {
    noteForLanguage += TaiwaneseWordsNote;
  }
  return [
    {
      role: "system",
      content: `You are a Senior ${languageId} Developer \n I will provide some ${languageId} code, and it will be your job to explain the  ${languageId} code I selected.`,
    },
    {
      role: "user",
      content: `Other context about the selected code is in the following triple quotes """${codeContext}""". The ${languageId} code I selected is in the following triple quotes """${selectedCode}""". Please focus on explain target ${languageId} code.${noteForLanguage}`,
    },
  ];
};

export const FirstAuditRequest = (
  languageId: string,
  selectedCode: string,
  codeContext: string,
  outputLanguage: string = "English"
): reqType[] => {
  let noteForLanguage = "";
  if (outputLanguage && outputLanguage != "English") {
    {
      noteForLanguage = `Output in ${outputLanguage}.`;
    }
  }
  if (outputLanguage == "Chinese (Traditional)") {
    noteForLanguage += TaiwaneseWordsNote;
  }
  let moveSpecialization = "";
  if (languageId.toLowerCase() === "move") {
    console.log("Audit Move!");
    moveSpecialization =
      "Move is an open source language for writing safe smart contracts. It's format is similar to Rust.";
  }
  return [
    {
      role: "system",
      content: `${moveSpecialization} I want you to act as a professional ${languageId} Auditor. \n I will provide some code about ${languageId} smart contract, \n and it will be your job to audit provided ${languageId} smart contract code, refine provided smart contract code`,
    },
    {
      role: "user",
      content: `Here are ${languageId} code : ${selectedCode}, \n if there is a problem with this ${languageId} code or if there is a security concern, \n modify this ${languageId} code. Here is the full code ${codeContext} if needed.${noteForLanguage}`,
    },
  ];
};

export const CommentRequestMsg = (
  languageId: string,
  selectedCode: string,
  codeContext: string,
  outputLanguage: string = "English"
): reqType[] => {
  let noteForLanguage = "";
  if (outputLanguage && outputLanguage != "English") {
    {
      noteForLanguage = `Add or rewrite the comment in the given code in ${outputLanguage}.`;
    }
  }
  if (outputLanguage == "Chinese (Traditional)") {
    noteForLanguage += TaiwaneseWordsNote;
  }
  return [
    {
      role: "system",
      content: `I want you to act as a professional ${languageId} Commenter. \n I will provide some code about ${languageId}, \n and it will be your job to add or rewrite comment on the provided ${languageId} code. You should only edit command, but keep the code the same.`,
    },
    {
      role: "user",
      content: `Here are some context of the code, don't output them: ${codeContext}\n Here are the ${languageId} code I want you to add comment: ${selectedCode}. Only return the code after modified. return the code with the start of \`\`\` and end it with \`\`\`.${noteForLanguage}`,
    },
  ];
};

export const FirstReplyForGpt3 = (
  languageId: string,
  selectedCode: string,
  codeContext: string,
  outputLanguage: string = "English"
): reqType[] => {
  let noteForLanguage = "";
  if (outputLanguage && outputLanguage != "English") {
    {
      noteForLanguage = `Output the explain in ${outputLanguage} and add or rewrite the comment in the code in ${outputLanguage}.`;
    }
  }
  if (outputLanguage == "Chinese (Traditional)") {
    noteForLanguage += TaiwaneseWordsNote;
  }
  return [
    {
      role: "system",
      content: `I want you to act as a professional ${languageId} Auditor. \n I will provide some code about ${languageId} smart contract, \n and it will be your job to audit provided ${languageId} smart contract code, refine provided smart contract code and add comments if necessary to make it more easy to understand.`,
    },
    {
      role: "user",
      content: `Here are ${languageId} code : ${selectedCode}, \n if there is a problem with this ${languageId} code or if there is a security concern, \n modify this ${languageId} code. Here is the full code ${codeContext} if needed \n Only return the code after modified. return the code with the start of \`\`\` and end it with \`\`\`.${noteForLanguage}`,
    },
  ];
};

export const getAuditRequestMsg = (
  languageId: string,
  previousAnswer: string,
  selectedCode: string,
  outputLanguage: string = "English"
): reqType[] => {
  let noteForLanguage = "";
  if (outputLanguage && outputLanguage != "English") {
    {
      noteForLanguage = `Output in ${outputLanguage}.`;
    }
  }
  if (outputLanguage == "Chinese (Traditional)") {
    noteForLanguage += TaiwaneseWordsNote;
  }
  return [
    {
      role: "system",
      content: `I want you to act as a professional ${languageId} Auditor. \n I will provide some code about ${languageId} smart contract,\n and it will be your job to audit provided ${languageId} smart contract code, refine provided smart contract code`,
    },
    {
      role: "user",
      content: `The original given ${languageId} code is as follows: ${selectedCode} \n We have provided code that after refine and audit : ${previousAnswer}\n We have the opportunity to refine and audit this code again \n Please think carefully. And audit this code to be better. \n If it is already quite secure and efficient, \n return original answer.${noteForLanguage}`,
    },
  ];
};

export const CustomizePrompt = (
  userInput: string,
  languageId: string,
  selectedCode: string,
  outputLanguage: string = "English"
): reqType[] => {
  let noteForLanguage = "";
  if (outputLanguage && outputLanguage != "English") {
    {
      noteForLanguage = `Output in ${outputLanguage}.`;
    }
  }
  if (outputLanguage == "Chinese (Traditional)") {
    noteForLanguage += TaiwaneseWordsNote;
  }
  return [
    {
      role: "system",
      content: `I want you to act as a Senior ${languageId} Developer. \n Expertise in analyzing ${languageId} code and solving smart contract problems`,
    },
    {
      role: "user",
      content: `Give question : ${userInput} \n And given code : ${selectedCode} \n Please answer ${userInput} as detail as possible.${noteForLanguage}`,
    },
  ];
};
