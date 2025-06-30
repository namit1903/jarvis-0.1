import { GoogleGenerativeAI } from "@google/generative-ai"//class is imported which allows us to interact with google generative ai models


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);// the API key is typically used for authentication and authorization.
const model = genAI.getGenerativeModel({//The getGenerativeModel method is called to specify which AI model to use for content generation
    model: "gemini-1.5-flash",// The configuration object passed to it contains various settings, including the model type and instructions.
    generationConfig: {
        responseMimeType: "application/json",//MIME types (Multipurpose Internet Mail Extensions) t
        // responseMimeType is typically a property used to specify the format or type of data that the API should return in its response.

        temperature: 0.4,//randomness of responses
    },

    // below is a detailed set of instructions for the AI, describing the model's role, expertise, and behavior. 
    systemInstruction: `You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.
    
    Examples: 

    <example>
 
    response: {

    "text": "this is you fileTree structure of the express server",
    "fileTree": {
        "app.js": {
            file: {
                contents: "
                const express = require('express');

                const app = express();


                app.get('/', (req, res) => {
                    res.send('Hello World!');
                });


                app.listen(3000, () => {
                    console.log('Server is running on port 3000');
                })
                "
            
        },
    },

        "package.json": {
            file: {
                contents: "

                {
                    "name": "temp-server",
                    "version": "1.0.0",
                    "main": "index.js",
                    "scripts": {
                        "test": "echo \"Error: no test specified\" && exit 1"
                    },
                    "keywords": [],
                    "author": "",
                    "license": "ISC",
                    "description": "",
                    "dependencies": {
                        "express": "^4.21.2"
                    }
}

                
                "
                
                

            },

        },

    },
    "buildCommand": {
        mainItem: "npm",
            commands: [ "install" ]
    },

    "startCommand": {
        mainItem: "node",
            commands: [ "app.js" ]
    }
}

    user:Create an express application 
   
    </example>


    
       <example>

       user:Hello 
       response:{
       "text":"Hello, How can I help you today?"
       }
       
       </example>
    
 IMPORTANT : don't use file name like routes/index.js
       
       
    `
});

export const generateResult = async (prompt) => {

    const result = await model.generateContent(prompt);

    return result.response.text()
}