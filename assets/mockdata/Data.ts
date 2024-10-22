export const home_data = [
  {
    id: 1,
    title: 'Food',
    navigation: 'food',
    image: require('../../assets/food.png'),
  },
  {
    id: 2,
    title: 'Demographic Information',
    navigation: 'demographic', //FIX ME - demographic
    image: require('../../assets/demographic.png'),
  },
  {
    id: 3,
    title: 'Landholding & Usage mapping',
    navigation: 'landholding', // FIX ME - landholding
    image: require('../../assets/landhold.png'),
  },
  {
    id: 4,
    title: 'Housing',
    navigation: 'housing', // FIX ME - housing
    image: require('../../assets/housing.png'),
  },
  {
    id: 5,
    title: 'Water',
    navigation: 'water',
    image: require('../../assets/water.png'),
  },
  {
    id: 6,
    title: 'Energy & Fuel',
    navigation: 'energy',
    image: require('../../assets/fuel.png'),
  },
  {
    id: 7,
    title: 'Mobility',
    navigation: 'mobility',
    image: require('../../assets/mobility.png'),
  },
  {
    id: 8,
    title: 'Forestry & Timber',
    navigation: 'forestry',
    image: require('../../assets/forestry.png'),
  },
  {
    id: 9,
    title: 'Other personal & Household Items',
    navigation: 'otherPersonal',
    image: require('../../assets/household.png'),
  },
  {
    id: 10,
    title: 'Business & Commercial Establishments/Organisations',
    navigation: 'businessCommercial',
    image: require('../../assets/business.png'),
  },
  {
    id: 11,
    title: 'Community Infrastructure (Only for Village level)',
    navigation: 'communityInfrastructure',
    image: require('../../assets/community.png'),
  },
];

export const storage_data = [
  {
    _id: 1,
    storage_quantity: '',
    storage_method_name: '',
    storage_method_id: '',
    storage_name: 'grain',
  },
  {
    _id: 2,
    storage_quantity: '',
    storage_method_name: '',
    storage_method_id: '',
    storage_name: 'poultry',
  },
  {
    _id: 3,
    storage_quantity: '',
    storage_method_name: '',
    storage_method_id: '',
    storage_name: 'meat',
  },
  {
    _id: 4,
    storage_quantity: '',
    storage_method_name: '',
    storage_method_id: '',
    storage_name: 'vegetables & fruits',
  },
];

export const diet = [
    {
      id: 1,
      label: 'Predominantly Vegetarian',
      value: 'predominantly vegetarian',
    },
    {id: 2, label: 'Predominantly Non-Veg', value: 'predominantly non_veg'},
    {id: 3, label: 'Balanced', value: 'balanced'},
    {id: 4, label: 'Vegan', value: 'vegan'},
];

export const language = [
  {id: 1, label: 'English', value: 'english'},
  {id: 2, label: 'Zonkha', value: 'zonkha'},
  {id: 3, label: 'Malay', value: 'malay'},
  {id: 4, label: 'Hindi', value: 'hindi'},
  {id: 5, label: 'Local Dialect', value: 'local_dialect'},
];

export const occupation = [
  {
    id: 1,
    label: 'Farmer (Subsistence, Livestock)',
    value: 'farmer_subsistence_livestock',
  },
  {id: 2, label: 'Fisherman', value: 'fisherman'},
  {
    id: 3,
    label: 'Plantation Worker (Palm Oil, Rubber)',
    value: 'plantation_worker_palm_oil_rubber',
  },
  {id: 4, label: 'Tourism Operator/Guide', value: 'tourism_operator_guide'},
  {id: 5, label: 'Artisan (Handicrafts)', value: 'artisan_handicrafts'},
  {id: 6, label: 'Carpenter', value: 'carpenter'},
  {id: 7, label: 'Traditional Healer', value: 'traditional_healer'},
  {id: 8, label: 'Construction Worker', value: 'construction_worker'},
  {
    id: 9,
    label: 'Craftsperson (Traditional Weaving, Basketry)',
    value: 'craftsperson_traditional_weaving_basketry',
  },
  {id: 10, label: 'Forest Ranger/Warden', value: 'forest_ranger_warden'},
  {
    id: 11,
    label: 'Religious Practitioner/Worker (Priest/Imam/Monk/Nun)',
    value: 'religious_practitioner_worker',
  },
  {
    id: 12,
    label: 'Retail Trader/Shopkeeper',
    value: 'retail_trader_shopkeeper',
  },
  {id: 13, label: 'Government Employee', value: 'government_employee'},
  {id: 14, label: 'Educator/Teacher', value: 'educator_teacher'},
  {
    id: 15,
    label: 'Healthcare Worker (Nurse, Assistant)',
    value: 'healthcare_worker',
  },
  {id: 16, label: 'Logging Worker', value: 'logging_worker'},
  {
    id: 17,
    label: 'Hospitality Worker (Small-scale lodging, Guesthouse, Restaurant)',
    value: 'hospitality_worker',
  },
  {id: 18, label: 'Small Business Owner', value: 'small_business_owner'},
  {
    id: 19,
    label: 'Transport Operator (Driver, Boatman)',
    value: 'transport_operator',
  },
  {
    id: 20,
    label: 'Administrative Assistant/Clerk',
    value: 'administrative_assistant_clerk',
  },
];

export const chronic = [
  {id: 1, label: 'Cardiovascular Diseases', value: 'cardiovascular_diseases'},
  {id: 2, label: 'Hypertension (High blood pressure)', value: 'hypertension'},
  {id: 3, label: 'Coronary artery disease', value: 'coronary_artery_disease'},
  {id: 4, label: 'Respiratory Diseases', value: 'respiratory_diseases'},
  {id: 5, label: 'Chronic obstructive pulmonary disease (COPD)', value: 'copd'},
  {id: 6, label: 'Asthma', value: 'asthma'},
  {id: 7, label: 'Diabetes', value: 'diabetes'},
  {id: 8, label: 'Type 1 diabetes', value: 'type_1_diabetes'},
  {id: 9, label: 'Type 2 diabetes', value: 'type_2_diabetes'},
  {id: 10, label: 'Cancer', value: 'cancer'},
  {id: 11, label: 'Breast cancer', value: 'breast_cancer'},
  {id: 12, label: 'Lung cancer', value: 'lung_cancer'},
  {id: 13, label: 'Colorectal cancer', value: 'colorectal_cancer'},
  {id: 14, label: 'Cervical cancer', value: 'cervical_cancer'},
  {id: 15, label: 'Oral Cancer', value: 'oral_cancer'},
  {id: 16, label: 'Other Cancer', value: 'other_cancer'},
  {
    id: 17,
    label: 'Chronic Kidney Disease (CKD)',
    value: 'chronic_kidney_disease',
  },
  {id: 18, label: 'Autoimmune Diseases', value: 'autoimmune_diseases'},
  {id: 19, label: 'Rheumatoid arthritis', value: 'rheumatoid_arthritis'},
  {id: 20, label: 'Lupus', value: 'lupus'},
  {id: 21, label: 'Multiple sclerosis', value: 'multiple_sclerosis'},
  {id: 22, label: 'Neurological Disorders', value: 'neurological_disorders'},
  {id: 23, label: 'Alzheimer’s disease', value: 'alzheimers_disease'},
  {id: 24, label: 'Parkinson’s disease', value: 'parkinsons_disease'},
  {id: 25, label: 'Epilepsy', value: 'epilepsy'},
  {id: 26, label: 'Chronic Liver Diseases', value: 'chronic_liver_diseases'},
  {id: 27, label: 'Cirrhosis', value: 'cirrhosis'},
  {id: 28, label: 'Hepatitis B and C', value: 'hepatitis_b_c'},
  {
    id: 29,
    label: 'Musculoskeletal Disorders',
    value: 'musculoskeletal_disorders',
  },
  {id: 30, label: 'Osteoarthritis', value: 'osteoarthritis'},
  {id: 31, label: 'Osteoporosis', value: 'osteoporosis'},
  {
    id: 32,
    label: 'Chronic Mental Health Conditions',
    value: 'chronic_mental_health_conditions',
  },
  {id: 33, label: 'Depression', value: 'depression'},
  {id: 34, label: 'Anxiety disorders', value: 'anxiety_disorders'},
  {id: 35, label: 'Schizophrenia', value: 'schizophrenia'},
  {
    id: 36,
    label: 'Neuropsychiatric disorders',
    value: 'neuropsychiatric_disorders',
  },
  {id: 37, label: 'HIV/AIDS', value: 'hiv_aids'},
  {id: 38, label: 'Neglected Tropical Diseases (NTDs)', value: 'ntds'},
  {id: 39, label: 'Dengue', value: 'dengue'},
  {id: 40, label: 'Leptospirosis', value: 'leptospirosis'},
  {id: 41, label: 'Soil-Transmitted Helminthiasis (STH)', value: 'sth'},
  {
    id: 42,
    label: 'Lymphatic Filariasis (Elephantiasis)',
    value: 'lymphatic_filariasis',
  },
  {id: 43, label: 'Scrub Typhus', value: 'scrub_typhus'},
  {id: 44, label: 'Rabies', value: 'rabies'},
  {id: 45, label: 'Schistosomiasis', value: 'schistosomiasis'},
  {id: 46, label: 'Buruli ulcer', value: 'buruli_ulcer'},
  {id: 47, label: 'Chagas disease', value: 'chagas_disease'},
  {id: 48, label: 'Chikungunya', value: 'chikungunya'},
  {id: 49, label: 'Leishmaniasis', value: 'leishmaniasis'},
  {id: 50, label: 'Foodborne trematodiases', value: 'foodborne_trematodiases'},
  {id: 51, label: 'Leprosy', value: 'leprosy'},
  {id: 52, label: 'Mycetoma', value: 'mycetoma'},
  {
    id: 53,
    label: 'Scabies and other ectoparasitoses',
    value: 'scabies_ectoparasitoses',
  },
  {id: 54, label: 'Snakebite envenoming', value: 'snakebite_envenoming'},
  {id: 55, label: 'Tuberculosis (TB)', value: 'tuberculosis'},
  {id: 56, label: 'Chronic Malaria', value: 'chronic_malaria'},
  {id: 57, label: 'Hypercholesterolemia', value: 'hypercholesterolemia'},
  {id: 58, label: 'Chronic Melioidosis', value: 'chronic_melioidosis'},
];

export const motor = [
  {id: 1, label: 'No Disability', value: 'no_disability'},
  {
    id: 2,
    label: 'Partial Mobility Impairment',
    value: 'partial_mobility_impairment',
  },
  {
    id: 3,
    label: 'Complete Mobility Impairment',
    value: 'complete_mobility_impairment',
  },
  {id: 4, label: 'Paralysis (Partial)', value: 'partial_paralysis'},
  {id: 5, label: 'Paralysis (Complete)', value: 'complete_paralysis'},
  {id: 6, label: 'Cerebral Palsy', value: 'cerebral_palsy'},
  {id: 7, label: 'Muscular Dystrophy', value: 'muscular_dystrophy'},
  {id: 8, label: 'Amputation (Upper Limb)', value: 'amputation_upper_limb'},
  {id: 9, label: 'Amputation (Lower Limb)', value: 'amputation_lower_limb'},
  {id: 10, label: 'Spinal Cord Injury', value: 'spinal_cord_injury'},
  {id: 11, label: 'Multiple Sclerosis', value: 'multiple_sclerosis'},
  {
    id: 12,
    label: 'Stroke-related Impairment',
    value: 'stroke_related_impairment',
  },
  {id: 13, label: 'Parkinson’s Disease', value: 'parkinsons_disease'},
];

export const emotional = [
  {
    id: 1,
    label: 'Average (Minor stress or anxiety, manageable)',
    value: 'average_mental_health',
  },
  {
    id: 2,
    label: 'Good (Mentally fit, calm, focused)',
    value: 'good_mental_health',
  },
  {
    id: 3,
    label: 'Poor (Frequent stress, anxiety, or depression)',
    value: 'poor_mental_health',
  },
  {
    id: 4,
    label: 'Prefer not to answer',
    value: 'prefer_not_to_answer_mental_health',
  },

  {
    id: 5,
    label: 'Excellent (Able to identify and express emotions clearly)',
    value: 'excellent_emotional_awareness',
  },
  {
    id: 6,
    label:
      'Good (Can generally identify emotions but may struggle in stressful situations)',
    value: 'good_emotional_awareness',
  },
  {
    id: 7,
    label: 'Limited (Has difficulty identifying and expressing emotions)',
    value: 'limited_emotional_awareness',
  },
  {
    id: 8,
    label: 'Poor (Often unaware of emotions or how they impact behavior)',
    value: 'poor_emotional_awareness',
  },
  {id: 9, label: 'Emotionally unstable', value: 'emotionally_unstable'},
  {
    id: 10,
    label: 'Prefer not to answer',
    value: 'prefer_not_to_answer_emotional_awareness',
  },

  {
    id: 11,
    label: 'Strong family/community support',
    value: 'strong_support_system',
  },
  {
    id: 12,
    label: 'Moderate family/community support',
    value: 'moderate_support_system',
  },
  {
    id: 13,
    label: 'Limited family/community support',
    value: 'limited_support_system',
  },
  {id: 14, label: 'No support system in place', value: 'no_support_system'},
  {
    id: 15,
    label: 'Seeks external (professional) support',
    value: 'seeks_professional_support',
  },

  {
    id: 16,
    label: 'Positive coping mechanisms',
    value: 'positive_coping_mechanisms',
  },
  {
    id: 17,
    label: 'Neutral coping mechanisms',
    value: 'neutral_coping_mechanisms',
  },
  {id: 18, label: 'Mixed coping mechanisms', value: 'mixed_coping_mechanisms'},
  {
    id: 19,
    label: 'Negative coping mechanisms',
    value: 'negative_coping_mechanisms',
  },
  {
    id: 20,
    label: 'Seeks spiritual or religious guidance',
    value: 'spiritual_guidance',
  },

  {id: 21, label: 'Low stress levels', value: 'low_stress'},
  {id: 22, label: 'Moderate stress levels', value: 'moderate_stress'},
  {id: 23, label: 'High stress levels', value: 'high_stress'},
  {id: 24, label: 'Prefer not to answer', value: 'prefer_not_to_answer_stress'},

  {id: 25, label: 'High emotional resilience', value: 'high_resilience'},
  {
    id: 26,
    label: 'Moderate emotional resilience',
    value: 'moderate_resilience',
  },
  {id: 27, label: 'Low emotional resilience', value: 'low_resilience'},
  {
    id: 28,
    label: 'Very low emotional resilience',
    value: 'very_low_resilience',
  },

  {id: 29, label: 'High empathy', value: 'high_empathy'},
  {id: 30, label: 'Moderate empathy', value: 'moderate_empathy'},
  {id: 31, label: 'Low empathy', value: 'low_empathy'},
  {id: 32, label: 'None (Lacks empathy)', value: 'no_empathy'},
];

export const habits = [
  {
    key: 'chewing_betel_nut',
    name: 'Chewing Betel nut and leaves (Doma in Bhutan)',
  },
  {
    key: 'consuming_local_liquor',
    name: 'Consuming Local liquor (Rice wine, Tapioca wine etc.)',
  },
  {
    key: 'participating_traditional_ceremonies',
    name: 'Participation in traditional ceremonies',
  },
  {key: 'worship_offering_prayer', name: 'Worshiping/Offering Prayer at home'},
  {key: 'visiting_place_of_worship', name: 'Visiting place of worship'},
  {
    key: 'procurement_food_locally',
    name: 'Procurement of food for own consumption locally (From own fields etc.)',
  },
  {key: 'foraging', name: 'Foraging'},

  {key: 'smoking', name: 'Smoking (Tobacco, Cigarettes)'},
  {
    key: 'alcohol_consumption',
    name: 'Alcohol consumption (Beer, Wine, Spirits etc.)',
  },
  {key: 'no_substance_use', name: 'No substance use'},
  {key: 'substance_use_others', name: 'Others'},

  {key: 'tea_drinking', name: 'Tea drinking (Butter tea, Black tea)'},
  {key: 'packaged_processed_food', name: 'Consuming packaged/processed food'},
  {key: 'organic_local_food', name: 'Eating organic/local food'},
  {key: 'none_food_consumption', name: 'None of the above'},

  {key: 'watching_television', name: 'Watching television/YouTube'},
  {
    key: 'social_media_engagement',
    name: 'Social media engagement (Facebook, WhatsApp, WeChat etc.)',
  },
  {key: 'online_shopping', name: 'Engaging in online shopping'},
  {key: 'modern_fashion_trends', name: 'Following modern fashion trends'},
  {key: 'none_modern_habits', name: 'None'},
];
export const education = [
  { id: 1, label: "No formal education", value: "no_formal_education" },
  { id: 2, label: "Primary education", value: "primary_education" },
  { id: 3, label: "Secondary education", value: "secondary_education" },
  { id: 4, label: "Higher secondary education", value: "higher_secondary_education" },
  { id: 5, label: "Diploma", value: "diploma" },
  { id: 6, label: "Bachelor's degree", value: "bachelors_degree" },
  { id: 7, label: "Master's degree", value: "masters_degree" },
  { id: 8, label: "Doctorate", value: "doctorate" },
  { id: 9, label: "Monastic education", value: "monastic_education" },
  { id: 10, label: "Vocational/Skill-based training", value: "vocational_training" },
  { id: 11, label: "Religious education (e.g., Christian, Buddhist, Islamic studies)", value: "religious_education" }
]

export const education_seeking = [
  {id: 1, label: 'Primary education', value: 'primary_education'},
  {id: 2, label: 'Secondary education', value: 'secondary_education'},
  {
    id: 3,
    label: 'Vocational / Skill based training',
    value: 'vocational_skill_based_training',
  },
  {
    id: 4,
    label: 'Higher education (Bachelor’s/Master’s)',
    value: 'higher_education',
  },
  {
    id: 5,
    label: 'Technical skills certification',
    value: 'technical_skills_certification',
  },
  {id: 6, label: 'Digital literacy', value: 'digital_literacy'},
  {id: 7, label: 'Religious education', value: 'religious_education'},
];

export const skillset = [
  {
    key: 'carpentry_construction',
    name: 'Carpentry/Construction (Modern/Traditional)',
  },
  {key: 'organic_farming', name: 'Organic farming'},
  {key: 'farming', name: 'Farming (Modern/Traditional)'},
  {
    key: 'food_preservation',
    name: 'Food preservation methods (Smoking, Drying, Canning)',
  },
  {key: 'sewing_tailoring', name: 'Sewing and tailoring'},
  {
    key: 'cooking_baking',
    name: 'Cooking and baking (Traditional /modern/both)',
  },
  {key: 'driving', name: 'Driving (Motorcycles, Cars, Commercial Vehicles)'},
  {key: 'livestock_management', name: 'Livestock management'},
  {key: 'fishing_hunting', name: 'Fishing/Hunting'},
  {key: 'digital_literacy_basic', name: 'Digital literacy (Basic)'},
  {key: 'traditional_healing', name: 'Traditional healing practices'},

  {key: 'small_business_management', name: 'Small business management'},
  {key: 'digital_marketing', name: 'Digital marketing'},
  {key: 'financial_literacy', name: 'Financial literacy'},
  {
    key: 'tourism_hospitality_management',
    name: 'Tourism and hospitality management',
  },

  {
    key: 'leadership_teamwork',
    name: 'Leadership and teamwork in community projects',
  },
  {key: 'teaching_mentoring', name: 'Teaching and mentoring others'},

  {
    key: 'weaving_handicrafts',
    name: 'Weaving baskets, fabrics, and other handicrafts',
  },
  {
    key: 'jewelry_making',
    name: 'Jewelry making with beads, stones, and traditional materials',
  },
  {
    key: 'playing_instruments',
    name: 'Playing traditional instruments (Drums, flutes, etc.)',
  },
  {key: 'performing_dances', name: 'Performing cultural dances'},
  {key: 'traditional_music', name: 'Traditional Music'},
  {key: 'photography', name: 'Photography (Basic/Advanced)'},
];

export const hobbies = [
  {key: 'performing_dance', name: 'Performing Traditional dance'},
  {
    key: 'storytelling_traditions',
    name: 'Storytelling and oral traditions (Folklore, myths)',
  },
  {
    key: 'traditional_crafts',
    name: 'Traditional crafts (Beads, Weaving, Bamboo work)',
  },
  {
    key: 'local_festivals_rituals',
    name: 'Participating in local festivals or rituals',
  },

  {key: 'fishing_hunting', name: 'Fishing/Hunting'},
  {key: 'gardening', name: 'Gardening (Growing herbs, vegetables)'},
  {key: 'hiking', name: 'Hiking (Nature walks, bird watching)'},
  {key: 'archery', name: 'Archery'},
  {key: 'games', name: 'Games (Football, volleyball)'},
  {key: 'travelling', name: 'Travelling'},

  {
    key: 'digital_content_creation',
    name: 'Digital content creation (YouTube, TikTok, Instagram)',
  },
  {key: 'photography', name: 'Photography'},
  {
    key: 'playing_video_games',
    name: 'Playing video games (Mobile games, online platforms)',
  },
  {key: 'watching_movies_tv', name: 'Watching movies/TV shows'},
  {key: 'reading_books', name: 'Reading books'},

  {
    key: 'music_playing_instruments',
    name: 'Music (Playing traditional instruments, modern instruments)',
  },
  {key: 'drawing_painting', name: 'Drawing/Painting'},
  {key: 'handicrafts', name: 'Handicrafts (Jewelry making, embroidery)'},
  {key: 'writing', name: 'Writing (Poetry, stories)'},
];

export const skillset_seeking =[
  { key: "modern_carpentry_techniques", name: "Modern carpentry techniques" },
  { key: "organic_farming_sustainable_agriculture", name: "Organic farming and sustainable agriculture" },
  { key: "food_preservation_methods", name: "Food preservation methods (Smoking, Drying, Canning)" },
  { key: "sewing_tailoring", name: "Sewing and tailoring" },
  { key: "cooking_baking_traditional_modern", name: "Cooking and baking (Traditional and modern)" },

  { key: "small_business_management", name: "Small business management" },
  { key: "digital_marketing_sales", name: "Digital marketing and sales (Setting up e-commerce, using platforms)" },
  { key: "financial_literacy", name: "Financial literacy (Managing finances, loans, savings)" },
  { key: "tourism_hospitality_management", name: "Tourism and hospitality management" },
  { key: "ecotourism_management", name: "Ecotourism management" },

  { key: "computer_skills", name: "Computer skills (Basic to advanced computer usage)" },
  { key: "digital_literacy", name: "Digital literacy (Using smartphones, apps, internet)" },
  { key: "social_media_management", name: "Social media management (Facebook, Instagram)" },
  { key: "photography_videography", name: "Photography and videography (For tourism, documentation)" },
  { key: "website_design_maintenance", name: "Website design/maintenance" },

  { key: "english_proficiency", name: "English language proficiency (Speaking, reading, writing)" },
  { key: "different_dialects", name: "Different Dialects (Learning for cross-cultural communication)" },
  { key: "public_speaking_presentation", name: "Public speaking and presentation skills" },
  { key: "conflict_resolution_negotiation", name: "Conflict resolution and negotiation" },

  { key: "first_aid_healthcare_basics", name: "First aid and healthcare basics" },
  { key: "nutrition_healthy_cooking", name: "Nutrition and healthy cooking" },

  { key: "crafting", name: "Crafting (Advanced beadwork, weaving techniques)" },
  { key: "traditional_music_dance", name: "Traditional music and dance (Learning instruments, dance styles)" },
  { key: "creative_writing", name: "Creative writing (Poetry, storytelling)" },
  { key: "film_photography", name: "Film and photography" }
]

export const hobbies_seeking = [
  {key: 'fishing_hunting', name: 'Fishing/Hunting'},
  {
    key: 'gardening_herbs_vegetables',
    name: 'Gardening (Growing herbs, vegetables)',
  },
  {key: 'ecotourism', name: 'Ecotourism'},
  {key: 'archery', name: 'Archery'},
  {key: 'reading_books', name: 'Reading Books'},
  {key: 'drawing_painting', name: 'Drawing/Painting'},
  {
    key: 'music_traditional_modern',
    name: 'Music (Playing traditional instruments, modern instruments)',
  },
];

export const aspiration = [
  // Economic Aspirations
  {
    key: 'improved_household_income',
    name: 'Improved household income and financial stability',
  },
  {
    key: 'small_business_development',
    name: 'Development of small businesses or entrepreneurship',
  },
  {
    key: 'local_employment_opportunities',
    name: 'Local employment opportunities',
  },
  {
    key: 'access_to_markets',
    name: 'Better access to markets for selling local products',
  },
  {key: 'financial_independence', name: 'Financial independence'},
  {
    key: 'less_dependence_on_forest',
    name: 'Less dependence on Forest (Full time Farmers)',
  },

  // Educational Aspirations
  {
    key: 'quality_education_access',
    name: 'Access to quality education for children and adults',
  },
  {
    key: 'vocational_training_centers',
    name: 'Establishment of vocational training centers',
  },
  {
    key: 'scholarships_financial_aid',
    name: 'Scholarships and financial aid for higher education',
  },
  {
    key: 'school_infrastructure_improvement',
    name: 'Better infrastructure for schools (buildings, facilities)',
  },
  {
    key: 'digital_literacy_programs',
    name: 'Digital literacy programs for youth and adults',
  },

  // Health and Wellbeing Aspirations
  {
    key: 'better_healthcare_services',
    name: 'Better healthcare services and facilities (clinics, hospitals)',
  },
  {key: 'clean_drinking_water_access', name: 'Access to clean drinking water'},
  {
    key: 'improved_sanitation_systems',
    name: 'Improved sanitation and waste management systems',
  },
  {
    key: 'mental_health_support',
    name: 'Mental health support and counseling services',
  },
  {
    key: 'healthy_lifestyles',
    name: 'Healthy lifestyles with better nutrition and fitness',
  },

  // Infrastructure and Technology Aspirations
  {
    key: 'reliable_electricity_supply',
    name: 'Reliable electricity and power supply',
  },
  {
    key: 'improved_transportation_infrastructure',
    name: 'Improved transportation infrastructure (roads, bridges)',
  },
  {
    key: 'affordable_reliable_internet',
    name: 'Affordable and reliable internet access',
  },
  {
    key: 'better_mobile_connectivity',
    name: 'Better Mobile Connectivity and digital Literacy',
  },
  {key: 'affordable_housing', name: 'Access to affordable housing'},

  // Environmental and Sustainability Aspirations
  {key: 'sustainable_farming_practices', name: 'Sustainable farming practices'},
  {
    key: 'local_flora_fauna_protection',
    name: 'Protection of local flora and fauna',
  },
  {
    key: 'pollution_reduction_programs',
    name: 'Programs for reducing pollution and waste',
  },
  {key: 'disaster_preparedness', name: 'Disaster preparedness'},
  {key: 'guide_for_ecotourism', name: 'Guide for Ecotourism'},

  // Cultural Aspirations
  {
    key: 'preservation_of_culture',
    name: 'Preservation of traditional culture and heritage',
  },
  {
    key: 'promotion_of_arts_crafts',
    name: 'Promotion of local arts, crafts, and cultural tourism',
  },
  {
    key: 'language_preservation_programs',
    name: 'Language preservation programs',
  },
  {
    key: 'support_for_cultural_festivals',
    name: 'Support for cultural festivals and community events',
  },
  {
    key: 'intergenerational_knowledge_transfer',
    name: 'Intergenerational transmission of knowledge and traditions',
  },

  // Community and Social Aspirations
  {
    key: 'stronger_community_leadership',
    name: 'Stronger community leadership and governance',
  },
  {key: 'women_empowerment_programs', name: "Women's empowerment programs"},
  {key: 'youth_engagement', name: 'Youth engagement'},
  {
    key: 'increased_social_cohesion',
    name: 'Increased social cohesion and community bonding',
  },
  {
    key: 'poverty_social_inequalities_reduction',
    name: 'Reduction of poverty and social inequalities',
  },

  // Aspiration for Personal Growth
  {
    key: 'personal_skill_learning',
    name: 'Personal development through skill learning and education',
  },
  {
    key: 'access_to_self_employment_resources',
    name: 'Access to resources for self-employment or creative endeavors',
  },
  {key: 'healthier_work_life_balance', name: 'Healthier work-life balance'},
  {
    key: 'career_ambitions_fulfillment',
    name: 'Fulfillment of career ambitions',
  },
  {
    key: 'emotional_wellbeing_peace',
    name: 'Emotional well-being and mental peace',
  },
];

export const unfullfilled = [
  // Basic Necessities
  {
    key: 'clean_safe_drinking_water',
    name: 'Access to clean and safe drinking water',
  },
  {
    key: 'reliable_electricity_energy',
    name: 'Reliable electricity and energy sources',
  },
  {
    key: 'food_security_nutrition',
    name: 'Sufficient food security and nutrition',
  },
  {
    key: 'healthcare_services_medication',
    name: 'Availability of healthcare services and medication',
  },
  {key: 'safe_housing_shelter', name: 'Access to safe housing and shelter'},

  // Educational Needs
  {
    key: 'availability_teachers_resources',
    name: 'Availability of teachers and educational resources',
  },
  {key: 'schools_remote_areas', name: 'Schools in remote areas'},
  {
    key: 'affordable_educational_materials',
    name: 'Affordable educational materials (books, technology)',
  },
  {
    key: 'vocational_technical_education',
    name: 'Need for vocational and technical education',
  },
  {
    key: 'adult_literacy_programs',
    name: 'Improved literacy programs for adults',
  },

  // Economic Needs
  {
    key: 'local_employment_opportunities',
    name: 'Opportunities for local employment',
  },
  {
    key: 'affordable_credit_loans',
    name: 'Access to affordable credit and loans for entrepreneurship',
  },
  {
    key: 'financial_literacy_support',
    name: 'Financial literacy training and support',
  },
  {
    key: 'improved_market_access',
    name: 'Improved local market access for selling goods',
  },
  {
    key: 'land_property_rights_protection',
    name: 'Protection of land and property rights',
  },

  // Healthcare Needs
  {
    key: 'access_to_medical_staff',
    name: 'Access to doctors, nurses, and medical staff',
  },
  {
    key: 'availability_hospitals_medical_centers',
    name: 'Availability of hospitals and medical centers nearby',
  },
  {
    key: 'affordable_healthcare_schemes',
    name: 'Affordable healthcare and insurance schemes',
  },
  {
    key: 'sanitation_facilities_households',
    name: 'Proper sanitation facilities in households',
  },
  {
    key: 'nutrition_preventive_healthcare',
    name: 'Nutrition education and preventive healthcare',
  },

  // Infrastructure Needs
  {
    key: 'road_connectivity_transportation',
    name: 'Better road connectivity and transportation',
  },
  {
    key: 'digital_infrastructure',
    name: 'Digital infrastructure (internet, telecommunication)',
  },
  {
    key: 'waste_disposal_sanitation',
    name: 'Reliable waste disposal and sanitation systems',
  },
  {key: 'public_transport_services', name: 'Public transportation services'},
  {key: 'affordable_housing_solutions', name: 'Affordable housing solutions'},

  // Social and Governance Needs
  {
    key: 'access_legal_rights_justice',
    name: 'Better access to legal rights and justice systems',
  },
  {key: 'gender_equality_empowerment', name: 'Gender equality and empowerment'},
  {
    key: 'youth_programs_leadership',
    name: 'Youth programs and leadership initiatives',
  },
  {
    key: 'crime_prevention_safety',
    name: 'Crime prevention and safety measures',
  },
  {
    key: 'community_participation_decision_making',
    name: 'Increased community participation in decision-making',
  },

  // Environmental Needs
  {
    key: 'waste_management_recycling',
    name: 'Waste management and recycling facilities',
  },
  {
    key: 'soil_degradation_reforestation',
    name: 'Solutions for soil degradation and reforestation',
  },
  {
    key: 'water_management_systems',
    name: 'Water management systems to avoid flooding',
  },
  {
    key: 'climate_adaptation_strategies',
    name: 'Climate adaptation strategies (for disasters)',
  },
  {
    key: 'sustainable_agriculture_training',
    name: 'Training on sustainable agriculture practices',
  },
];

export const wishes = [
  // For the Community
  {
    key: 'peaceful_harmonious_community',
    name: 'A peaceful and harmonious community',
  },
  {
    key: 'prosperous_future_next_generation',
    name: 'A prosperous future for the next generation',
  },
  {
    key: 'preservation_cultural_heritage',
    name: 'Preservation of cultural heritage and traditions',
  },
  {
    key: 'green_sustainable_village',
    name: 'A green and environmentally sustainable village',
  },
  {
    key: 'unity_stronger_bonds_community',
    name: 'Unity and stronger bonds among community members',
  },

  // For the Economy
  {
    key: 'thriving_local_economy',
    name: 'A thriving local economy with jobs for all',
  },
  {
    key: 'sustainable_industries',
    name: 'Establishment of sustainable industries (e.g., eco-tourism, organic farming)',
  },
  {
    key: 'support_for_small_businesses',
    name: 'More support for small businesses and entrepreneurs',
  },
  {
    key: 'stable_income_sources',
    name: 'Stable income sources that provide long-term security',
  },
  {
    key: 'investment_local_infrastructure',
    name: 'Investment in local infrastructure to support growth',
  },

  // For Personal Growth
  {
    key: 'opportunities_new_skills',
    name: 'Opportunities to learn new skills and trades',
  },
  {
    key: 'better_work_life_balance',
    name: 'Better work-life balance and personal time',
  },
  {
    key: 'mental_wellbeing_happiness',
    name: 'Increased mental well-being and happiness',
  },
  {
    key: 'opportunities_travel_experience',
    name: 'Opportunities to travel and experience the world',
  },
  {
    key: 'career_goals_fulfillment',
    name: 'Fulfillment of career goals and aspirations',
  },

  // For the Environment
  {
    key: 'reforestation_preservation_resources',
    name: 'Reforestation and preservation of natural resources',
  },
  {
    key: 'wildlife_protection_biodiversity',
    name: 'Wildlife protection and biodiversity conservation',
  },
  {
    key: 'clean_rivers_forests_pollution',
    name: 'Clean rivers, forests, and reduced pollution',
  },
  {
    key: 'protection_environmental_disasters',
    name: 'Protection against environmental disasters',
  },
  {
    key: 'education_climate_change_sustainability',
    name: 'Education about climate change and sustainability',
  },

  // For Family and Future Generations
  {
    key: 'bright_future_good_education',
    name: 'A bright future with access to good education',
  },
  {
    key: 'safe_secure_livelihoods_children',
    name: 'Safe and secure livelihoods for children and grandchildren',
  },
  {
    key: 'support_women_youth_elderly',
    name: 'Support for women, youth, and the elderly in the community',
  },
  {
    key: 'sustainable_homes_future_generations',
    name: 'Sustainable homes and resources for future generations',
  },
  {
    key: 'happy_healthy_fulfilled_family_life',
    name: 'Happy, healthy, and fulfilled family life',
  },
];