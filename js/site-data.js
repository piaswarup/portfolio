/* ==========================================================
   site-data.js — the ONE list of every page on the site.

   To add a page: copy pages/_template.html to pages/<slug>.html,
   then add one entry below. The home-page grids, the Projects /
   Experience dropdowns and the "More work" rows all update
   automatically.

   Fields:
     slug     file name in pages/ without ".html"
     title    card title (also used in the dropdown menu)
     blurb    one-line description under the card title
     tag      "Project" | "Internship" | ... (not shown on cards right now)
     section  "work" | "leadership" | "hobbies" — only "work" pages get a
              card on the home page; the others are reached through the
              dropdown menus and the "More work" rows
     thumb    card image, relative to the site root, or null to show
              the title on a light box until there's a photo
     thumbAlt (optional) alt text for the card image
     menu     which dropdown lists it: "projects" | "experience" | null

   Order matters: cards and dropdown items appear in this order.
   ========================================================== */

const SITE_PAGES = [
  /* ── Projects & Experience ─────────────────────────────── */
  {
    slug: 'revimo',
    title: 'ReviMo — Hardware Robotics Intern',
    blurb: 'Advanced the mechanical design of the assistive robot ReviMo Niko toward production.',
    tag: 'Internship',
    section: 'work',
    thumb: 'assets/images/revimo/thumb.jpg',
    thumbAlt: 'Render of the ReviMo Niko assistive robot',
    menu: 'experience'
  },
  {
    slug: 'self-balancing-bicycle',
    title: 'Autonomous Self-Balancing Bicycle',
    blurb: 'A self-balancing bicycle using a high-inertia reaction wheel and PID control.',
    tag: 'Project',
    section: 'work',
    thumb: 'assets/images/self-balancing-bicycle/thumb.jpg',
    thumbAlt: 'Self-balancing bicycle with reaction wheel',
    menu: 'projects'
  },
  {
    slug: 'baja-suspension',
    title: 'Baja SAE Suspension',
    blurb: 'Wheel hubs, brakes, and suspension geometry for an off-road racing vehicle.',
    tag: 'Project',
    section: 'work',
    thumb: 'assets/images/baja-suspension/thumb.jpg',
    thumbAlt: 'Machined Baja SAE wheel hub',
    menu: 'projects'
  },
  {
    slug: 'soil-sampling-drone',
    title: 'Soil Sampling Drone Attachment',
    blurb: 'An auger-based soil sampling attachment for an autonomous fleet of farm drones.',
    tag: 'Project',
    section: 'work',
    thumb: 'assets/images/soil-sampling-drone/thumb.jpg',
    thumbAlt: 'CAD of the soil sampling attachment',
    menu: 'projects'
  },
  {
    slug: 'soil-probing-rover',
    title: 'Soil Probing Ground Rover',
    blurb: 'A retractable gantry that lets a farm rover autonomously probe soil moisture and health.',
    tag: 'Project',
    section: 'work',
    thumb: null,
    menu: 'projects'
  },
  {
    slug: 'robotics-software',
    title: 'Robotics Software',
    blurb: 'Robot behaviors, localization, and vision written in ROS2 and Python.',
    tag: 'Project',
    section: 'work',
    thumb: 'assets/images/robotics-software/thumb.jpg',
    thumbAlt: 'Particle filter running on a Neato robot in Gazebo',
    menu: 'projects'
  },
  {
    slug: 'animatronic-flying-pig',
    title: 'Peric the Flying Pig',
    blurb: 'An animatronic pig that spins faster when you approach and flaps its wings at loud noises.',
    tag: 'Project',
    section: 'work',
    thumb: 'assets/images/animatronic-flying-pig/cad.jpg',
    thumbAlt: 'CAD of Peric the animatronic pig',
    menu: 'projects'
  },
  {
    slug: 'pan-tilt-scanner',
    title: 'Pan-Tilt 3D Scanner',
    blurb: 'Two servos and an infrared distance sensor that turn readings into 2D and 3D scans.',
    tag: 'Project',
    section: 'work',
    thumb: 'assets/images/pan-tilt-scanner/thumb.jpg',
    thumbAlt: '3D-printed pan-tilt scanner with an infrared distance sensor',
    menu: 'projects'
  },
  {
    slug: 'hopping-mechanism',
    title: 'Biomimetic Hopping Mechanism',
    blurb: 'A hopping mechanism based on elastic energy storage observed in grasshopper legs.',
    tag: 'Project',
    section: 'work',
    thumb: 'assets/images/hopping-mechanism/cad.jpg',
    thumbAlt: 'CAD render of the hopping mechanism',
    menu: 'projects'
  },
  {
    slug: 'arctic-kinetic-sculpture',
    title: 'The Arctic Kinetic Sculpture',
    blurb: 'A seal, bear, and shark set in motion by chains, sprockets, and bevel gears.',
    tag: 'Project',
    section: 'work',
    thumb: 'assets/images/arctic-kinetic-sculpture/thumb.jpg',
    thumbAlt: 'The Arctic kinetic sculpture',
    menu: 'projects'
  },
  {
    slug: 'flying-automata',
    title: 'Flying Automata',
    blurb: 'A mechanical bird automaton with articulated wings, driven by gears and linkages.',
    tag: 'Project',
    section: 'work',
    thumb: 'assets/images/flying-automata/thumb.jpg',
    thumbAlt: 'Mechanical bird automaton with wooden wings',
    menu: 'projects'
  },
  {
    slug: 'matlab-modeling',
    title: 'Modeling & Simulation in MATLAB',
    blurb: 'Facial recognition, transit delays, disease spread, and lighting optimization.',
    tag: 'Project',
    section: 'work',
    thumb: 'assets/images/matlab-modeling/mbta-arrivals.png',
    thumbAlt: 'Heat map of MBTA passenger arrival rates by station and time of day',
    menu: 'projects'
  },
  {
    slug: 'movu',
    title: 'Movu NV — Warehouse Robotics Intern',
    blurb: '3D simulations of AGV fleets around the Eligo robotic picking arm to optimize throughput.',
    tag: 'Internship',
    section: 'work',
    thumb: 'assets/images/movu_escala.png',
    thumbAlt: 'Movu Escala robot',
    menu: 'experience'
  },
  {
    slug: 'veg-nutraceuticals',
    title: 'Veg Nutraceuticals — Web Design & Marketing Intern',
    blurb: 'Website, e-commerce, branding, and digital marketing for a nutraceutical company.',
    tag: 'Internship',
    section: 'work',
    thumb: 'assets/images/vitrient_mockup.png',
    thumbAlt: 'Vitrient product mockup',
    menu: 'experience'
  },

  /* ── Leadership ────────────────────────────────────────── */
  {
    slug: 'baja-sae-pm',
    title: 'Olin Baja SAE — Project Manager',
    blurb: 'Leading a 50+ member team designing and building an off-road racing vehicle.',
    tag: 'Leadership',
    section: 'leadership',
    thumb: null,
    menu: 'experience'
  },
  {
    slug: 'vex-robotics',
    title: 'High School VEX Robotics — Founder & President',
    blurb: "Founded and led my high school's VEX Robotics competition team.",
    tag: 'Leadership',
    section: 'leadership',
    thumb: 'assets/images/vex-robotics/robot-02.jpg',
    thumbAlt: 'VEX competition robot',
    menu: 'experience'
  },

  /* ── Hobbies ───────────────────────────────────────────── */
  {
    slug: 'machining',
    title: 'Machining & Fabrication',
    blurb: 'Custom parts for precise engineering purposes and decorative pieces.',
    tag: 'Hobby',
    section: 'hobbies',
    thumb: 'assets/images/machining/thumb.jpg',
    thumbAlt: 'Machined fork bushing housing',
    menu: 'projects'
  },
  {
    slug: 'electronics',
    title: 'Circuits & Electronics',
    blurb: 'An LED grid that displays the noise level in a room, built with an Arduino Nano.',
    tag: 'Hobby',
    section: 'hobbies',
    thumb: null,
    menu: 'projects'
  },
  {
    slug: 'karate',
    title: 'Karate',
    blurb: 'Black belt and multiple international medalist.',
    tag: 'Hobby',
    section: 'hobbies',
    thumb: null,
    menu: 'projects'
  }
];

/* Contact details used in the footer and top bar. */
const SITE_CONTACT = {
  email: 'pswarup(at)olin(dot)edu',
  linkedin: 'https://linkedin.com/in/piaswarup',
  github: 'https://github.com/piaswarup',
  instagram: 'https://instagram.com/ppiiias',
  resume: 'assets/files/resume.pdf'
};
