// IMPORTANT: This file should be placed in the 'api' directory
// for Vercel to automatically detect it as a serverless function.

import { GoogleGenAI, Type } from "@google/genai";
import type { UserData, AstralMapAnalysis, ParentRelation } from '../types';

// --- Numerology Calculation Logic ---
const numerologyMap: { [key: string]: number } = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};
const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
const reduceToSingleDigit = (num: number): number => {
  if ([11, 22, 33].includes(num)) return num;
  let currentNum = num;
  while (currentNum > 9) {
    currentNum = String(currentNum).split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
    if ([11, 22, 33].includes(currentNum)) return currentNum;
  }
  return currentNum;
};
const forceReduceToSingleDigit = (num: number): number => {
  let currentNum = num;
  while (currentNum > 9) {
    currentNum = String(currentNum).split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  return currentNum;
};
interface NumerologyData {
    essence: number;
    image: number;
    mission: number;
    lifePath: number;
    karmas: string;
    deudaKarmica: string;
    pinnacles: string;
    desafios: string;
}
const calculateNumerology = (fullName: string, dob: string): NumerologyData => {
  const normalizedName = fullName.toLowerCase().replace(/[^a-z]/g, '');
  let vowelSum = 0;
  let consonantSum = 0;
  const presentNumbers = new Set<number>();
  for (const char of normalizedName) {
    const value = numerologyMap[char];
    if (value) {
      presentNumbers.add(value);
      if (vowels.has(char)) { vowelSum += value; } else { consonantSum += value; }
    }
  }
  const essence = reduceToSingleDigit(vowelSum);
  const image = reduceToSingleDigit(consonantSum);
  const totalNameSum = vowelSum + consonantSum;
  const mission = reduceToSingleDigit(totalNameSum);
  const [year, month, day] = dob.split('-');
  const dobDigits = dob.replace(/-/g, '');
  const lifePathSum = dobDigits.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  const lifePath = reduceToSingleDigit(lifePathSum);
  const allPossibleNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const karmasArr = Array.from(allPossibleNumbers).filter(num => !presentNumbers.has(num));
  const karmas = karmasArr.length > 0 ? karmasArr.join(', ') : 'Ninguno aparente';
  const karmicDebtNumbers = new Set([13, 14, 16, 19]);
  const debts: string[] = [];
  if (karmicDebtNumbers.has(parseInt(day, 10))) debts.push(`Día de Nacimiento (${parseInt(day, 10)})`);
  if (karmicDebtNumbers.has(lifePathSum) && ![22, 33].includes(lifePathSum)) debts.push(`Sendero Natal (${lifePathSum})`);
  if (karmicDebtNumbers.has(vowelSum)) debts.push(`Esencia (${vowelSum})`);
  if (karmicDebtNumbers.has(consonantSum)) debts.push(`Imagen (${consonantSum})`);
  if (karmicDebtNumbers.has(totalNameSum) && ![22, 33].includes(totalNameSum)) debts.push(`Misión (${totalNameSum})`);
  const deudaKarmica = debts.length > 0 ? [...new Set(debts)].join('; ') : 'Ninguna aparente';
  const reducedMonth = reduceToSingleDigit(parseInt(month, 10));
  const reducedDay = reduceToSingleDigit(parseInt(day, 10));
  const reducedYear = reduceToSingleDigit(parseInt(year, 10));
  const pinnacle1Val = reduceToSingleDigit(reducedMonth + reducedDay);
  const pinnacle2Val = reduceToSingleDigit(reducedDay + reducedYear);
  const pinnacle3Val = reduceToSingleDigit(pinnacle1Val + pinnacle2Val);
  const pinnacle4Val = reduceToSingleDigit(reducedMonth + reducedYear);
  const reducedLifePathForPinnacle = forceReduceToSingleDigit(lifePath);
  const pinnacle1EndAge = 36 - reducedLifePathForPinnacle;
  const pinnacle2EndAge = pinnacle1EndAge + 10;
  const pinnacle3EndAge = pinnacle2EndAge + 10;
  const pinnacles = `Primer Pináculo (Nacimiento - ${pinnacle1EndAge} años): Valor ${pinnacle1Val}. Segundo Pináculo (${pinnacle1EndAge + 1} - ${pinnacle2EndAge} años): Valor ${pinnacle2Val}. Tercer Pináculo (${pinnacle2EndAge + 1} - ${pinnacle3EndAge} años): Valor ${pinnacle3Val}. Cuarto Pináculo (desde los ${pinnacle3EndAge + 1} años): Valor ${pinnacle4Val}.`;
  const challenge1 = reduceToSingleDigit(Math.abs(reducedMonth - reducedDay));
  const challenge2 = reduceToSingleDigit(Math.abs(reducedDay - reducedYear));
  const challenge3 = reduceToSingleDigit(Math.abs(challenge1 - challenge2));
  const challenge4 = reduceToSingleDigit(Math.abs(reducedMonth - reducedYear));
  const desafios = `Primer Desafío (Nacimiento - ${pinnacle1EndAge} años): Valor ${challenge1}. Segundo Desafío (${pinnacle1EndAge + 1} - ${pinnacle2EndAge} años): Valor ${challenge2}. Tercer Desafío (${pinnacle2EndAge + 1} - ${pinnacle3EndAge} años): Valor ${challenge3}. Cuarto Desafío (desde los ${pinnacle3EndAge + 1} años): Valor ${challenge4}.`;
  return { essence, image, mission, lifePath, karmas, deudaKarmica, pinnacles, desafios };
};
// --- Schema and Prompt Logic ---
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    numerology: { type: Type.STRING, description: "Análisis numerológico profundo. Explica el significado de TODOS los números calculados. **Formato Estricto:** Usa títulos de texto plano para cada sección (ej. 'Tu Esencia: Número X'). Separa párrafos y títulos **únicamente** con '\\n\\n'. No uses el nombre del usuario para empezar las secciones. No dividas oraciones." },
    family: { type: Type.STRING, description: "Análisis del sistema familiar. **Formato Estricto:** Usa títulos de texto plano (ej. 'Un Ejercicio para tu Sistema'). Separa todos los párrafos y títulos **exclusivamente** con '\\n\\n'. No dividas oraciones en varias líneas. No uses el nombre de la persona para iniciar el texto." },
    wounds: { type: Type.STRING, description: "Análisis de heridas emocionales. **Formato Estricto:** Separa todos los párrafos **exclusivamente** con '\\n\\n'. No dividas oraciones en varias líneas. No uses el nombre de la persona para iniciar el texto." },
    nlp: { type: Type.STRING, description: "Guía de PNL. **Formato Estricto:** Usa títulos de texto plano (ej. 'El Patrón en tu Lenguaje'). Separa todos los párrafos y títulos **exclusivamente** con '\\n\\n'. No dividas oraciones en varias líneas. No uses el nombre de la persona para iniciar el texto." },
    cuento: { type: Type.STRING, description: "Narrativa integradora estilo Milton Erickson. **Formato Estricto:** Usa un título de texto plano al inicio. Separa todos los párrafos **exclusivamente** con '\\n\\n'. No dividas oraciones en varias líneas. No uses el nombre de la persona para iniciar el texto." },
    symbolicImagePrompt: { type: Type.STRING, description: "A short, symbolic, and visually rich prompt in ENGLISH for an AI image generator, summarizing the core themes of the entire analysis. For example: 'Ethereal digital art of a soul with life path 9 learning to heal abandonment, finding strength in family roots under a cosmic sky.' This prompt MUST be in English." }
  },
  required: ["numerology", "family", "wounds", "nlp", "cuento", "symbolicImagePrompt"]
};

function buildPrompt(data: UserData): string {
    const numerologyData = calculateNumerology(data.fullName, data.dob);
    const motherRelationMap: { [key in ParentRelation]: string } = { good: 'Buena', bad: 'Mala', complicated: 'Complicada', deceased: 'Fallecida', unknown: 'No conocida', absent: 'Ausente', distanced: 'Distanciada', avoiding: 'Evitándola', imprisoned: 'Reclusa de libertad' };
    const fatherRelationMap: { [key in ParentRelation]: string } = { good: 'Buena', bad: 'Mala', complicated: 'Complicada', deceased: 'Fallecido', unknown: 'No conocido', absent: 'Ausente', distanced: 'Distanciado', avoiding: 'Evitándolo', imprisoned: 'Recluso de libertad' };
    return `
**Misión: Crear un Mapa de Autoconocimiento Profundo**
Eres un Guía Consciente. Tu tono es directo, claro y profundamente empático. Hablas con la seguridad y la calma de alguien que entiende la complejidad humana. Tu principal objetivo es la PROFUNDIDAD y el DESARROLLO de las ideas, no la brevedad.
**Principios de Comunicación:**
- **Natural y Orgánico:** Habla como lo harías en una conversación real y significativa. Empieza directamente.
- **Empatía Auténtica:** Tu empatía se muestra al comprender y validar la experiencia del otro. Reconoces tanto las dificultades como los dones con respeto.
- **Directo y Compasivo (Palabras Crudas):** Explica los desafíos sin rodeos, pero siempre desde una perspectiva de aprendizaje y crecimiento.
**Estructura y Formato CRÍTICOS (Debes seguir estas reglas al 100%):**
- **No uses el nombre de la persona:** No empieces ninguna sección con el nombre de la persona (ej: "Jonathan, tu esencia..."). Ve directo al análisis.
- **Títulos Claros:** Usa títulos de texto plano, SIN ASTERISCOS ni negritas. Ejemplo: "Tu Esencia: Número X".
- **Separador ÚNICO:** Usa **únicamente** saltos de línea dobles (\`\\n\\n\`) para separar párrafos completos y títulos. NUNCA uses un solo salto de línea (\`\\n\`) dentro de un párrafo o para separar oraciones. Las oraciones NUNCA deben estar divididas en varias líneas.
- **Desarrollo Profundo:** Cada sección debe ser un análisis bien desarrollado y profundo. Evita la brevedad.
**Datos de la Persona:**
- **Nombre Completo:** ${data.fullName}
- **Fecha de Nacimiento:** ${data.dob}
- **Estado de los Padres:** ${data.parentsStatus}
- **Relación con la Madre:** ${motherRelationMap[data.motherRelation]}
- **Relación con el Padre:** ${fatherRelationMap[data.fatherRelation]}
- **Descripción de la Crianza:** ${data.upbringing}
- **Hijos:** ${data.children}
- **Posición entre Hermanos:** ${data.siblingPosition}
- **Profesión:** ${data.profession}
- **Pasatiempos:** ${data.hobbies}
**Datos Numerológicos (Calculados):**
- **Número de Esencia (Suma de Vocales):** ${numerologyData.essence}
- **Número de Imagen (Suma de Consonantes):** ${numerologyData.image}
- **Número de Misión (Suma Total del Nombre):** ${numerologyData.mission}
- **Sendero Natal (Suma de Fecha de Nacimiento):** ${numerologyData.lifePath}
- **Karmas (Lecciones Kármicas):** ${numerologyData.karmas}
- **Deuda Kármica:** ${numerologyData.deudaKarmica}
- **Pináculos (Estaciones de la vida):** ${numerologyData.pinnacles}
- **Desafíos (Pruebas del alma):** ${numerologyData.desafios}
**Estructura del Mapa (Instrucciones):**
1.  **Tus Números al Descubierto (Numerología):**
    - **Contenido Obligatorio (Desarrolla TODOS los puntos):** Tu Esencia: Número ${numerologyData.essence}, Tu Imagen: Número ${numerologyData.image}, Tu Misión de Vida: Número ${numerologyData.mission}, Tu Sendero Natal: Número ${numerologyData.lifePath}, Tus Karmas o Lecciones Pendientes: ${numerologyData.karmas}, Tu Deuda Kármica: ${numerologyData.deudaKarmica}, Tus Pináculos (Las etapas de tu vida): ${numerologyData.pinnacles}, Tus Desafíos: ${numerologyData.desafios}.
    - **Cierre:** Termina con un párrafo de resumen bien desarrollado bajo el título "En Resumen, tus Números Dicen Esto:".
2.  **Tus Raíces Familiares (Constelaciones Familiares):**
    - **El Mapa de tu Sistema Familiar:** Describe con detalle las dinámicas que observes.
    - **Un Ejercicio para tu Sistema:** Propón un ejercicio práctico y bien explicado con una "frase sanadora".
3.  **Las Heridas como Guías (Heridas Emocionales):**
    Identifica las heridas principales y explica con profundidad y ejemplos concretos cómo se manifiestan.
4.  **El Poder de Tu Lenguaje (PNL):**
    - **El Patrón en tu Lenguaje:** Identifica un patrón de lenguaje limitante.
    - **Una Práctica para Cambiarlo:** Ofrece un ejercicio simple y bien detallado.
    - **El Beneficio Directo:** Explica el beneficio práctico y tangible.
5.  **Tu Historia: Un Puente Hacia tu Potencial (Tu Cuento):**
    Usando el estilo de Milton Erickson, teje una narrativa que sirva como un puente desde el estado actual hacia su potencial.
    - **Punto de Partida (Acompañar/Pacing):** Valida su realidad actual.
    - **Construyendo el Puente (Guiar/Leading):** Introduce el cambio sutilmente con sugestiones indirectas.
    - **El Potencial Desplegado:** Describe el futuro deseado.
Genera la respuesta estrictamente como un objeto JSON que se ajuste al esquema proporcionado. No incluyas ninguna explicación introductoria o final fuera del JSON.
`;
}

// This is the main serverless function handler
export default async function handler(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        console.error("API_KEY is not defined in environment variables.");
        return new Response(JSON.stringify({ error: "CONFIGURACIÓN REQUERIDA: La API_KEY de Gemini no se ha encontrado en el servidor. Por favor, revisa la configuración de 'Environment Variables' en Vercel." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const data: UserData = await request.json();
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const prompt = buildPrompt(data);

        // Step 1: Generate text analysis and the prompt for the image
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
                temperature: 0.7,
                maxOutputTokens: 8192,
            }
        });

        const jsonText = textResponse.text.trim();
        const partialAnalysis = JSON.parse(jsonText) as Omit<AstralMapAnalysis, 'symbolicImage'> & { symbolicImagePrompt: string };
        
        if (!partialAnalysis.symbolicImagePrompt) {
            throw new Error("La IA no pudo generar un prompt para la imagen simbólica.");
        }

        // Step 2: Generate the symbolic image
        const imageResponse = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: partialAnalysis.symbolicImagePrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
        });

        if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
            throw new Error("La generación de la imagen falló.");
        }

        const imageBase64 = imageResponse.generatedImages[0].image.imageBytes;
        const { symbolicImagePrompt, ...analysisData } = partialAnalysis;
        
        const finalAnalysis: AstralMapAnalysis = {
            ...analysisData,
            symbolicImage: imageBase64,
        };

        return new Response(JSON.stringify(finalAnalysis), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error in serverless function:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred on the server.";
        return new Response(JSON.stringify({ error: `Error al generar el mapa astral: ${errorMessage}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
