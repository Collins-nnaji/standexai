const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Project Seeding ---');

  // 1. Approve all existing project signals
  const updatedExisting = await prisma.researchBrief.updateMany({
    data: { isApproved: true }
  });
  console.log(`Approved ${updatedExisting.count} existing projects.`);

  // 2. Generic high-end Lab names
  const labNames = [
    "Aether Dynamics Lab",
    "Cognitive Forge AI",
    "NeuroFlow Systems",
    "Veritas Intelligence",
    "Prisma Research Hub",
    "Synthetix Robotics",
    "Orbit Analytics",
    "Core Logic Research"
  ];

  // 3. Define 8 implementation-focused projects
  const implementationProjects = [
    {
      title: "Llama-3 70B Quantization for Edge Hardware",
      description: "Low-latency implementation of LLMs on mobile and IoT edge devices using 4-bit quantization and specialized C++ kernels.",
      lookingFor: "Systems engineering experts with CUDA or ARM experience.",
      domain: ["LLM", "Systems", "Hardware"],
      lab: "Aether Dynamics Lab"
    },
    {
      title: "Agentic RAG with Multi-Step Reasoning",
      description: "Implementing production-ready RAG systems utilizing multi-step reasoning agents to synthesize data from heterogeneous corporate databases.",
      lookingFor: "Full-stack AI engineers with LangChain/LlamaIndex production experience.",
      domain: ["RAG", "Agents", "Data"],
      lab: "Cognitive Forge AI"
    },
    {
      title: "Fine-Tuning Stable Diffusion for Architectural CAD",
      description: "Adapting diffusion models to generate highly precise architectural blueprints based on structural engineering constraints.",
      lookingFor: "Generative AI researchers with LoRA/ControlNet experience.",
      domain: ["Vision", "CAD", "Generative"],
      lab: "Prisma Research Hub"
    },
    {
      title: "Vision-Language Model (VLM) for Medical Diagnostics",
      description: "Fine-tuning multimodal models for real-time analysis of medical imaging and electronic health records for clinical decision support.",
      lookingFor: "SOTA Researchers with domain knowledge in healthcare data.",
      domain: ["Vision", "Healthcare", "VLM"],
      lab: "NeuroFlow Systems"
    },
    {
      title: "Real-Time Multilingual Speech-to-Speech Translation",
      description: "Implementing zero-latency, high-fidelity neural translation for cross-border engineering meetings with custom accent adaptation.",
      lookingFor: "Audio engineering and STT/TTS specialists.",
      domain: ["Audio", "Translation", "Voice"],
      lab: "Orbit Analytics"
    },
    {
      title: "Synthetics for Robotics: Sim-to-Real Policy Transfer",
      description: "Developing robust Reinforcement Learning policies in simulation for high-precision robotic limb control in manufacturing environments.",
      lookingFor: "Robotics and RL specialists with MuJoCo/NVIDIA Isaac experience.",
      domain: ["Robotics", "RL", "Simulation"],
      lab: "Synthetix Robotics"
    },
    {
      title: "VLAN & Security Logic Verification via LLM",
      description: "Formal verification of network security policies and firewall configurations using automated logic analysis and large language models.",
      lookingFor: "Security researchers with background in formal methods and AI.",
      domain: ["Security", "Logic", "Networking"],
      lab: "Veritas Intelligence"
    },
    {
      title: "Compilers for Specialized AI Silicon Optimization",
      description: "Optimizing the compilation pathway for custom ML accelerators to reduce FLOPS latency for large-scale transformer deployments.",
      lookingFor: "Compiler engineers with specialized AI hardware experience.",
      domain: ["Systems", "Optimization", "Silicon"],
      lab: "Core Logic Research"
    }
  ];

  // 4. Create Labs and Projects
  for (const proj of implementationProjects) {
    const email = `${proj.lab.replace(/\s+/g, '').toLowerCase()}@standex.ai`;
    
    // Find or create lab user
    const labUser = await prisma.user.upsert({
      where: { email },
      update: {
        role: 'LAB',
        name: proj.lab,
        companyName: proj.lab,
        bio: `Generic mission-critical lab focused on ${proj.domain.join(', ')}.`,
        websiteUrl: `https://${proj.lab.replace(/\s+/g, '').toLowerCase()}.ai`
      },
      create: {
        name: proj.lab,
        email,
        passwordHash: '$2a$10$fVl63U0N5bF3uEzgR.iFPeY1S.n8l/S1T6.gVl/I1hE1S1S1S1S1S',
        role: 'LAB',
        companyName: proj.lab,
        bio: `Generic mission-critical lab focused on ${proj.domain.join(', ')}.`,
        websiteUrl: `https://${proj.lab.replace(/\s+/g, '').toLowerCase()}.ai`,
        labProfile: {
          create: {
            companyName: proj.lab
          }
        }
      }
    });

    // Create project
    await prisma.researchBrief.create({
      data: {
        title: proj.title,
        description: proj.description,
        lookingFor: proj.lookingFor,
        domain: proj.domain,
        companyId: labUser.id,
        active: true,
        isApproved: true
      }
    });
    console.log(`Created & Approved Project: ${proj.title}`);
  }

  console.log('--- Seeding Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
