import type { UserData, AstralMapAnalysis } from '../types';

/**
 * Sends user data to the secure backend function to generate the astral map.
 * The frontend no longer handles the API key or direct communication with Gemini.
 * @param data - The user's input data.
 * @returns A promise that resolves to the AstralMapAnalysis.
 */
export const generateAstralMap = async (data: UserData): Promise<AstralMapAnalysis> => {
  try {
    // We send a POST request to our new serverless function endpoint.
    // Vercel automatically routes `/api/gemini` to the gemini.ts file in the /api directory.
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // If the server responds with an error, try to parse the error message.
      const errorData = await response.json();
      // Throw an error with the message provided by our backend function.
      throw new Error(errorData.error || `Error del servidor: ${response.statusText}`);
    }

    // If the response is successful, parse the JSON body.
    const analysis: AstralMapAnalysis = await response.json();
    return analysis;
    
  } catch (error) {
    console.error("Error al contactar el servicio del mapa astral:", error);
    // Re-throw the error so the UI layer (App.tsx) can catch it and display it.
    // If it's a network error, provide a generic message.
    if (error instanceof TypeError) { // This often indicates a network error
        throw new Error("No se pudo conectar con el servidor. Revisa tu conexión a internet.");
    }
    throw error; // Re-throw the error from the backend or other issues.
  }
};
