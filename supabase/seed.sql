-- =====================================================================
-- Initial content for Nur Ayuni Hanani, taken only from her resume.
-- Run ONCE after the migrations. It replaces all portfolio content and
-- publishes the first version of the site.
-- Fields the resume does not state are left blank on purpose. Dates are
-- year-only where the resume gives only years.
-- =====================================================================

update public.site_settings set data = $json$
{
  "profile": {
    "full_name": "Nur Ayuni Hanani binti Abd Latif",
    "short_name": "Ayuni",
    "title": "System Analyst",
    "headline": "I translate business needs into clear BRS, SRS and SDS specifications.",
    "intro": "System Analyst at Heitech Padu Berhad on Project NIISe for the Immigration Department of Malaysia. Software Engineering graduate from Universiti Kebangsaan Malaysia, working across requirements, documentation, Figma prototyping and UAT.",
    "process_steps": [
      "Requirements: Stakeholder discussions and workflow analysis to capture what the business needs.",
      "Process modelling: DFDs, use case diagrams and system/process flows that make the requirements visible.",
      "BRS, SRS & SDS: Specifications that keep development output aligned with business requirements.",
      "Wireframes & prototypes: UI/UX wireframes and interactive prototypes in Figma for design discussions and sign-off.",
      "UAT & FAT: System testing, defect analysis, and coordination of User and Final Acceptance Testing.",
      "Training & handover: User training, system presentations and process-flow walkthroughs."
    ],
    "location": "Dengkil, Selangor",
    "availability": { "enabled": true, "text": "Open to junior System Analyst roles" },
    "photo_path": "",
    "show_photo": true,
    "email": "ayunilatif3012@gmail.com",
    "phone": "",
    "show_phone": false,
    "linkedin_url": "https://www.linkedin.com/in/ayuni-latif",
    "github_url": "",
    "other_links": []
  },
  "about": {
    "summary": [
      "Software Engineering graduate with hands-on experience in system analysis, requirements gathering and technical documentation across enterprise and government-scale systems. I translate business needs into BRS, SRS and SDS specifications and support UAT and FAT.",
      "I'm comfortable working across the SDLC, from stakeholder discussions and business process modelling to UI/UX prototyping in Figma, and I'm looking for a junior System Analyst role where I can apply strong analytical, documentation and cross-functional collaboration skills."
    ],
    "strengths": [
      "Requirements gathering and analysis",
      "BRS, SRS and SDS documentation",
      "Business process modelling (DFD, use case, process flows)",
      "UAT and FAT coordination",
      "UI/UX wireframing and prototyping in Figma",
      "Stakeholder communication and cross-functional collaboration"
    ],
    "interests": ["Junior System Analyst"],
    "languages": ["English (fluent)", "Bahasa Melayu (native)"],
    "activities": [
      "Vice President, Mobile Application Development Club (UKM): led and coordinated technical workshops, overseeing planning, logistics, training materials and committee communication.",
      "Project Leader, AR Competition with Blender and Effect House: led the planning and execution of an AR design competition."
    ]
  },
  "resume": { "path": "", "file_name": "", "updated_at": "", "show_preview": true },
  "seo": {
    "title": "Nur Ayuni Hanani | System Analyst",
    "description": "System Analyst in Malaysia with experience in requirements gathering, BRS/SRS/SDS documentation, business process modelling, Figma prototyping and UAT/FAT.",
    "og_image_path": ""
  },
  "theme": { "template": "orbit", "accent": "#3B82F6", "default_mode": "dark", "allow_toggle": true },
  "sections": { "about": true, "experience": true, "projects": true, "skills": true, "education": true, "resume": true, "contact": true },
  "contact": {
    "intro": "Hiring for a junior System Analyst role? Send a message and I'll reply by email.",
    "form_enabled": true
  }
}
$json$::jsonb
where id = 1;

delete from public.experiences where true;
insert into public.experiences (company, role, employment_type, work_mode, location, context, start_date, end_date, is_current, summary, highlights, tools, visible, sort_order) values
(
  'Heitech Padu Berhad', 'System Analyst', 'Contract', '', '',
  'Project NIISe, Immigration Department of Malaysia',
  '2026', '', true,
  'Requirements, specifications, prototyping and testing support for a national immigration system.',
  array[
    'Analyse business and system requirements through stakeholder discussions and workflow analysis for Project NIISe under the Immigration Department of Malaysia.',
    'Create UI/UX wireframes and interactive prototypes in Figma to support system design discussions.',
    'Conduct system testing, debugging and defect analysis, and support User Acceptance Testing (UAT).',
    'Delivered complete SRS and SDS documentation for a government-level immigration system, translating stakeholder requirements into clear technical specifications.',
    'Produced UI/UX wireframes and prototypes that supported the development team and stakeholder sign-off.'
  ],
  array['Figma','SRS','SDS','UAT'],
  true, 1
),
(
  'Two Q Alliance Sdn Bhd', 'System Analyst', 'Internship', '', '', '',
  '2025', '2026', false,
  'Business process documentation and delivery support alongside developers, QA and UI/UX designers.',
  array[
    'Analysed and documented business processes with developers, QA teams and UI/UX designers so that implementation aligned with requirements.',
    'Tracked, reported and followed up on system issues, supporting project delivery through coordination with cross-functional teams.',
    'Took part in User Acceptance Testing (UAT) and Final Acceptance Testing (FAT), and assisted with user training, system presentations and process-flow walkthroughs.',
    'Produced BRS, SRS and SDS documentation that aligned development output with business requirements across cross-functional teams.'
  ],
  array['BRS','SRS','SDS','UAT','FAT'],
  true, 2
),
(
  'Cafe Kroni – KPZ, Universiti Kebangsaan Malaysia', 'Cashier', 'Part-time', '', '', '',
  '2022', '2025', false,
  'Managed customer orders and payments using POS systems while maintaining efficient service in a high-traffic environment.',
  array[]::text[], array['POS systems'],
  false, 3
),
(
  'MBM Dreams Photostat & Printing', 'Photostat & Printing Shop Assistant', 'Part-time', '', '', '',
  '2019', '2020', false,
  'Assisted customers with printing, photocopying, scanning and document formatting services.',
  array[]::text[], array[]::text[],
  false, 4
);

delete from public.projects where true;
insert into public.projects (title, category, year, summary, role, contributions, awards, tech, visual, confidential, featured, sort_order) values
(
  'Project NIISe: National Immigration System', 'System analysis', '2026 – present',
  'Requirements, specifications and prototypes for a government-level immigration system delivered for the Immigration Department of Malaysia.',
  'System Analyst (contract) at Heitech Padu Berhad: analysis, documentation, prototyping and testing support',
  array[
    'Delivered complete SRS and SDS documentation from stakeholder requirements.',
    'Created UI/UX wireframes and interactive prototypes in Figma for design discussions and sign-off.',
    'Supported system testing, defect analysis and UAT.'
  ],
  array[]::text[],
  array['Figma','SRS','SDS','UAT'],
  'flow', true, true, 1
),
(
  'BRS, SRS & SDS documentation', 'Internship', '2025 – 2026',
  'Business and system documentation that kept development output aligned with business requirements across cross-functional teams.',
  'System Analyst (internship) at Two Q Alliance Sdn Bhd',
  array[
    'Produced BRS, SRS and SDS documentation with developers, QA teams and UI/UX designers.',
    'Took part in UAT and FAT, and assisted with user training, system presentations and process-flow walkthroughs.'
  ],
  array[]::text[],
  array['BRS','SRS','SDS','UAT','FAT'],
  'document', true, true, 2
),
(
  'UniConnect: University Community and Activity System', 'Final year project', '',
  'A mobile and web platform for student engagement: an Android app with real-time messaging and a responsive admin panel.',
  'Developer (final year project)',
  array[
    'Built the Android app with Java, Firebase and real-time messaging.',
    'Built a responsive admin panel with HTML, Tailwind CSS, JavaScript and Firebase Firestore/Cloud Functions.'
  ],
  array[]::text[],
  array['Java','Android','Firebase','Firestore','Cloud Functions','HTML','Tailwind CSS','JavaScript'],
  'dashboard', false, true, 3
);

delete from public.skill_groups where true;
insert into public.skill_groups (name, items, sort_order) values
('Analysis & documentation', array['Requirements gathering & analysis','BRS / SRS / SDS documentation','Business process modelling','DFD','Use case diagrams','System / process flows','UAT & FAT coordination'], 1),
('Design & prototyping', array['UI/UX wireframing','Interactive prototyping','Figma','Draw.io'], 2),
('Development', array['HTML','CSS','PHP','Java','Android Studio'], 3),
('Data & tools', array['MySQL','Firebase','DBeaver','Microsoft Office & Excel'], 4),
('Ways of working', array['Stakeholder communication','Cross-functional collaboration','Problem-solving','Attention to detail','Time management','Adaptability','Team leadership'], 5),
('Transferable', array['Process documentation & technical writing','Customer service & client handling','Workshop & training coordination','Project coordination','Data accuracy & quality control'], 6);

delete from public.education where true;
insert into public.education (institution, qualification, field, location, start_date, end_date, grade, details, sort_order) values
(
  'Universiti Kebangsaan Malaysia (UKM)', 'Bachelor of Software Engineering (Information Systems)', 'Software Engineering, Information Systems', '',
  '2022', '2026', 'CGPA 3.61',
  array[
    'Dean''s List Award: Semester 5, Semester 6 and Semester 8',
    'Final year project: UniConnect, a university community and activity system (Android app and web admin panel)'
  ],
  1
),
(
  'Kolej Matrikulasi Negeri Sembilan', 'Matriculation', '', '',
  '2021', '2022', 'CGPA 3.58',
  array[]::text[],
  2
);

-- Publish the first version so the public site has content immediately.
insert into public.publications (content, note) values (public._build_snapshot(), 'Initial content from resume');
update public.site_state set last_published_at = now(), last_change_at = now() where id = 1;
