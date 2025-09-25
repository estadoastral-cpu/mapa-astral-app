import { GoogleGenAI, Type } from "@google/genai";
import type { UserData, AstralMapAnalysis, ParentRelation } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Numerology Calculation Logic ---
const numerologyMap: { [key: string]: number } = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

const vowels = new Set(['a', 'e', 'i', 'o', 'u']);

const reduceToSingleDigit = (num: number): number => {
  if ([11, 22, 33].includes(num)) {
    return num;
  }
  let currentNum = num;
  while (currentNum > 9) {
    currentNum = String(currentNum).split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
    if ([11, 22, 33].includes(currentNum)) {
      return currentNum;
    }
  }
  return currentNum;
};

// Reduces a number to a single digit, without preserving master numbers.
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
  // 1. Core numbers from name
  const normalizedName = fullName.toLowerCase().replace(/[^a-z]/g, '');
  let vowelSum = 0;
  let consonantSum = 0;
  const presentNumbers = new Set<number>();

  for (const char of normalizedName) {
    const value = numerologyMap[char];
    if (value) {
      presentNumbers.add(value);
      if (vowels.has(char)) {
        vowelSum += value;
      } else {
        consonantSum += value;
      }
    }
  }

  const essence = reduceToSingleDigit(vowelSum);
  const image = reduceToSingleDigit(consonantSum);
  const totalNameSum = vowelSum + consonantSum;
  const mission = reduceToSingleDigit(totalNameSum);

  // 2. Core number from DOB
  const [year, month, day] = dob.split('-');
  const dobDigits = dob.replace(/-/g, '');
  const lifePathSum = dobDigits.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  const lifePath = reduceToSingleDigit(lifePathSum);

  // 3. Karmas (Karmic Lessons)
  const allPossibleNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const karmasArr = Array.from(allPossibleNumbers).filter(num => !presentNumbers.has(num));
  const karmas = karmasArr.length > 0 ? karmasArr.join(', ') : 'Ninguno aparente';

  // 4. Deuda Kármica (Karmic Debt)
  const karmicDebtNumbers = new Set([13, 14, 16, 19]);
  const debts: string[] = [];
  if (karmicDebtNumbers.has(parseInt(day, 10))) {
    debts.push(`Día de Nacimiento (${parseInt(day, 10)})`);
  }
  if (karmicDebtNumbers.has(lifePathSum) && ![22, 33].includes(lifePathSum)) {
    debts.push(`Sendero Natal (${lifePathSum})`);
  }
  if (karmicDebtNumbers.has(vowelSum)) {
    debts.push(`Esencia (${vowelSum})`);
  }
  if (karmicDebtNumbers.has(consonantSum)) {
    debts.push(`Imagen (${consonantSum})`);
  }
  if (karmicDebtNumbers.has(totalNameSum) && ![22, 33].includes(totalNameSum)) {
    debts.push(`Misión (${totalNameSum})`);
  }
  const deudaKarmica = debts.length > 0 ? [...new Set(debts)].join('; ') : 'Ninguna aparente';

  // 5. Pináculos (Pinnacles)
  const reducedMonth = reduceToSingleDigit(parseInt(month, 10));
  const reducedDay = reduceToSingleDigit(parseInt(day, 10));
  const reducedYear = reduceToSingleDigit(parseInt(year, 10));

  const pinnacle1Val = reduceToSingleDigit(reducedMonth + reducedDay);
  const pinnacle2Val = reduceToSingleDigit(reducedDay + reducedYear);
  const pinnacle3Val = reduceToSingleDigit(pinnacle1Val + pinnacle2Val);
  const pinnacle4Val = reduceToSingleDigit(reducedMonth + reducedYear);

  // Calculate Pinnacle timing based on user's logic
  const reducedLifePathForPinnacle = forceReduceToSingleDigit(lifePath);
  const pinnacle1EndAge = 36 - reducedLifePathForPinnacle;
  const pinnacle2EndAge = pinnacle1EndAge + 10;
  const pinnacle3EndAge = pinnacle2EndAge + 10;

  const pinnacles = 
    `Primer Pináculo (Nacimiento - ${pinnacle1EndAge} años): Valor ${pinnacle1Val}. ` +
    `Segundo Pináculo (${pinnacle1EndAge + 1} - ${pinnacle2EndAge} años): Valor ${pinnacle2Val}. ` +
    `Tercer Pináculo (${pinnacle2EndAge + 1} - ${pinnacle3EndAge} años): Valor ${pinnacle3Val}. ` +
    `Cuarto Pináculo (desde los ${pinnacle3EndAge + 1} años): Valor ${pinnacle4Val}.`;

  // 6. Desafíos (Challenges)
  const challenge1 = reduceToSingleDigit(Math.abs(reducedMonth - reducedDay));
  const challenge2 = reduceToSingleDigit(Math.abs(reducedDay - reducedYear));
  const challenge3 = reduceToSingleDigit(Math.abs(challenge1 - challenge2));
  const challenge4 = reduceToSingleDigit(Math.abs(reducedMonth - reducedYear));
  
  const desafios = 
    `Primer Desafío (Nacimiento - ${pinnacle1EndAge} años): Valor ${challenge1}. ` +
    `Segundo Desafío (${pinnacle1EndAge + 1} - ${pinnacle2EndAge} años): Valor ${challenge2}. ` +
    `Tercer Desafío (${pinnacle2EndAge + 1} - ${pinnacle3EndAge} años): Valor ${challenge3}. ` +
    `Cuarto Desafío (desde los ${pinnacle3EndAge + 1} años): Valor ${challenge4}.`;


  return {
    essence,
    image,
    mission,
    lifePath,
    karmas,
    deudaKarmica,
    pinnacles,
    desafios,
  };
};
// --- End of Numerology Logic ---

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    numerology: {
      type: Type.STRING,
      description: "Análisis numerológico profundo. Explica el significado de TODOS los números calculados. **Formato Estricto:** Usa títulos de texto plano para cada sección (ej. 'Tu Esencia: Número X'). Separa párrafos y títulos **únicamente** con '\\n\\n'. No uses el nombre del usuario para empezar las secciones. No dividas oraciones."
    },
    family: {
      type: Type.STRING,
      description: "Análisis del sistema familiar. **Formato Estricto:** Usa títulos de texto plano (ej. 'Un Ejercicio para tu Sistema'). Separa todos los párrafos y títulos **exclusivamente** con '\\n\\n'. No dividas oraciones en varias líneas. No uses el nombre de la persona para iniciar el texto."
    },
    wounds: {
      type: Type.STRING,
      description: "Análisis de heridas emocionales. **Formato Estricto:** Separa todos los párrafos **exclusivamente** con '\\n\\n'. No dividas oraciones en varias líneas. No uses el nombre de la persona para iniciar el texto."
    },
    nlp: {
      type: Type.STRING,
      description: "Guía de PNL. **Formato Estricto:** Usa títulos de texto plano (ej. 'El Patrón en tu Lenguaje'). Separa todos los párrafos y títulos **exclusivamente** con '\\n\\n'. No dividas oraciones en varias líneas. No uses el nombre de la persona para iniciar el texto."
    },
    cuento: {
        type: Type.STRING,
        description: "Narrativa integradora estilo Milton Erickson. **Formato Estricto:** Usa un título de texto plano al inicio. Separa todos los párrafos **exclusivamente** con '\\n\\n'. No dividas oraciones en varias líneas. No uses el nombre de la persona para iniciar el texto."
    },
    symbolicImagePrompt: {
        type: Type.STRING,
        description: "A short, symbolic, and visually rich prompt in ENGLISH for an AI image generator, summarizing the core themes of the entire analysis. For example: 'Ethereal digital art of a soul with life path 9 learning to heal abandonment, finding strength in family roots under a cosmic sky.' This prompt MUST be in English."
    }
  },
  required: ["numerology", "family", "wounds", "nlp", "cuento", "symbolicImagePrompt"]
};

function buildPrompt(data: UserData): string {
    const numerologyData = calculateNumerology(data.fullName, data.dob);

    const motherRelationMap: { [key in ParentRelation]: string } = {
        good: 'Buena',
        bad: 'Mala',
        complicated: 'Complicada',
        deceased: 'Fallecida',
        unknown: 'No conocida',
        absent: 'Ausente',
        distanced: 'Distanciada',
        avoiding: 'Evitándola',
        imprisoned: 'Reclusa de libertad'
    };

    const fatherRelationMap: { [key in ParentRelation]: string } = {
        good: 'Buena',
        bad: 'Mala',
        complicated: 'Complicada',
        deceased: 'Fallecido',
        unknown: 'No conocido',
        absent: 'Ausente',
        distanced: 'Distanciado',
        avoiding: 'Evitándolo',
        imprisoned: 'Recluso de libertad'
    };

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
    Aquí es crucial ser detallado. Explica de forma profunda y clara qué significa cada uno de los siguientes puntos en la vida de esta persona. No te limites a una frase, desarrolla la idea para que se entienda el impacto práctico.
    - **Contenido Obligatorio (Desarrolla TODOS los puntos):**
        - Tu Esencia: Número ${numerologyData.essence}
        - Tu Imagen: Número ${numerologyData.image}
        - Tu Misión de Vida: Número ${numerologyData.mission}
        - Tu Sendero Natal: Número ${numerologyData.lifePath}
        - Tus Karmas o Lecciones Pendientes: ${numerologyData.karmas}
        - Tu Deuda Kármica: ${numerologyData.deudaKarmica}
        - Tus Pináculos (Las etapas de tu vida): ${numerologyData.pinnacles}
        - Tus Desafíos: ${numerologyData.desafios}
    - **Cierre:** Termina con un párrafo de resumen bien desarrollado bajo el título "En Resumen, tus Números Dicen Esto:".

2.  **Tus Raíces Familiares (Constelaciones Familiares):**
    Observa el sistema familiar con respeto y claridad, y desarrolla tus observaciones.
    - **El Mapa de tu Sistema Familiar:** Describe con detalle las dinámicas que observes. Sé directo sobre las lealtades invisibles o los desórdenes sistémicos y explica cómo podrían estar afectando a la persona hoy.
    - **Un Ejercicio para tu Sistema:** Propón un ejercicio práctico y bien explicado con una "frase sanadora". Detalla el propósito de la frase y el proceso para realizar el ejercicio.

3.  **Las Heridas como Guías (Heridas Emocionales):**
    Aborda las heridas como maestras. Identifica las heridas principales y explica con profundidad y ejemplos concretos cómo se manifiestan en el día a día. Sé directo pero enfocado en la oportunidad de crecimiento que representan. Desarrolla la explicación.

4.  **El Poder de Tu Lenguaje (PNL):**
    Analiza el lenguaje como la herramienta que crea la realidad. Desarrolla cada punto.
    - **El Patrón en tu Lenguaje:** Identifica un patrón de lenguaje limitante de forma clara y explícalo.
    - **Una Práctica para Cambiarlo:** Ofrece un ejercicio simple y bien detallado para cambiarlo.
    - **El Beneficio Directo:** Explica el beneficio práctico y tangible de este cambio.

5.  **Tu Historia: Un Puente Hacia tu Potencial (Tu Cuento):**
    Esta es la culminación. Usando el estilo de lenguaje hipnótico de Milton Erickson, vas a tejer una narrativa que sirva como un puente desde el estado actual de la persona hacia su potencial.
    - **Punto de Partida (Acompañar/Pacing):** Comienza validando su realidad actual, resumiendo los dones y desafíos del mapa. Por ejemplo: "Y mientras estás aquí, leyendo esto, quizás eres consciente de que..."
    - **Construyendo el Puente (Guiar/Leading):** Introduce el cambio sutilmente. Usa sugestiones indirectas ("Y no sé en qué momento exacto te darás cuenta de que la fuerza de tu número X ya está trabajando para ti..."), presuposiciones ("A medida que continúes este viaje, notarás cómo...") y metáforas que ilustren su transformación.
    - **El Potencial Desplegado:** Describe el futuro deseado como una consecuencia natural de su viaje. Pinta una imagen de la persona viviendo su potencial, habiendo integrado las lecciones de su mapa.

Genera la respuesta estrictamente como un objeto JSON que se ajuste al esquema proporcionado. No incluyas ninguna explicación introductoria o final fuera del JSON.
`;
}

export const generateAstralMap = async (data: UserData): Promise<AstralMapAnalysis> => {
  try {
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
        thinkingConfig: { thinkingBudget: 1024 },
      }
    });

    const jsonText = textResponse.text.trim();
    const partialAnalysis = JSON.parse(jsonText) as Omit<AstralMapAnalysis, 'symbolicImage'> & { symbolicImagePrompt: string };
    
    if (!partialAnalysis.symbolicImagePrompt) {
        throw new Error("Could not generate a prompt for the symbolic image.");
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
        throw new Error("Image generation failed to return an image.");
    }

    const imageBase64 = imageResponse.generatedImages[0].image.imageBytes;

    // Remove the temporary prompt property and add the image
    const { symbolicImagePrompt, ...analysisData } = partialAnalysis;
    return {
      ...analysisData,
      symbolicImage: imageBase64,
    };

  } catch (error) {
    console.error("Error generating astral map:", error);
    throw new Error("Failed to generate astral map analysis. Please try again.");
  }
};
