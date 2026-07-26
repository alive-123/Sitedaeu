import {
  Subject,
  Exercise,
  Flashcard,
  StudyTask,
  Note,
  ErrorLogItem,
  Exam,
  ExamAttempt,
  UserProfile,
} from '../types';

export const INITIAL_PROFILE: UserProfile = {
  name: 'Elias',
  age: 24,
  location: 'Montigny-lès-Cormeilles, France',
  targetExamDate: '2026-10-15',
  dailyGoalMinutesGoodDay: 270, // 4.5h
  dailyGoalMinutesToughDay: 30, // 30m
  isDarkMode: true,
};

export const SUBJECTS: Subject[] = [
  {
    id: 'maths',
    name: 'Mathématiques',
    iconName: 'Calculator',
    color: '#3B82F6', // Blue
    bgGradient: 'from-blue-600/20 to-indigo-600/10 border-blue-500/30',
    description: 'Calcul numérique, algèbre, équations, fonctions et lecture graphique.',
    workedConceptsCount: 12,
    totalConceptsCount: 12,
    chapters: [
      {
        id: 'math_c1',
        subjectId: 'maths',
        title: 'Calcul numérique & Nombres',
        description: 'Priorités, nombres relatifs, fractions, pourcentages et proportionnalité.',
        concepts: [
          {
            id: 'm1',
            title: 'Priorités opératoires',
            mastery: 75,
            worked: true,
            summary: 'Dans un calcul sans parenthèses, les multiplications et divisions sont prioritaires sur les additions et soustractions. Avec parenthèses, on calcule d’abord l’intérieur des parenthèses les plus internes.',
            examples: [
              {
                problem: 'Calculer A = 5 + 3 × (10 - 4)',
                solution: 'A = 5 + 3 × 6 = 5 + 18 = 23',
                method: '1. Calculer entre parenthèses (10 - 4 = 6). 2. Effectuer la multiplication (3 × 6 = 18). 3. Effectuer l’addition finale.'
              }
            ]
          },
          {
            id: 'm2',
            title: 'Nombres relatifs',
            mastery: 70,
            worked: true,
            summary: 'Règle des signes pour la multiplication/division : deux signes identiques donnent (+), deux signes différents donnent (-). Pour l’addition : garder le signe de la plus grande valeur absolue.',
            examples: [
              {
                problem: 'Calculer B = (-4) × (-3) + (-10) ÷ 2',
                solution: 'B = (+12) + (-5) = 12 - 5 = 7',
                method: '(-4)×(-3) = +12. (-10)÷2 = -5. Puis +12 + (-5) = 7.'
              }
            ]
          },
          {
            id: 'm3',
            title: 'Fractions',
            mastery: 65,
            worked: true,
            summary: 'Addition/Soustraction : réduire au même dénominateur. Multiplication : multiplier les numérateurs entre eux et les dénominateurs entre eux. Division : multiplier par l’inverse.',
            examples: [
              {
                problem: 'Calculer C = (2/3) + (1/4)',
                solution: 'C = (8/12) + (3/12) = 11/12',
                method: 'Dénominateur commun = 12. 2/3 = 8/12 et 1/4 = 3/12. On additionne les numérateurs.'
              }
            ]
          },
          {
            id: 'm4',
            title: 'Pourcentages & Proportionnalité',
            mastery: 80,
            worked: true,
            summary: 'Pour calculer x% d’une valeur, on multiplie par x/100. Pour la proportionnalité, utiliser le produit en croix ou le coefficient de proportionnalité.',
            examples: [
              {
                problem: 'Appliquer une réduction de 20% sur un article à 80 €.',
                solution: 'Montant réduction = 80 × (20/100) = 16 €. Prix final = 80 - 16 = 64 €.',
                method: 'Multiplier par le pourcentage puis soustraire du prix initial.'
              }
            ]
          }
        ]
      },
      {
        id: 'math_c2',
        subjectId: 'maths',
        title: 'Algèbre & Équations',
        description: 'Équations simples, inconnue dans les 2 membres, développement et factorisation.',
        concepts: [
          {
            id: 'm5',
            title: 'Équations simples (ax + b = c)',
            mastery: 60,
            worked: true,
            summary: 'Isoler x en effectuant la même opération (addition, soustraction, multiplication, division) des deux côtés de l’égalité.',
            examples: [
              {
                problem: 'Résoudre 3x + 5 = 17',
                solution: '3x = 17 - 5 => 3x = 12 => x = 12 / 3 => x = 4',
                method: '1. Soustraire 5 des deux côtés. 2. Diviser par 3.'
              }
            ]
          },
          {
            id: 'm6',
            title: 'Équations avec inconnue dans les deux membres',
            mastery: 55,
            worked: true,
            summary: 'Regrouper tous les termes en x d’un côté de l’égalité et les termes constants de l’autre côté.',
            examples: [
              {
                problem: 'Résoudre 5x - 3 = 2x + 9',
                solution: '5x - 2x = 9 + 3 => 3x = 12 => x = 4',
                method: '1. Passer 2x à gauche (- 2x). 2. Passer -3 à droite (+ 3). 3. Simplifier et diviser.'
              }
            ]
          },
          {
            id: 'm7',
            title: 'Développement & Factorisation',
            mastery: 50,
            worked: true,
            summary: 'Développer : k(a + b) = ka + kb. Double distributivité : (a+b)(c+d) = ac + ad + bc + bd. Factoriser : trouver le facteur commun ka + kb = k(a + b).',
            examples: [
              {
                problem: 'Développer D = (2x + 3)(x - 4)',
                solution: 'D = 2x*x - 8x + 3x - 12 = 2x² - 5x - 12',
                method: 'Appliquer la double distributivité terme à terme.'
              }
            ]
          },
          {
            id: 'm8',
            title: 'Identités & Expressions algébriques',
            mastery: 45,
            worked: true,
            summary: 'Identités remarquables : (a+b)² = a² + 2ab + b², (a-b)² = a² - 2ab + b², (a+b)(a-b) = a² - b².',
            examples: [
              {
                problem: 'Développer (3x - 2)²',
                solution: '(3x)² - 2*(3x)*(2) + 2² = 9x² - 12x + 4',
                method: 'Utiliser la 2e identité remarquable (a-b)².'
              }
            ]
          }
        ]
      },
      {
        id: 'math_c3',
        subjectId: 'maths',
        title: 'Fonctions & Représentation graphique',
        description: 'Notion de fonction, images, antécédents, lecture de tableaux et de graphiques.',
        concepts: [
          {
            id: 'm9',
            title: 'Notion de fonction & Notations',
            mastery: 60,
            worked: true,
            summary: 'Une fonction f associe à un nombre x un unique nombre f(x). x est la variable d’entrée.',
            examples: [
              {
                problem: 'Soit f(x) = 2x² - 3. Calculer f(3).',
                solution: 'f(3) = 2*(3)² - 3 = 2*9 - 3 = 18 - 3 = 15.',
                method: 'Remplacer x par 3 dans l’expression de la fonction.'
              }
            ]
          },
          {
            id: 'm10',
            title: 'Images et Antécédents',
            mastery: 50,
            worked: true,
            summary: 'L’image de x par f se calcule en évaluant f(x). Un antécédeut de y par f s’obtient en résolvant l’équation f(x) = y.',
            examples: [
              {
                problem: 'Trouver l’antécédent de 7 par f(x) = 3x + 1.',
                solution: 'Résoudre 3x + 1 = 7 => 3x = 6 => x = 2.',
                method: 'Poser f(x) = 7 et résoudre l’équation pour trouver x.'
              }
            ]
          },
          {
            id: 'm11',
            title: 'Lecture de tableaux de valeurs',
            mastery: 70,
            worked: true,
            summary: 'Un tableau de valeurs associe sur la 1re ligne les valeurs de x et sur la 2e ligne leurs images f(x).',
            examples: [
              {
                problem: 'Si le tableau indique x = -2 => f(x) = 5, quelle est l’image de -2 ?',
                solution: 'L’image de -2 est 5.',
                method: 'Lire directement dans le tableau la valeur sur la ligne f(x).'
              }
            ]
          },
          {
            id: 'm12',
            title: 'Lecture de graphiques',
            mastery: 65,
            worked: true,
            summary: 'L’axe horizontal est l’axe des abscisses (x). L’axe vertical est l’axe des ordonnées (y = f(x)). Pour trouver une image, partir de l’abscisse vers la courbe puis lire l’ordonnée.',
            examples: [
              {
                problem: 'Comment déterminer graphiquement l’antécédent de 4 ?',
                solution: 'Partir de y = 4 sur l’axe vertical, aller horizontalement vers la courbe, puis descendre lire x sur l’axe horizontal.',
                method: 'Inverser la démarche de recherche d’image.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'physique',
    name: 'Physique',
    iconName: 'Zap',
    color: '#8B5CF6', // Purple
    bgGradient: 'from-purple-600/20 to-pink-600/10 border-purple-500/30',
    description: 'Cinématique, forces, énergie, conversions et méthode rigoureuse en 6 étapes.',
    workedConceptsCount: 5,
    totalConceptsCount: 5,
    chapters: [
      {
        id: 'phy_c1',
        subjectId: 'physique',
        title: 'Mouvement, Forces & Énergie',
        description: 'Formules fondamentales de vitesse, poids et énergie.',
        concepts: [
          {
            id: 'p1',
            title: 'Vitesse, distance et durée (v = d/t)',
            mastery: 70,
            worked: true,
            summary: 'Formule de vitesse v = d / t. On en déduit d = v × t et t = d / v. Veiller à la cohérence des unités (m et s -> m/s ; km et h -> km/h).',
            examples: [
              {
                problem: 'Un train parcourt 180 km en 2 h. Calculer sa vitesse moyenne.',
                solution: 'v = d / t = 180 / 2 = 90 km/h.',
                method: 'Appliquer v = d / t avec d en km et t en h.'
              }
            ]
          },
          {
            id: 'p2',
            title: 'Poids et Masse (P = m × g)',
            mastery: 60,
            worked: true,
            summary: 'La masse m (en kg) est une quantité de matière constante. Le poids P (en Newtons N) est une force de pesanteur : P = m × g (avec g ≈ 9,81 N/kg sur Terre).',
            examples: [
              {
                problem: 'Calculer le poids sur Terre d’un objet de masse m = 50 kg (g = 9,8 N/kg).',
                solution: 'P = m × g = 50 × 9,8 = 490 N.',
                method: 'Vérifier que m est bien en kg puis calculer P = m × g.'
              }
            ]
          },
          {
            id: 'p3',
            title: 'Énergie électrique et puissance (E = P × t)',
            mastery: 55,
            worked: true,
            summary: 'L’énergie consommée E dépend de la puissance P de l’appareil et de sa durée d’utilisation t : E = P × t. Si P est en Watts (W) et t en secondes (s), E est en Joules (J). Si P en kW et t en h, E en kWh.',
            examples: [
              {
                problem: 'Un radiateur de 2000 W fonctionne pendant 3 heures. Calculer l’énergie en kWh.',
                solution: 'P = 2000 W = 2 kW. t = 3 h. E = 2 × 3 = 6 kWh.',
                method: 'Convertir la puissance en kW puis multiplier par la durée en heures.'
              }
            ]
          },
          {
            id: 'p4',
            title: 'Conversions d’unités scientifiques',
            mastery: 65,
            worked: true,
            summary: 'Master des conversions : 1 h = 3600 s. Pour passer de km/h en m/s, diviser par 3,6. Pour passer de m/s en km/h, multiplier par 3,6. 1 kg = 1000 g.',
            examples: [
              {
                problem: 'Convertir 72 km/h en m/s.',
                solution: '72 / 3,6 = 20 m/s.',
                method: 'Diviser la vitesse en km/h par 3,6 pour obtenir des m/s.'
              }
            ]
          },
          {
            id: 'p5',
            title: 'Méthode de résolution en 6 étapes',
            mastery: 80,
            worked: true,
            summary: 'La méthode infaillible en physique : 1. Données | 2. Unités | 3. Conversions | 4. Formule littérale | 5. Calcul numérique | 6. Résultat avec unité finale.',
            examples: [
              {
                problem: 'Résoudre un problème complet avec la méthode en 6 étapes.',
                solution: '1. Données : d = 1500 m, t = 5 min. 2. Unités : m et min. 3. Conversion : t = 5 × 60 = 300 s. 4. Formule : v = d / t. 5. Calcul : v = 1500 / 300 = 5. 6. Résultat : v = 5 m/s.',
                method: 'Suivre rigoureusement les 6 étapes dans l’ordre pour ne perdre aucun point.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'biologie',
    name: 'Biologie',
    iconName: 'Activity',
    color: '#10B981', // Emerald
    bgGradient: 'from-emerald-600/20 to-teal-600/10 border-emerald-500/30',
    description: 'Organisation du vivant, rôle des organes, circulation sanguine et métabolisme.',
    workedConceptsCount: 5,
    totalConceptsCount: 5,
    chapters: [
      {
        id: 'bio_c1',
        subjectId: 'biologie',
        title: 'Organisation du Vivant & Organes',
        description: 'Hiérarchie biologique, rôles du cœur, poumons, reins et foie.',
        concepts: [
          {
            id: 'b1',
            title: 'Hiérarchie biologique (Cellule à Organisme)',
            mastery: 85,
            worked: true,
            summary: 'Cellule -> Tissu -> Organe -> Appareil (Système) -> Organisme. La cellule est l’unité structurale et fonctionnelle de tout être vivant.',
            examples: [
              {
                problem: 'Classer par ordre croissant de complexité : Cœur, Cellule musculaire, Organisme humain, Tissu musculaire, Appareil cardiovasculaire.',
                solution: 'Cellule musculaire -> Tissu musculaire -> Cœur (organe) -> Appareil cardiovasculaire -> Organisme humain.',
                method: 'Appliquer la hiérarchie biologique du plus petit au plus grand.'
              }
            ]
          },
          {
            id: 'b2',
            title: 'Rôles des grands organes (Cœur, Poumons, Reins, Foie)',
            mastery: 75,
            worked: true,
            summary: 'Cœur : pompe musculaire faisant circuler le sang. Poumons : hématose (échanges O2/CO2). Reins : filtration du sang et élimination des déchets (urée) dans l’urine. Foie : stockage, détoxification et digestion (bile).',
            examples: [
              {
                problem: 'Quel est le rôle principal des reins ?',
                solution: 'Filtrer le sang pour éliminer les déchets métaboliques sous forme d’urine et réguler l’eau et les sels minéraux.',
                method: 'Mémoriser la fonction d’épuration sanguine du rein.'
              }
            ]
          },
          {
            id: 'b3',
            title: 'Circulation sanguine & Vaisseaux',
            mastery: 65,
            worked: true,
            summary: 'Double circulation : petite circulation (cœur-poumons pour oxygéner le sang) et grande circulation (cœur-organes pour distribuer O2 et nutriments). Artères = du cœur vers les organes ; Veines = des organes vers le cœur ; Capillaires = lieux d’échanges.',
            examples: [
              {
                problem: 'Quelle est la différence entre une artère et une veine ?',
                solution: 'Une artère transporte le sang qui sort du cœur vers les organes. Une veine ramène le sang des organes vers le cœur.',
                method: 'Le sens de circulation définit l’artère ou la veine, pas seulement le taux d’oxygène.'
              }
            ]
          },
          {
            id: 'b4',
            title: 'Échanges gazeux & Transport (O2 et CO2)',
            mastery: 70,
            worked: true,
            summary: 'Au niveau des alvéoles pulmonaires, le dioxygène O2 passe de l’air vers le sang (fixé sur l’hémoglobine des globules rouges). Le CO2 fait le chemin inverse.',
            examples: [
              {
                problem: 'Comment le dioxygène est-il transporté dans le sang ?',
                solution: 'Il est majoritairement transporté fixé sur l’hémoglobine présente dans les hématies (globules rouges).',
                method: 'Associer O2 -> Hémoglobine -> Globules rouges.'
              }
            ]
          },
          {
            id: 'b5',
            title: 'Digestion, Nutriments & Production d’énergie',
            mastery: 60,
            worked: true,
            summary: 'La digestion transforme les aliments complexes en nutriments simples (glucose, acides animés...). Au niveau cellulaire, Nutriments + O2 -> Énergie (ATP) + CO2 + Déchets + Chaleur (Respiration cellulaire).',
            examples: [
              {
                problem: 'Écrire le bilan simplifié de la respiration cellulaire.',
                solution: 'Glucose + Dioxygène (O2) -> Énergie + Dioxyde de carbone (CO2) + Eau.',
                method: 'La cellule consomme du glucose et de l’O2 pour produire son énergie.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'francais',
    name: 'Français',
    iconName: 'BookOpen',
    color: '#EC4899', // Pink / Rose
    bgGradient: 'from-pink-600/20 to-rose-600/10 border-pink-500/30',
    description: 'Compréhension de texte, argumentation, paragraphe structuré et syntaxe.',
    workedConceptsCount: 4,
    totalConceptsCount: 4,
    chapters: [
      {
        id: 'fra_c1',
        subjectId: 'francais',
        title: 'Expression Écrite & Méthode',
        description: 'Analyse de consignes, structure de paragraphe et argumentation.',
        concepts: [
          {
            id: 'f1',
            title: 'Compréhension des consignes et textes',
            mastery: 70,
            worked: true,
            summary: 'Analyser les mots-clés de la consigne (expliquer, justifier, comparer, illustrer). Repérer la thèse de l’auteur et les idées principales d’un texte.',
            examples: [
              {
                problem: 'Que signifie "Justifiez votre réponse à l’aide du texte" ?',
                solution: 'Cela implique de donner une explication claire et de citer précisément un passage du texte entre guillemets.',
                method: 'Toujours associer la justification à une preuve textuelle.'
              }
            ]
          },
          {
            id: 'f2',
            title: 'Rédaction de paragraphes de 8 à 10 lignes',
            mastery: 65,
            worked: true,
            summary: 'Structure AEI : 1. Affirmation (Idée clé) | 2. Explication (Développement) | 3. Illustration (Exemple précis ou citation). Respecter la longueur recommandée.',
            examples: [
              {
                problem: 'Comment construire un paragraphe efficace de 8 lignes ?',
                solution: '1 ligne d’introduction d’idée, 4-5 lignes d’explication logique avec connecteurs (en effet, de plus, par conséquent), 2 lignes d’exemple concret.',
                method: 'Utiliser la méthode de la pyramide d’argumentation.'
              }
            ]
          },
          {
            id: 'f3',
            title: 'Formulation d’arguments et exemples',
            mastery: 60,
            worked: true,
            summary: 'Un argument est une idée générale abstraite. Un exemple est une illustration concrète (fait historique, expérience, œuvre littéraire, donnée statistique).',
            examples: [
              {
                problem: 'Proposer un argument et un exemple sur l’importance de la lecture.',
                solution: 'Argument : La lecture enrichit le vocabulaire et stimule l’empathie. Exemple : La lecture réguliere de romans permet de se mettre à la place de personnages variés.',
                method: 'Ne pas confondre l’argument (l’idée) et l’exemple (le fait concrétisant l’idée).'
              }
            ]
          },
          {
            id: 'f4',
            title: 'Orthographe, Syntaxe & Connecteurs logiques',
            mastery: 55,
            worked: true,
            summary: 'Accords sujet-verbe, accords dans le groupe nominal, emploi des connecteurs logiques (Car, Donc, Cependant, Néanmoins, De surcroît) pour lier les idées.',
            examples: [
              {
                problem: 'Corriger et améliorer : "Les élève qui travaille reussisse leurs examen parce que ils révisent."',
                solution: '"Les élèves qui travaillent réussissent leurs examens parce qu’ils révisent."',
                method: 'Vérifier la chaîne des accords au pluriel (élèves -> travaillent -> réussissent) et la gestion de l’élision (parce qu’ils).'
              }
            ]
          }
        ]
      }
    ]
  }
];

export const INITIAL_EXERCISES: Exercise[] = [
  // MATHS
  {
    id: 'ex_m1',
    subjectId: 'maths',
    chapterId: 'math_c1',
    conceptId: 'm1',
    title: 'Priorités opératoires complexes',
    type: 'numeric',
    question: 'Calculer la valeur exacte de l’expression suivante : A = 12 + 4 × (15 - 3 × 3)',
    correctAnswer: 36,
    explanation: 'D’abord la multiplication dans la parenthèse : 3 × 3 = 9. Puis la parenthèse : 15 - 9 = 6. Ensuite la multiplication : 4 × 6 = 24. Enfin l’addition : 12 + 24 = 36.',
    method: '1. Parenthèses internes (multiplication puis soustraction)\n2. Multiplication extérieure\n3. Addition finale',
    errorCode: 'C',
    conceptToReview: 'Priorités opératoires'
  },
  {
    id: 'ex_m2',
    subjectId: 'maths',
    chapterId: 'math_c1',
    conceptId: 'm3',
    title: 'Addition et réduction de fractions',
    type: 'qcm',
    question: 'Quelle est la forme irréductible de : F = (3/4) + (2/5) ?',
    options: ['23/20', '5/9', '11/20', '23/9'],
    correctAnswer: '23/20',
    explanation: 'Dénominateur commun = 20. (3/4) = 15/20 et (2/5) = 8/20. Donc (15 + 8)/20 = 23/20.',
    method: 'Trouver le plus petit dénominateur commun (20), convertir chaque fraction puis additionner les numérateurs.',
    errorCode: 'M',
    conceptToReview: 'Fractions - Addition'
  },
  {
    id: 'ex_m3',
    subjectId: 'maths',
    chapterId: 'math_c2',
    conceptId: 'm5',
    title: 'Résolution d’équation simple',
    type: 'step_by_step',
    question: 'Résoudre pas à pas l’équation : 4x - 7 = 17',
    correctAnswer: '6',
    explanation: 'Étape 1 : Isoler 4x en ajoutant 7 des deux côtés -> 4x = 24. Étape 2 : Diviser par 4 -> x = 6.',
    method: 'Isoler le terme en x d’un côté de l’égalité.',
    errorCode: 'S',
    conceptToReview: 'Équations simples',
    steps: [
      {
        instruction: 'Que vaut 4x après avoir ajouté 7 de chaque côté ?',
        answer: '24',
        explanation: '17 + 7 = 24.',
        hint: 'Ajoutez 7 à 17.'
      },
      {
        instruction: 'Quelle est la valeur finale de x (24 divisé par 4) ?',
        answer: '6',
        explanation: '24 / 4 = 6.',
        hint: 'Divisez 24 par 4.'
      }
    ]
  },
  {
    id: 'ex_m4',
    subjectId: 'maths',
    chapterId: 'math_c2',
    conceptId: 'm6',
    title: 'Équation avec x dans les deux membres',
    type: 'numeric',
    question: 'Quelle est la solution de l’équation : 7x - 5 = 2x + 15 ?',
    correctAnswer: 4,
    explanation: 'Regrouper les x à gauche : 7x - 2x = 5x. Regrouper les constantes à droite : 15 + 5 = 20. Donc 5x = 20 => x = 4.',
    method: '1. Soustraire 2x des deux côtés (5x - 5 = 15)\n2. Ajouter 5 des deux côtés (5x = 20)\n3. Diviser par 5 (x = 4)',
    errorCode: 'S',
    conceptToReview: 'Équations avec inconnue dans les deux membres'
  },
  {
    id: 'ex_m5',
    subjectId: 'maths',
    chapterId: 'math_c3',
    conceptId: 'm10',
    title: 'Recherche d’image par une fonction',
    type: 'numeric',
    question: 'Soit la fonction f définie par f(x) = 3x² - 2x + 1. Calculer l’image de -2 par la fonction f.',
    correctAnswer: 17,
    explanation: 'f(-2) = 3 × (-2)² - 2 × (-2) + 1 = 3 × 4 + 4 + 1 = 12 + 4 + 1 = 17.',
    method: 'Attention au carré du nombre négatif : (-2)² = +4, et (-2) × (-2) = +4.',
    errorCode: 'S',
    conceptToReview: 'Images et antécédents'
  },

  // PHYSIQUE
  {
    id: 'ex_p1',
    subjectId: 'physique',
    chapterId: 'phy_c1',
    conceptId: 'p1',
    title: 'Calcul de durée avec conversion de vitesse',
    type: 'numeric',
    question: 'Un automobiliste roule à une vitesse constante v = 90 km/h sur une distance d = 45 km. Combien de minutes dure son trajet ?',
    correctAnswer: 30,
    explanation: 't = d / v = 45 / 90 = 0,5 heure. En minutes : 0,5 × 60 = 30 minutes.',
    method: '1. Appliquer t = d / v.\n2. Convertir les heures décimales en minutes en multipliant par 60.',
    errorCode: 'U',
    conceptToReview: 'Vitesse, distance, durée'
  },
  {
    id: 'ex_p2',
    subjectId: 'physique',
    chapterId: 'phy_c1',
    conceptId: 'p2',
    title: 'Poids sur la Terre vs la Lune',
    type: 'qcm',
    question: 'Un astronaute a une masse m = 80 kg sur Terre (g = 9,8 N/kg). Quelle est sa masse sur la Lune (g_lune = 1,6 N/kg) ?',
    options: ['80 kg', '128 N', '13 kg', '784 N'],
    correctAnswer: '80 kg',
    explanation: 'La masse est une quantité de matière invariable ! Elle vaut 80 kg sur Terre comme sur la Lune. C’est le poids P qui varie.',
    method: 'Ne pas confondre la masse (en kg, constante) et le poids (en N, dépend de l’astre).',
    errorCode: 'K',
    conceptToReview: 'Poids et Masse'
  },
  {
    id: 'ex_p3',
    subjectId: 'physique',
    chapterId: 'phy_c1',
    conceptId: 'p5',
    title: 'Méthode en 6 étapes - Puissance électrique',
    type: 'step_by_step',
    question: 'Appliquer la méthode en 6 étapes : Un four micro-ondes de puissance P = 1200 W fonctionne pendant 10 minutes. Calculer l’énergie consommée en Joules.',
    correctAnswer: '720000',
    explanation: 'P = 1200 W. t = 10 min = 600 s. E = P × t = 1200 × 600 = 720 000 J.',
    method: 'Respecter les 6 étapes : Données -> Unités -> Conversion (min en s) -> Formule E = P × t -> Calcul -> Unité finale (J).',
    errorCode: 'U',
    conceptToReview: 'Méthode de résolution en 6 étapes',
    steps: [
      {
        instruction: 'Étape 3 : Convertir la durée t = 10 minutes en secondes (s).',
        answer: '600',
        explanation: '10 min × 60 s/min = 600 s.',
        hint: 'Multipliez par 60.'
      },
      {
        instruction: 'Étape 5 & 6 : Calculer l’énergie E = P × t en Joules (1200 × 600).',
        answer: '720000',
        explanation: 'E = 1200 × 600 = 720 000 Joules.',
        hint: '1200 x 600'
      }
    ]
  },

  // BIOLOGIE
  {
    id: 'ex_b1',
    subjectId: 'biologie',
    chapterId: 'bio_c1',
    conceptId: 'b1',
    title: 'Association des niveaux d’organisation',
    type: 'matching',
    question: 'Associez chaque élément biologique au niveau d’organisation correspondant :',
    correctAnswer: 'matched',
    explanation: 'Glomérule = Tissu/Structure rénale, Neurone = Cellule, Poumon = Organe, Système digestif = Appareil, Être humain = Organisme.',
    method: 'Appliquer la hiérarchie biologique du niveau microscopique au niveau macroscopique.',
    errorCode: 'V',
    conceptToReview: 'Hiérarchie du vivant',
    matchingPairs: [
      { left: 'Neurone', right: 'Cellule' },
      { left: 'Tissu musculaire', right: 'Tissu' },
      { left: 'Cœur', right: 'Organe' },
      { left: 'Appareil respiratoire', right: 'Appareil' },
      { left: 'Être humain', right: 'Organisme' }
    ]
  },
  {
    id: 'ex_b2',
    subjectId: 'biologie',
    chapterId: 'bio_c1',
    conceptId: 'b2',
    title: 'Rôle de filtration des organes',
    type: 'qcm',
    question: 'Quel organe est responsable du maintien de l’équilibre hydrique et de l’élimination de l’urée du sang ?',
    options: ['Les reins', 'Le foie', 'Les poumons', 'La rate'],
    correctAnswer: 'Les reins',
    explanation: 'Les reins filtrent en permanence le sang pour sécréter l’urine, éliminer l’urée (déchet des protéines) et ajuster l’eau.',
    method: 'Reins = filtration sanguine + élimination de l’urée.',
    errorCode: 'K',
    conceptToReview: 'Rôle des reins'
  },
  {
    id: 'ex_b3',
    subjectId: 'biologie',
    chapterId: 'bio_c1',
    conceptId: 'b5',
    title: 'Respiration cellulaire & Métabolisme',
    type: 'boolean',
    question: 'Vrai ou Faux ? La respiration cellulaire se produit uniquement dans les poumons pour fabriquer de l’air.',
    correctAnswer: false,
    explanation: 'FAUX ! La respiration pulmonaire a lieu dans les poumons, mais la respiration CELLULAIRE a lieu à l’intérieur de TOUTES les cellules du corps (dans les mitochondries) pour produire de l’énergie (ATP) à partir du glucose et du dioxygène.',
    method: 'Distinguer la ventilation pulmonaire (mécanique) de la respiration cellulaire (biochimique).',
    errorCode: 'V',
    conceptToReview: 'Digestion et production d’énergie'
  },

  // FRANÇAIS
  {
    id: 'ex_f1',
    subjectId: 'francais',
    chapterId: 'fra_c1',
    conceptId: 'f1',
    title: 'Analyse de consigne d’examen',
    type: 'qcm',
    question: 'Que vous demande exactement la consigne : "Soutenez votre point de vue en développant deux arguments illustrés" ?',
    options: [
      'Donner son avis, présenter 2 arguments distincts et associer à chacun un exemple concret.',
      'Résumer le texte principal en 2 phrases simples.',
      'Rédiger une liste de 10 mots-clés sans faire de phrases.',
      'Donner uniquement des exemples d’actualité sans argument général.'
    ],
    correctAnswer: 'Donner son avis, présenter 2 arguments distincts et associer à chacun un exemple concret.',
    explanation: '"Soutenir un point de vue" = donner sa thèse. "Deux arguments" = 2 idées explicatives. "Illustrés" = avec des exemples précis.',
    method: 'Décomposer chaque mot clé de la consigne avant de commencer la rédaction.',
    errorCode: 'L',
    conceptToReview: 'Compréhension des consignes'
  },
  {
    id: 'ex_f2',
    subjectId: 'francais',
    chapterId: 'fra_c1',
    conceptId: 'f4',
    title: 'Choix des connecteurs logiques',
    type: 'qcm',
    question: 'Quel connecteur logique convient le mieux dans la phrase suivante : "L’entraînement régulier demande des efforts constants ; [...], il garantit une progression solide à l’examen."',
    options: ['néanmoins', 'car', 'parce que', 'en effet'],
    correctAnswer: 'néanmoins',
    explanation: 'Le premier membre évoque la difficulté (efforts constants) et le second membre évoque le résultat positif (progression). Il s’agit d’une opposition ou concession, exprimée par "néanmoins" ou "cependant".',
    method: 'Identifier la relation logique entre les deux propositions (opposition, cause, conséquence...).',
    errorCode: 'R',
    conceptToReview: 'Connecteurs logiques'
  },
  {
    id: 'ex_f3',
    subjectId: 'francais',
    chapterId: 'fra_c1',
    conceptId: 'f2',
    title: 'Rédaction d’un paragraphe argumenté (8-10 lignes)',
    type: 'writing',
    question: 'Rédigez un paragraphe structuré d’environ 8 lignes répondant à la question suivante : "En quoi la reprise d’études à l’âge adulte constitue-t-elle un atout personnel et professionnel ?".',
    correctAnswer: 'sample',
    explanation: 'Votre paragraphe doit comporter : 1. Une idée directrice claire (Affirmation), 2. Un développement explicatif avec connecteurs logiques, 3. Un exemple concret (par exemple la maturité ou le projet professionnel bien défini).',
    method: 'Suivre la structure AEI (Affirmation, Explication, Illustration) avec environ 8 à 10 lignes.',
    errorCode: 'R',
    conceptToReview: 'Rédaction de paragraphes',
    sampleCorrection: 'Reprendre ses études à l’âge adulte représente une démarche particulièrement valorisante tant sur le plan personnel que professionnel. Tout d’abord, l’étudiant adulte aborde son apprentissage avec une motivation renouvelée et des objectifs très précis, ce qui renforce sa ténacité face aux difficultés. En effet, contrairement au parcours scolaire initial parfois subi, ce retour sur les bancs de la faculté découle d’un choix mûri. Par exemple, un candidat préparant le DAEU B met à profit son expérience de vie pour mieux organiser son temps de travail et assimiler les notions complexes. De plus, cette démarche témoigne auprès des recruteurs d’une grande capacité d’adaptation et d’une réelle détermination. Ainsi, cette reprise d’études constitue un véritable levier d’épanouissement et de réorientation réussie.'
  }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  // Maths
  {
    id: 'fc_m1',
    subjectId: 'maths',
    front: 'Quelle est la priorité entre multiplication et addition dans un calcul sans parenthèses ?',
    back: 'La multiplication est STRICTEMENT prioritaire sur l’addition.',
    box: 2,
    nextReviewDate: '2026-07-27',
    fromError: false
  },
  {
    id: 'fc_m2',
    subjectId: 'maths',
    front: 'Règle des signes : Quel est le signe du produit de deux nombres négatifs ?',
    back: 'Le produit de deux nombres négatifs est POSITIF : (-) × (-) = (+).',
    box: 3,
    nextReviewDate: '2026-07-28',
    fromError: false
  },
  {
    id: 'fc_m3',
    subjectId: 'maths',
    front: 'Comment additionner deux fractions qui n’ont pas le même dénominateur ?',
    back: 'Il faut d’abord les réduire au même dénominateur commun, puis additionner leurs numérateurs.',
    box: 1,
    nextReviewDate: '2026-07-26',
    fromError: false
  },
  {
    id: 'fc_m4',
    subjectId: 'maths',
    front: 'Formule de la 3e identité remarquable (a + b)(a - b) = ?',
    back: 'a² - b²',
    box: 2,
    nextReviewDate: '2026-07-27',
    fromError: false
  },
  {
    id: 'fc_m5',
    subjectId: 'maths',
    front: 'Définition d’un antécédent d’un nombre y par une fonction f.',
    back: 'C’est un nombre x tel que f(x) = y. On le trouve en résolvant l’équation f(x) = y.',
    box: 1,
    nextReviewDate: '2026-07-26',
    fromError: true
  },

  // Physique
  {
    id: 'fc_p1',
    subjectId: 'physique',
    front: 'Formule reliant la vitesse, la distance et la durée.',
    back: 'v = d / t (avec d = v × t et t = d / v).',
    box: 3,
    nextReviewDate: '2026-07-29',
    fromError: false
  },
  {
    id: 'fc_p2',
    subjectId: 'physique',
    front: 'Quelle est la différence entre la masse et le poids ?',
    back: 'La masse m (en kg) est constante et mesure la quantité de matière. Le poids P (en Newtons) est la force de pesanteur : P = m × g.',
    box: 2,
    nextReviewDate: '2026-07-27',
    fromError: false
  },
  {
    id: 'fc_p3',
    subjectId: 'physique',
    front: 'Comment convertir une vitesse de km/h en m/s ?',
    back: 'Il faut DIVISER la vitesse par 3,6. (Ex : 36 km/h ÷ 3,6 = 10 m/s).',
    box: 1,
    nextReviewDate: '2026-07-26',
    fromError: true
  },
  {
    id: 'fc_p4',
    subjectId: 'physique',
    front: 'Citer dans l’ordre les 6 étapes de résolution d’un problème de physique.',
    back: '1. Données | 2. Unités | 3. Conversions | 4. Formule | 5. Calcul | 6. Unité finale.',
    box: 4,
    nextReviewDate: '2026-08-01',
    fromError: false
  },

  // Biologie
  {
    id: 'fc_b1',
    subjectId: 'biologie',
    front: 'Citer les 5 niveaux de l’organisation du vivant, du plus simple au plus complexe.',
    back: 'Cellule -> Tissu -> Organe -> Appareil (Système) -> Organisme.',
    box: 3,
    nextReviewDate: '2026-07-29',
    fromError: false
  },
  {
    id: 'fc_b2',
    subjectId: 'biologie',
    front: 'Quel est le rôle principal des reins ?',
    back: 'Filtrer le sang pour éliminer les déchets métaboliques (urée) sous forme d’urine et réguler l’eau.',
    box: 2,
    nextReviewDate: '2026-07-27',
    fromError: false
  },
  {
    id: 'fc_b3',
    subjectId: 'biologie',
    front: 'Où se déroulent les échanges gazeux de dioxygène et dioxyde de carbone dans les poumons ?',
    back: 'Au niveau des alvéoles pulmonaires.',
    box: 2,
    nextReviewDate: '2026-07-27',
    fromError: false
  },
  {
    id: 'fc_b4',
    subjectId: 'biologie',
    front: 'Équation bilan simplifiée de la respiration cellulaire.',
    back: 'Glucose + Dioxygène (O2) -> Énergie (ATP) + Dioxyde de carbone (CO2) + Eau.',
    box: 1,
    nextReviewDate: '2026-07-26',
    fromError: true
  },

  // Français
  {
    id: 'fc_f1',
    subjectId: 'francais',
    front: 'Que signifie l’acronyme AEI pour la rédaction d’un paragraphe argumenté ?',
    back: 'A = Affirmation (Idée clé) | E = Explication (Développement) | I = Illustration (Exemple concret).',
    box: 2,
    nextReviewDate: '2026-07-27',
    fromError: false
  },
  {
    id: 'fc_f2',
    subjectId: 'francais',
    front: 'Quelle est la différence entre un argument et un exemple ?',
    back: 'L’argument est une idée générale justificative ; l’exemple est une illustration concrète (fait, chiffre, citation).',
    box: 3,
    nextReviewDate: '2026-07-29',
    fromError: false
  }
];

export const INITIAL_ERROR_LOGS: ErrorLogItem[] = [
  {
    id: 'err_demo_1',
    subjectId: 'maths',
    conceptTitle: 'Équations avec l’inconnue dans les deux membres',
    question: 'Résoudre 5x - 3 = 2x + 9',
    userAnswer: 'x = 2',
    correctAnswer: 'x = 4',
    errorCode: 'S',
    date: '2026-07-25',
    repetitionCount: 2,
    resolved: false,
    explanation: 'Erreur de signe lors du passage de -3 de l’autre côté de l’égalité (+3 au lieu de -3).'
  },
  {
    id: 'err_demo_2',
    subjectId: 'physique',
    conceptTitle: 'Conversions d’unités',
    question: 'Convertir t = 15 minutes en secondes',
    userAnswer: '150 s',
    correctAnswer: '900 s',
    errorCode: 'C',
    date: '2026-07-24',
    repetitionCount: 1,
    resolved: false,
    explanation: 'Calcul : 15 × 60 = 900 secondes (et non 15 × 10).'
  },
  {
    id: 'err_demo_3',
    subjectId: 'biologie',
    conceptTitle: 'Rôle des reins',
    question: 'Quel est le déchet principal éliminé par les reins dans l’urine ?',
    userAnswer: 'Dioxyde de carbone',
    correctAnswer: 'L’urée',
    errorCode: 'V',
    date: '2026-07-23',
    repetitionCount: 1,
    resolved: true,
    explanation: 'Le CO2 est éliminé par les poumons ; l’urée issue de la dégradation des protéines est éliminée par les reins.'
  }
];

export const INITIAL_SCHEDULE: StudyTask[] = [
  {
    id: 'task_1',
    date: '2026-07-26',
    subjectId: 'maths',
    title: 'Équations et identités remarquables (Session normale)',
    durationMinutes: 120,
    type: 'normal',
    completed: true,
    notes: 'Priorité sur les réductions et résolution de 5 exercices.'
  },
  {
    id: 'task_2',
    date: '2026-07-26',
    subjectId: 'physique',
    title: 'Problèmes de vitesse v=d/t (Session courte)',
    durationMinutes: 30,
    type: 'short',
    completed: false,
    notes: 'Appliquer scrupuleusement la méthode en 6 étapes.'
  },
  {
    id: 'task_3',
    date: '2026-07-27',
    subjectId: 'biologie',
    title: 'Schéma du système circulatoire & rôle du cœur',
    durationMinutes: 60,
    type: 'normal',
    completed: false
  },
  {
    id: 'task_4',
    date: '2026-07-27',
    subjectId: 'francais',
    title: 'Rédaction d’un paragraphe argumenté AEI (30 min)',
    durationMinutes: 30,
    type: 'short',
    completed: false
  },
  {
    id: 'task_5',
    date: '2026-07-28',
    subjectId: 'maths',
    title: 'Mini-Test de Mathématiques (15 min)',
    durationMinutes: 15,
    type: 'test',
    completed: false
  },
  {
    id: 'task_6',
    date: '2026-07-29',
    subjectId: 'physique',
    title: 'Révision générale Énergie et Puissance',
    durationMinutes: 45,
    type: 'revision',
    completed: false
  },
  {
    id: 'task_7',
    date: '2026-07-30',
    subjectId: 'biologie',
    title: 'Journée de récupération active - Flashcards',
    durationMinutes: 20,
    type: 'recovery',
    completed: false
  },
  {
    id: 'task_8',
    date: '2026-08-01',
    subjectId: 'maths',
    title: 'Examen Blanc N°1 Multidisciplinaire (Session 3h)',
    durationMinutes: 180,
    type: 'exam',
    completed: false
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note_1',
    subjectId: 'maths',
    title: 'Aide-mémoire : Identités remarquables',
    content: '1. (a + b)² = a² + 2ab + b²\n2. (a - b)² = a² - 2ab + b²\n3. (a + b)(a - b) = a² - b²\n\nPiège classique : (a+b)² n’est PAS égal à a² + b² ! Il ne faut jamais oublier le double produit 2ab.',
    updatedAt: '2026-07-24',
    isImportant: true,
    tags: ['Algèbre', 'Formules']
  },
  {
    id: 'note_2',
    subjectId: 'physique',
    title: 'Les 6 étapes indispensables en résolution de physique',
    content: 'Affiche sur mon bureau :\n1. Écrire les DONNÉES de l’énoncé\n2. Vérifier les UNITÉS\n3. Faire les CONVERSIONS (ex: min -> s, km/h -> m/s)\n4. Poser la FORMULE LITTÉRALE\n5. Réaliser le CALCUL NUMÉRIQUE\n6. Indiquer le résultat avec son UNITÉ FINALE.',
    updatedAt: '2026-07-25',
    isImportant: true,
    tags: ['Méthode', 'Conseils']
  },
  {
    id: 'note_3',
    subjectId: 'biologie',
    title: 'Respiration cellulaire vs ventilation',
    content: 'Ventilation = mouvement mécanique d’air dans les poumons.\nRespiration cellulaire = réaction biochimique dans chaque cellule :\nGlucose + O2 -> Énergie (ATP) + CO2 + Déchets + Chaleur.',
    updatedAt: '2026-07-22',
    isImportant: false,
    tags: ['Cellule', 'Métabolisme']
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam_mini_1',
    title: 'Mini-Test de Mathématiques (Calcul & Algèbre)',
    subjectId: 'maths',
    type: 'mini',
    durationMinutes: 15,
    description: 'Test rapide de 5 questions sur les priorités, fractions et équations.',
    questions: [
      {
        id: 'eq1',
        subjectId: 'maths',
        question: 'Calculer : 8 + 2 × (10 - 3 × 2)',
        options: ['16', '40', '28', '12'],
        correctAnswer: '16',
        explanation: '3 × 2 = 6, 10 - 6 = 4, 2 × 4 = 8, 8 + 8 = 16.',
        errorCode: 'C'
      },
      {
        id: 'eq2',
        subjectId: 'maths',
        question: 'Quelle est la solution de 3x - 4 = 11 ?',
        options: ['x = 5', 'x = 3', 'x = 15', 'x = 4'],
        correctAnswer: 'x = 5',
        explanation: '3x = 15 => x = 5.',
        errorCode: 'S'
      },
      {
        id: 'eq3',
        subjectId: 'maths',
        question: 'Développer (2x - 3)²',
        options: ['4x² - 12x + 9', '4x² - 9', '2x² - 6x + 9', '4x² + 12x + 9'],
        correctAnswer: '4x² - 12x + 9',
        explanation: '(a-b)² = a² - 2ab + b² => (2x)² - 2*(2x)*3 + 3² = 4x² - 12x + 9.',
        errorCode: 'K'
      },
      {
        id: 'eq4',
        subjectId: 'maths',
        question: 'Si f(x) = x² - 5, quelle est l’image de -3 ?',
        options: ['4', '-14', '14', '-4'],
        correctAnswer: '4',
        explanation: '(-3)² - 5 = 9 - 5 = 4.',
        errorCode: 'S'
      },
      {
        id: 'eq5',
        subjectId: 'maths',
        question: 'Calculer : (1/3) + (1/6)',
        options: ['1/2', '2/9', '2/6', '3/6'],
        correctAnswer: '1/2',
        explanation: '1/3 = 2/6. 2/6 + 1/6 = 3/6 = 1/2.',
        errorCode: 'M'
      }
    ]
  },
  {
    id: 'exam_blank_1',
    title: 'Examen Blanc DAEU B N°1 (Multidisciplinaire)',
    type: 'blank',
    durationMinutes: 90,
    description: 'Épreuve d’évaluation complète regroupant Mathématiques, Physique, Biologie et Français.',
    questions: [
      {
        id: 'ebq1',
        subjectId: 'maths',
        question: 'Résoudre l’équation : 4x + 3 = 2x + 11',
        options: ['x = 4', 'x = 2', 'x = 7', 'x = -4'],
        correctAnswer: 'x = 4',
        explanation: '2x = 8 => x = 4.',
        errorCode: 'S'
      },
      {
        id: 'ebq2',
        subjectId: 'physique',
        question: 'Un appareil de 1500 W fonctionne pendant 2h. Son énergie consommée en kWh vaut :',
        options: ['3 kWh', '3000 kWh', '1,5 kWh', '750 kWh'],
        correctAnswer: '3 kWh',
        explanation: 'P = 1,5 kW, t = 2 h => E = 1,5 × 2 = 3 kWh.',
        errorCode: 'U'
      },
      {
        id: 'ebq3',
        subjectId: 'biologie',
        question: 'Quel est le rôle du système excréteur rénal ?',
        options: ['Filtrer le sang et éliminer l’urée dans l’urine', 'Produire le glucose', 'Transporteur de dioxygène', 'Assurer la digestion des lipides'],
        correctAnswer: 'Filtrer le sang et éliminer l’urée dans l’urine',
        explanation: 'Les reins assument la filtration d’épuration sanguine.',
        errorCode: 'K'
      },
      {
        id: 'ebq4',
        subjectId: 'francais',
        question: 'Que signifie l’acronyme AEI dans la structure de paragraphe ?',
        options: ['Affirmation - Explication - Illustration', 'Analyse - Écriture - Illustration', 'Argument - Exemple - Idée', 'Accord - Éléments - Introduction'],
        correctAnswer: 'Affirmation - Explication - Illustration',
        explanation: 'Méthode AEI pour construire un paragraphe convaincant.',
        errorCode: 'R'
      },
      {
        id: 'ebq5',
        subjectId: 'physique',
        question: 'Calculer le poids P d’une masse de 60 kg sur Terre (g = 9,8 N/kg) :',
        options: ['588 N', '60 N', '6,12 N', '588 kg'],
        correctAnswer: '588 N',
        explanation: 'P = 60 × 9,8 = 588 N (en Newtons).',
        errorCode: 'U'
      }
    ]
  }
];

export const INITIAL_EXAM_ATTEMPTS: ExamAttempt[] = [
  {
    id: 'att_demo_1',
    examId: 'exam_mini_1',
    examTitle: 'Mini-Test de Mathématiques (Calcul & Algèbre)',
    type: 'mini',
    score: 16,
    totalQuestions: 5,
    correctCount: 4,
    date: '2026-07-24',
    durationMinutes: 12,
    errorsSummary: {
      K: 0, M: 0, C: 0, S: 1, U: 0, L: 0, V: 0, R: 0, A: 0
    },
    userAnswers: { eq1: '16', eq2: 'x = 5', eq3: '4x² - 12x + 9', eq4: '-14', eq5: '1/2' }
  }
];
