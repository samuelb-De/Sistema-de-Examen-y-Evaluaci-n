import { Question } from '../types';

export const DEFAULT_QUESTIONS: Question[] = [
  // =========================================================================
  // GRUPO A: ALTO RENDIMIENTO / AVANZADO (Lógica Compleja y Algoritmia)
  // =========================================================================
  {
    id: 'grpA-dom-1',
    targetGroup: 'Grupo A',
    category: 'domino',
    title: 'Secuencia Modular Inversa y Simetría Cruzada',
    description: 'La cara superior disminuye en 2 unidades (módulo 7) mientras que la inferior aumenta en 3 unidades (módulo 7).',
    dominoSequence: [
      { top: 5, bottom: 1 },
      { top: 3, bottom: 4 },
      { top: 1, bottom: 0 },
      { top: 6, bottom: 3 },
      null
    ],
    options: [
      { id: 'opt-a1', text: '4 / 6', domino: { top: 4, bottom: 6 } },
      { id: 'opt-a2', text: '4 / 5', domino: { top: 4, bottom: 5 } },
      { id: 'opt-a3', text: '5 / 6', domino: { top: 5, bottom: 6 } },
      { id: 'opt-a4', text: '3 / 6', domino: { top: 3, bottom: 6 } }
    ],
    correctAnswerId: 'opt-a1',
    explanation: 'Superior: 5 - 2 = 3; 3 - 2 = 1; 1 - 2 = -1 mod 7 = 6; 6 - 2 = 4. Inferior: 1 + 3 = 4; 4 + 3 = 7 mod 7 = 0; 0 + 3 = 3; 3 + 3 = 6. Ficha resultante: 4 / 6.',
    points: 1
  },
  {
    id: 'grpA-dom-2',
    targetGroup: 'Grupo A',
    category: 'domino',
    title: 'Suma Constante de Puntas y Rotación',
    description: 'La suma de las caras de cada ficha consecutiva suma exactamente 7 en dominó (0+7 equivalente a 1+6, 2+5, 3+4).',
    dominoSequence: [
      { top: 1, bottom: 6 },
      { top: 2, bottom: 5 },
      { top: 3, bottom: 4 },
      { top: 4, bottom: 3 },
      null
    ],
    options: [
      { id: 'opt-a5', text: '5 / 2', domino: { top: 5, bottom: 2 } },
      { id: 'opt-a6', text: '5 / 3', domino: { top: 5, bottom: 3 } },
      { id: 'opt-a7', text: '6 / 1', domino: { top: 6, bottom: 1 } },
      { id: 'opt-a8', text: '4 / 4', domino: { top: 4, bottom: 4 } }
    ],
    correctAnswerId: 'opt-a5',
    explanation: 'La cara superior incrementa: 1, 2, 3, 4 -> 5. La inferior disminuye: 6, 5, 4, 3 -> 2. La ficha complementaria es 5 / 2.',
    points: 1
  },
  {
    id: 'grpA-dom-3',
    targetGroup: 'Grupo A',
    category: 'domino',
    title: 'Matriz de Dominó: Producto y Residuo de Dobles',
    description: 'Serie donde la cara superior sigue los números primos (2, 3, 5, 0 en mod 7) y la inferior se multiplica por 2 cíclicamente.',
    dominoSequence: [
      { top: 2, bottom: 1 },
      { top: 3, bottom: 2 },
      { top: 5, bottom: 4 },
      null
    ],
    options: [
      { id: 'opt-a9', text: '0 / 1', domino: { top: 0, bottom: 1 } },
      { id: 'opt-a10', text: '0 / 2', domino: { top: 0, bottom: 2 } },
      { id: 'opt-a11', text: '1 / 1', domino: { top: 1, bottom: 1 } },
      { id: 'opt-a12', text: '6 / 1', domino: { top: 6, bottom: 1 } }
    ],
    correctAnswerId: 'opt-a9',
    explanation: 'Superior: 2, 3, 5, 7 mod 7 = 0. Inferior: 1 * 2 = 2; 2 * 2 = 4; 4 * 2 = 8 mod 7 = 1. Ficha: 0 / 1.',
    points: 1
  },
  {
    id: 'grpA-math-1',
    targetGroup: 'Grupo A',
    category: 'math',
    title: 'Complejidad Algorítmica y Notación Big-O',
    description: 'Un algoritmo recorre una matriz de N x N y por cada celda ejecuta una búsqueda binaria en un arreglo ordenado de tamaño N. ¿Cuál es su complejidad temporal en el peor caso?',
    options: [
      { id: 'opt-am1', text: 'O(N² log N)' },
      { id: 'opt-am2', text: 'O(N³)' },
      { id: 'opt-am3', text: 'O(N log N)' },
      { id: 'opt-am4', text: 'O(2^N)' }
    ],
    correctAnswerId: 'opt-am1',
    explanation: 'El recorrido de la matriz N x N toma O(N²). Dentro de cada iteración se realiza una búsqueda binaria de O(log N). Por regla de multiplicación, la complejidad total es O(N² log N).',
    points: 1
  },
  {
    id: 'grpA-math-2',
    targetGroup: 'Grupo A',
    category: 'math',
    title: 'Aritmética Hexadecimal y Desplazamiento de Bits',
    description: 'En bajo nivel, se tiene el valor hexadecimal 0x1A. Si se aplica un desplazamiento a la izquierda de 2 bits (1A << 2), ¿cuál es el valor resultante en decimal?',
    options: [
      { id: 'opt-am5', text: '104' },
      { id: 'opt-am6', text: '52' },
      { id: 'opt-am7', text: '208' },
      { id: 'opt-am8', text: '96' }
    ],
    correctAnswerId: 'opt-am5',
    explanation: '0x1A en decimal es (1 * 16) + 10 = 26. Desplazar a la izquierda 2 bits equivale a multiplicar por 2² = 4. Por tanto, 26 * 4 = 104.',
    points: 1
  },
  {
    id: 'grpA-math-3',
    targetGroup: 'Grupo A',
    category: 'math',
    title: 'Disponibilidad Cloud SLA 99.99%',
    description: 'Un microservicio en producción garantiza un SLA de disponibilidad del 99.99% en un año estándar de 365 días (8760 horas). ¿Cuál es el tiempo máximo de inactividad permitido (downtime)?',
    options: [
      { id: 'opt-am9', text: 'Aproximadamente 52.56 minutos' },
      { id: 'opt-am10', text: 'Aproximadamente 8.76 horas' },
      { id: 'opt-am11', text: 'Aproximadamente 3.65 días' },
      { id: 'opt-am12', text: 'Aproximadamente 1.5 horas' }
    ],
    correctAnswerId: 'opt-am9',
    explanation: 'El 0.01% de inactividad sobre 8760 horas es: 8760 * 0.0001 = 0.876 horas = 0.876 * 60 minutos = 52.56 minutos al año.',
    points: 1
  },
  {
    id: 'grpA-reading-1',
    targetGroup: 'Grupo A',
    category: 'reading',
    title: 'Arquitectura de Microservicios: Teorema CAP e Idempotencia',
    contextText: 'En sistemas bancarios distribuidos, cuando ocurre una partición de red (P), el sistema debe elegir entre consistencia estricta (C) o disponibilidad inmediata (A). Para evitar dobles transacciones ante reintentos de red, se exige que los endpoints sean estrictamente idempotentes usando llaves UUID únicas por operación.',
    description: 'Según el texto, ¿cuál es la razón primordial de exigir idempotencia con UUID en un entorno distribuido?',
    options: [
      { id: 'opt-ar1', text: 'Evitar duplicidad de transacciones cuando una petición se reintenta por fallas temporales de red' },
      { id: 'opt-ar2', text: 'Mejorar la velocidad de renderizado de la interfaz gráfica' },
      { id: 'opt-ar3', text: 'Reducir el tamaño de las tablas en la base de datos relacional' },
      { id: 'opt-ar4', text: 'Sustituir por completo el uso de protocolos seguros HTTPS' }
    ],
    correctAnswerId: 'opt-ar1',
    explanation: 'La idempotencia asegura que enviar la misma petición múltiples veces (debido a timeouts o reintentos) produzca el mismo efecto que una sola ejecución, impidiendo cobros duplicados.',
    points: 1
  },
  {
    id: 'grpA-reading-2',
    targetGroup: 'Grupo A',
    category: 'reading',
    title: 'Inyección de Dependencias y Principio SOLID (DIP)',
    contextText: 'El Principio de Inversión de Dependencias estipula que los módulos de alto nivel no deben depender de módulos de bajo nivel; ambos deben depender de abstracciones. Asimismo, las abstracciones no deben depender de los detalles, sino los detalles de las abstracciones.',
    description: 'En el desarrollo de software ADSO, ¿cuál es un beneficio directo de aplicar este principio arquitectónico?',
    options: [
      { id: 'opt-ar5', text: 'Facilita el testing unitario mediante mocks y permite desacoplar componentes para evolucionar sin romper el sistema' },
      { id: 'opt-ar6', text: 'Hace que el código se ejecute en un solo hilo sin necesidad de memoria RAM' },
      { id: 'opt-ar7', text: 'Obliga a que todas las variables del sistema sean globales' },
      { id: 'opt-ar8', text: 'Elimina la necesidad de utilizar bases de datos' }
    ],
    correctAnswerId: 'opt-ar5',
    explanation: 'Desacoplar las implementaciones mediante interfaces permite inyectar simulaciones (mocks) durante pruebas y reemplazar servicios sin alterar la lógica de negocio.',
    points: 1
  },
  {
    id: 'grpA-psycho-1',
    targetGroup: 'Grupo A',
    category: 'psycho',
    title: 'Resolución de Incidentes Críticos en Producción',
    description: 'Ocurre una caída imprevista en el clúster productivo a las 11:00 PM. ¿Cómo abordas la situación?',
    options: [
      {
        id: 'opt-ap1',
        text: 'Analizo los dashboards de observabilidad (Grafana, logs de Kubernetes y diagramas de flujo de datos) para aislar la causa raíz de forma visual y sistemática.',
        learningStyle: 'Visual',
        projectStyle: 'Ágil'
      },
      {
        id: 'opt-ap2',
        text: 'Abro de inmediato un canal de voz técnico con los ingenieros clave para debatir hipótesis en caliente y coordinar acciones.',
        learningStyle: 'Auditivo',
        projectStyle: 'Ágil'
      },
      {
        id: 'opt-ap3',
        text: 'Reviso el protocolo de contingencia documentado en el manual de incidentes paso a paso y registro cada comando ejecutado.',
        learningStyle: 'Kinestésico',
        projectStyle: 'Tradicional'
      }
    ],
    points: 1
  },
  {
    id: 'grpA-psycho-2',
    targetGroup: 'Grupo A',
    category: 'psycho',
    title: 'Diseño y Evolución de la Arquitectura del Software',
    description: 'Al diseñar la arquitectura para un nuevo sistema empresarial en ADSO, ¿cuál es tu enfoque predilecto?',
    options: [
      {
        id: 'opt-ap4',
        text: 'Construir un prototipo mínimo viable funcional (Spike), interactuando directamente con el código para validar la latencia empíricamente.',
        learningStyle: 'Kinestésico',
        projectStyle: 'Ágil'
      },
      {
        id: 'opt-ap5',
        text: 'Modelar esquemas C4 y diagramas de arquitectura en Figma o PlantUML antes de tirar la primera línea de código.',
        learningStyle: 'Visual',
        projectStyle: 'Híbrida'
      },
      {
        id: 'opt-ap6',
        text: 'Reunir al equipo de desarrollo y a los líderes para debatir las ventajas y desventajas de cada stack tecnológico.',
        learningStyle: 'Auditivo',
        projectStyle: 'Híbrida'
      }
    ],
    points: 1
  },

  // =========================================================================
  // GRUPO B: NIVEL INTERMEDIO (Lógica Secuencial y Estructuras de Datos)
  // =========================================================================
  {
    id: 'grpB-dom-1',
    targetGroup: 'Grupo B',
    category: 'domino',
    title: 'Secuencia de Saltos Alternos (+2 y +1)',
    description: 'Observa la serie de fichas: la cara superior aumenta de 2 en 2, y la inferior aumenta de 1 en 1.',
    dominoSequence: [
      { top: 0, bottom: 1 },
      { top: 2, bottom: 2 },
      { top: 4, bottom: 3 },
      { top: 6, bottom: 4 },
      null
    ],
    options: [
      { id: 'opt-b1', text: '1 / 5', domino: { top: 1, bottom: 5 } },
      { id: 'opt-b2', text: '0 / 5', domino: { top: 0, bottom: 5 } },
      { id: 'opt-b3', text: '2 / 5', domino: { top: 2, bottom: 5 } },
      { id: 'opt-b4', text: '1 / 6', domino: { top: 1, bottom: 6 } }
    ],
    correctAnswerId: 'opt-b1',
    explanation: 'Superior: 0 (+2) -> 2 (+2) -> 4 (+2) -> 6 (+2) -> 8 mod 7 = 1. Inferior: 1 (+1) -> 2 (+1) -> 3 (+1) -> 4 (+1) -> 5. La ficha es 1 / 5.',
    points: 1
  },
  {
    id: 'grpB-dom-2',
    targetGroup: 'Grupo B',
    category: 'domino',
    title: 'Inversión de Espejo y Paso Constante',
    description: 'Las fichas intercambian sus valores entre la cara superior e inferior en cada turno sumando 1 a la pareja.',
    dominoSequence: [
      { top: 1, bottom: 3 },
      { top: 3, bottom: 2 },
      { top: 2, bottom: 4 },
      { top: 4, bottom: 3 },
      null
    ],
    options: [
      { id: 'opt-b5', text: '3 / 5', domino: { top: 3, bottom: 5 } },
      { id: 'opt-b6', text: '5 / 3', domino: { top: 5, bottom: 3 } },
      { id: 'opt-b7', text: '4 / 5', domino: { top: 4, bottom: 5 } },
      { id: 'opt-b8', text: '2 / 4', domino: { top: 2, bottom: 4 } }
    ],
    correctAnswerId: 'opt-b5',
    explanation: 'La cara superior toma el valor inferior previo (3). La cara inferior aumenta en 1 respecto a la anterior superior (4+1=5). La ficha es 3 / 5.',
    points: 1
  },
  {
    id: 'grpB-dom-3',
    targetGroup: 'Grupo B',
    category: 'domino',
    title: 'Serie Progresiva de Dobles',
    description: 'Determina la ficha que continúa la serie regular de fichas dobles en el dominó.',
    dominoSequence: [
      { top: 1, bottom: 1 },
      { top: 2, bottom: 2 },
      { top: 4, bottom: 4 },
      null
    ],
    options: [
      { id: 'opt-b9', text: '1 / 1 (Ciclo mod 7)', domino: { top: 1, bottom: 1 } },
      { id: 'opt-b10', text: '5 / 5', domino: { top: 5, bottom: 5 } },
      { id: 'opt-b11', text: '0 / 0', domino: { top: 0, bottom: 0 } },
      { id: 'opt-b12', text: '3 / 3', domino: { top: 3, bottom: 3 } }
    ],
    correctAnswerId: 'opt-b9',
    explanation: 'La serie de dobles duplica su valor: 1 -> 2 -> 4 -> 8 (en módulo 7: 8 - 7 = 1). La ficha resultante es 1 / 1.',
    points: 1
  },
  {
    id: 'grpB-math-1',
    targetGroup: 'Grupo B',
    category: 'math',
    title: 'Conversión de Binario a Decimal',
    description: 'En el protocolo de red IPv4, una máscara de subred contiene el octeto binario 11100000. ¿A qué número decimal equivale este valor?',
    options: [
      { id: 'opt-bm1', text: '224' },
      { id: 'opt-bm2', text: '192' },
      { id: 'opt-bm3', text: '240' },
      { id: 'opt-bm4', text: '128' }
    ],
    correctAnswerId: 'opt-bm1',
    explanation: 'Calculando potencias de 2: 128 + 64 + 32 = 224.',
    points: 1
  },
  {
    id: 'grpB-math-2',
    targetGroup: 'Grupo B',
    category: 'math',
    title: 'Cálculo de Ancho de Banda y Transferencia',
    description: 'Un instalador de software pesa 600 Megabytes (MB). Si la velocidad de descarga es constante de 80 Megabits por segundo (Mbps), ¿cuántos segundos tardará la descarga? (Recuerda: 1 Byte = 8 bits).',
    options: [
      { id: 'opt-bm5', text: '60 segundos' },
      { id: 'opt-bm6', text: '7.5 segundos' },
      { id: 'opt-bm7', text: '48 segundos' },
      { id: 'opt-bm8', text: '120 segundos' }
    ],
    correctAnswerId: 'opt-bm5',
    explanation: '600 MB equivalen a 600 * 8 = 4800 Megabits. Dividiendo entre 80 Mbps: 4800 / 80 = 60 segundos.',
    points: 1
  },
  {
    id: 'grpB-math-3',
    targetGroup: 'Grupo B',
    category: 'math',
    title: 'Conteo de Iteraciones en Bucles Anidados',
    description: 'Se ejecuta el siguiente pseudocódigo: "Para i de 1 a 4 hacer: Para j de 1 a 3 hacer: contador = contador + 2". Si contador inicia en 0, ¿cuál es su valor final?',
    options: [
      { id: 'opt-bm9', text: '24' },
      { id: 'opt-bm10', text: '12' },
      { id: 'opt-bm11', text: '14' },
      { id: 'opt-bm12', text: '20' }
    ],
    correctAnswerId: 'opt-bm9',
    explanation: 'El bucle exterior itera 4 veces y el interior 3 veces: 4 * 3 = 12 iteraciones totales. En cada una se suma 2: 12 * 2 = 24.',
    points: 1
  },
  {
    id: 'grpB-reading-1',
    targetGroup: 'Grupo B',
    category: 'reading',
    title: 'Estrategia de Ramas Gitflow vs Trunk-Based',
    contextText: 'En proyectos colaborativos, Gitflow utiliza ramas separadas para "develop", "release", "hotfix" y ramas de características ("feature"). En contraste, Trunk-Based Development promueve que todos los desarrolladores integren código diariamente a una sola rama principal protegida con pruebas automatizadas continuas.',
    description: '¿Cuál es la principal ventaja de Trunk-Based Development frente a ramas de larga duración?',
    options: [
      { id: 'opt-br1', text: 'Evita conflictos masivos de integración al final del sprint y fomenta despliegues continuos' },
      { id: 'opt-br2', text: 'Permite programar sin necesidad de usar ningún sistema de control de versiones' },
      { id: 'opt-br3', text: 'Garantiza que el software nunca tenga bugs' },
      { id: 'opt-br4', text: 'Elimina la necesidad de revisar código entre compañeros' }
    ],
    correctAnswerId: 'opt-br1',
    explanation: 'Integrar con frecuencia ramas pequeñas minimiza los "merge hells" y asegura que el código principal siempre esté en estado desplegable.',
    points: 1
  },
  {
    id: 'grpB-reading-2',
    targetGroup: 'Grupo B',
    category: 'reading',
    title: 'Criterios de Aceptación e Historias de Usuario',
    contextText: 'Una Historia de Usuario bien redactada sigue el formato: "Como [rol], quiero [funcionalidad] para [beneficio]". Los Criterios de Aceptación delimitan el alcance exacto y establecen los escenarios de prueba que deben cumplirse para dar la tarea por completada.',
    description: 'Si durante el desarrollo un cliente pide añadir una función no contemplada en los criterios de aceptación acordados, ¿qué debe hacerse?',
    options: [
      { id: 'opt-br5', text: 'Documentar el nuevo requerimiento como una nueva historia de usuario para ser priorizada en el backlog' },
      { id: 'opt-br6', text: 'Desarrollarla de inmediato sin registrarla ni avisar al equipo' },
      { id: 'opt-br7', text: 'Cancelar el proyecto de desarrollo por completo' },
      { id: 'opt-br8', text: 'Borrar los criterios de aceptación previos' }
    ],
    correctAnswerId: 'opt-br5',
    explanation: 'Gestionar el cambio de alcance agregando una nueva historia al backlog protege el sprint en curso y mantiene la transparencia con los interesados.',
    points: 1
  },
  {
    id: 'grpB-psycho-1',
    targetGroup: 'Grupo B',
    category: 'psycho',
    title: 'Metodología de Aprendizaje de Nuevos Frameworks',
    description: 'Cuando debes aprender una tecnología nueva (por ejemplo, React o NestJS), ¿cuál es tu método predilecto?',
    options: [
      {
        id: 'opt-bp1',
        text: 'Clonar un proyecto demo y ponerme a programar modificando componentes de inmediato para ver los cambios en pantalla.',
        learningStyle: 'Kinestésico',
        projectStyle: 'Ágil'
      },
      {
        id: 'opt-bp2',
        text: 'Ver video-tutoriales con diagramas visuales y esquemas paso a paso.',
        learningStyle: 'Visual',
        projectStyle: 'Ágil'
      },
      {
        id: 'opt-bp3',
        text: 'Escuchar podcasts técnicos y debatir las características con desarrolladores experimentados.',
        learningStyle: 'Auditivo',
        projectStyle: 'Híbrida'
      }
    ],
    points: 1
  },
  {
    id: 'grpB-psycho-2',
    targetGroup: 'Grupo B',
    category: 'psycho',
    title: 'Organización del Trabajo en Equipo',
    description: 'En el desarrollo de un módulo grupal en ADSO, ¿qué dinámica prefieres?',
    options: [
      {
        id: 'opt-bp4',
        text: 'Un tablero Kanban interactivo con reuniones diarias breves de 15 minutos (Dailies) para coordinar avances dinámicos.',
        learningStyle: 'Visual',
        projectStyle: 'Ágil'
      },
      {
        id: 'opt-bp5',
        text: 'Un cronograma Gantt detallado con fechas de entrega fijas y especificaciones estáticas por adelantado.',
        learningStyle: 'Kinestésico',
        projectStyle: 'Tradicional'
      },
      {
        id: 'opt-bp6',
        text: 'Un esquema mixto donde definimos entregables por fases pero adaptamos las tareas semanalmente.',
        learningStyle: 'Auditivo',
        projectStyle: 'Híbrida'
      }
    ],
    points: 1
  },

  // =========================================================================
  // GRUPO C: FUNDAMENTOS Y PRINCIPIOS (Básico / Nivel Inicial)
  // =========================================================================
  {
    id: 'grpC-dom-1',
    targetGroup: 'Grupo C',
    category: 'domino',
    title: 'Secuencia Progresiva Simple (+1 en ambas caras)',
    description: 'Determina cuál es la ficha de dominó que continúa lógicamente la serie horizontal ascendente.',
    dominoSequence: [
      { top: 1, bottom: 2 },
      { top: 2, bottom: 3 },
      { top: 3, bottom: 4 },
      { top: 4, bottom: 5 },
      null
    ],
    options: [
      { id: 'opt-c1', text: '5 / 6', domino: { top: 5, bottom: 6 } },
      { id: 'opt-c2', text: '5 / 5', domino: { top: 5, bottom: 5 } },
      { id: 'opt-c3', text: '4 / 6', domino: { top: 4, bottom: 6 } },
      { id: 'opt-c4', text: '6 / 0', domino: { top: 6, bottom: 0 } }
    ],
    correctAnswerId: 'opt-c1',
    explanation: 'La cara superior incrementa de 1 en 1 (1, 2, 3, 4 -> 5). La cara inferior también incrementa de 1 en 1 (2, 3, 4, 5 -> 6). La ficha resultante es 5 / 6.',
    points: 1
  },
  {
    id: 'grpC-dom-2',
    targetGroup: 'Grupo C',
    category: 'domino',
    title: 'Ficha Fija y Cara Ascendente',
    description: 'La cara superior se mantiene constante en 3, mientras que la cara inferior sube de 1 en 1.',
    dominoSequence: [
      { top: 3, bottom: 0 },
      { top: 3, bottom: 1 },
      { top: 3, bottom: 2 },
      { top: 3, bottom: 3 },
      null
    ],
    options: [
      { id: 'opt-c5', text: '3 / 4', domino: { top: 3, bottom: 4 } },
      { id: 'opt-c6', text: '3 / 5', domino: { top: 3, bottom: 5 } },
      { id: 'opt-c7', text: '4 / 4', domino: { top: 4, bottom: 4 } },
      { id: 'opt-c8', text: '3 / 3', domino: { top: 3, bottom: 3 } }
    ],
    correctAnswerId: 'opt-c5',
    explanation: 'La cara superior permanece constante en 3. La inferior avanza: 0, 1, 2, 3 -> 4. La ficha es 3 / 4.',
    points: 1
  },
  {
    id: 'grpC-dom-3',
    targetGroup: 'Grupo C',
    category: 'domino',
    title: 'Simetría de Espejo Simple',
    description: 'Cada ficha invierte los valores de la ficha anterior.',
    dominoSequence: [
      { top: 1, bottom: 5 },
      { top: 5, bottom: 1 },
      { top: 2, bottom: 4 },
      null
    ],
    options: [
      { id: 'opt-c9', text: '4 / 2', domino: { top: 4, bottom: 2 } },
      { id: 'opt-c10', text: '2 / 4', domino: { top: 2, bottom: 4 } },
      { id: 'opt-c11', text: '4 / 4', domino: { top: 4, bottom: 4 } },
      { id: 'opt-c12', text: '3 / 3', domino: { top: 3, bottom: 3 } }
    ],
    correctAnswerId: 'opt-c9',
    explanation: 'La pareja 1/5 se invierte a 5/1. Por consiguiente, la pareja 2/4 se invierte a 4/2.',
    points: 1
  },
  {
    id: 'grpC-math-1',
    targetGroup: 'Grupo C',
    category: 'math',
    title: 'Operadores Lógicos Booleanos Básicos',
    description: 'En programación, si la condición A es VERDADERA (true) y la condición B es FALSA (false), ¿cuál es el resultado de la expresión: (A AND B) OR A?',
    options: [
      { id: 'opt-cm1', text: 'VERDADERO (true)' },
      { id: 'opt-cm2', text: 'FALSO (false)' },
      { id: 'opt-cm3', text: 'Error de sintaxis' },
      { id: 'opt-cm4', text: 'Indeterminado' }
    ],
    correctAnswerId: 'opt-cm1',
    explanation: '(true AND false) resulta en false. Luego, (false OR true) resulta en true (VERDADERO).',
    points: 1
  },
  {
    id: 'grpC-math-2',
    targetGroup: 'Grupo C',
    category: 'math',
    title: 'Cálculo de Presupuesto de Equipos de Cómputo',
    description: 'Un laboratorio del SENA adquiere 5 computadores a $2.000.000 COP cada uno. Si el proveedor otorga un descuento del 10% sobre el valor total, ¿cuánto paga la institución?',
    options: [
      { id: 'opt-cm5', text: '$9.000.000 COP' },
      { id: 'opt-cm6', text: '$8.000.000 COP' },
      { id: 'opt-cm7', text: '$9.500.000 COP' },
      { id: 'opt-cm8', text: '$10.000.000 COP' }
    ],
    correctAnswerId: 'opt-cm5',
    explanation: 'El costo inicial es 5 * $2.000.000 = $10.000.000. El 10% de descuento es $1.000.000. Total a pagar: $10.000.000 - $1.000.000 = $9.000.000 COP.',
    points: 1
  },
  {
    id: 'grpC-math-3',
    targetGroup: 'Grupo C',
    category: 'math',
    title: 'Secuencia Aritmética de Memoria RAM',
    description: 'Los módulos de memoria estándar aumentan en progresión geométrica: 2 GB, 4 GB, 8 GB, 16 GB... ¿Cuál es el siguiente valor en la secuencia?',
    options: [
      { id: 'opt-cm9', text: '32 GB' },
      { id: 'opt-cm10', text: '24 GB' },
      { id: 'opt-cm11', text: '20 GB' },
      { id: 'opt-cm12', text: '64 GB' }
    ],
    correctAnswerId: 'opt-cm9',
    explanation: 'Cada término se obtiene multiplicando el anterior por 2: 16 * 2 = 32 GB.',
    points: 1
  },
  {
    id: 'grpC-reading-1',
    targetGroup: 'Grupo C',
    category: 'reading',
    title: 'Buenas Prácticas en el Desarrollo de Software',
    contextText: 'Escribir código limpio significa utilizar nombres de variables claros y autoexplicativos, estructurar funciones pequeñas que hagan una sola cosa bien y documentar las partes críticas. Esto facilita que otros compañeros de equipo puedan entender y mantener el sistema a lo largo del tiempo.',
    description: '¿Por qué es importante mantener el código ordenado y legible en un equipo de desarrollo?',
    options: [
      { id: 'opt-cr1', text: 'Porque reduce el tiempo de depuración y facilita que cualquier miembro del equipo pueda mantenerlo' },
      { id: 'opt-cr2', text: 'Porque hace que el ordenador consuma cero electricidad' },
      { id: 'opt-cr3', text: 'Porque evita tener que encender el monitor' },
      { id: 'opt-cr4', text: 'Porque el compilador rechaza cualquier código que no tenga comentarios en cada línea' }
    ],
    correctAnswerId: 'opt-cr1',
    explanation: 'El software se lee muchas más veces de las que se escribe; la legibilidad disminuye la fricción y el costo de mantenimiento en equipo.',
    points: 1
  },
  {
    id: 'grpC-reading-2',
    targetGroup: 'Grupo C',
    category: 'reading',
    title: 'Seguridad Básica: Autenticación y Contraseñas',
    contextText: 'Nunca se deben guardar contraseñas en texto plano en una base de datos. Se deben utilizar funciones hash criptográficas seguras (como bcrypt o Argon2) con una sal (salt) aleatoria para proteger la información de los usuarios ante posibles filtraciones.',
    description: '¿Qué mecanismo previene que las contraseñas se almacenen de forma vulnerable en texto legible?',
    options: [
      { id: 'opt-cr5', text: 'El uso de algoritmos hash criptográficos unidireccionales con sal' },
      { id: 'opt-cr6', text: 'Guardarlas en un bloc de notas compartido en red' },
      { id: 'opt-cr7', text: 'Escribirlas al revés en la base de datos' },
      { id: 'opt-cr8', text: 'Cambiar el tipo de letra de la interfaz' }
    ],
    correctAnswerId: 'opt-cr5',
    explanation: 'Las funciones de dispersión criptográfica convierten la contraseña en un resumen irrevesible, impidiendo que sea descubierta directamente.',
    points: 1
  },
  {
    id: 'grpC-psycho-1',
    targetGroup: 'Grupo C',
    category: 'psycho',
    title: 'Entendimiento de Requerimientos Iniciales',
    description: 'Al recibir tu primera tarea de desarrollo en clase o empresa, ¿cómo prefieres asimilar la instrucción?',
    options: [
      {
        id: 'opt-cp1',
        text: 'Viendo un prototipo visual o boceto del resultado esperado en pantalla.',
        learningStyle: 'Visual',
        projectStyle: 'Ágil'
      },
      {
        id: 'opt-cp2',
        text: 'Escuchando la explicación paso a paso de mi instructor o líder de equipo.',
        learningStyle: 'Auditivo',
        projectStyle: 'Híbrida'
      },
      {
        id: 'opt-cp3',
        text: 'Empezando a teclear un ejemplo básico y probándolo por mi cuenta de inmediato.',
        learningStyle: 'Kinestésico',
        projectStyle: 'Ágil'
      }
    ],
    points: 1
  },
  {
    id: 'grpC-psycho-2',
    targetGroup: 'Grupo C',
    category: 'psycho',
    title: 'Gestión del Tiempo y Tareas Diarias',
    description: '¿Cómo manejas tus actividades diarias cuando tienes múltiples entregas académicas?',
    options: [
      {
        id: 'opt-cp4',
        text: 'Uso una lista visual de tareas pendientes que voy tachando conforme las completo.',
        learningStyle: 'Visual',
        projectStyle: 'Ágil'
      },
      {
        id: 'opt-cp5',
        text: 'Sigo un horario fijo estructurado hora por hora con disciplina rigurosa.',
        learningStyle: 'Kinestésico',
        projectStyle: 'Tradicional'
      },
      {
        id: 'opt-cp6',
        text: 'Coordino con compañeros de estudio para recordar fechas clave y apoyarnos mutuamente.',
        learningStyle: 'Auditivo',
        projectStyle: 'Híbrida'
      }
    ],
    points: 1
  }
];
