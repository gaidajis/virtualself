import type { VirtualMeData } from '@/types/virtualme2';

export const defaultVirtualMeData: VirtualMeData = {
  metadata: {
    version: '2.0',
    lastModified: new Date().toISOString(),
    activeProfileId: 'networking',
  },
  globalSettings: {
    backgroundMusic: false,
    theme: {
      primaryColor: '#60a5fa',
      accentColor: '#a78bfa',
      background: 'slate-950',
    },
    zoomLevels: {
      overview: 1,
      section: 2.5,
      detail: 5,
    },
  },
  sections: [
    {
      id: 'knowledge-cv',
      type: 'knowledge',
      title: 'Knowledge & CV',
      position: { x: -350, y: -200 },
      icon: 'Briefcase',
      color: '#3b82f6',
      content: {
        currentRole: 'Program Manager IT – Digital Transformation',
        organization: 'EHL University',
        location: 'Switzerland',
        summary: 'Leading digital transformation initiatives across the institution, managing IT projects from conception to delivery.',
        achievements: [
          'Led 15+ IT projects with 95% on-time delivery',
          'Managed $2M annual IT budget',
          'Implemented cloud-first strategy reducing costs by 30%',
          'Established Agile practices across 5 teams',
        ],
        customFields: {},
      },
    },
    {
      id: 'school-university',
      type: 'education',
      title: 'School & University',
      position: { x: -200, y: -400 },
      icon: 'GraduationCap',
      color: '#8b5cf6',
      content: {
        institutions: [
          {
            id: 'uni-cyprus',
            name: 'University of Cyprus',
            degree: 'Physics (3 years)',
            status: 'incomplete',
            years: '2003-2006',
            location: 'Nicosia, Cyprus',
            logo: null,
            customFields: {},
          },
        ],
        customFields: {},
      },
    },
    {
      id: 'languages',
      type: 'languages',
      title: 'Languages',
      position: { x: 200, y: -400 },
      icon: 'Languages',
      color: '#10b981',
      content: {
        languages: [
          { id: 'lang-el', name: 'Greek', level: 'native', flag: '🇬🇷' },
          { id: 'lang-en', name: 'English', level: 'fluent', flag: '🇬🇧' },
          { id: 'lang-fr', name: 'French', level: 'fluent', flag: '🇫🇷' },
          { id: 'lang-de', name: 'German', level: 'learning', flag: '🇩🇪' },
          { id: 'lang-jp', name: 'Japanese', level: 'learning', flag: '🇯🇵' },
        ],
        customFields: {},
      },
    },
    {
      id: 'hobbies',
      type: 'interests',
      title: 'Hobbies & Interests',
      position: { x: 350, y: -200 },
      icon: 'Music',
      color: '#f59e0b',
      content: {
        categories: [
          {
            id: 'cat-energy',
            name: 'Energy & Trading',
            items: ['Pico-hydro projects', 'Stock trading', 'Joule crypto token', 'Renewable energy investments'],
          },
          {
            id: 'cat-lifestyle',
            name: 'Lifestyle',
            items: ['Minimalism', 'Japanese aesthetics', '150 heart points/week', 'Intermittent fasting'],
          },
          {
            id: 'cat-travel',
            name: 'Travel',
            items: ['50+ countries visited', 'Digital nomad experiences', 'Cultural immersion'],
          },
        ],
        customFields: {},
      },
    },
    {
      id: 'events',
      type: 'timeline',
      title: 'Life Events',
      position: { x: 350, y: 200 },
      icon: 'Calendar',
      color: '#ec4899',
      content: {
        events: [
          { id: 'evt-1', year: 1985, title: 'Born', location: 'Didymoteicho, Greece', icon: 'Baby', description: 'Birthplace in northern Greece' },
          { id: 'evt-2', year: 1995, title: 'Moved to Cyprus', location: 'Nicosia, Cyprus', icon: 'Plane', description: 'Childhood relocation' },
          { id: 'evt-3', year: 2003, title: 'University of Cyprus', location: 'Physics studies', icon: 'BookOpen', description: 'Began physics degree' },
          { id: 'evt-4', year: 2006, title: 'Cameroon Project', location: 'Volunteer work', icon: 'Globe', description: 'International development experience' },
          { id: 'evt-5', year: 2010, title: 'Oslo Chapter', location: 'Norway', icon: 'Snowflake', description: 'Nordic adventure' },
          { id: 'evt-6', year: 2014, title: 'USA Experience', location: 'United States', icon: 'Flag', description: 'Professional development' },
          { id: 'evt-7', year: 2018, title: 'Switzerland', location: 'EHL University', icon: 'Briefcase', description: 'Current chapter begins' },
        ],
        customFields: {},
      },
    },
    {
      id: 'skills',
      type: 'skills',
      title: 'Skills',
      position: { x: 200, y: 400 },
      icon: 'Zap',
      color: '#06b6d4',
      content: {
        skills: [
          { id: 'skill-1', name: 'IT Architecture', category: 'technical', level: 5 },
          { id: 'skill-2', name: 'Cloud/SaaS', category: 'technical', level: 5 },
          { id: 'skill-3', name: 'NoSQL Databases', category: 'technical', level: 4 },
          { id: 'skill-4', name: 'Project Management', category: 'technical', level: 5 },
          { id: 'skill-5', name: 'Systems Thinking', category: 'soft', level: 5 },
          { id: 'skill-6', name: 'Cross-cultural Communication', category: 'soft', level: 4 },
          { id: 'skill-7', name: 'Strategic Planning', category: 'soft', level: 4 },
          { id: 'skill-8', name: 'Digital Transformation', category: 'technical', level: 5 },
        ],
        customFields: {},
      },
    },
  ],
  profiles: [
    {
      id: 'networking',
      name: 'Networking',
      description: 'Professional connections & opportunities',
      theme: {
        primary: '#3b82f6',
        accent: '#60a5fa',
        gradient: 'from-blue-500 to-cyan-400',
      },
      photos: [
        { id: 'photo-n1', url: '/avatar.jpg', caption: 'Professional headshot', order: 0 },
        { id: 'photo-n2', url: '/avatar.jpg', caption: 'Conference keynote', order: 1 },
        { id: 'photo-n3', url: '/avatar.jpg', caption: 'Team leadership', order: 2 },
      ],
      visibleSections: ['knowledge-cv', 'school-university', 'skills', 'languages'],
      sectionFilters: {
        'knowledge-cv': { showAchievements: true, showMetrics: true },
        'school-university': { showIncomplete: true },
        'hobbies': { filterToProfessional: true },
      },
      customMessage: 'Open to collaborations in digital transformation and renewable energy.',
    },
    {
      id: 'dating',
      name: 'Dating',
      description: 'Personal connections & relationships',
      theme: {
        primary: '#ec4899',
        accent: '#f472b6',
        gradient: 'from-pink-500 to-rose-400',
      },
      photos: [
        { id: 'photo-d1', url: '/avatar.jpg', caption: 'Travel in Japan', order: 0 },
        { id: 'photo-d2', url: '/avatar.jpg', caption: 'Hiking weekend', order: 1 },
        { id: 'photo-d3', url: '/avatar.jpg', caption: 'Coffee & books', order: 2 },
      ],
      visibleSections: ['hobbies', 'events', 'languages', 'school-university'],
      sectionFilters: {
        'hobbies': { emphasizeLifestyle: true, showHealthGoals: true },
        'events': { highlightTravel: true },
        'knowledge-cv': { showRoleOnly: true },
      },
      customMessage: 'Minimalist, curious, always learning. Let\'s explore together.',
    },
    {
      id: 'alumni',
      name: 'University / Alumni',
      description: 'Academic network & peer connections',
      theme: {
        primary: '#8b5cf6',
        accent: '#a78bfa',
        gradient: 'from-violet-500 to-purple-400',
      },
      photos: [
        { id: 'photo-a1', url: '/avatar.jpg', caption: 'Graduation', order: 0 },
        { id: 'photo-a2', url: '/avatar.jpg', caption: 'Research project', order: 1 },
        { id: 'photo-a3', url: '/avatar.jpg', caption: 'Alumni event', order: 2 },
      ],
      visibleSections: ['school-university', 'knowledge-cv', 'skills', 'events'],
      sectionFilters: {
        'school-university': { showAllDetails: true, emphasizePhysics: true },
        'skills': { highlightAcademic: true },
      },
      customMessage: 'Physics background, now in digital transformation. Always happy to connect with fellow academics.',
    },
  ],
  people: [
    {
      id: 'spouse',
      name: 'Anh-Thu Alice Kha',
      relationship: 'spouse',
      profileIds: ['networking', 'dating'],
      photo: '/avatar.jpg',
      details: {
        profession: 'Asset Manager',
        employer: 'Swiss Life',
        location: 'Switzerland',
      },
    },
  ],
  connections: [
    { from: 'knowledge-cv', to: 'skills', strength: 0.8 },
    { from: 'school-university', to: 'knowledge-cv', strength: 0.6 },
    { from: 'languages', to: 'events', strength: 0.4 },
    { from: 'skills', to: 'hobbies', strength: 0.5 },
  ],
};
